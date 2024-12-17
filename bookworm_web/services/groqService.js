import { baseUrl } from "./variables";
import axios from 'axios';

export async function generateBookDescription(bookTitle, authorName) {
    try {
        const response = await axios.post(`${baseUrl}/book/generate-description`, {
            bookTitle,
            authorName,
        });

        return {
            description: response.data.description || "No description generated.",
            rating: response.data.rating || "No rating available.",
        };
    } catch (error) {
        console.error("Error generating description:", error);
        return "Error generating description.";
    }
}
