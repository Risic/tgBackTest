const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const token = '6319001077:AAELUFdps3lU2ZMnd6ly5THJLMLOtITUUbw';
const webAppUrl = 'https://master--dazzling-gumption-bbd3ba.netlify.app/'

const bot = new TelegramBot(token, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text ==='/start') {
    await bot.sendMessage(chatId, 'Go down for button, then fill the form', {
        reply_markup: {
            keyboard: [
              [{text: 'Form', web_app: {url: webAppUrl + 'form'}}]
            ]
        }
    })
  }

  if (text ==='/start') {
    await bot.sendMessage(chatId, 'Go to shop', {
        reply_markup: {
            inline_keyboard: [
              [{text: 'Buy', web_app: {url: webAppUrl}}]
            ]
        }
    })
  }
if(msg?.web_app_data?.data) {
  try {
    const data = JSON.parse(msg?.web_app_data?.data)
    console.log(data)
    await bot.sendMessage(chatId, 'Thanks for feedback')
    await bot.sendMessage(chatId, 'Yours country: ' + data?.country)
    await bot.sendMessage(chatId, 'Yours street: ' + data?.street)

    setTimeout (async () => {
      await bot.sendMessage(chatId, 'All information you will get in this chat')
    }, 3000)
  } catch (e) {
    console.log(e)
  }
}

});

app.post('web-data', async (req, res) => {
  const {queryId, products, totalPrice} = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Well done',
      input_message_content: {message_text: 'Congratulation, total price: ' + totalPrice}
    })
    return res.status(200).json({})
  } catch (error) {
    await bot.answerWebAppQuery(queryId, {
      type: 'article',
      id: queryId,
      title: 'Error',
      input_message_content: {message_text: 'Error'}
    })
    return res.status(500).json({})
  }
})

const PORT = 8000
app.listen(PORT, () => console.log('server started on port ' + PORT))