import axios from "axios";
import { baseUrl } from "./variables";

export const getUsers = async () => {
    try {
        const url = `${baseUrl}/users`;
        const res = await fetch(url);
        if (!res.ok) {
            console.log('Fetch users: Network response was not ok');
            return null;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

export const getUser = async (id) => {
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

export const getUserLists = async (id) => {
    try {
        const url = `${baseUrl}/user/${id}/lists`;
        const res = await fetch(url);
        if (!res.ok) {
            console.log('Fetch user lists: Network response was not ok');
            return null;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// In Search; update which lists a book belongs to
export const updateBookBelonging = async (loggedInUserId, selectedListsIds, olid) => {
    try {
        const url = `${baseUrl}/lists/add`;
        const res = await fetch(url, {
            method: 'put',
            //mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: loggedInUserId,
                selectedListsIds: selectedListsIds,
                olid: olid
            })
        });
        if (!res.ok) {
            console.log('PUT list items: Network response was not ok');
            return;
        }
        console.log('PUT Successful: updateBookBelonging');
    } catch (error) {
        console.error(error);
    }
}