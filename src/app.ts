import express, { Application, Request, Response } from "express"
import CronJob from 'cron'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

import bodyParser from "body-parser";
import fs from 'fs';
import https from 'https'
import telegramRouter from './router/telegramRouter';
import workflowRouter from './router/workflowRouter';
import externalApiRouter from './router/externalApiRouter';
import subscriberInformationRouter from './router/subscriberInformationRouter'
import discordRouter from './router/discordRouter'
import { telegramBotService } from './services/telegramBotService'
// import { PriceLogginService } from "./services/priceLogginService"
// const priceLogginService = new PriceLogginService()
import { ExternalApiService } from "./services/externalApiService"
const externalApiService = new ExternalApiService()
import {CronJobService} from './services/cronJobService'
const cronJobService = new CronJobService()
const app: Application = express()
const port: number = 8080
const httpsPort: number = 8443
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const sslCert = fs.readFileSync(`${__dirname}/B5A96CBA293C33D986D193CA56347609.txt`)
const key = fs.readFileSync(`${__dirname}/private.key`)
const cert = fs.readFileSync(`${__dirname}/certificate.crt`)

const cred = {
    key,
    cert
}

if (process.env.DATABASE_URL) {
    console.log(`${process.env.DATABASE_URL}`)
    mongoose.connect(`${process.env.DATABASE_URL}`)
    // const AutoIncrement = AutoIncrementFactory(connect);
    const db = mongoose.connection
    console.log(`connecting database`)
    db.on('error', (error) => console.error(error))
    db.once('open', () => console.log('Connected to Database'))
}


app.get("/toto", (req: Request, res: Response) => {
    res.send("Hello toto")
})

/*
this part for port forwading in ec2 to allow verify ssl cert
*/
app.get("/.well-known/pki-validation/B5A96CBA293C33D986D193CA56347609.txt", (req: Request, res: Response) => {
    res.send(sslCert)
})
// app.use('telegram',tele)

app.use('/workflow', workflowRouter)
app.use('/telegram', telegramRouter)
app.use('/noitifcation', subscriberInformationRouter)
app.use('/discord', discordRouter);
app.use('/api',externalApiRouter)

app.get('/testTriggerCronJob', cronJobService.triggerLiquidationAlert)
app.get('/testScoreSystem', cronJobService.triggerScoreSystem)

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

const httpsServer = https.createServer(cred, app)
httpsServer.listen(httpsPort)
console.log(`https App is listening on port ${httpsPort} !`)

telegramBotService()


const job = new CronJob.CronJob("* * * * *", function () {
    console.log(`trigger cron job by bot`)
    cronJobService.startLiquidation();
})

job.start()



// const { WrapperBuilder } = require("@redstone-finance/evm-connector");
// const { formatBytes32String } = require("ethers/lib/utils");

// import { WrapperBuilder } from "@redstone-finance/evm-connector";
// import { ethers, Wallet } from "ethers";
// import { formatBytes32String } from "ethers/lib/utils";
// import { Client, IntentsBitField } from 'discord.js';
// import redstone from "redstone-api";
// import usdcAbi from "./abi/usdc.json"
// import wethAbi from "./abi/weth.json"
// import comptrollerAbi from './abi/Comptroller.json'
// import testAbi from './abi/test.json'
// import cethAbi from './abi/ceth.json'
// import cusdcAbi from './abi/cusdc.json'
// import cwethAbi from './abi/cweth.json'



// async function main() {
//     const div18zero = 1000000000000000000
//     let liquidationAddressCheck = `0x24DE9902d6F49d6E4D5c8fe4B9749c2CB0204f43`


//     const comptrollerContractAddress = `0xfa83427b4c6de91d7b0F074533876DBB0C6B982A`
//     const nameItem = ["cash",
//         "price",
//         "totalSupply",
//         "exchangeRate",
//         "totalBorrows",
//         "balance",
//         "supplyRatePerBlock",
//         "borrowBalanceStored",
//         "borrowRatePerBlock",
//         "markets",
//         "borrowCaps",
//         "isMember",]

