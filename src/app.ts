import express, { Application, Request, Response } from "express"
import CronJob from 'cron'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bodyParser from "body-parser";
import fs from 'fs';
import https from 'https'
import telegramRouter from './router/telegramRouter';
import workflowRouter from './router/workflowRouter';
import subscriberInformationRouter from './router/subscriberInformationRouter'
import {telegramBotService} from './services/telegramBotService'
import {checkTrigger} from './services/cronJobService'

const app: Application = express()
const port: number = 8080
const httpsPort: number = 8443
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const key=fs.readFileSync(`${__dirname}/private.key`)
const cert=fs.readFileSync(`${__dirname}/certificate.crt`)

const cred = {
    key,
    cert
}
if (process.env.DATABASE_URL) {
    console.log(`${process.env.DATABASE_URL}`)
    mongoose.connect(`${process.env.DATABASE_URL}`)
    const db = mongoose.connection
    console.log(`connecting database`)
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
}


app.get("/toto", (req: Request, res: Response) => {
    res.send("Hello toto")
})

// app.use('telegram',tele)

app.use('/workflow',workflowRouter)
app.use('/telegram',telegramRouter)
app.use('/noitifcation',subscriberInformationRouter)

app.get('/testTriggerCronJob',checkTrigger)
// app.use('/email', emailRouter);
// app.use('/discord', discordRouter);
// app.use('/workflow', workflowRouter);

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

const httpsServer = https.createServer(cred, app)
httpsServer.listen(httpsPort)
console.log(`https App is listening on port ${httpsPort} !`)

telegramBotService()


const job = new CronJob.CronJob("*/5 * * * * *",function (){
    // checkTrigger()
})

job.start()




// import TelegramBot from 'node-telegram-bot-api'
// // replace the value below with the Telegram token you receive from @BotFather
// const token = '5967762690:AAF_hubaylvHTxw8Zh2xEuPo-ncvX1tJ40k';

// // Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, {polling: true});

// // Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg:any, match:any) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg:any) => {
//     console.log(msg)
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   console.log(chatId)
// //   bot.sendMessage(chatId, 'Received your message');
// });



// setTimeout(()=>{
//     bot.sendMessage('76718957','hello world!')
//     bot.sendMessage('1080703864','sent you something')
// }, 1000)

