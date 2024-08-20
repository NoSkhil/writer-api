import userService from "../services/userService";
import {Request, Response, NextFunction} from "express";
import { ICreateUser } from "../types/userTypes";


const getUserByEmail = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const {email} = req.body;
        const user = await userService.getUserByEmail(email);
        if ("err" in user) return res.status(301).send({err:user.err});

        res.status(200).send({data:user.data});
    } catch (err) {
        res.status(500).send(err);
    }
}

const login = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const {email,password} = req.body;
        const user = await userService.login(email,password);
        if ("err" in user) return res.status(301).send({err:user.err});

        res.status(200).send({data:user.data});
    } catch (err) {
        res.status(500).send(err);
    }
}

const register = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const createUserData:ICreateUser = req.body;
        const user = await userService.register(createUserData);
        if ("err" in user) return res.status(301).send({err:user.err});

        res.status(200).send({data:user.data});
    } catch (err) {
        res.status(500).send(err);
    }
}

export default {
    getUserByEmail, 
    login,
    register
};