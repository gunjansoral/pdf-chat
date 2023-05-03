require('dotenv').config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: "org-6RMGcfRLEd6Qc3tq1v1csSQ9",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// exports.response = openai.listEngines();
module.exports = openai;