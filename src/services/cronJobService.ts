import TelegramBot from 'node-telegram-bot-api'
import { TelegramMapping } from '../modal/telegramMappingModal'
import { SubscriptedNoitifcations } from '../modal/subscriptedNoitifcationsModal'
import { Test } from '../modal/testModal';
import { Employee } from '../modal/employeeModel';
import { EmailMapping } from '../modal/emailMappingModal'
import { sendMessageByUsername } from '../services/telegramService'
import { sendEmail } from '../services/emailService'
import { bot } from '../services/telegramBotService'
import { SubscriberInformation } from '../modal/subscriberInformationModal'
// async function getChatIdByUsername(username:string){
//     try{
//         const result = await TelegramMapping.findOne({username:username});
//         return result?.chatId??0
//     }catch(e){
//         console.error(e)
//         return 0
//     }
// }

// function sendMsg(chatId:any,message:any){

// }

// function addNewUser(){

// }

async function checkSubscriptedNoitifcation() {
    console.log(`checkSubscriptedNoitifcation`)
    let body = { "alertSubscripte.telegram": true }
    try {
        const saveRespond = await SubscriptedNoitifcations.find(body);
        console.log(saveRespond)
        return {
            code: 0,
            message: "success",
            result: saveRespond
        }
    }
    catch (e) {
        console.log(e)
        return {
            code: -1,
            message: "fail",
            result: []
        }
    }
}

async function getTelegramUserByWalletAddress(walletAddress: string) {
    console.log(`getTelegramUserByWalletAddress`)
    let body = { "address": walletAddress }
    try {
        const saveRespond = await TelegramMapping.findOne(body);
        console.log(saveRespond)
        return {
            code: 0,
            message: "success",
            result: saveRespond
        }
    }
    catch (e) {
        console.log(e)
        return {
            code: -1,
            message: "fail",
            result: {}
        }
    }
}

async function getEmailByWalletAddress(walletAddress: string) {
    console.log(`getEmailByWalletAddress`,walletAddress)
    let body = { "address": walletAddress }
    try {
        const saveRespond = await EmailMapping.findOne(body);
        console.log(`getEmailByWalletAddress`,saveRespond)
        return {
            code: 0,
            message: "success",
            result: saveRespond
        }
    }
    catch (e) {
        console.log(e)
        return {
            code: -1,
            message: "fail",
            result: {}
        }
    }
}
export async function checkTrigger() {
    console.log(`trigger`)
    //step 1 loop list
    //get user
    //trigger alert
    let checkSubscriptedNoitifcationResult: any = await checkSubscriptedNoitifcation()
    console.log(`checkSubscriptedNoitifcationResult`, checkSubscriptedNoitifcationResult)
    if (checkSubscriptedNoitifcationResult.result.length > 0) {
        for (let i = 0; i < checkSubscriptedNoitifcationResult.result.length; i++) {
            let address = checkSubscriptedNoitifcationResult?.result[i]?.address ?? ''
            if (checkSubscriptedNoitifcationResult?.result[i].alertSubscripte.telegram === true) {
                let telgramResult = await getTelegramUserByWalletAddress(address)
                console.log(telgramResult)
                let senmsgResult = await sendMessageByUsername(telgramResult.result.username,'' , "this is trigger alert")
                console.log(`send tg msg`)
            }
            if (checkSubscriptedNoitifcationResult?.result[i].alertSubscripte.email === true) {
                let emailResult = await getEmailByWalletAddress(address)
                console.log(emailResult)
                let sendEmailResult = await sendEmail(emailResult.result.email,'')
                console.log(`send email`)
            }
            if (checkSubscriptedNoitifcationResult?.result[i].alertSubscripte.discord === true) {

            }


        }
    }
}



async function getAllBorrowLimitOverCondition() {
    console.log(`getAllBorrowLimitOverCondition`)
    let body = {condition:{$elemMatch:{condition:"borrowLimitOver"}},status:"on"}
    // let body = {condition:{$elemMatch:{condition:"abcd"}}}
    try {
        const saveRespond = await SubscriberInformation.find(body);
        return {
            code: 0,
            message: "success",
            result: saveRespond
        }
    }
    catch (e) {
        console.error(e)
        return {
            code: -1,
            message: "fail",
            result: []
        }
    }
}

async function checkEachSubscribedCondition(eachSubscribeInformation:any){
    console.log(`checkEachSubscribedCondition`,eachSubscribeInformation)
    //.. check condition

    //send alert
    // eachSubscribeInformation.
    if(eachSubscribeInformation.notification.email.status==='on'){
        let sendEmailResult = await sendEmail(eachSubscribeInformation.notification.email.toList,eachSubscribeInformation.notification.email.ccList)
        console.log(`sent email`)
    }
    if(eachSubscribeInformation.notification.telegram.status==='on'){
        let senmsgResult = await sendMessageByUsername('',eachSubscribeInformation.notification.telegram.chatId, "this is trigger alert")
        console.log(`send tg msg`)
    }
    if(eachSubscribeInformation.notification.discord.status==='on'){
        // let senmsgResult = await sendMessageByUsername('',eachSubscribeInformation.notification.telegram.chatId, "this is trigger alert")
        // console.log(`send tg msg`)
    }
}

export async function triggerLiquidationAlert(){
    const result = await getAllBorrowLimitOverCondition()
    if(result.result.length>0){
        //someone subscribe
        for(let count=0; count < result.result.length;count++){
            checkEachSubscribedCondition(result.result[count])
        }
    }
    
    return 
}