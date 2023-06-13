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
        const saveRespond = await SubscriberInformation.findOne(reqestBody);
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
        if (result.notification.telegram.chatId) {
            result.notification.telegram.chatId=chatId
            result = await  this.updateSubscriberInformation(result)
            return result
        }
    }

    modifySubscriberInformation = async () => {

    }
}

// module.exports SubscriberInformationService;
// default export SubscriberInformationService