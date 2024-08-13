import express,{Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import db from './prisma/client';
import type { users } from '@prisma/client'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req:Request,res:Response)=> res.status(200).send({data:"voxtone server."}));




const PORT = process.env.PORT || 3000;
app.listen(8000, async ()=>{
console.log(`Voxtone server running at port - ${PORT}`);
console.log(db);
});

