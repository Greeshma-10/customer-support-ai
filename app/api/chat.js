// pages/api/chat.js
import { Configuration, OpenAIApi } from 'openai';


export default async function handler(req, res) {
  const { message, context, userContext } = req.body;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4', // Use 'gpt-3.5-turbo' or another model if necessary
      messages: [
        { role: 'system', content: `You are a helpful assistant.` },
        { role: 'user', content: `${userContext ? userContext + '\n' : ''}${context ? context + '\n' : ''}${message}` },
      ],
    });

    res.status(200).json({ message: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Failed to generate a response' });
  }
}
