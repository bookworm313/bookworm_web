import axios from "axios";
import { baseUrl } from "./variables";

export const getLists = async () => {
    try {
        const { data, status } = await axios.get(`${baseUrl}/book/lists`);
        console.log(data);

        if (status == 200)
            return data;
        else return null;
    } catch (error) {
        console.error(error);
    }
};