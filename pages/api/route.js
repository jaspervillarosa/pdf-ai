import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({
  apiKey: process.env.KS_OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
  const text = req.body;
  console.log(text)

  if (!text) {
    return new Error('There was an error with you text, try again!')
  }

  const response = await openai
  .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `summarize this body of text in one paragraph: ${text}`}],
  }) 

  res.status(200).json({ text: response.data.choices[0].message.content })
}