import express, { NextFunction, Request, Response } from 'express';
import { PriceLogginService } from '../services/priceLogginService'
const priceLogginService = new PriceLogginService();
const router = express.Router();
// const workflowServices = new WorkflowServices()
router.post('/getScoreByAddress', async function (req: Request, res: Response) {
    const { address } = req.body
    let allAllLowerLetter = address.toLowerCase()
    let getScoreByAddressRespond = await priceLogginService.getScoreByAddress(allAllLowerLetter)
    res.status(200).json(getScoreByAddressRespond)
    return
});

router.get('/checkHasDeposit', async function (req: Request, res: Response) {
    res.status(200).json({})
    return 
    // const address = req.query.address;
    // // const { address } = req.params
    // console.log(`address`, address)
    // let result = {
    //     "code":0,
    //     "data":false, //   If the task verification passes, return true; if not, return false
    //     "detailMsg":"",
    //     "error_code":"0",
    //     "error_message":"",
    //     "msg":""
    // }
    // if(typeof(address)!=='string'){
    //     result.error_code='-1'
    //     result.error_message='wrong input address type'
    //     res.status(200).json(result)
    //     return 
    // }
 
    // let allAllLowerLetter = address.toLowerCase()
    // let getScoreByAddressRespond:any = await priceLogginService.getScoreByAddress(allAllLowerLetter)
    // console.log(`getScoreByAddressRespond`, getScoreByAddressRespond)
    // if (getScoreByAddressRespond?.result?.[0]?.marks ?? 0 > 0) {
    //     result.data = true
    // } else {
    //     result.data = false
    // }
    // res.status(200).json(result)
    // return
});

export default router;
