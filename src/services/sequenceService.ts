import TelegramBot from 'node-telegram-bot-api'
import moment from 'moment'
// import { TelegramMapping }from '../modal/telegramMappingModal'
// import {Test} from '../modal/testModal';
// import { Employee } from '../modal/employeeModel';
import { AlertHistory } from '../modal/alertHistoryModel'
import { Sequences } from '../modal/sequencesModel'
import { SubscriptionMarks } from '../modal/subscriptionMarksModel'

import { bot } from '../services/telegramBotService'


export class SequenceService {
    constructor() { }

    getNextSequence = async (name: any) => {
        const saveRespond = await Sequences.findOneAndUpdate(
            { "type": name },
            {
                $inc: {
                    sequence: 1
                },
            },
            { returnNewDocument: false }
        )
        let result:any = saveRespond?.sequence ?? -2
        result++
        return result
    }
}

// module.exports SubscriberInformationService;
// default export SubscriberInformationService