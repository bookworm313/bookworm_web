import axios from "axios";
import { baseUrl } from "./variables";

export const getLists = async (id) => {
    try {
        const url = id ? `${baseUrl}/book/lists/${id}` : `${baseUrl}/book/lists`;
        const { data, status } = await axios.get(url);
        console.log(data);

        if (status == 200)
            return data;
        else return null;
    } catch (error) {
        console.error(error);
    }
};