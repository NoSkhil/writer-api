import { Prisma } from "@prisma/client"
import { temp_threads as ITempThread } from "@prisma/client"
import messageService from "./messageService";
import threadService from "./threadService";
import tempThreadService from "./tempThreadService";
import tempMessageService from "./tempMessageService";



//const initialiseTempChat = async(userId:string) : Promise <Record<"data", ITempThread> | Record<"err", string> > => {

