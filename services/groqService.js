import { fetchBooksByOLID } from "../src/utils/openlibrary";
import { getDoneReading } from "./serverApi";
import { baseUrl } from "./variables";
import axios from 'axios';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });


export async function generateRecommendationsByHistory(loggedInUserId) {
    const doneReading = await getDoneReading(loggedInUserId);

    if (!doneReading) return null;

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

        const chatCompletion = await getGroqChatCompletionHistory(booksString);
        const recommendString = chatCompletion.choices[0]?.message?.content || null;
        console.log("Dobivene preporuke:\n" + recommendString);
        
        return recommendString;

    } catch (error) {
        console.error("Greška kod dohvaćanja knjiga: ", error);
    }

    return null;
}

export async function generateRecommendationsRandom() {
  
  try {
    
    const letter = String.fromCharCode(new Date().getMilliseconds() % 26 + 65);
    console.log(letter)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant and write only what you were explicitly told to write.",
        },
        {
          role: "user",
          content: `
          Recommend me 10 books in one genre determined in the next line, preferably written by different authors.
          The first letter of the genre is ${letter}.
          Write the recommendations in the format:
          '<genre>;;; <short description of the genre>###'
          '<book title>;;; <authors seperated by commas>###'
          '<book title>;;; <authors seperated by commas>###'
          ...
          `,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
    const recommendString = chatCompletion.choices[0]?.message?.content || null;

    console.log("GROQ Dobivene preporuke:\n" + recommendString);
    
    return recommendString;

  } catch (error) {
      console.error("Greška kod dohvaćanja knjiga: ", error);
  }

  return null;
}

export async function getGroqChatCompletionHistory(booksString) {

  return groq.chat.completions.create({

    messages: [
      {
        role: "user",
        content: "Recommend me 10 books that you think I'd enjoy after having read the following books, listed in the format '<book title>;;; <authors seperated by commas>###':\n" + booksString + "and write the recommendations in the format '<book title>;;; <authors seperated by commas>###', without any additional notes.",
      },

    ],

    model: "llama-3.3-70b-versatile",

  });
  
}