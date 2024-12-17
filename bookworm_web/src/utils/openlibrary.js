const search_input = document.getElementById("query-input");
const submit_button = document.getElementById("submit-button");
const content = document.getElementById("content");
const search_results = document.getElementById("search-results");

const fields = "editions,key,cover_i,author_key,author_name,first_publish_year,title,work";
const lang = "eng";
const limit = 10;
const page = 1;

function keyToOLID(key) {
    // "/books/OL1234M" => OL1234M
    return key.substring(key.lastIndexOf("/") + 1)
}

function getAuthorURI(a_olid) {
    return encodeURI(`https://openlibrary.org/authors/${a_olid}.json`)
}
function getQueryURI(query, fields, lang, limit, page) {
    return encodeURI(`https://openlibrary.org/search.json?q=${query}&fields=${fields}&language=${lang}&limit=${limit}&page=${page != "" ? page : "0"}`);
}
// Slika korice knjige
function getCoverURI(cover_id, size) {
    return encodeURI(`https://covers.openlibrary.org/b/id/${cover_id}-${size}.jpg?default=false`); // Vraća 404 ako ne postoji
}
// Slika autora
function getPortraitURI(author_olid, size) {
    return encodeURI(`https://covers.openlibrary.org/a/olid/${author_olid}-${size}.jpg?default=false`) // Vraća 404 ako ne postoji
}

// Dohvati podatke o knjizi prema OLID-u izdanja (edition) - to je ono što će se spremat u bazi
export async function fetchBookByOLID(e_olid)
{
    const uri = e_olid ? getQueryURI(e_olid, fields, lang, limit, page) : "";
    console.log(uri);

    if (!uri) return {};

    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        // Zna se dogoditi da neko djelo (work) ima isti OLID kao izdanje (edition) tražene knjige, samo se razlikuju u zadnjem znaku (npr. OL123W i OL123M)
        const work = json.docs.find((doc) => keyToOLID(doc.editions.docs[0].key.substring(0, doc.editions.docs[0].key.length - 1)) == e_olid.substring(0, e_olid.length - 1)); 
        const edition = work.editions.docs[0];

        const book = {
            olid: keyToOLID(edition.key),
            cover_uri: getCoverURI(edition.cover_i, "M"),
            author_names: edition.author_name ?? work.author_name,
            author_keys: edition.author_key ?? work.author_key,
            title: edition.title,
            publication_year: work?.first_publish_year,
        }

        console.log(`BOOK INFO (OLID: ${book.olid})\n\n${book.cover_uri}\n\nTitle: ${book.title}\nWritten by: ${book?.author_names?.join(", ")}\nFirst publish year: ${book.publication_year}`);
        return book;

    } catch (err) {
        console.log("Fetch error: ", err);
    }
}

// Dohvati podatke o autoru prema OLID-u autora
async function fetchAuthorByOLID(a_olid)
{
    const uri = getAuthorURI(a_olid);
    console.log(uri);
    
    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        const author = {
            olid: a_olid,
            portrait_uri: getPortraitURI(a_olid, "L"),
            personal_name: json.personal_name,
            full_personal_name: json.fuller_name,
            birth_date: json.birth_date,
            bio: json.bio,
            wiki_uri: json.wikipedia,
            //works: await fetchBooks(a_olid),
        }

        console.log(`AUTHOR INFO (OLID: ${author.olid})\n\n${author.portrait_uri}\n\nName: ${author.personal_name}${author.full_personal_name ? (author.personal_name !== author.full_personal_name ? ` (${author.full_personal_name})` : ``) : ``}\nBirth date: ${author.birth_date}\n\nBio: ${author.bio}\n\nMore info: ${author.wiki_uri}`)
        return author;
    }
    catch (err) {
        console.log("Fetch error: ", err);
    }
}

// Dohvati sve knjige koje odgovaraju nekom upitu
// lang - jezik knjige
// limit - koliko knjiga dohvatiti po upitu
// page - npr. page=1 dohvaća prvih limit (npr. 10) knjiga, page=2 sljedećih limit knjiga itd.
export async function fetchBooks(query, lang, limit, page)
{
    // Odredi URI upita
    // fields - koje atribute dohvatiti, ne bi se trebalo mijenjat
    const uri = getQueryURI(query, fields, lang, limit, page);
    console.log(uri);

    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        
        const results = {
            query: json.q,
            start: json.start, // index prve dohvaćene knjige
            retrieved_count: json.docs.length, // najčešće = limit, ali neki upit može rezultirati s još manje knjiga
            total_count: json.num_found, // ukupan broj knjiga koje odgovaraju upitu
            books: json.docs.map((work) => {
                const edition = work?.editions?.docs?.[0];
                return {
                    olid: edition.key.substring(edition.key.lastIndexOf("/") + 1),
                    cover_uri: getCoverURI(edition.cover_i, "M"),
                    author_names: edition.author_name ?? work.author_name,
                    author_keys: edition.author_key ?? work.author_key,
                    title: edition.title,
                    publication_year: work.first_publish_year,
                }
            })
        };

        /*console.log(`Page ${page}/${Math.ceil(results.total_count / results.retrieved_count)}`)
        for (let i = 0; i < results.retrieved_count; i++) {
            const book = results.books[i];
            console.log(`${results.start + 1 + i}/${results.total_count}\n\tBOOK INFO (OLID: ${book.olid})\n\n\t${book.cover_uri}\n\n\tTitle: ${book.title}\n\tWritten by: ${book?.author_names?.join(", ")}\n\tFirst publish year: ${book.publication_year}`);
        }*/
        return results;
    }
    catch (err) {
        console.log("Fetch error: ", err);
    }
}