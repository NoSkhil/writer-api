import express,{Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import session from "express-session";

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
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

app.get('/', (req:Request,res:Response)=> res.status(200).send({data:"voxtone server."}));
app.get('/api/users',userRoutes);



const PORT = process.env.PORT || 3000;
app.listen(8000, async ()=>{
console.log(`Voxtone server running at port - ${PORT}`);
});