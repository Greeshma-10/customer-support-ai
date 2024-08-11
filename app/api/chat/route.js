// route.js
import { Configuration, OpenAIApi } from 'openai';
require('dotenv').config();
//const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set your OpenAI API key in environment variables
});
const openai = new OpenAIApi(configuration);

const systemPrompt = "Your system prompt here"; // Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  const data = await req.json(); // Parse the JSON body of the incoming request

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Use the appropriate model name
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data.message }
      ],
      max_tokens: 150,
    });

    return new Response(JSON.stringify({ message: response.data.choices[0].message.content.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error processing your request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
