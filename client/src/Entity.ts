import axios, { AxiosResponse } from "axios";

type ResponseData = {
    proxy: string;
    data: any;
}

const PORT = 3000;

abstract class Entity {
    url: string;

    constructor() {
        this.url = `http://localhost:${PORT}`;
    }
    
    async getAll() {
        try {
            console.log(`GET ${this.url}`);
            const response: AxiosResponse<ResponseData> = await axios(this.url, { method: 'GET' });
            if (response.data.data) return response.data.data;
        } catch (err) {
            console.error(`${String(err)}`);
        }
    }
    
    async getById(id: number) {
        try {
            console.log(`GET ${this.url}`);
            const response: AxiosResponse<ResponseData> = await axios(this.url + id, { method: 'GET' });
            if (response.data.data) return response.data.data;
        } catch (err) {
            console.error(`${String(err)}`);
        }
    }
}

export class PostEntity extends Entity {
    constructor() {
        super();
        this.url += "/posts/"
    }
}

export class UserEntity extends Entity {
    constructor() {
        super();
        this.url += "/users/"
    }
}