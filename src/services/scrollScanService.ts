import TelegramBot from 'node-telegram-bot-api'
import fetch from 'node-fetch';
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

export class ScrollScanService {
    constructor() {
        // super();
    }

    getTokenHolderByContractAddress = async (address: string) => {
        let page = 1
        const offset = 1000
        let holderAddress: any = []
        //call api`
        while (page > 0) {
            try {
                const response = await fetch(`https://sepolia-blockscout.scroll.io/api?module=token&action=getTokenHolders&contractaddress=${address}&page=${page}&offset=${offset}`);
                if (response.status === 200) {
                    const data: any = await response.json();
                    if ((data?.result?.length ?? 0) > 0) {
                        for (let count = 0; count < data.result.length; count++) {
                            holderAddress.push(data.result[count].address)
                        }
                    }
                    if ((data?.result?.length ?? 0) !== offset) {
                        break;
                    }
                }
                page++
            } catch (e) {
                break;
            }
        }
        return holderAddress
    }
}
