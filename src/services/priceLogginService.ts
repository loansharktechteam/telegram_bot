import TelegramBot from 'node-telegram-bot-api'
import moment from 'moment'
// import { TelegramMapping }from '../modal/telegramMappingModal'
// import {Test} from '../modal/testModal';
// import { Employee } from '../modal/employeeModel';
import { AlertHistory } from '../modal/alertHistoryModel'
import { PriceLogging } from '../modal/priceLoggingModel'
import { SubscriptionMarks } from '../modal/subscriptionMarksModel'
import {SubscriptionHaveMarks } from '../modal/subscriptionHaveMarksModel'
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

    // addSubsctiptionMarks = async (subscriptionMark: any) => {
    addSubsctiptionMarks = async (address: string, additionalMark: any) => {
        try {
            let nextNumber = await this.sequenceService.getNextSequence("SUBSCRIPTION_MARKS")
            const originAddressMarks:any = await SubscriptionMarks.find({ address: address });
            let subscriptionMark: any = {}
            if((Object?.keys(originAddressMarks?.[0]??{})?.length??0) >0){
                subscriptionMark={
                    marks: (originAddressMarks[0]?.marks ?? 0) + additionalMark,
                    lastUpdateDate: new Date(),
                    lastUpdateBy: 'SYSTEM',
                    address:address,
                }
            }else{
                subscriptionMark={
                    marks: additionalMark,
                    key: nextNumber,
                    createDate: new Date(),
                    createBy: 'SYSTEM',
                    lastUpdateDate: new Date(),
                    lastUpdateBy: 'SYSTEM',
                    address:address,
                }
            }
            // const saveRespond = await SubscriptionMarks.findOneAndUpdate({ address: subscriptionMark.address }, subscriptionMark, { upsert: true });
            const saveRespond = await SubscriptionMarks.findOneAndUpdate({ address: address }, subscriptionMark, { upsert: true });
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            // console.error(`[addSubsctiptionMarks error] ${e}`)
            return {
                code: -1,
                message: "fail",
                result: {}
            }
        }
    }

    addSubscriptionHaveMarks = async (address: string, additionalMark: any) => {
        try {
            let nextNumber = await this.sequenceService.getNextSequence("SUBSCRIPTION_HAVE_MARKS")
            const originAddressMarks:any = await SubscriptionHaveMarks.find({ address: address });
            let subscriptionMark: any = {}
            if((Object?.keys(originAddressMarks?.[0]??{})?.length??0) >0){
                subscriptionMark={
                    marks: (originAddressMarks[0]?.marks ?? 0) + additionalMark,
                    lastUpdateDate: new Date(),
                    lastUpdateBy: 'SYSTEM',
                    address:address,
                }
            }else{
                subscriptionMark={
                    marks: additionalMark,
                    key: nextNumber,
                    createDate: new Date(),
                    createBy: 'SYSTEM',
                    lastUpdateDate: new Date(),
                    lastUpdateBy: 'SYSTEM',
                    address:address,
                }
            }
            // const saveRespond = await SubscriptionMarks.findOneAndUpdate({ address: subscriptionMark.address }, subscriptionMark, { upsert: true });
            SubscriptionHaveMarks.insertMany
            const saveRespond = await SubscriptionHaveMarks.findOneAndUpdate({ address: address }, subscriptionMark, { upsert: true });
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            // console.error(`[addSubsctiptionMarks error] ${e}`)
            return {
                code: -1,
                message: "fail",
                result: {}
            }
        }
    }

    addSubscriptionHaveMarksInsertMany = async (addressList: any) => {
        console.log(`addressList`,addressList?.length??0);
        try {

            if(addressList.length>0){
                let insertList:any =[]
                for(let count=0;count<addressList.length;count ++){
                    let nextNumber = await this.sequenceService.getNextSequence("SUBSCRIPTION_HAVE_MARKS")
                    let tempObj = {
                        marks: 1,
                        key: nextNumber,
                        createDate: new Date(),
                        createBy: 'SYSTEM',
                        lastUpdateDate: new Date(),
                        lastUpdateBy: 'SYSTEM',
                        address:addressList[count],
                    }
                    // console.log(`tempObj`,tempObj)
                    insertList.push(tempObj)
                }
                console.log(`finish loop address`, insertList[0])
                        // remove all record
                await this.removeSubsctiptionMarks();
                SubscriptionHaveMarks.insertMany(insertList)
                console.log(`finish`)
            }
           return {
                code: 0,
                message: "success",
                result: {}
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

    removeSubsctiptionMarks = async () => {
        try {
            const saveRespond = await SubscriptionHaveMarks.deleteMany()
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            // console.error(`[addSubsctiptionMarks error] ${e}`)
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

    
    checkHasDepositByAddress = async (address: string) => {
        try {
            const saveRespond = await SubscriptionHaveMarks.find({ address: address });
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