const btn = document.querySelector("button");

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
  return data;
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
  bookLookUp(processedTerm, filter);
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
