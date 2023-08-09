import TelegramBot from 'node-telegram-bot-api'
import moment from 'moment'
// import { TelegramMapping }from '../modal/telegramMappingModal'
// import {Test} from '../modal/testModal';
// import { Employee } from '../modal/employeeModel';
import { AlertHistory } from '../modal/alertHistoryModel'
import { bot } from '../services/telegramBotService'


export class AlertHistoryService {
    constructor() { }


    addAlertHistoryService = async (alertHistoryInformation: any) => {
        try {
            const saveRespond = await AlertHistory.create(alertHistoryInformation);
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

    getAlertHistoryByCreateDateAndCondition = async (address:any,condition:any,workflowKey:any) => {
        let now = moment().add(-1,'days')
        console.log(now)
        const saveRespond = await AlertHistory.find({
            $and: [
                { createDate: { $gte: now } },
                { condition: condition },
                { address: address},
                {key:workflowKey}
            ]
        });
        return saveRespond
    }
}

// module.exports SubscriberInformationService;
// default export SubscriberInformationService