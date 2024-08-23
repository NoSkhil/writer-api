import userService from "../services/userService";
import {Request, Response, NextFunction} from "express";
import { CustomRequest } from '../types/requestTypes';
import { ICreateUser } from "../types/userTypes";


const getUserByEmail = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const {email} = req.body;
        const user = await userService.getUserByEmail(email);
        if ("err" in user) return res.status(301).send({err:user.err});

        res.status(200).send({data:user.data});
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: "Internal server error!" });
    }
}

const login = async (req:CustomRequest,res:Response,next:NextFunction) => {
    try{
        const {email,password} = req.body;
        const user = await userService.login({email,password});
        if ("err" in user) return res.status(401).send({err:user.err});

        req.user = user.data;
        req.session.userId = user.data.id;

        res.status(200).send({data:user.data.id});
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: "Internal server error!" });
    }
}

const register = async (req:CustomRequest,res:Response,next:NextFunction) => {
    try{
        const createUserData:ICreateUser = req.body;
        const user = await userService.register(createUserData);
        if ("err" in user) return res.status(400).send({err:user.err});

        req.user = user.data;
        req.session.userId = user.data.id;

        res.status(200).send({data:user.data.id});
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: "Internal server error!" });
    }
}

const validateAuth = async (req: CustomRequest, res: Response ) => {
    try {
        if (req.user) return res.status(200).send({data:req.user});
        
        res.status(401).send({err: "Unauthorised User!"});
    } catch(err) {
        console.log(err);
        res.status(500).send({err:"Internal server error!"})
    }
}

export default {
    getUserByEmail, 
    login,
    register,
    validateAuth
};