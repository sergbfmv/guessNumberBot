import {setWebhook} from "telebot-vercel"
import bot from "../index"

const path = "api/telegram.mjs"

export default setWebhook({bot, path, handleErrors: true})