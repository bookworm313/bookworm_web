const search_input = document.getElementById("query-input");
const submit_button = document.getElementById("submit-button");
const content = document.getElementById("content");
const search_results = document.getElementById("search-results");

let search_value;

function displayResult(docs, docs_size, num_found) {
    console.log("docs", docs);
    for (let i = 0; i < docs_size; i++) {
        let book = docs[i];

        const doc = docs[i];
        const editions = doc.editions;
        const edition = editions.docs[0];

        console.log(book)
        
        let key = "id";
        let value = edition.cover_i;
        let size = "M";
        const cover_uri = value ? `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg?default=false` : "https://placehold.co/80x120/ddd/9b9b9b/png?text=No\\ncover";

        const book_container = document.createElement("div");
        book_container.setAttribute("id", i);
        book_container.classList.add("book-container");
        book_container.innerHTML = 
            `<div class="book-cover-container">
                <img class="book-cover" src="${cover_uri}" alt="">
            </div>
            <div class="book-info">
                <p class="book-author">${edition.author_name}</p>
                <p class="book-title">${edition.title}</p>
                <p class="book-about">${edition.first_sentence}</p>
            </div>`
        search_results.append(book_container);
    }
}

function fetchBooks(page) {
    search_results.replaceChildren();
    const query = encodeURI(search_input.value);
    const fields = encodeURI("*,editions");
    const lang = "en";
    const limit = "10";
    const uri = `https://openlibrary.org/search.json?q=${query}&fields=${fields}&lang=${lang}e&limit=${limit}&page=${page ? page : 0}`;
    console.log(uri);

    fetch(uri)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            response.json().then(function (json) {
                displayResult(json.docs, limit, json.num_found);
            });
        })
        .catch(function (err) {
            console.log("Fetch error: ", err);
        });
}

submit_button.addEventListener("click", fetchBooks);