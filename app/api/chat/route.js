// route.js
import OpenAI from "openai";

const openai=new OpenAI();

const chatCompletion =await openai.chat.completions.create({
  messages:[{role:"user",content:"what is ur name",}],
  model:"gpt-3.5-turbo",
  stream: true
})

//  for await (const chat of chatCompletion){
//     process.atdout.write(chat.choices[0]?.delta?.content ||'');
// }

console.log(chatCompletion.choices[0].message);