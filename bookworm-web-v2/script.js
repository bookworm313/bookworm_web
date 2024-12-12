const search_input = document.getElementById("query-input");
const submit_button = document.getElementById("submit-button");
const content = document.getElementById("content");
const search_results = document.getElementById("search-results");

let search_value;

function displayResult(docs, docs_size, num_found) {
    console.log("docs", docs);
    for (let i = 0; i < docs_size; i++) {
        
        const works = docs[i]; // Skup svih mogućih izdanja iste knjige
        let edition = docs[i].editions?.docs[0]; // Jedno specifično izdanje

        if (!edition)
            edition = works;

        console.log(works, edition)
        
        // Odredi URI korice
        let key = "id";
        let value = edition?.cover_i;
        let size = "M";
        const cover_uri = value ? `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg?default=false` : "https://placehold.co/80x120/ddd/9b9b9b/png?text=No\\ncover";

        const work_title = works.title;
        const edition_title = edition.title.concat(edition.subtitle? ": " + edition.subtitle : "");
        const author_name = edition.author_name ? edition.author_name.join(", ") : works.author_name.join(", ");
        const first_sentence = works.first_sentence ? works.first_sentence : "";

        const book_container = document.createElement("div");
        book_container.setAttribute("id", i);
        book_container.classList.add("book-container");
        book_container.innerHTML = 
            `<div class="book-cover-container">
                <img class="book-cover" src="${cover_uri}" alt="">
            </div>
            <div class="book-info">
                <p class="book-author">${author_name}</p>
                <p class="book-work-title">${work_title}</p>
                <p class="book-edition-title">${edition_title}</p>
                <p class="book-about">${first_sentence}</p>
            </div>`
        if (work_title !== edition_title) {
            book_container.getElementsByClassName("book-work-title")[0].style.display = "block";
        }
        search_results.append(book_container);
    }
}

function fetchBooks(page) {
    search_results.replaceChildren();

    // Odredi URI upita
    const query = encodeURI(search_input.value);
    const fields = encodeURI("editions,key,title,subtitle,author_name,first_sentence,cover_i");
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