import userService from "../services/userService";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from '../types/requestTypes';
import { ICreateUser } from "../types/userTypes";


const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const login = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await userService.login({ email, password });

        req.user = user
        req.session.userId = user.id;

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const register = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const createUserData: ICreateUser = req.body;
        const user = await userService.register(createUserData);
        if ("err" in user) return res.status(400).send(user.err);

        req.user = user;
        req.session.userId = user.id;

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const validateAuth = async (req: CustomRequest, res: Response) => {
    try {
        if (req.user) return res.status(200).send(req.user);

        res.status(401).send("User not logged in!");
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
}

export default {
    getUserByEmail,
    login,
    register,
    validateAuth
};