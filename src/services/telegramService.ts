import TelegramBot from 'node-telegram-bot-api'
import { TelegramMapping }from '../modal/telegramMappingModal'
import {Test} from '../modal/testModal';
import { Employee } from '../modal/employeeModel';
import { bot } from '../services/telegramBotService'

async function getChatIdByUsername(username:string){
    try{
        const result = await TelegramMapping.findOne({username:username});
        return result?.chatId??0
    }catch(e){
        console.error(e)
        return 0
    }
}

function sendMsg(chatId:any,message:any){

}

function addNewUser(){

}

export async function sendMessageByUsername(username:any,chatId:any,message:any){
    try{
        // let chatId =await getChatIdByUsername(username)
        let result  = await bot.sendMessage(chatId,message)
        if(result.message_id){
            return {
                code:'0',
                message:'success'
            }
        }
        return {
            code:'-1',
            message:'fail'
        }
    }
    catch(e:any){
        return {
            code:e?.code??'-1',
            message:e?.message??'fail'
        }
    }
}