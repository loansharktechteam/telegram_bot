import express, { NextFunction, Request, Response } from 'express';
import * as TelegramServices from '../services/telegramService';
const router = express.Router();

router.post('/sendMsg', async function (req: Request, res: Response) {
    // console.log(`sendEmail`,req.body)
    const {username,message} = req.body
    const result = await TelegramServices.sendMessageByUsername(username,'',message);
    res.status(200).json(result)
});


export default router;
