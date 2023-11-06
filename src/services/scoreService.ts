import TelegramBot from 'node-telegram-bot-api'

import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { ethers, Wallet } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { Client, IntentsBitField } from 'discord.js';
import redstone from "redstone-api";
// import { useContractRead, useContractReads } from "wagmi";
// import contracts from "../generated/deployedContracts";

import usdcAbi from "../abi/usdc.json"
import wethAbi from "../abi/weth.json"
import comptrollerAbi from "../abi/Comptroller.json"
import testAbi from "../abi/test.json"
import cethAbi from "../abi/ceth.json"
import cusdcAbi from "../abi/cusdc.json"
import cwethAbi from "../abi/cweth.json"



import { TelegramMapping } from '../modal/telegramMappingModal'
import { SubscriptedNoitifcations } from '../modal/subscriptedNoitifcationsModal'
import { Test } from '../modal/testModal';
import { Employee } from '../modal/employeeModel';
import { EmailMapping } from '../modal/emailMappingModal'
import { sendMessageByUsername } from '../services/telegramService'
import { sendEmail } from '../services/emailService'
import { bot } from '../services/telegramBotService'
import { sendDiscordMessageByUsername } from '../services/discordService'
import { SubscriberInformation } from '../modal/subscriberInformationModal'
import { AlertHistoryService } from '../services/alertHistoryService'
import { PriceLogginService } from '../services/priceLogginService'
const COMPTROLLER_CONTRACT_ADDRESS = process.env.COMPTROLLER_CONTRACT_ADDRESS
const CETH_CONTRACT_ADDRESS = process.env.CETH_CONTRACT_ADDRESS
// const CWETH_CONTRACT_ADDRESS = process.env.CWETH_CONTRACT_ADDRESS
const CUSDC_CONTRACT_ADDRESS = process.env.CUSDC_CONTRACT_ADDRESS
const div18zero = 1000000000000000000

export class ScoreService {
    constructor() {
        // super();
    }

    alertHistoryService = new AlertHistoryService()
    priceLogginService = new PriceLogginService()

    getScoreByAddress = async () => {
        await this.priceLogginService.priceLogginService("")
        // console.log(`checkSubscriptedNoitifcation`)
        // let body = { "alertSubscripte.telegram": true }
        // try {
        //     const saveRespond = await SubscriptedNoitifcations.find(body);
        //     console.log(saveRespond)
        //     return {
        //         code: 0,
        //         message: "success",
        //         result: saveRespond
        //     }
        // }
        // catch (e) {
        //     console.log(e)
        //     return {
        //         code: -1,
        //         message: "fail",
        //         result: []
        //     }
        // }
    }

   
}
