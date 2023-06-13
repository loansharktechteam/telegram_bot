import TelegramBot from 'node-telegram-bot-api'
// import { TelegramMapping }from '../modal/telegramMappingModal'
// import {Test} from '../modal/testModal';
// import { Employee } from '../modal/employeeModel';
import {SubscriberInformationService } from '../services/subscriberInformationService'

import { TelegramMapping } from '../modal/telegramMappingModal'
const token = process.env.TELEGRAM_TOKEN
export const bot = new TelegramBot(token ? token : '', { polling: true });
let subscriberInformationService = new SubscriberInformationService()

async function addSubscribe(address: any, username: any, chatId: any) {
    let body = {
        address, username, chatId
    }
    try {
        const saveRespond = await TelegramMapping.create(body);
        return {
            code: 0,
            message: "success",
            result: saveRespond
        }
    }
    catch (e) {
        return {
            code: -1,
            message: "fail",
            result: {}
        }
    }
}


async function removeSubscribe(username: any, chatId: any) {
    let body = {
        username, chatId
    }
    try {
        const saveRespond = await TelegramMapping.deleteOne(body)
        console.log(saveRespond)
        if(saveRespond.deletedCount>0){
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }else{
            return {
                code: -1,
                message: "No Subscribe record found",
                result: saveRespond
            }
        }
    }
    catch (e) {
        return {
            code: -2,
            message: "fail",
            result: {}
        }
    }
}

// async function getSubscribByUsername(username:string){
//     let body = {
//         username
//     }
//     try {
//         const saveRespond = await TelegramMapping.findOne(username)
//         console.log(saveRespond)
//         if(saveRespond.deletedCount>0){
//             return {
//                 code: 0,
//                 message: "success",
//                 result: saveRespond
//             }
//         }else{
//             return {
//                 code: -1,
//                 message: "No Subscribe record found",
//                 result: saveRespond
//             }
//         }
//     }
//     catch (e) {
//         return {
//             code: -2,
//             message: "fail",
//             result: {}
//         }
//     }
// }

export function telegramBotService() {

    bot.onText(/\/startsubscribe/, async function (msg) {
        let chatId = msg.chat.id; //用戶的ID
        let username = msg?.chat?.username??''; //用戶的ID
        // let sentMsg = await bot.sendMessage(chatId, "type your wallet", { reply_to_message_id: msg.message_id })
        let sentMsg = await bot.sendMessage(chatId, "type your wallet", {
            reply_markup: {
                force_reply: true
            }
        }).then(function (res) {
            bot.onReplyToMessage(res.chat.id, res.message_id, async function (msg) {
                //call api to add
                let result = await subscriberInformationService.updateSubscriberTgChatIdByUsername(chatId.toString(),username)
                if((result?.notification?.telegram?.chatId??'')!==''){
                    bot.sendMessage(chatId, 'success register')
                }else{
                    bot.sendMessage(chatId, 'fail to register. please seek help in discord')
                }
            })
        })
    });

    bot.onText(/\/endsubscribe/, async function (msg) {
        let chatId = msg.chat.id; //用戶的ID
        let username = msg.chat.username; //用戶的ID
        let result = await removeSubscribe(username,chatId)
        bot.sendMessage(chatId,result.message)
    });


}