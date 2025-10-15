import { PostEntity, UserEntity } from "./Entity";

const posts = new PostEntity();
const users = new UserEntity();

const test = async() => {    
    console.log(await posts.getAll());
    console.log(await users.getById(1));
}

test();