//         let accountStatus={
//             address:liquidationAddressCheck,
//             totalBorrowAmountInUsdInNumber:0,
//             totalLimitedAmountInUsdInNumber:0,
//             currentPercentageLimit:0,
//         }
//     let martketContractsDetail = [
//         {
//             address: "0xe28e7A2d39301aa4695232bcf9E82765FAEF2b13",  //ceth
//             abi: cethAbi,
//             balance: null,
//             borrow: null,
//             borrowInNumber: 0,
//             borrowInUsdInNumber: 0,
//             borrowBalanceStored: null,
//             borrowCaps: null,
//             borrowRatePerBlock: null,
//             cash: null,
//             exchangeRate: null,
//             isMember: null,
//             markets: null,
//             price: null,
//             supply: null,
//             supplyRatePerBlock: null,
//             token: null,
//             tokenBorrowAPY: null,
//             tokenSupplyAPY: null,
//             totalBorrows: null,
//             totalBorrowsInNumber: null,
//             totalSupply: null,
//             value: null,
//         },
//         {
//             address: "0x75F9d174e2BF5031b69Ec92241813aDF4583Ed26", //cweth
//             abi: cwethAbi,
//             balance: null,
//             borrow: null,
//             borrowInNumber: 0,
//             borrowInUsdInNumber: 0,
//             borrowBalanceStored: null,
//             borrowCaps: null,
//             borrowRatePerBlock: null,
//             cash: null,
//             exchangeRate: null,
//             isMember: null,
//             markets: null,
//             price: null,
//             supply: null,
//             supplyRatePerBlock: null,
//             token: null,
//             tokenBorrowAPY: null,
//             tokenSupplyAPY: null,
//             totalBorrows: null,
//             totalBorrowsInNumber: null,
//             totalSupply: null,
//             value: null,
//         },
//         {
//             address: "0x84b9D6ed4B98d6CDA4009DB92B0dec861520935C", //cusdc
//             abi: cusdcAbi,
//             balance: null,
//             borrow: null,
//             borrowInNumber: 0,
//             borrowInUsdInNumber: 0,
//             borrowBalanceStored: null,
//             borrowCaps: null,
//             borrowRatePerBlock: null,
//             cash: null,
//             exchangeRate: null,
//             isMember: null,
//             markets: null,
//             price: null,
//             supply: null,
//             supplyRatePerBlock: null,
//             token: null,
//             tokenBorrowAPY: null,
//             tokenSupplyAPY: null,
//             totalBorrows: null,
//             totalBorrowsInNumber: null,
//             totalSupply: null,
//             value: null,
//         },
//     ]



//     const usdcPrice = await redstone.getPrice("USDC");
//     //real usdc price usdcPrice.value
//     const ethPrice = await redstone.getPrice("ETH");
//     //real eth price ethPrice.value
//     const priceArray = new Map();
//     priceArray.set("USDC", ethers.utils.parseUnits(usdcPrice.value.toString()));
//     priceArray.set("WETH", ethers.utils.parseUnits(ethPrice.value.toString()));
//     priceArray.set("ETH", ethers.utils.parseUnits(ethPrice.value.toString()));
//     let usdcPriceInNumber = Number(priceArray.get('USDC').toString()) / div18zero
//     let wethPriceInNumber = Number(priceArray.get('WETH').toString()) / div18zero
//     let ethPriceInNumber = Number(priceArray.get('ETH').toString()) / div18zero



//     const provider = new ethers.providers.JsonRpcProvider("https://alpha-rpc.scroll.io/l2");
//     const wallet = new ethers.Wallet("34fca74d424c5acd869a373b6c5907fa0f42e9def560054e09a9d3e27764b6e5", provider)
//     const comptrollerContract = new ethers.Contract(comptrollerContractAddress, comptrollerAbi, provider);

//     const comptrollerContractWithSignerAA = comptrollerContract.connect(wallet);

