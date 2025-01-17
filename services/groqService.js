import { fetchBooksByOLID } from "../src/utils/openlibrary";
import { getDoneReading } from "./serverApi";
import { baseUrl } from "./variables";
import axios from 'axios';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });


export async function generateRecommendations(loggedInUserId) {
    const doneReading = await getDoneReading(loggedInUserId);
    const bookIds = doneReading.booksOlid;

    let doneReadingBooks = [];
    try {
        doneReadingBooks = await fetchBooksByOLID(bookIds);

        let booksString = "";
        if (doneReadingBooks.length > 0) {
            for (const book of doneReadingBooks) {
                booksString = booksString.concat(book.title + ";;; " + book.authors?.join(', ') + "###\n");
            }
            console.log("Poslani upit:\n" + booksString);
        } else return null;

        const chatCompletion = await getGroqChatCompletion(booksString);
        const recommendString = chatCompletion.choices[0]?.message?.content || null;
        console.log("Dobivene preporuke:\n" + recommendString);
        
        return recommendString;

    } catch (error) {
        console.error("Greška kod dohvaćanja knjiga: ", error);
    }

    return null;
}

export async function getGroqChatCompletion(booksString) {

    return groq.chat.completions.create({
  
      messages: [
        {
          role: "user",
          content: "Recommend me 8 books that you think I'd enjoy after having read the following books, listed in the format '<book title>;;; <authors seperated by commas>###':\n" + booksString + "and write the recommendations in the format '<book title>;;; <authors seperated by commas>###', without any additional notes.",
        },
  
      ],
  
      model: "llama-3.3-70b-versatile",
  
    });
  
  }