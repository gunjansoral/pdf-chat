const openai = require('../config/OpenAi');
const PDFParser = require('pdf-parse')
const { Binary } = require('mongodb');
const User = require('../models/userModel');
const AiBot = require('../models/aiModel');
const Pdf = require('../models/pdfModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

//ask a question and get an answer
const generateCompletion = async (question, context) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 2000,
    prompt: `Question: ${question}\nContext: ${context}`,
  })
  return response.data.choices[0].text;
}

const startANewChat = async (req, res) => {
  const { chatName, user, pdf } = req.query;
  const chat = new Chat({
    chatName,
    user,
    pdf,
    message: ''
  });
  chat.save((err, saveChat) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Chat saved to database: ', saveChat);
    }
  })
}

exports.uploadPdf = async (req, res) => {
  try {
    const { fileName } = req.body;
    const check = await Pdf.findOne({ fileName });
    // Save the pdf buffer to MongoDB using Mongoose
    const userFound = await User.findOne({ email: req.email });
    const userId = userFound?._id;
    if (check === null) {
      const pdfBuffer = req.file.buffer;
      const binaryData = new Binary(pdfBuffer, Binary.SUBTYPE_BYTE_ARRAY);
      const newPdf = new Pdf({
        data: binaryData,
        contentType: req.file.mimetype,
        fileName,
        user: userId
      });
      await newPdf.save();
      res.json({ success: "pdf uploaded successfully", id: newPdf._id })
    } else {
      res.json({ message: 'Pdf with the same name is already exists, Change your filename' });
    }
  } catch (err) {
    console.log(err);
  }
}

exports.askAnything = async (req, res) => {
  try {
    const { pdf, chat, question } = req.body;
    const userFound = await User.findOne({ email: req.email });
    const pdfFound = await Pdf.findOne({ fileName: pdf });
    const chatFound = await Chat.findOne({ chatName: chat });
    if (userFound === null)
      return res.status(404).json({ message: 'User not found' });
    const userId = userFound?._id;

    if (pdfFound === null)
      return res.status(404).json({ message: 'Pdf not found' });
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
    //send the answer as a response to the frontend
    res.json(answer)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
}

exports.getMessages = async (req, res) => {
  const { chat, pdf, } = req.query;
  //find user by userId, pdf by pdfId, chats by chatId
  const userFound = await User.findOne({ email: req.email });
  const pdfFound = await Pdf.findOne({ fileName: pdf });
  const chatFound = await Chat.findOne({ chatName: chat });
  const aiBotFound = await AiBot.findOne({ name: "PDFAssist" });
  if (userFound === null)
    return res.status(404).json({ message: 'User not found' });
  const userId = userFound?._id;

  if (pdfFound === null)
    return res.status(404).json({ message: 'Pdf not found' });
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
        res.json(msgs)
      }
      else
        res.json({ message: "No chats found, create a new chat" })
    })
    .catch(err => {
      res.json({ error: err.message })
    })
}

exports.getUser = async (req, res) => {
  try {
    const { name, email, picture } = req;
    const userFound = await User.findOne({ email });
    if (userFound) {
      const { lastPdf, lastChat } = userFound;
      res.json({ name, email, picture, lastPdf, lastChat });
    } else
      res.json({ message: "No user found" })
  } catch (err) {
    console.log(err.message);

  }
}