//     const redstoneCacheLayerUrls = [
//         "https://d33trozg86ya9x.cloudfront.net",
//     ];
//     const config = {
//         dataServiceId: "redstone-main-demo",
//         uniqueSignersCount: 1,
//         dataFeeds: ["USDC", "ETH"],
//         urls: redstoneCacheLayerUrls
//     };

//     const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(config);
//     // console.log(`wrappedComptrollerContract`,await wrappedComptrollerContract)
//     // console.log(`wrappedComptrollerContract`, await wrappedComptrollerContract.getAllMarkets())
//     let allMarketAddress = await wrappedComptrollerContract.getAllMarkets()
//     // console.log(allMarketAddress)

//     for (let count = 0; count < martketContractsDetail.length; count++) {
//         let eachContractDetail = martketContractsDetail[count]
//         const eachContract = new ethers.Contract(eachContractDetail.address, eachContractDetail.abi, provider);
//         const eachContractWithSignerAA = eachContract.connect(wallet);
//         // console.log(`eachContract`,eachContract)
//         if (eachContractDetail.address === `0x84b9D6ed4B98d6CDA4009DB92B0dec861520935C`) {
//             //usdc
//             // let totalBorrows = await eachContract.totalBorrows()
//             let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
//             console.log(`borrowBalance`, borrowBalance)

//             // let userBorrowed = await eachContractWithSignerAA.totalBorrowsCurrent()
//             // console.log(`userBorrowed`, userBorrowed)
//             // let borrowBalance = await eachContractWithSignerAA.borrowBalanceCurrent(liquidationAddressCheck)
//             // console.log(`usdc `,Number(borrowBalance.toString()))
//             // console.log(`usdc `,Number(borrowBalance.toString()) * usdcPriceInNumber)
//             martketContractsDetail[count] = {
//                 ...eachContractDetail,
//                 borrowInNumber: Number(borrowBalance.toString()),
//                 borrowInUsdInNumber: Number(borrowBalance.toString()) * usdcPriceInNumber
//             }

//         }
//         else if (eachContractDetail.address === `0x75F9d174e2BF5031b69Ec92241813aDF4583Ed26`) {
//             // // //weth
//             // let totalBorrows = await eachContract.totalBorrows()
//             let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
//             // console.log(`borrowBalance`, borrowBalance)

//             // let userBorrowed = await eachContractWithSignerAA.totalBorrowsCurrent()
//             // console.log(`userBorrowed`, userBorrowed)
//             // let borrowBalance = await eachContractWithSignerAA.borrowBalanceCurrent(liquidationAddressCheck)
//             console.log(`wethPriceInNumber`,wethPriceInNumber)
//             martketContractsDetail[count] = {
//                 ...eachContractDetail,
//                 borrowInNumber: Number(borrowBalance.toString()),
//                 borrowInUsdInNumber: Number(borrowBalance.toString()) * wethPriceInNumber
//             }
//         }
//         else if (eachContractDetail.address === `0xe28e7A2d39301aa4695232bcf9E82765FAEF2b13`) {
//             // // //eth
//             // // let totalBorrows = await eachContract.totalBorrows()
//             let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
//             // console.log(`borrowBalance`, borrowBalance)

//             // let userBorrowed = await eachContractWithSignerAA.totalBorrowsCurrent()
//             // console.log(`userBorrowed`, userBorrowed)
//             // let borrowBalance = await eachContractWithSignerAA.borrowBalanceCurrent(liquidationAddressCheck)
//             martketContractsDetail[count] = {
//                 ...eachContractDetail,
//                 borrowInNumber: Number(borrowBalance.toString()),
//                 borrowInUsdInNumber: Number(borrowBalance.toString()) * ethPriceInNumber
//             }
//         }
//         // const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(config);
//     }

