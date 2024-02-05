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
import externalApiRouter from './router/externalApiRouter';
import subscriberInformationRouter from './router/subscriberInformationRouter'
import discordRouter from './router/discordRouter'
import { telegramBotService } from './services/telegramBotService'
// import { PriceLogginService } from "./services/priceLogginService"
// const priceLogginService = new PriceLogginService()
import { ExternalApiService } from "./services/externalApiService"
const externalApiService = new ExternalApiService()
import {CronJobService} from './services/cronJobService'
const cronJobService = new CronJobService()
const app: Application = express()
const port: number = 8080
const httpsPort: number = 8443
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const sslCert = fs.readFileSync(`${__dirname}/B5A96CBA293C33D986D193CA56347609.txt`)
const key = fs.readFileSync(`/etc/letsencrypt/live/api.loanshark.tech/privkey.pem`)
const cert = fs.readFileSync(`/etc/letsencrypt/live/api.loanshark.tech/fullchain.pem`)

const cred = {
    key,
    cert
}

if (process.env.DATABASE_URL) {
    console.log(`${process.env.DATABASE_URL}`)
    mongoose.connect(`${process.env.DATABASE_URL}`)
    // const AutoIncrement = AutoIncrementFactory(connect);
    const db = mongoose.connection
    console.log(`connecting database`)
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
}


app.get("/toto", (req: Request, res: Response) => {
    res.send("Hello toto")
})

/*
this part for port forwading in ec2 to allow verify ssl cert
*/
app.get("/.well-known/pki-validation/B5A96CBA293C33D986D193CA56347609.txt", (req: Request, res: Response) => {
    res.send(sslCert)
})
// app.use('telegram',tele)

app.use('/workflow', workflowRouter)
app.use('/telegram', telegramRouter)
app.use('/noitifcation', subscriberInformationRouter)
app.use('/discord', discordRouter);
app.use('/api',externalApiRouter)

app.get('/testTriggerCronJob', cronJobService.triggerLiquidationAlert)
app.get('/testScoreSystem', cronJobService.triggerScoreSystem)
app.get("/startCheckHolderByAddress", cronJobService.triggerStartCheckHolderByAddress)

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

const httpsServer = https.createServer(cred, app)
httpsServer.listen(httpsPort)
console.log(`hn porttps App is listening ot ${httpsPort} !`)

telegramBotService()


const job = new CronJob.CronJob("* * * * *", function () {
    console.log(`trigger cron job by bot`)
    // cronJobService.startLiquidation();
})

const jobScoreSystem = new CronJob.CronJob("0 23 * * *", function () {
    console.log(`triggerScoreSystem cron job by bot ${new Date()}`)
    cronJobService.startScoreSystem();
})
// jobScoreSystem.start()

const jobCheckHolder = new CronJob.CronJob("0 * * * *", function () {
    console.log(`triggerScoreSystem cron job by bot ${new Date()}`)
    cronJobService.startCheckHolderByAddress();
})
jobCheckHolder.start()