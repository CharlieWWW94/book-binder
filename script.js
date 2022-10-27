const btn = document.querySelector("#searchButton");

async function bookLookUp(searchTerm, filter) {
  const data = await (
    await fetch(`http://openlibrary.org/search.json?${filter}=${searchTerm}`)
  ).json();
  let title = data.docs[0].title;
  let author = data.docs[0].author_name[0];
  let isbn = data.docs[0].isbn[0];
  let firstSentence = data.docs[0].first_sentence;
  let firstPublishYear = data.docs[0].first_publish_year;
  let subjects = data.docs[0].subject;
  console.log(data.docs[0].subject);
  let bookObjects = createBookObjects(data.docs)
  listResults(bookObjects)
  return data.docs;
}

function processString(userInput) {
  const wordArr = [];
  const splitWord = userInput.split(" ");

  splitWord.forEach((word) => {
    wordArr.push(word);
  });

  return wordArr.join("+");
}

btn.addEventListener("click", (event) => {
  event.preventDefault();
  const form = new FormData(document.querySelector("form"));
  const searchTerm = form.get("search");
  const filter = form.get("term");
  const processedTerm = processString(searchTerm);
 const allData = bookLookUp(processedTerm, filter);

//  console.log(allData)
 // createBookObjects(allData)
});

// TO DO:

// 1.access the info we want from json.
// 2.create a book class.
// 3. create a list of book instances.

class Book {
  //add fiction/nonfiction external links
  constructor(title, author, isbn, firstSentence, firstPublishYear, subjects) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.firstSentence = firstSentence;
    this.firstPublishYear = firstPublishYear;
    this.subjects = subjects;
  }
}

function createBookObjects (allData) {

let bookArray = []

for (let i = 0; i <= 10; i++) {

console.log(allData[i])

if (  Array.isArray(allData[i].isbn) && Array.isArray(allData[i].author_name) ) {

  allData[i].isbn = allData[i].isbn[0]
  allData[i].author_name = allData[i].author_name[0]

} else if (Array.isArray(allData[i].author_name)) {

  allData[i].author_name = allData[i].author_name[0]
} else if (Array.isArray(allData[i].isbn)) {
  
  allData[i].isbn = allData[i].isbn[0]
}

let newBook = new Book (allData[i].title, allData[i].author_name, allData[i].isbn, 
  allData[i].first_sentence, allData[i].first_publish_year, allData[i].subject)
bookArray.push(newBook)
}

return bookArray

}

function listResults (bookArray) {
// Adding it to the HTML 
let body = document.querySelector("body")
// body.removeChild(ul)
let ul = document.createElement("ul") 

ul.classList.add("results")
body.appendChild(ul)
// li.innerText = "Hello World"
// li.classList.add("listItem")


// let toRemove = document.getElementsByClassName("listItem")

for (let book of bookArray ) {

let li = document.createElement("li")
let p = document.createElement("p")
p.innerText =  book.title  + " Author: " + book.author + " ISBN: " + book.isbn
li.appendChild(p)
ul.appendChild(li)
}

}



// http://openlibrary.org/search.json?title=the+lord+of+the+rings

// const response = await fetch(URL);
// const data = await response.json()

// const = dataBooks;

// const bookArray = []



// createBookObjects(dataBooks) {
//   for (let i = 0; i <= 10; i++) {
//    // const id = i
//     const title = dataBooks[i].title
//     const date = dataBooks[i].date
//     const author = dataBooks[i].author
//     const book = new Book(title, date, author)

//     bookArray.push(book)
//   }
// }