//     // martketContractsDetail.forEach(async (eachContractDetail, index) => {
//     //     const eachContract = new ethers.Contract(eachContractDetail.address, eachContractDetail.abi, provider);
//     //     const eachContractWithSignerAA = eachContract.connect(wallet);
//     //     // console.log(`eachContract`,eachContract)
//     //     if (eachContractDetail.address === `0x84b9D6ed4B98d6CDA4009DB92B0dec861520935C`) {
//     //         //usdc
//     //         // let totalBorrows = await eachContract.totalBorrows()
//     //         let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
//     //         console.log(`borrowBalance`, borrowBalance)

//     //         // let userBorrowed = await eachContractWithSignerAA.totalBorrowsCurrent()
//     //         // console.log(`userBorrowed`, userBorrowed)
//     //         // let borrowBalance = await eachContractWithSignerAA.borrowBalanceCurrent(liquidationAddressCheck)
//     //         martketContractsDetail[index] = {
//     //             ...eachContractDetail,
//     //             borrowInNumber: Number(borrowBalance.toString()),
//     //             borrowInUsdInNumber: Number(borrowBalance.toString()) * usdcPriceInNumber
//     //         }

//     //     }
//     //     else if (eachContractDetail.address === `0x75F9d174e2BF5031b69Ec92241813aDF4583Ed26`) {
//     //         // // //weth
//     //         // let totalBorrows = await eachContract.totalBorrows()
//     //         let borrowBalance = await eachContractWithSignerAA.borrowBalanceStored(liquidationAddressCheck)
//     //         console.log(`borrowBalance`, borrowBalance)

//     //         // let userBorrowed = await eachContractWithSignerAA.totalBorrowsCurrent()
//     //         // console.log(`userBorrowed`, userBorrowed)
//     //         // let borrowBalance = await eachContractWithSignerAA.borrowBalanceCurrent(liquidationAddressCheck)
//     //         martketContractsDetail[index] = {
//     //             ...eachContractDetail,
//     //             borrowInNumber: Number(borrowBalance.toString()),
//     //             borrowInUsdInNumber: Number(borrowBalance.toString()) * wethPriceInNumber
//     //         }
//     //     }
//     //     else if (eachContractDetail.address === `0x84b9D6ed4B98d6CDA4009DB92B0dec861520935C`) {
//     //         // // //eth
//     //         // // let totalBorrows = await eachContract.totalBorrows()
//     //         // let userBorrowed = await eachContractWithSignerAA.totalBorrowsCurrent()
//     //         // console.log(`userBorrowed`, userBorrowed)
//     //         // let borrowBalance = await eachContractWithSignerAA.borrowBalanceCurrent(liquidationAddressCheck)
//     //         // martketContractsDetail[index] = {
//     //         //     ...eachContractDetail,
//     //         //     borrowInNumber: Number(borrowBalance.value.toString()),
//     //         //     borrowInUsdInNumber: Number(borrowBalance.value.toString()) * ethPriceInNumber
//     //         // }
//     //     }
//     //     // const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(config);
//     // })
//     console.log(`martketContractsDetail`, martketContractsDetail)
//     let accountLiquidityInNumber = 0
//     var allAccountLiquidity = await wrappedComptrollerContract.getAccountLiquidity(liquidationAddressCheck);
//     // console.log(`accountLiquidity`, allAccountLiquidity)
//     if (allAccountLiquidity[1]) {
//         accountLiquidityInNumber = Number(allAccountLiquidity[1].toString())
//     }

//     for(let count = 0; count < martketContractsDetail.length; count++){
//         let eachContractDetail = martketContractsDetail[count]
//         accountStatus={
//             ...accountStatus,
//             totalBorrowAmountInUsdInNumber:accountStatus.totalBorrowAmountInUsdInNumber + eachContractDetail.borrowInUsdInNumber
//         }
//     }
    
//     console.log(`accountLiquidityInNumber`,accountLiquidityInNumber)
//     accountStatus={
//         ...accountStatus,
//         totalLimitedAmountInUsdInNumber:accountLiquidityInNumber+accountStatus.totalBorrowAmountInUsdInNumber
//     }
//     accountStatus={
//         ...accountStatus,
//         currentPercentageLimit:(accountStatus.totalBorrowAmountInUsdInNumber / accountStatus.totalLimitedAmountInUsdInNumber)
//     }


