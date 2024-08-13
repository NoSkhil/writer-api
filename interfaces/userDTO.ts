interface User {
    id:string,
    firstName:string, 
    lastName:string, 
    birthdate:Date,
    phone:number,
    email:string
}

interface CreateUserDTO extends Omit<User, 'id'> {}

export {User, CreateUserDTO};