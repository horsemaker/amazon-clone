import axios from "axios";

const instance = axios.create({
    baseURL: 'Put in the cloud function URL here' // THE API {cloud function} URL
});

export default instance;