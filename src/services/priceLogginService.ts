import TelegramBot from 'node-telegram-bot-api'
import moment from 'moment'
// import { TelegramMapping }from '../modal/telegramMappingModal'
// import {Test} from '../modal/testModal';
// import { Employee } from '../modal/employeeModel';
import { AlertHistory } from '../modal/alertHistoryModel'
import { PriceLogging } from '../modal/priceLoggingModel'
import { SubscriptionMarks } from '../modal/subscriptionMarksModel'

import { bot } from '../services/telegramBotService'
import { SequenceService } from '../services/sequenceService'

export class PriceLogginService {
    constructor() { }
    sequenceService = new SequenceService();
    addPriceLog = async (priceInformation: any) => {
        try {
            let nextNumber = await this.sequenceService.getNextSequence("PRICE_LOGGIN")
            priceInformation = {
                ...priceInformation,
                key: nextNumber
            }
            const saveRespond = await PriceLogging.create(priceInformation);
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            console.error(`[addPriceLog error], ${e}`)
            return {
                code: -1,
                message: "fail",
                result: {}
            }
        }
    }

    addSubsctiptionMarks = async (subscriptionMark: any) => {
        try {
            let nextNumber = await this.sequenceService.getNextSequence("SUBSCRIPTION_MARKS")
            subscriptionMark = {
                ...subscriptionMark,
                key: nextNumber
            }
            const saveRespond = await SubscriptionMarks.findOneAndUpdate({ address: subscriptionMark.address }, subscriptionMark, { upsert: true });
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            console.error(`[addSubsctiptionMarks error] ${e}`)
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