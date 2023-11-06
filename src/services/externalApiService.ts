import { PriceLogginService } from '../services/priceLogginService'

export class ExternalApiService {
    constructor() { }
    priceLogginService = new PriceLogginService();
    getScoreByAddress = async (req:any, res:any)=>{
        const {address} =req.body
        let getScoreByAddressRespond = await this.priceLogginService.getScoreByAddress(address)
        res.status(200).json(getScoreByAddressRespond)
        return 
    }  
}