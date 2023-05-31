const JWT = require("jsonwebtoken");
const openai = require('../config/OpenAi');
const PDFParser = require('pdf-parse')
const { Binary } = require('mongodb');
const User = require('../models/userModel');
const AiBot = require('../models/aiModel');
const Pdf = require('../models/pdfModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

exports.requireAuth = (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const decoded = JWT.verify(token, 'secretKey');
    socket.decoded = decoded;
    next();
  } catch (error) {
    console.log(error.message)
  }
}

const generateCompletion = async (question, context) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 2000,
    prompt: `Question: ${question}\nContext: ${context}`,
  })
  return response.data.choices[0].text;
}

const getPdfs = async (email, socket) => {
  const userFound = await User.findOne({ email });

  const pdfs = await Pdf.find({ user: userFound._id });
  await socket.emit('pdfsData', pdfs)
  return pdfs ? pdfs : [];
}

const getMessages = async (req, socket) => {
  const { email, chat, pdf, } = req;
  //find user by userId, pdf by pdfId, chats by chatId
  const userFound = await User.findOne({ email });
  const pdfFound = await Pdf.findOne({ fileName: pdf });
  const chatFound = await Chat.findOne({ chatName: chat });
  const aiBotFound = await AiBot.findOne({ name: "PDFAssist" });
  if (userFound === null)
    return { message: 'User not found' };
  const userId = userFound?._id;

  if (pdfFound === null)
    return { message: 'Pdf not found' };
  const pdfId = pdfFound?._id

  let chatId = "";
  if (chatFound === null) {
    const newChat = new Chat({
      chatName: chat,
      user: userId,
      pdf: pdfId,
    })
    await newChat.save();
    chatId = newChat._id;
  } else {
    chatId = chatFound._id;
  }

  const aiId = aiBotFound?._id;
  Message.find({
    $or: [
      { sender: userId },
      {
        sender: aiId,
        user: userId
      }
    ],
    chat: chatId
  })
    .sort({ createdAt: 1 })
    .then(messages => {
      //send chats to the frontend
      if (messages) {
        const msgs = messages.map((message) => {
          if (message.sender.toString() === userId.toString())
            return { message, name: userFound.name, email: userFound.email, picture: userFound.pic }
          if (message.sender.toString() === aiId.toString())
            return { message, name: aiBotFound.name, email: aiBotFound.email, picture: aiBotFound.pic }
        })
        socket.emit('messages recieved', msgs)
        return msgs
      }
      else
        return { message: "No chats found, create a new chat" }
    })
    .catch(err => {
      return { error: err.message }
    })
}

const askAnything = async (req, res, socket) => {
  try {
    const { name, email, picture, pdf, chat, question } = req;
    const userFound = await User.findOne({ email });
    const pdfFound = await Pdf.findOne({ fileName: pdf });
    const chatFound = await Chat.findOne({ chatName: chat });
    if (userFound === null)
      res = 'User not found';
    const userId = userFound?._id;

    if (pdfFound === null)
      res = 'Pdf not found';
    const pdfId = pdfFound?._id

    let chatId = "";
    if (chatFound === null) {
      const newChat = new Chat({
        chatName: chat,
        user: userId,
        pdf: pdfId,
      })
      await newChat.save();
      chatId = newChat._id;
    } else {
      chatId = chatFound._id;
    }
    //create sender's message and store it in database
    const senderMessage = new Message({
      sender: userId,
      content: question,
      chat: chatId
    })
    await senderMessage.save();
    let userData = {
      email,
      message: {
        chat,
        content: question,
        sender: userId
      },
      name,
      picture
    }
    socket.emit('message', userData)

    // find a aiBot in database. if not exists, create one and
    // get it's id
    let aiBot = {};
    let aiId = "";
    const aiBotFound = await AiBot.findOne({ name: "PDFAssist" });
    if (aiBotFound === null) {
      aiBot = new AiBot({
        name: "PDFAssist",
      })
      await aiBot.save();
      aiId = aiBot?._id;
    }
    aiId = aiBotFound?._id;

    //create ai's message and store it in database
    const pdfData = await PDFParser(pdfFound.data);
    //ask a question from the given pdf and get an answer
    const answer = await generateCompletion(question, pdfData.text);
    // store the message in the database
    const aiMessage = new Message({
      sender: aiId,
      user: userId,
      content: answer,
      chat: chatId
    })
    await aiMessage.save();
    let aiData = {
      message: {
        chat,
        content: answer,
        sender: aiId
      },
      name: 'PDFAssist',
      picture: aiBotFound.pic
    }

    socket.emit('message', aiData)
    //send the answer as a response to the frontend
    return answer;
  } catch (err) {
    console.log(err)
    res = err.message;
  }
}

const deletePdf = async (req, email, socket) => {
  try {
    const { fileName } = req;
    const userFound = await User.findOne({ email });
    const pdfFound = await Pdf.findOneAndRemove({ fileName, user: userFound._id });
    // Save the pdf buffer to MongoDB using Mongoose
    if (!pdfFound) {
      console.log("pdf with this name doesn't exists")
    }
    const pdfs = await Pdf.find({ user: userFound._id })
    socket.emit('pdfsData', pdfs)
  } catch (err) {
    console.log(err);
  }
}
const uploadPdf = async (req, email, socket) => {
  try {
    const { name } = req;
    const userFound = await User.findOne({ email });
    const pdfFound = await Pdf.findOne({ fileName: name, user: userFound._id });
    // Save the pdf buffer to MongoDB using Mongoose
    if (pdfFound === null) {
      const pdfBuffer = req.data;
      const binaryData = new Binary(pdfBuffer, Binary.SUBTYPE_BYTE_ARRAY);
      const newPdf = new Pdf({
        data: binaryData,
        contentType: 'application/pdf',
        fileName: name,
        user: userFound._id
      });
      await newPdf.save();

      const pdfs = await Pdf.find({ user: userFound._id })
      socket.emit('pdfsData', pdfs)
    } else {
      console.log('pdf with this name is already exists')
    }
  } catch (err) {
    console.log(err);
  }
}

exports.connection = (socket) => {
  const { name, email, picture } = socket.decoded;
  const res = {};
  console.log('connection established on socket');

  socket.on('messages', async (userData) => {
    const data = { ...userData, name, email, picture }
    const messages = await getMessages(data, socket)
  })

  socket.on('message', async (userData) => {
    const data = { ...userData, name, email, picture }
    const answer = await askAnything(data, res, socket)

    socket.join(userData);
    socket.emit('message recieved', data);
  })

  socket.on('renamepdf', async (data) => {
    const { fileName, text } = data;
    const pdfFound = await Pdf.findOne({ fileName });
    if (pdfFound) {
      pdfFound.fileName = text + '.pdf';
      await pdfFound.save();
      console.log(pdfFound.fileName);
      socket.emit('renamepdfedited', pdfFound.fileName)
    }
  })

  socket.on('getpdfs', async () => {
    await getPdfs(email, socket)
  })

  socket.on('uploadpdf', async (data) => {
    await uploadPdf(data, email, socket)
  })

  socket.on('deletepdf', async (data) => {
    await deletePdf(data, email, socket);
    console.log('delete')
  })
}