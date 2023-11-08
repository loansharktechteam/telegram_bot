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
export default router;
