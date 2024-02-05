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
import { ScrollScanService } from '../services/scrollScanService'
import {
    filterDuplicateElement
} from '../util/generalFunction'
import {
    RED_STONE_CONFIG_CONSTANT
} from '../util/generalConstant'
const COMPTROLLER_CONTRACT_ADDRESS = process.env.COMPTROLLER_CONTRACT_ADDRESS
const CETH_CONTRACT_ADDRESS = process.env.CETH_CONTRACT_ADDRESS
// const CWETH_CONTRACT_ADDRESS = process.env.CWETH_CONTRACT_ADDRESS
const CUSDC_CONTRACT_ADDRESS = process.env.CUSDC_CONTRACT_ADDRESS
const SCROLL_NET = process.env.SCROLL_NET
const CONNECT_WALLET_PRIVATE_KEY = process.env.CONNECT_WALLET_PRIVATE_KEY
// const RED_STONE_CACHE_LAYER = process.env.RED_STONE_CACHE_LAYER
const div18zero = 1000000000000000000
// async function getChatIdByUsername(username:string){
//     try{
//         const result = await TelegramMapping.findOne({username:username});
//         return result?.chatId??0
//     }catch(e){
//         console.error(e)
//         return 0
//     }
// }

// function sendMsg(chatId:any,message:any){

// }

// function addNewUser(){

// }

export class CronJobService {
    constructor() {
        // super();
    }

    alertHistoryService = new AlertHistoryService()
    priceLogginService = new PriceLogginService()
    scrollScanService = new ScrollScanService()

    checkSubscriptedNoitifcation = async () => {
        console.log(`checkSubscriptedNoitifcation`)
        let body = { "alertSubscripte.telegram": true }
        try {
            const saveRespond = await SubscriptedNoitifcations.find(body);
            console.log(saveRespond)
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            console.log(e)
            return {
                code: -1,
                message: "fail",
                result: []
            }
        }
    }

    getTelegramUserByWalletAddress = async (walletAddress: string) => {
        console.log(`getTelegramUserByWalletAddress`)
        let body = { "address": walletAddress }
        try {
            const saveRespond = await TelegramMapping.findOne(body);
            console.log(saveRespond)
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            console.log(e)
            return {
                code: -1,
                message: "fail",
                result: {}
            }
        }
    }

    getEmailByWalletAddress = async (walletAddress: string) => {
        console.log(`getEmailByWalletAddress`, walletAddress)
        let body = { "address": walletAddress }
        try {
            const saveRespond = await EmailMapping.findOne(body);
            console.log(`getEmailByWalletAddress`, saveRespond)
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            console.log(e)
            return {
                code: -1,
                message: "fail",
                result: {}
            }
        }
    }

    getDiscordClientIdByWalletAddress = async (walletAddress: string) => {
        console.log(`getDiscordClientIdByWalletAddress`, walletAddress)
        let body = { "address": walletAddress }
        try {
            const saveRespond = await EmailMapping.findOne(body);
            console.log(`getEmailByWalletAddress`, saveRespond)
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            console.log(e)
            return {
                code: -1,
                message: "fail",
                result: {}
            }
        }
    }

    checkTrigger = async () => {
        console.log(`trigger`)
        //step 1 loop list
        //get user
        //trigger alert
        let checkSubscriptedNoitifcationResult: any = await this.checkSubscriptedNoitifcation()
        console.log(`checkSubscriptedNoitifcationResult`, checkSubscriptedNoitifcationResult)
        if (checkSubscriptedNoitifcationResult.result.length > 0) {
            for (let i = 0; i < checkSubscriptedNoitifcationResult.result.length; i++) {
                let address = checkSubscriptedNoitifcationResult?.result[i]?.address ?? ''
                if (checkSubscriptedNoitifcationResult?.result[i].alertSubscripte.telegram === true) {
                    let telgramResult = await this.getTelegramUserByWalletAddress(address)
                    console.log(telgramResult)
                    let senmsgResult = await sendMessageByUsername(telgramResult.result.username, '', "this is trigger alert")
                    console.log(`send tg msg`)
                }
                if (checkSubscriptedNoitifcationResult?.result[i].alertSubscripte.email === true) {
                    let emailResult = await this.getEmailByWalletAddress(address)
                    console.log(emailResult)
                    let sendEmailResult = await sendEmail(emailResult.result.email, '')
                    console.log(`send email`)
                }
                if (checkSubscriptedNoitifcationResult?.result[i].alertSubscripte.discord === true) {
                    let emailResult = await this.getEmailByWalletAddress(address)
                    console.log(emailResult)
                    let sendEmailResult = await sendEmail(emailResult.result.email, '')
                    console.log(`send email`)
                }


            }
        }
    }



