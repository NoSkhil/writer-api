import express,{Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import session from "express-session";
import { chatRoutes } from './routes/chatRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    }
}));

app.get('/', (req:Request,res:Response)=> res.status(200).send({data:"voxtone server."}));
app.use('/api/users',userRoutes);
app.use('/api/chat',chatRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, async ()=>{
console.log(`Voxtone server running at port - ${PORT}`);
});