//     // if currentPercentageLimit >> with in over percetange >> alert trigger



//     // console.log(`accountLiquidityInString`, accountLiquidityInString)


//     // allMarketAddress.forEach((eachMarketAddress:any, index:any) => {
//     //     console.log(index)
//     //     console.log(`eachMarketAddress`,eachMarketAddress)

//     //     wrappedComptrollerContract.get
//     //     eachMarketAddress


//     //     // console.log(`259`, index)
//     //     // console.log(`260`, item)
//     //     // console.log(`261`, item.toString())
//     //     // const marketIndex = Math.floor(index / props.length);
//     //     // console.log(marketIndex)
//     //     // const propIndex = index % props.length;
//     //     // console.log(propIndex)
//     //     // const marketContract = marketContracts[marketIndex]!;
//     //     // console.log(marketContract)
//     //     // const prop = props[propIndex];
//     //     // console.log(prop)
//     //     // console.log(`261`, result)
//     //     // if (!result[marketContract.address]) {
//     //     //     const market = realmInfo!.markets.find(market => {
//     //     //         return market.cToken === contractAddressName[marketContract.address];
//     //     //     })!;
//     //     //     result[marketContract.address] = {
//     //     //         token: realmInfo!.tokens.find(token => {
//     //     //             return token.name === market.token;
//     //     //         })!,
//     //     //         address: marketContract.address,
//     //     //     };
//     //     // }
//     //     // if (!item) {
//     //     //     result[marketContract.address]![prop] = undefined;
//     //     // } else if (prop === "price") {
//     //     //     const market = realmInfo!.markets.find(market => {
//     //     //         return market.cToken === contractAddressName[marketContract.address];
//     //     //     })!;

//     //     //     // @ts-ignore
//     //     //     result[marketContract.address].price = processContractValue(priceArray.get(market.token))?.div(p18);
//     //     // } else if (prop === "exchangeRate") {
//     //     //     // @ts-ignore
//     //     //     result[marketContract.address].exchangeRate = processContractValue(item)?.div(p18);
//     //     // } else if (Array.isArray(item)) {
//     //     //     // @ts-ignore
//     //     //     result[marketContract.address][prop] = item.map(value => {
//     //     //         return processContractValue(value);
//     //     //     });
//     //     // } else {
//     //     //     // @ts-ignore
//     //     //     result[marketContract.address][prop] = processContractValue(item);
//     //     // }
//     // })

//     // let number1 = accountLiquidity[0]
//     // console.log(accountLiquidity[0]);
//     // console.log(number1.toNumber());  //got account luqiuidty
//     // let number2 = accountLiquidity[1]
//     // console.log(accountLiquidity[1]);
//     // console.log(number2.toNumber());
//     // let number3 = accountLiquidity[2]
//     // console.log(accountLiquidity[2]);
//     // console.log(number3.toNumber());

//     // const marketIndex = Math.floor(index / props.length);
//     // console.log(marketIndex)
//     // const propIndex = index % props.length;
//     // console.log(propIndex)
//     // const marketContract = marketContracts[marketIndex]!;
//     // console.log(marketContract)
//     // const prop = props[propIndex];
//     // console.log(prop)



//     // const wrappedContract = await getContract(realm.contract.contracts.Comptroller.address, abi);
//     // let accountLiquidtityResult = undefined;
//     // try {
//     //   const res = await wrappedContract.getAccountLiquidity(address);
//     //   accountLiquidtityResult = res.map((item: any) => {
//     //     return processContractValue(item);
//     //   });
//     //   accountLiquidtityResult[1] = accountLiquidtityResult[1].div(1e8);
//     // } catch (e) {
//     //   console.error("fetch getAccountLiquidity fail");
//     // }



