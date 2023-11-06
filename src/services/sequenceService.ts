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
        console.log(`saveRespond`, saveRespond);
        let result:any = saveRespond?.sequence ?? -2
        result++
        return result
        // console.log(saveRespond)
        // const saveRespond = await PriceLogging.findAndModify(priceInformation);

        // var ret = db.counters.findAndModify(
        //     {
        //         query: { _id: name },
        //         update: { $inc: { seq: 1 } },
        //         new: true
        //     }
        // );

        // return ret.seq;
    }
}

// module.exports SubscriberInformationService;
// default export SubscriberInformationService