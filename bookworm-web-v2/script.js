const search_input = document.getElementById("query-input");
const submit_button = document.getElementById("submit-button");
const content = document.getElementById("content");
const search_results = document.getElementById("search-results");

const displayResult = async function()
{
    search_results.replaceChildren();

    const query = search_input.value;
    const results = await fetchBooks(query, "eng", 10, 1);
    console.log("results", results);

    // Fetch failed
    if (!results)
        return;

    const books = [];
    
    // Dohvati podatke o pojedinoj knjizi
    for (let i = 0; i < results.retrieved_count; i++)
    {    
        const book = await fetchBookByKey(results.book_keys[i]);
        console.log("book", book)
        
        books.push(book);
    }

    // Prikaži rezultat
    for (let i = 0; i < results.retrieved_count; i++) 
    {   
        const book = books[i];

        // Odredi URI korice
        const size = "M";
        const cover_uri = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-${size}.jpg?default=false` : "https://placehold.co/80x120/ddd/9b9b9b/png?text=No\\ncover"; 

        const book_container = document.createElement("div");
        book_container.setAttribute("id", results.start + i);
        book_container.classList.add("book-container");
        book_container.innerHTML = 
            `<div class="book-cover-container">
                <img class="book-cover" src="${cover_uri}" alt="">
            </div>
            <div class="book-info">
                <p class="book-author">${book.authors_key}</p>
                <p class="book-title">${book.title}</p>
                <p class="book-about">${book.description ?? "No info"}</p>
            </div>`
        search_results.append(book_container);
    }
}

async function fetchBooks(query, lang, limit, page)
{
    // Odredi URI upita
    query = encodeURI(query);
    //const fields = encodeURI("editions,key,title,subtitle,author_name,first_sentence,cover_i,language");
    const fields = encodeURI("editions,key");
    const uri = `https://openlibrary.org/search.json?q=${query}&fields=${fields}&language=${lang}&limit=${limit}&page=${page != "" ? page : "0"}`;

    console.log(uri);
    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        
        const results = {
            query: json.q,
            start: json.start,
            retrieved_count: json.docs.length,
            total_count: json.num_found,
            book_keys: json.docs.map((work) => work?.editions?.docs?.[0].key),
        };
        return results;
    } catch (err) {
        console.log("Fetch error: ", err);
    }
}

async function fetchBookByKey(key)
{
    // nekad sadržava authors, ali kad nema ima works[0].key preko kojeg se dobije autor

    const uri = encodeURI(`https://openlibrary.org${key}.json`);
    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        const result = {
            cover_id: json.covers?.[0],
            authors_key: json.authors, // fetchAuthor
            title: json.title,
            description: json.description?.value,
            subjects: json.subjects, // potencijalno neki drugi atribut, treba bi se koristit za žanrove
        }

        return result;

    } catch (err) {
        console.log("Fetch error: ", err);
    }
}

submit_button.addEventListener("click", displayResult);