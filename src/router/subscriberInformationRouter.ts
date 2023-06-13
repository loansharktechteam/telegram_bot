import express, { NextFunction, Request, Response } from 'express';
// import { ApiError, createApiResponse } from '../services/model';
import * as WorkflowServices from '../services/workflowServices';
import {SubscriberInformationService} from '../services/subscriberInformationService'


const router = express.Router();
let subscriberInformationService = new SubscriberInformationService()
// const workflowServices = new WorkflowServices()
router.post('/addSubscriberInformation', async function (req: Request, res: Response) {
    //   console.log(req, res)
    // const {  } = req.body
    try {
        const result = await subscriberInformationService.addSubscriberInformation(req.body);
        if (result.code === 0) {
            res.status(200).json(result)
        } else {
            res.status(503).json(result)
        }
    } catch (e) {
        res.status(404).json({
            code: -2,
            message: `fail ${e}`,
            result: {}
        })
    }
});

router.post('/getSubscriberInformationByKey', async function (req: Request, res: Response) {
    //   console.log(req, res)
    const { key } = req.body
    try {
        const result = await subscriberInformationService.getSubscriberInformationByKey(key);
        if(result){
            res.status(200).json(result)
        }else{
            res.status(503).json(result)
        }
    } catch (e) {
        console.error(e)
        res.status(404).json({
            code: -2,
            message: `fail ${e}`,
            result: {}
        })
    }
});



router.post('/updateSubscriberInformation', async function (req: Request, res: Response) {
    //   console.log(req, res)
    const { key } = req.body
    try {
        const result = await subscriberInformationService.updateSubscriberInformation(req.body);
        if(result.code===0){
            res.status(200).json(result)
        }else{
            res.status(503).json(result)
        }
    } catch (e) {
        console.error(e)
        res.status(404).json({
            code: -2,
            message: `fail ${e}`,
            result: {}
        })
    }
});

// router.post('/saveWorkflows', async function (req: Request, res: Response) {
//     //   console.log(req, res)
//     // const { body } = req.body
//     console.log(`savework`,req.body)
//     const result = await WorkflowServices.saveWorkflows(req.body);
//     if(result.code===0){
//         res.status(200).json(result)
//     }else{
//         res.status(503).json(result)
//     }

// });


// router.post('/updateWorkflowByKey', async function (req: Request, res: Response) {
//     const result = await WorkflowServices.updateWorkflowByKey(req.body);
//     if(result.code===0){
//         res.status(200).json(result)
//     }else{
//         res.status(503).json(result)
//     }    
// });

// router.post('/deleteWorkflowByKey', async function (req: Request, res: Response) {
//     const result = await WorkflowServices.deleteWorkflowByKey(req.body);
//     if(result.code===0){
//         res.status(200).json(result)
//     }else{
//         res.status(503).json(result)
//     }    
// });

// router.post('/addSubscriptedNotification', function (req: Request, res: Response) {
//     const {address, telegramNotification,emailNotification,discordNotification} = req.body
//     WorkflowServices.addSubscriptedNotification(address, telegramNotification,emailNotification,discordNotification);
//     res.status(200).json({message:"success"})
// })

// router.post('/trypost', function (req: Request, res: Response) {
//     WorkflowServices.trypost();
//     res.status(200).json({message:"success"})
// })


export default router;
