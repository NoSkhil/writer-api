import userService from "../services/userService";
import {Request, Response, NextFunction} from "express";


const getAllUserData = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const userData = await userService.getAllData();
        res.status(200).send({data:userData});
    } catch (err) {
        res.status(500).send(err);
    }
}

export default {
    getAllUserData, 
};