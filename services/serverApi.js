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

export const getWantToRead = async (id) => {
    try {
        const url = `${baseUrl}/user/${id}/lists/want_to_read`;
        const res = await fetch(url);
        if (!res.ok) {
            console.log('Fetch user Want To Read list: Network response was not ok');
            return null;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}
export const getDoneReading = async (id) => {
    try {
        const url = `${baseUrl}/user/${id}/lists/done_reading`;
        const res = await fetch(url);
        if (!res.ok) {
            console.log('Fetch user Want To Read list: Network response was not ok');
            return null;
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// Ažurira popis lista kojima knjiga pripada, koristi se kad se promijeni unos u MultiSelectu u BookResult
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