    getAllBorrowLimitOverCondition = async () => {
        console.log(`getAllBorrowLimitOverCondition`)
        let body = { "condition.condition": "borrowLimitOver", status: "on" }
        // let body = {condition:{$elemMatch:{condition:"abcd"}}}
        try {
            const saveRespond = await SubscriberInformation.find(body);
            return {
                code: 0,
                message: "success",
                result: saveRespond
            }
        }
        catch (e) {
            console.error(e)
            return {
                code: -1,
                message: "fail",
                result: []
            }
        }
    }

    checkEachSubscribedCondition = async (eachSubscribeInformation: any) => {
        console.log(`checkEachSubscribedCondition`, eachSubscribeInformation)
        //.. check condition

        //send alert
        // eachSubscribeInformation.
        if (eachSubscribeInformation.notification.email.status === 'on') {
            let sendEmailResult = await sendEmail(eachSubscribeInformation.notification.email.toList, eachSubscribeInformation.notification.email.ccList)
            console.log(`sent email`)
        }
        if (eachSubscribeInformation.notification.telegram.status === 'on') {
            let senmsgResult = await sendMessageByUsername('', eachSubscribeInformation.notification.telegram.chatId, "this is trigger alert")
            console.log(`send tg msg`)
        }
        if (eachSubscribeInformation.notification.discord.status === 'on') {
            let sendDiscordMessageResult = await sendDiscordMessageByUsername(eachSubscribeInformation.notification.discord.clientId, "this is trigger alert")
            console.log(`send discord msg`)
        }
        //write history for not trigger again within 24hrs
        let obj = {
            key: eachSubscribeInformation.key,
            address: eachSubscribeInformation.address,
            condition: 'borrowLimitOver',
            createDate: new Date()
        }
        await this.alertHistoryService.addAlertHistoryService(obj)
        // let result = await this.alertHistoryService.getAlertHistoryByCreateDateAndCondition('borrowLimitOver')
        // console.log(result)
        return
    }

    triggerLiquidationAlert = async (req: any, res: any) => {
        this.startLiquidation()
        res.status(200).json({ message: "OK" })
        return
    }

    startLiquidation = async () => {
        const result = await this.getAllBorrowLimitOverCondition()
        console.log(result)
        if (result.result.length > 0) {
            //someone subscribe
            console.log(`start looping`)
            for (let count = 0; count < result.result.length; count++) {
                let eachSubscription = result.result[count]
                // checkEachSubscribedCondition(result.result[count])
                eachSubscription.condition.map(async (eachCondition: any) => {
                    if (eachCondition.condition === 'borrowLimitOver') {
                        console.log(` eachSubscription.key`, eachSubscription.key)
                        // let checkAlertNeedTriggerResult = true
                        let checkAlertNeedTriggerResult = await this.checkAlertNeedTrigger(eachSubscription.address, eachCondition.value, eachSubscription.key)
                        console.log(`checkAlertNeedTriggerResult`, checkAlertNeedTriggerResult)

                        if (checkAlertNeedTriggerResult === true) {
                            //if triggered alert send alert
                            console.log(`trigger alert`)
                            this.checkEachSubscribedCondition(eachSubscription)
                        }
                    }
                })
            }
        }
        return
    }

