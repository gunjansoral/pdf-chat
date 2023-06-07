const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const configuration = new Configuration({
  organization: "org-ApcGpG4CmrbCPGcZiQWM264S",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// exports.response = openai.listEngines();
module.exports = openai;