const PDF = require('../modals/pdf');
const Chat = require('../modals/conversations');
const openai = require('../OpenAI');
const PDFParser = require('pdf-parse')
const mongoose = require('mongoose');
const { Binary } = require('mongodb');

//ask a question and get an answer
const generateCompletion = async (question, context) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 2000,
    prompt: `Question: ${question}\nContext: ${context}`,
  })
  return response.data.choices[0].text;
}

const startANewChat = async (userId) => {
  const chat = new Chat({
    chatId,
    userId,
    messages: []
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
    const pdfBuffer = req.file.buffer;
    const binaryData = new Binary(pdfBuffer, Binary.SUBTYPE_BYTE_ARRAY);
    // Save the pdf buffer to MongoDB using Mongoose
    const pdf = new PDF({
      data: binaryData,
      contentType: req.file.mimetype,
      fileName: req.file.originalname,
    });
    await pdf.save();
  } catch (err) {
    console.log(err);
  }
}

exports.askAnything = async (req, res) => {
  try {
    const { userId, chatId, question, pdfId } = req.body;
    const pdf_id = new mongoose.Types.ObjectId(pdfId);

    //find a pdf file data from a given pdfId
    const pdf = await PDF.findOne({ _id: pdf_id });
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    const pdfData = await PDFParser(pdf.data);

    //ask a question from the given pdf and get an answer
    const answer = await generateCompletion(question, pdfData.text);


    //store the conversations in the database
    // const chat = new Chat({

    // })
    res.json({ answer })
    //send the answer as a response to the frontend
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
