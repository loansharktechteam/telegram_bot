import TelegramBot from 'node-telegram-bot-api'
import moment from 'moment'
// import { TelegramMapping }from '../modal/telegramMappingModal'
// import {Test} from '../modal/testModal';
// import { Employee } from '../modal/employeeModel';
import { AlertHistory } from '../modal/alertHistoryModel'
import { PriceLogging } from '../modal/priceLoggingModel'
import { SubscriptionMarks } from '../modal/subscriptionMarksModel'

import { bot } from '../services/telegramBotService'

export class PriceLogginService {
    constructor() { }
    addPriceLog = async (priceInformation: any) => {
        try {
            const saveRespond = await PriceLogging.create(priceInformation);
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

    addSubsctiptionMarks = async (subscriptionMark: any) => {
        try {
            const saveRespond = await SubscriptionMarks.findOneAndUpdate({ address: subscriptionMark.address }, subscriptionMark, { upsert: true });
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

    getScoreByAddress = async (address: string) => {
        try {
            const saveRespond = await SubscriptionMarks.find({ address: address });
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
}

// module.exports SubscriberInformationService;
// default export SubscriberInformationService