//     // const comptrollerContractAddress = `0xfa83427b4c6de91d7b0F074533876DBB0C6B982A`
//     // const usdcPrice = await redstone.getPrice("USDC");
//     // console.log(`usdcPrice`, usdcPrice.value)
//     // const ethPrice = await redstone.getPrice("ETH");
//     // console.log(`ethPrice`, ethPrice.value)


//     // const provider = new ethers.providers.JsonRpcProvider("https://alpha-rpc.scroll.io/l2");
//     // const wallet = new ethers.Wallet("34fca74d424c5acd869a373b6c5907fa0f42e9def560054e09a9d3e27764b6e5", provider)
//     // const comptrollerContract = new ethers.Contract(comptrollerContractAddress, comptrollerAbi, provider);

//     // const comptrollerContractWithSignerAA = comptrollerContract.connect(wallet);

//     // const redstoneCacheLayerUrls = [
//     //     "https://d33trozg86ya9x.cloudfront.net",
//     // ];
//     // const config = {
//     //     dataServiceId: "redstone-main-demo",
//     //     uniqueSignersCount: 1,
//     //     dataFeeds: ["USDC", "ETH"],
//     //     urls: redstoneCacheLayerUrls
//     // };

//     // const wrappedComptrollerContract = WrapperBuilder.wrap(comptrollerContractWithSignerAA).usingDataService(config);

//     // var liquidationJobCompound = async () => {
//     //     console.log("liquidationJobCompound Start")
//     //     try {
//     //         var accountLiquidity = await wrappedComptrollerContract.getAccountLiquidity("0x24DE9902d6F49d6E4D5c8fe4B9749c2CB0204f43");
//     //         let number1 = accountLiquidity[0]
//     //         console.log(accountLiquidity[0]);
//     //         console.log(number1.toNumber());  //got account luqiuidty
//     //         let number2 = accountLiquidity[1]
//     //         console.log(accountLiquidity[1]);
//     //         console.log(number2.toNumber());
//     //         let number3 = accountLiquidity[2]
//     //         console.log(accountLiquidity[2]);
//     //         console.log(number3.toNumber());
//     //     } catch (error) {
//     //         console.error("error %s", error);
//     //     }
//     // };


//     // totalUserBorrowed = totalUserBorrowed.plus(result[marketAddress]!.userBorrowed!);
//     // result.totalUserBorrowed = totalUserBorrowed;
//     // result.userBorrowLimit = result.totalUserBorrowed.div(result.totalUserLimit);

//     // userBorrowLimit = realm.totalUserBorrowed.div(realm?.totalUserLimit).multipliedBy(100)


//     // liquidationJobCompound();
// };

// main()




// import TelegramBot from 'node-telegram-bot-api'
// // replace the value below with the Telegram token you receive from @BotFather
// const token = '5967762690:AAF_hubaylvHTxw8Zh2xEuPo-ncvX1tJ40k';

// // Create a bot that uses 'polling' to fetch new updates
// const bot = new TelegramBot(token, {polling: true});

// // Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg:any, match:any) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg:any) => {
//     console.log(msg)
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   console.log(chatId)
// //   bot.sendMessage(chatId, 'Received your message');
// });



// setTimeout(()=>{
//     bot.sendMessage('76718957','hello world!')
//     bot.sendMessage('1080703864','sent you something')
// }, 1000)












// const provider = new ethers.providers.JsonRpcProvider(
//     'https://alpha-rpc.scroll.io/l2'
//   );
// const signer = new ethers.Wallet(`this is private key`, provider);
//     const abc = await new ethers.Contract('0xa1EA0B2354F5A344110af2b6AD68e75545009a03',wethAbi,signer);
//     let contract = await abc.deployed()
//     console.log(`contract name: ${await contract.name()}`)
// const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
//     dataFeeds: ["ETH", "BTC"],
//   });
//   console.log(wrappedContract.totalSupply())
//   console.log(await wrappedContract.totalSupply())