    checkAlertNeedTrigger = async (address: any, alertThreshold: any, workflowKey: any) => {

        let pass24HoursHistory = await this.alertHistoryService.getAlertHistoryByCreateDateAndCondition(address, 'borrowLimitOver', workflowKey)
        // console.log(pass24HoursHistory)
        pass24HoursHistory = pass24HoursHistory ? pass24HoursHistory : []
        console.log(`pass24HoursHistory.length`, pass24HoursHistory.length)
        if (pass24HoursHistory.length > 0) return false



        // let liquidationAddressCheck = `0x24DE9902d6F49d6E4D5c8fe4B9749c2CB0204f43`
        let liquidationAddressCheck = address


        const comptrollerContractAddress = COMPTROLLER_CONTRACT_ADDRESS
        const nameItem = ["cash",
            "price",
            "totalSupply",
            "exchangeRate",
            "totalBorrows",
            "balance",
            "supplyRatePerBlock",
            "borrowBalanceStored",
            "borrowRatePerBlock",
            "markets",
            "borrowCaps",
            "isMember",]

        let accountStatus = {
            address: liquidationAddressCheck,
            totalBorrowAmountInUsdInNumber: 0,
            totalLimitedAmountInUsdInNumber: 0,
            currentPercentageLimit: 0,
        }
        let martketContractsDetail = [
            {
                address: CETH_CONTRACT_ADDRESS,  //ceth
                abi: cethAbi,
                balance: null,
                borrow: null,
                borrowInNumber: 0,
                borrowInUsdInNumber: 0,
                borrowBalanceStored: null,
                borrowCaps: null,
                borrowRatePerBlock: null,
                cash: null,
                exchangeRate: null,
                isMember: null,
                markets: null,
                price: null,
                supply: null,
                supplyRatePerBlock: null,
                token: null,
                tokenBorrowAPY: null,
                tokenSupplyAPY: null,
                totalBorrows: null,
                totalBorrowsInNumber: null,
                totalSupply: null,
                value: null,
            },
            // {
            //     address: CWETH_CONTRACT_ADDRESS, //cweth
            //     abi: cwethAbi,
            //     balance: null,
            //     borrow: null,
            //     borrowInNumber: 0,
            //     borrowInUsdInNumber: 0,
            //     borrowBalanceStored: null,
            //     borrowCaps: null,
            //     borrowRatePerBlock: null,
            //     cash: null,
            //     exchangeRate: null,
            //     isMember: null,
            //     markets: null,
            //     price: null,
            //     supply: null,
            //     supplyRatePerBlock: null,
            //     token: null,
            //     tokenBorrowAPY: null,
            //     tokenSupplyAPY: null,
            //     totalBorrows: null,
            //     totalBorrowsInNumber: null,
            //     totalSupply: null,
            //     value: null,
            // },
            {
                address: CUSDC_CONTRACT_ADDRESS, //cusdc
                abi: cusdcAbi,
                balance: null,
                borrow: null,
                borrowInNumber: 0,
                borrowInUsdInNumber: 0,
                borrowBalanceStored: null,
                borrowCaps: null,
                borrowRatePerBlock: null,
                cash: null,
                exchangeRate: null,
                isMember: null,
                markets: null,
                price: null,
                supply: null,
                supplyRatePerBlock: null,
                token: null,
                tokenBorrowAPY: null,
                tokenSupplyAPY: null,
                totalBorrows: null,
                totalBorrowsInNumber: null,
                totalSupply: null,
                value: null,
            },
        ]



        const usdcPrice = await redstone.getPrice("USDC");
        //real usdc price usdcPrice.value
        const ethPrice = await redstone.getPrice("ETH");
        //real eth price ethPrice.value
        const priceArray = new Map();
        priceArray.set("USDC", ethers.utils.parseUnits(usdcPrice.value.toString()));
        priceArray.set("WETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        priceArray.set("ETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        let usdcPriceInNumber = Number(priceArray.get('USDC').toString()) / div18zero
        let wethPriceInNumber = Number(priceArray.get('WETH').toString()) / div18zero
        let ethPriceInNumber = Number(priceArray.get('ETH').toString()) / div18zero

        // const provider = new ethers.providers.JsonRpcProvider("https://alpha-rpc.scroll.io/l2");
        // const provider = new ethers.providers.JsonRpcProvider("https://1rpc.io/scroll/sepolia");
        const provider = new ethers.providers.JsonRpcProvider(SCROLL_NET);
        const wallet = new ethers.Wallet("34fca74d424c5acd869a373b6c5907fa0f42e9def560054e09a9d3e27764b6e5", provider)
        console.log(`wallet`)
        const comptrollerContract = new ethers.Contract(comptrollerContractAddress ? comptrollerContractAddress : '', comptrollerAbi, provider);

        const comptrollerContractWithSignerAA = comptrollerContract.connect(wallet);
        const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(RED_STONE_CONFIG_CONSTANT);
        let allMarketAddress = await wrappedComptrollerContract.getAllMarkets()
        let assestIn = await wrappedComptrollerContract.getAssetsIn(liquidationAddressCheck)


        for (let count = 0; count < martketContractsDetail.length; count++) {
            let eachContractDetail = martketContractsDetail[count]
            const eachContract = new ethers.Contract(eachContractDetail?.address ?? '', eachContractDetail.abi, provider);
            const eachContractWithSignerAA = eachContract.connect(wallet);
            if (eachContractDetail.address === CUSDC_CONTRACT_ADDRESS) {
                //usdc
                let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
                console.log(`borrowBalance`, Number(borrowBalance.toString()))
                martketContractsDetail[count] = {
                    ...eachContractDetail,
                    borrowInNumber: Number(borrowBalance.toString()),
                    borrowInUsdInNumber: Number(borrowBalance.toString()) * usdcPriceInNumber
                }
                console.log(martketContractsDetail[count].borrowInNumber)
                console.log(martketContractsDetail[count].borrowInUsdInNumber)
            }
            // else if (eachContractDetail.address === CWETH_CONTRACT_ADDRESS) {
            //     // // //weth
            //     let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
            //     console.log(`borrowBalance`, Number(borrowBalance.toString()))
            //     // console.log(`wethPriceInNumber`, wethPriceInNumber)
            //     martketContractsDetail[count] = {
            //         ...eachContractDetail,
            //         borrowInNumber: Number(borrowBalance.toString()),
            //         borrowInUsdInNumber: Number(borrowBalance.toString()) * wethPriceInNumber
            //     }
            //     console.log(martketContractsDetail[count].borrowInNumber)
            //     console.log(martketContractsDetail[count].borrowInUsdInNumber)
            // }
            else if (eachContractDetail.address === CETH_CONTRACT_ADDRESS) {
                // // //eth
                let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
                console.log(`borrowBalance`, Number(borrowBalance.toString()))
                martketContractsDetail[count] = {
                    ...eachContractDetail,
                    borrowInNumber: Number(borrowBalance.toString()),
                    borrowInUsdInNumber: Number(borrowBalance.toString()) * ethPriceInNumber
                }
                console.log(martketContractsDetail[count].borrowInNumber)
                console.log(martketContractsDetail[count].borrowInUsdInNumber)
            }
            // const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(config);
        }


        // console.log(`martketContractsDetail`, martketContractsDetail)
        let accountLiquidityInNumber = 0
        console.log(`getAccountLiquidity`,liquidationAddressCheck)
        var allAccountLiquidity = await wrappedComptrollerContract.getAccountLiquidity(liquidationAddressCheck);
        if (allAccountLiquidity[0]) {
            let testaccountLiquidityInNumber = Number(allAccountLiquidity[0].toString())
            console.log(`testaccountLiquidityInNumber`, testaccountLiquidityInNumber)
        }
        if (allAccountLiquidity[1]) {
            accountLiquidityInNumber = Number(allAccountLiquidity[1].toString())
            console.log(`accountLiquidityInNumber`, accountLiquidityInNumber)
        }
        if (allAccountLiquidity[2]) {
            let test3accountLiquidityInNumber = Number(allAccountLiquidity[2].toString())
            console.log(`test3accountLiquidityInNumber`, test3accountLiquidityInNumber)
        }

        for (let count = 0; count < martketContractsDetail.length; count++) {
            let eachContractDetail = martketContractsDetail[count]
            console.log(`each assest in usd`, eachContractDetail.borrowInUsdInNumber)
            accountStatus = {
                ...accountStatus,
                totalBorrowAmountInUsdInNumber: accountStatus.totalBorrowAmountInUsdInNumber + eachContractDetail.borrowInUsdInNumber
            }
        }
        console.log(`totalBorrowAmountInUsdInNumber`, accountStatus.totalBorrowAmountInUsdInNumber)
        console.log(`accountLiquidityInNumber`, accountLiquidityInNumber)   //this is real account liquidyt in usd  = limit
        accountStatus = {
            ...accountStatus,
            totalLimitedAmountInUsdInNumber: accountLiquidityInNumber / 100000000
        }
        accountStatus = {
            ...accountStatus,
            currentPercentageLimit: (((accountStatus.totalBorrowAmountInUsdInNumber / 1000000000000000000) / (accountStatus.totalLimitedAmountInUsdInNumber)) * 100)
        }

        console.log(`accountStatus`, accountStatus.currentPercentageLimit)
        console.log(`alertThreshold`, alertThreshold)
        //compare alertThreshold and accountStatus.currentPercentageLimit
        if (isNaN(accountStatus.currentPercentageLimit) || accountStatus.currentPercentageLimit === undefined || accountStatus.currentPercentageLimit === null) {
            return false
        }
        else if (accountStatus.currentPercentageLimit >= alertThreshold) {
            return true
        } else {
            return false
        }
    }

    getPriceFromRedSton = async () => {
        const usdcPrice = await redstone.getPrice("USDC");
        //real usdc price usdcPrice.value
        const ethPrice = await redstone.getPrice("ETH");
        //real eth price ethPrice.value

        const priceArray = new Map();
        priceArray.set("USDC", ethers.utils.parseUnits(usdcPrice.value.toString()));
        priceArray.set("WETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        priceArray.set("ETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        let usdcPriceInNumber = Number(priceArray.get('USDC').toString()) / div18zero
        let wethPriceInNumber = Number(priceArray.get('WETH').toString()) / div18zero
        let ethPriceInNumber = Number(priceArray.get('ETH').toString()) / div18zero

        return {
            usdcPriceInNumber,
            ethPriceInNumber
        }
    }

    getTokenHolderByContractAddress = async (address: string) => {

    }

    triggerScoreSystem = async (req: any, res: any) => {
        this.startScoreSystem()
        res.status(200).json({ message: "OK" })
        return
    }

    calculateScore = async (address: any, wrappedComptrollerContract: any, martketContractsDetail: any, provider: any, wallet: any, usdcPriceInNumber: any, ethPriceInNumber: any) => {
        let mark =0
        let liquidationAddressCheck = address
        let accountStatus = {
            address: liquidationAddressCheck,
            totalBorrowAmountInUsdInNumber: 0,
            totalLimitedAmountInUsdInNumber: 0,
            totalDepositAmountInUsdInNumber: 0,
            currentPercentageLimit: 0,
        }
        try{
            let assestIn = await wrappedComptrollerContract.getAssetsIn(liquidationAddressCheck)


            for (let count = 0; count < martketContractsDetail.length; count++) {
                let eachContractDetail = martketContractsDetail[count]
                const eachContract = new ethers.Contract(eachContractDetail?.address ?? '', eachContractDetail.abi, provider);
                const eachContractWithSignerAA = eachContract.connect(wallet);
                if (eachContractDetail.address === CUSDC_CONTRACT_ADDRESS) {
                    //usdc
                    let depositBalance = await eachContractWithSignerAA.balanceOf(liquidationAddressCheck)
                    let exchangeRateStore = await eachContractWithSignerAA.exchangeRateStored()
                    exchangeRateStore = Number(exchangeRateStore.toString()) / div18zero
                    let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
                    martketContractsDetail[count] = {
                        ...eachContractDetail,
                        borrowInNumber: Number(borrowBalance.toString()) / div18zero,
                        borrowInUsdInNumber: Number(borrowBalance.toString()) * usdcPriceInNumber / div18zero,
                        depositInNumber: Number(depositBalance.toString()) * exchangeRateStore / div18zero,
                        depositInUsdInNumber: Number(depositBalance.toString()) * usdcPriceInNumber * exchangeRateStore / div18zero,
                    }
                }
                else if (eachContractDetail.address === CETH_CONTRACT_ADDRESS) {
                    // // //eth
                    let depositBalance = await eachContractWithSignerAA.balanceOf(liquidationAddressCheck)
                    console.log(`exchangeRateCurrent`)
                    let exchangeRateStore = await eachContractWithSignerAA.exchangeRateStored()
                    console.log(`exchangeRateCurrent done`, exchangeRateStore.toString())
                    exchangeRateStore = Number(exchangeRateStore.toString()) / div18zero
                    let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
                    martketContractsDetail[count] = {
                        ...eachContractDetail,
                        borrowInNumber: Number(borrowBalance.toString()) / div18zero,
                        borrowInUsdInNumber: Number(borrowBalance.toString()) * ethPriceInNumber / div18zero,
                        depositInNumber: Number(depositBalance.toString()) * exchangeRateStore / div18zero,
                        depositInUsdInNumber: Number(depositBalance.toString()) * ethPriceInNumber * exchangeRateStore / div18zero,
                    }
                }
                // const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(config);
            }
    
            let accountLiquidityInNumber = 0
            var allAccountLiquidity = await wrappedComptrollerContract.getAccountLiquidity(liquidationAddressCheck);
            if (allAccountLiquidity[0]) {
                let testaccountLiquidityInNumber = Number(allAccountLiquidity[0].toString())
                console.log(`testaccountLiquidityInNumber`, testaccountLiquidityInNumber)
            }
            if (allAccountLiquidity[1]) {
                accountLiquidityInNumber = Number(allAccountLiquidity[1].toString())
                console.log(`accountLiquidityInNumber`, accountLiquidityInNumber)
            }
            if (allAccountLiquidity[2]) {
                let test3accountLiquidityInNumber = Number(allAccountLiquidity[2].toString())
                console.log(`test3accountLiquidityInNumber`, test3accountLiquidityInNumber)
            }
    
            for (let count = 0; count < martketContractsDetail.length; count++) {
                let eachContractDetail = martketContractsDetail[count]
                console.log(`each assest in usd`, eachContractDetail.borrowInUsdInNumber)
                accountStatus = {
                    ...accountStatus,
                    totalBorrowAmountInUsdInNumber: accountStatus.totalBorrowAmountInUsdInNumber + eachContractDetail.borrowInUsdInNumber,
                    totalDepositAmountInUsdInNumber: accountStatus.totalDepositAmountInUsdInNumber + eachContractDetail.depositInUsdInNumber
                }
            }
            console.log(`totalBorrowAmountInUsdInNumber`, accountStatus.totalBorrowAmountInUsdInNumber)
            console.log(`totalDepositAmountInUsdInNumber`, accountStatus.totalDepositAmountInUsdInNumber)
            console.log(`accountLiquidityInNumber`, accountLiquidityInNumber)   //this is real account liquidyt in usd  = limit
            mark = (accountStatus.totalDepositAmountInUsdInNumber * 1 + accountStatus.totalBorrowAmountInUsdInNumber * 1.5) / 1000
        }catch(e){
            console.error(`calculateScore ${e}`)
        }
        console.log(`mark`, mark)
        return mark
    }

    startScoreSystem = async () => {
        const currentPriceObject = await this.getPriceFromRedSton()
        let priceLogRequestBody = {
            ceth: currentPriceObject.ethPriceInNumber,
            cusdc: currentPriceObject.usdcPriceInNumber,
            createDate: new Date(),
        }
        // console.log(`priceLogRequestBody`,priceLogRequestBody)
        const getAddPriceLogResult = await this.priceLogginService.addPriceLog(priceLogRequestBody)
        // console.log(`getAddPriceLogResult`,getAddPriceLogResult)
        let allHolderAddressArr: any[] = []
        const ethHolderAddress = await this.scrollScanService.getTokenHolderByContractAddress(CETH_CONTRACT_ADDRESS ? CETH_CONTRACT_ADDRESS : '')
        const usdcHolderAddress = await this.scrollScanService.getTokenHolderByContractAddress(CUSDC_CONTRACT_ADDRESS ? CUSDC_CONTRACT_ADDRESS : '')
        allHolderAddressArr = allHolderAddressArr.concat(ethHolderAddress, usdcHolderAddress)
        allHolderAddressArr = filterDuplicateElement(allHolderAddressArr)



        /*
        get current market 
        */
        const comptrollerContractAddress = COMPTROLLER_CONTRACT_ADDRESS
        const nameItem = ["cash",
            "price",
            "totalSupply",
            "exchangeRate",
            "totalBorrows",
            "balance",
            "supplyRatePerBlock",
            "borrowBalanceStored",
            "borrowRatePerBlock",
            "markets",
            "borrowCaps",
            "isMember",]

        let martketContractsDetail = [
            {
                address: CETH_CONTRACT_ADDRESS,  //ceth
                abi: cethAbi,
                balance: null,
                borrow: null,
                borrowInNumber: 0,
                borrowInUsdInNumber: 0,
                borrowBalanceStored: null,
                borrowCaps: null,
                borrowRatePerBlock: null,
                cash: null,
                exchangeRate: null,
                isMember: null,
                markets: null,
                price: null,
                supply: null,
                supplyRatePerBlock: null,
                token: null,
                tokenBorrowAPY: null,
                tokenSupplyAPY: null,
                totalBorrows: null,
                totalBorrowsInNumber: null,
                totalSupply: null,
                value: null,
            },
            {
                address: CUSDC_CONTRACT_ADDRESS, //cusdc
                abi: cusdcAbi,
                balance: null,
                borrow: null,
                borrowInNumber: 0,
                borrowInUsdInNumber: 0,
                borrowBalanceStored: null,
                borrowCaps: null,
                borrowRatePerBlock: null,
                cash: null,
                exchangeRate: null,
                isMember: null,
                markets: null,
                price: null,
                supply: null,
                supplyRatePerBlock: null,
                token: null,
                tokenBorrowAPY: null,
                tokenSupplyAPY: null,
                totalBorrows: null,
                totalBorrowsInNumber: null,
                totalSupply: null,
                value: null,
            },
        ]



        const usdcPrice = await redstone.getPrice("USDC");
        const ethPrice = await redstone.getPrice("ETH");
        const priceArray = new Map();
        priceArray.set("USDC", ethers.utils.parseUnits(usdcPrice.value.toString()));
        priceArray.set("WETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        priceArray.set("ETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        let usdcPriceInNumber = Number(priceArray.get('USDC').toString()) / div18zero
        let wethPriceInNumber = Number(priceArray.get('WETH').toString()) / div18zero
        let ethPriceInNumber = Number(priceArray.get('ETH').toString()) / div18zero

        // const provider = new ethers.providers.JsonRpcProvider("https://alpha-rpc.scroll.io/l2");
        const provider = new ethers.providers.JsonRpcProvider(SCROLL_NET);
        const wallet = new ethers.Wallet(CONNECT_WALLET_PRIVATE_KEY?CONNECT_WALLET_PRIVATE_KEY:'', provider)
        const comptrollerContract = new ethers.Contract(comptrollerContractAddress ? comptrollerContractAddress : '', comptrollerAbi, provider);

        const comptrollerContractWithSignerAA = comptrollerContract.connect(wallet);
        const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(RED_STONE_CONFIG_CONSTANT);
        let allMarketAddress = await wrappedComptrollerContract.getAllMarkets()


        for (let count = 0; count < allHolderAddressArr.length; count++) {
            try{
            //calculate mark
            console.log(`looping holder address {}`,allHolderAddressArr[count]);
            let newScore = await this.calculateScore(allHolderAddressArr[count], wrappedComptrollerContract, martketContractsDetail, provider, wallet, usdcPriceInNumber, ethPriceInNumber)
            console.log(`newScore`, newScore)
            // let newScore = 1
            //insert record              
            // let addSubsctiptionMarksRequestBody = {
            //     address: allHolderAddressArr[count],
            //     marks: "1.0",
            //     createDate: new Date(),
            //     createBy: 'SYSTEM',
            //     lastUpdateDate: new Date(),
            //     lastUpdateBy: 'SYSTEM',
            // }
            // console.log(`start insert marks`)
            const getAddPriceLogResult = await this.priceLogginService.addSubsctiptionMarks(allHolderAddressArr[count], newScore)
            }catch(e){
                console.error(`error in address ${allHolderAddressArr[count]}`,e)
            }

        }



        // const result = await this.getAllBorrowLimitOverCondition()
        // if (result.result.length > 0) {
        //     //someone subscribe
        //     let activeSubscriptionList: any = []
        //     for (let count = 0; count < result.result.length; count++) {
        //         let eachSubscription = result.result[count]
        //         if (activeSubscriptionList.indexOf(eachSubscription?.address ?? '') === -1) {
        //             activeSubscriptionList.push(eachSubscription.address)
        //         }
        //     }

        //     for (let count = 0; count < activeSubscriptionList.length; count++) {
        //         activeSubscriptionList[count]
        //         //calculate mark
        //         //insert record              
        //         let addSubsctiptionMarksRequestBody = {
        //             key: "testkey",
        //             address: activeSubscriptionList[count],
        //             marks: "1.0",
        //             createDate: new Date(),
        //             createBy: 'SYSTEM',
        //             lastUpdateDate: new Date(),
        //             lastUpdateBy: 'SYSTEM',
        //         }
        //         const getAddPriceLogResult = await this.priceLogginService.addSubsctiptionMarks(addSubsctiptionMarksRequestBody)
        //     }

        // }
        return
    }


    
    startCalculateScoreByAddress = async () => {
        const currentPriceObject = await this.getPriceFromRedSton()
        let priceLogRequestBody = {
            ceth: currentPriceObject.ethPriceInNumber,
            cusdc: currentPriceObject.usdcPriceInNumber,
            createDate: new Date(),
        }
        // console.log(`priceLogRequestBody`,priceLogRequestBody)
        const getAddPriceLogResult = await this.priceLogginService.addPriceLog(priceLogRequestBody)
        // console.log(`getAddPriceLogResult`,getAddPriceLogResult)
        let allHolderAddressArr: any[] = []
        const ethHolderAddress = await this.scrollScanService.getTokenHolderByContractAddress(CETH_CONTRACT_ADDRESS ? CETH_CONTRACT_ADDRESS : '')
        const usdcHolderAddress = await this.scrollScanService.getTokenHolderByContractAddress(CUSDC_CONTRACT_ADDRESS ? CUSDC_CONTRACT_ADDRESS : '')
        allHolderAddressArr = allHolderAddressArr.concat(ethHolderAddress, usdcHolderAddress)
        allHolderAddressArr = filterDuplicateElement(allHolderAddressArr)



        /*
        get current market 
        */
        const comptrollerContractAddress = COMPTROLLER_CONTRACT_ADDRESS
        const nameItem = ["cash",
            "price",
            "totalSupply",
            "exchangeRate",
            "totalBorrows",
            "balance",
            "supplyRatePerBlock",
            "borrowBalanceStored",
            "borrowRatePerBlock",
            "markets",
            "borrowCaps",
            "isMember",]

        let martketContractsDetail = [
            {
                address: CETH_CONTRACT_ADDRESS,  //ceth
                abi: cethAbi,
                balance: null,
                borrow: null,
                borrowInNumber: 0,
                borrowInUsdInNumber: 0,
                borrowBalanceStored: null,
                borrowCaps: null,
                borrowRatePerBlock: null,
                cash: null,
                exchangeRate: null,
                isMember: null,
                markets: null,
                price: null,
                supply: null,
                supplyRatePerBlock: null,
                token: null,
                tokenBorrowAPY: null,
                tokenSupplyAPY: null,
                totalBorrows: null,
                totalBorrowsInNumber: null,
                totalSupply: null,
                value: null,
            },
            {
                address: CUSDC_CONTRACT_ADDRESS, //cusdc
                abi: cusdcAbi,
                balance: null,
                borrow: null,
                borrowInNumber: 0,
                borrowInUsdInNumber: 0,
                borrowBalanceStored: null,
                borrowCaps: null,
                borrowRatePerBlock: null,
                cash: null,
                exchangeRate: null,
                isMember: null,
                markets: null,
                price: null,
                supply: null,
                supplyRatePerBlock: null,
                token: null,
                tokenBorrowAPY: null,
                tokenSupplyAPY: null,
                totalBorrows: null,
                totalBorrowsInNumber: null,
                totalSupply: null,
                value: null,
            },
        ]



        const usdcPrice = await redstone.getPrice("USDC");
        const ethPrice = await redstone.getPrice("ETH");
        const priceArray = new Map();
        priceArray.set("USDC", ethers.utils.parseUnits(usdcPrice.value.toString()));
        priceArray.set("WETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        priceArray.set("ETH", ethers.utils.parseUnits(ethPrice.value.toString()));
        let usdcPriceInNumber = Number(priceArray.get('USDC').toString()) / div18zero
        let wethPriceInNumber = Number(priceArray.get('WETH').toString()) / div18zero
        let ethPriceInNumber = Number(priceArray.get('ETH').toString()) / div18zero

        // const provider = new ethers.providers.JsonRpcProvider("https://alpha-rpc.scroll.io/l2");
        const provider = new ethers.providers.JsonRpcProvider(SCROLL_NET);
        const wallet = new ethers.Wallet(CONNECT_WALLET_PRIVATE_KEY?CONNECT_WALLET_PRIVATE_KEY:'', provider)
        const comptrollerContract = new ethers.Contract(comptrollerContractAddress ? comptrollerContractAddress : '', comptrollerAbi, provider);

        const comptrollerContractWithSignerAA = comptrollerContract.connect(wallet);
        const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(RED_STONE_CONFIG_CONSTANT);
        let allMarketAddress = await wrappedComptrollerContract.getAllMarkets()


        for (let count = 0; count < allHolderAddressArr.length; count++) {
            //calculate mark

            let newScore = await this.calculateScore(allHolderAddressArr[count], wrappedComptrollerContract, martketContractsDetail, provider, wallet, usdcPriceInNumber, ethPriceInNumber)
            console.log(`newScore`, newScore)
            // let newScore = 1
            //insert record              
            // let addSubsctiptionMarksRequestBody = {
            //     address: allHolderAddressArr[count],
            //     marks: "1.0",
            //     createDate: new Date(),
            //     createBy: 'SYSTEM',
            //     lastUpdateDate: new Date(),
            //     lastUpdateBy: 'SYSTEM',
            // }
            // console.log(`start insert marks`)
            const getAddPriceLogResult = await this.priceLogginService.addSubsctiptionMarks(allHolderAddressArr[count], newScore)
        }



        // const result = await this.getAllBorrowLimitOverCondition()
        // if (result.result.length > 0) {
        //     //someone subscribe
        //     let activeSubscriptionList: any = []
        //     for (let count = 0; count < result.result.length; count++) {
        //         let eachSubscription = result.result[count]
        //         if (activeSubscriptionList.indexOf(eachSubscription?.address ?? '') === -1) {
        //             activeSubscriptionList.push(eachSubscription.address)
        //         }
        //     }

        //     for (let count = 0; count < activeSubscriptionList.length; count++) {
        //         activeSubscriptionList[count]
        //         //calculate mark
        //         //insert record              
        //         let addSubsctiptionMarksRequestBody = {
        //             key: "testkey",
        //             address: activeSubscriptionList[count],
        //             marks: "1.0",
        //             createDate: new Date(),
        //             createBy: 'SYSTEM',
        //             lastUpdateDate: new Date(),
        //             lastUpdateBy: 'SYSTEM',
        //         }
        //         const getAddPriceLogResult = await this.priceLogginService.addSubsctiptionMarks(addSubsctiptionMarksRequestBody)
        //     }

        // }
        return
    }
}
