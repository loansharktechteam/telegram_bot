import TelegramBot from 'node-telegram-bot-api'
// import { TelegramMapping }from '../modal/telegramMappingModal'
// import {Test} from '../modal/testModal';
// import { Employee } from '../modal/employeeModel';
import { SubscriberInformation } from '../modal/subscriberInformationModal'
import { bot } from '../services/telegramBotService'

export class SubscriberInformationService {
    constructor() { }

    getSubscriberInformationByAddress = async (address: string) => {
        let body = {
            address,
        }
        const saveRespond = await SubscriberInformation.findOne(body);
        return saveRespond
    }

    getSubscriberInformationByKey = async (key: string) => {
        let body = {
            key
        }
        const saveRespond = await SubscriberInformation.findOne(body);
        return saveRespond
    }

    getSubscriberInformation = async (reqestBody: any) => {
        const saveRespond = await SubscriberInformation.find(reqestBody);
        return saveRespond
    }


    addSubscriberInformation = async (subscriberInformation: any) => {
        try {
            const saveRespond = await SubscriberInformation.create(subscriberInformation);
            console.log(saveRespond)
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

    updateSubscriberInformation = async (subscriberInformation: any) => {
        try {
            console.log(subscriberInformation)
            const saveRespond = await SubscriberInformation.updateOne(subscriberInformation)
            console.log(saveRespond)
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
                result: {}
            }
        }
    }

    updateSubscriberTgChatIdByUsername = async (chatId: string, username: string) => {
        console.log(chatId, username)
        let requestBody = {"notification.telegram.username":username}
        let result = await this.getSubscriberInformation(requestBody)
        let successCount = 0
        let failCount = 0
        console.log(`got subscribe`,result)
        if(result.length>0){
            for(let i=0;i<result.length;i++){
                console.log(result[i])
                console.log(`83`,result[i].notification.telegram.chatId)
                if ((result[i]?.notification?.telegram?.chatId??null)!==null) {
                    result[i].notification.telegram.chatId=chatId
                    console.log(`got subscribe456`,result[i])
                    let result2 = await this.updateSubscriberInformation(result[i])
                    console.log(`got subscribe123`,result2)
                    if(result2){
                        successCount = successCount+1
                    }else{
                        failCount = failCount+1
                    }
                }
            }
        }
        if(failCount>0){
            return {
                message:'fail',
            }
        }else{
            return {
                message:'success',
            }
        }
    }

    modifySubscriberInformation = async () => {

    }
}

// module.exports SubscriberInformationService;
// default export SubscriberInformationService