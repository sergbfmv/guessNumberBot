const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '6355498340:AAHpfS84MiLuVP5BtzsyLaaBlJDLt6CHC_w'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Я загадываю цифру - ты отгадываешь, все просто'}
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Ну давай, отгадывай', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/25d/f5a/25df5a18-cf79-4b3e-a2f1-4862771ebd1c/1.webp')
            return bot.sendMessage(chatId, `Приветствую тебя, друг мой!`)
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}`)
        }

        if (text === '/game') {
            return  startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Э-э-э, я таких маневров не понимаю')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data === '/again') {
            return startGame(chatId)
        }

        if (parseInt(data) === chats[chatId]) {
            return bot.sendMessage(chatId, `А ты не плох, угадал! Это была цифра ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Мимо! Не угадал! Это была цифра ${chats[chatId]}`, againOptions)
        }

    })
}

start()