const search_input = document.getElementById("query-input");
const submit_button = document.getElementById("submit-button");
const content = document.getElementById("content");
const search_results = document.getElementById("search-results");

async function fetchBookByEditionKey(key)
{
    // nekad sadržava authors, ali kad nema ima works[0].key preko kojeg se dobije autor

    const uri = encodeURI(`https://openlibrary.org${key}.json`);
    console.log(uri);
    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        console.log(json)

        const result = {
            work_key: json.works[0].key,
            cover_id: json.covers?.[0],
            author_keys: json.authors, // ?? fetchAuthor(work_key)
            //author_names: 
            publish_year: json.publish_date,
            title: json.title,
            description: json.description ?? json.description?.value,
            //subjects: json.subjects, // potencijalno neki drugi atribut, treba bi se koristit za žanrove
        }

        console.log("1", result.description)
        return result;

    } catch (err) {
        console.log("Fetch error: ", err);
    }
}

const displayResult = async function()
{
    search_results.replaceChildren();

    const query = search_input.value;
    const results = await fetchBooks(query, "eng", 10, 1);
    console.log("results", results);

    // Fetch failed
    if (!results)
        return;
    
    // Dohvati podatke o pojedinoj knjizi
    for (let i = 0; i < results.retrieved_count; i++)
    {    
        const book = results.books[i];
        console.log("book", book)

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
                <p class="book-author">${book.author_names?.join(", ")}</p>
                <p class="book-title">${book.title}</p>
                <p class="book-about">${book.description ?? "No info"}</p>
            </div>`
        book_container.addEventListener("click", async () => {
            const edition_result = await fetchBookByEditionKey(book.edition_key);
            console.log("2", edition_result.description)
            book_container.querySelector(".book-about").replaceChildren();
            book_container.querySelector(".book-about").appendChild(document.createTextNode(edition_result.description));
        });
        search_results.append(book_container);
    }
}

async function fetchBooks(query, lang, limit, page)
{
    // Odredi URI upita
    query = encodeURI(query);
    //const fields = encodeURI("editions,key,title,subtitle,author_name,first_sentence,cover_i,language");
    const fields = encodeURI("editions,key,cover_i,author_key,author_name,first_publish_year,title");
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
            books: json.docs.map((work) => {
                const edition = work?.editions?.docs?.[0];
                return {
                    work_key: work.key,
                    edition_key: edition.key,
                    cover_id: edition.cover_i,
                    author_keys: edition.author_key ?? work.author_key,
                    author_names: edition.author_name ?? work.author_name,
                    publish_year: work.first_publish_year,
                    title: edition.title,
                }
            })
        };

        return results;
    }
    catch (err) {
        console.log("Fetch error: ", err);
    }
}

submit_button.addEventListener("click", displayResult);