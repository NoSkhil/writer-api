import threadService from "../services/threadService";
import { Request, Response, NextFunction } from "express";


const getThread = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const threadData = await threadService.getThread(id);
        res.status(200).send(threadData);
    } catch (err) {
        res.status(500).send(err);
    }
}

export default {
    getThread,
};