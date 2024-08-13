import userService from "../services/userService";
import {Request, Response, NextFunction} from "express";


const getUser = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const {id} = req.body;
        const userData = await userService.getUser(id);
        res.status(200).send({data:userData});
    } catch (err) {
        res.status(500).send(err);
    }
}

export default {
    getUser, 
};