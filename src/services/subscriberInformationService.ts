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

    modifySubscriberInformation = async () => {

    }
}

// module.exports SubscriberInformationService;
// default export SubscriberInformationService