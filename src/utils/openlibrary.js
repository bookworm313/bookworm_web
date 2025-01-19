const fields = "editions,key,cover_i,title,subtitle,publish_date,author_name";
const lang = "eng";
const limit = 10;
const page = 1;

function keyToOLID(key) {
    // "/books/OL1234M" => OL1234M
    if (!key) return undefined;
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
    if (!cover_id) return undefined;
    return encodeURI(`https://covers.openlibrary.org/b/id/${cover_id}-${size}.jpg?default=false`); // Vraća 404 ako ne postoji
}
function getCoverURIByOLID(olid, size) {
    if (!olid) return undefined;
    return encodeURI(`https://covers.openlibrary.org/b/olid/${olid}-${size}.jpg?default=false`)
}
// Slika autora
function getPortraitURI(author_olid, size) {
    return encodeURI(`https://covers.openlibrary.org/a/olid/${author_olid}-${size}.jpg?default=false`) // Vraća 404 ako ne postoji
}

function getYearFromDate(dateStr) {
    const dateObj = new Date(dateStr);
    return dateObj ? dateObj.getFullYear() : 'yyyy';
}

/*export async function fetchBookByOLID(e_olid)
{
    const uri = e_olid ? `https://openlibrary.org/api/books?bibkeys=OLID:${e_olid}&format=json&jscmd=data` : "";
    console.log(uri);

    if (!uri) return {};

    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        // Zna se dogoditi da neko djelo (work) ima isti OLID kao izdanje (edition) tražene knjige, samo se razlikuju u zadnjem znaku (npr. OL123W i OL123M)
        //const work = json.docs.find((doc) => keyToOLID(doc.editions.docs[0].key.substring(0, doc.editions.docs[0].key.length - 1)) == e_olid.substring(0, e_olid.length - 1)); 
        //const edition = work.editions.docs[0];

        const book = {
            olid: e_olid,
            cover_uri: json.cover.medium,
            author_names: json.authors.map((author) => author.name),
            title: json.title,
        }

        console.log(`BOOK INFO (OLID: ${book.olid})\n\n${book.cover_uri}\n\nTitle: ${book.title}\nWritten by: ${book?.author_names?.join(", ")}\nFirst publish year: ${book.publication_year}`);
        return book;

    } catch (err) {
        console.log("Fetch error: ", err);
    }
}*/

// Dohvati osnovne podatke o skupu knjiga prema njihovim OLID-ima
export async function fetchBooksByOLID(olids)
{
    const olidsString = olids.map((olid) => 'OLID:' + olid).join(',');
    const uri = `https://openlibrary.org/api/books?bibkeys=${olidsString}&format=json&jscmd=data`;
    
    const books = [];

    await fetch(uri)
        .then(response => response.json())
        .then(data => {
            for (const olid in data) {
                const book = data[olid];
                books.push({
                    olid: keyToOLID(book.key),
                    title: book.title,
                    subtitle: book.subtitle ? String(book.subtitle).charAt(0).toUpperCase() + String(book.subtitle).slice(1) : undefined,
                    publish_year: getYearFromDate(book.publish_date?.[0]),
                    authors: book.authors?.map((author) => author.name),
                    cover_uri: getCoverURIByOLID(keyToOLID(book.key), "M")
                })
            }
        })
        .catch(error => console.error('Greška pri dohvaćanju knjiga (fetchBooksByOLID):', error));

    return books;
}

export async function fetchBook(e_olid) {
    const editionUri = `https://openlibrary.org/books/${e_olid}.json`;
    console.log("Edition uri: ", editionUri);
    const book = {
        w_olid: null,
        e_olid: e_olid,
        a_olid: null,
        title: null,
        description: null,
        edition: {
            title: null,
            publisher: null,
            publish_date: null,
            cover_uri: null,
        },
        authors: []
    }
    await fetch(editionUri)
        .then(response => response.json())
        .then(data => {
            book.w_olid = data.works[0];
            book.a_olid = data?.authors?.map((author) => author.key);
            book.edition.title = data.title;
            book.edition.publisher = data.publisher;
            book.edition.publish_date = data.publish_date;
            book.edition.cover_uri = getCoverURI(data.covers?.[0], "M");

            console.log(book);
        })
        .catch(error => console.error('Error when fetching edition:', error));

        const workUri = `https://openlibrary.org${book.w_olid.key}.json`;
        console.log("Work uri: ", workUri);
        await fetch(workUri)
            .then(response => response.json())
            .then(data => {
                book.title = data.title;
                book.description = data.description?.value || data.description;
                if (!book.a_olid) book.a_olid = data.authors.map((author) => {
                    if (Object.hasOwn(author, 'author'))
                        return author.author.key;
                    else
                        return author.key;
                });
            })
            .catch(error => console.error('Error when fetching work:', error));
        console.log(book.a_olid)
        console.log(book)

        for (const a_olid of book.a_olid) {
            const authorUri = `https://openlibrary.org${a_olid}.json`
            console.log("Author uri: ", authorUri);
            console.log(authorUri)
            await fetch(authorUri)
                .then(response => response.json())
                .then(data => {
                    const author = {
                        name: data.name,
                        birth_date: data.birth_date,
                        death_date: data.death_date,
                        bio: data.bio,
                    }
                    book.authors.push(author);
                })
                .catch(error => console.error('Error when fetching author:', error));
        }
    return book;
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
    console.log(`URI za upit '${query}':\n${uri}`);

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
                const book = work?.editions?.docs?.[0];
                return {
                    olid: keyToOLID(book.key),
                    title: book.title,
                    subtitle: book.subtitle ? String(book.subtitle).charAt(0).toUpperCase() + String(book.subtitle).slice(1) : undefined,
                    publish_year: getYearFromDate(book.publish_date?.[0]),
                    authors: work.author_name,
                    cover_uri: getCoverURIByOLID(keyToOLID(book.key), "M")
                }
            })
        };

        return results;
    }
    catch (err) {
        console.log("Fetch error: ", err);
    }
}

// Koristi se za dohvaćanje knjige prema generiranoj preporuci (string koji sadrži naslov i ime pisaca)
export async function fetchBookByQuery(query, lang = "eng", limit = 1, page = 1)
{
    const fields = "editions,key,cover_i,title,publish_date,author_name";
    const uri = getQueryURI(query, fields, lang, limit, page);
    console.log(`URI za upit '${query}':\n${uri}`);

    try {
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        
        const work = json.docs[0];
        const edition = work?.editions.docs[0];
        const results = {
            olid: keyToOLID(edition.key ?? work.key),
            title: edition.title ?? work.title,
            publish_year: getYearFromDate(edition.publish_date?.[0] ?? work.publish_date?.[0]),
            authors: edition.author_name ?? work.author_name,
            cover_uri: getCoverURIByOLID(keyToOLID(edition.key ?? work.key), "M")
        };

        return results;
    }
    catch (err) {
        console.log("Fetch error: ", err);
    }
}