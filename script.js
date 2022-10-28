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

//clears page of previous search results
function clearPage() {
  let staleResults = document.querySelector(".results");
  if (staleResults) {
    resultsContainer.removeChild(staleResults);
  }
}

// Populates page with search results (book objects)
function listResults(bookArray) {
  clearPage();
  let ul = document.createElement("ul");
  ul.classList.add("results");
  resultsContainer.appendChild(ul);

  for (let book of bookArray) {
    let li = document.createElement("li");
    li.classList.add("listItem");
    let p = document.createElement("p");
    p.innerHTML =
      "<strong>" +
      book.title +
      "</strong> Author: " +
      book.author +
      " ISBN: " +
      book.isbn;

    let btn = document.createElement("button");
    btn.innerText = "Add";
    btn.id = `add-btn-${book.isbn}`;

    li.appendChild(p);
    li.appendChild(btn);
    ul.appendChild(li);
  }
}

//Creates array of book objects to populate HTML with
function createBookObjects(allData) {
  let bookArray = [];

  for (let i = 0; i <= 10; i++) {
    if (
      Array.isArray(allData[i].isbn) &&
      Array.isArray(allData[i].author_name)
    ) {
      allData[i].isbn = allData[i].isbn[0];
      allData[i].author_name = allData[i].author_name[0];
    } else if (Array.isArray(allData[i].author_name)) {
      allData[i].author_name = allData[i].author_name[0];
    } else if (Array.isArray(allData[i].isbn)) {
      allData[i].isbn = allData[i].isbn[0];
    }

    let newBook = new Book(
      allData[i].title,
      allData[i].author_name,
      allData[i].isbn,
      allData[i].first_sentence,
      allData[i].first_publish_year,
      allData[i].subject
    );
    bookArray.push(newBook);
  }

  return bookArray;
}

//Make API call with user filter and search term
async function bookLookUp(searchTerm, filter) {
  const data = await (
    await fetch(`http://openlibrary.org/search.json?${filter}=${searchTerm}`)
  ).json();
  console.log(data.docs);
  let bookObjects = createBookObjects(data.docs);
  listResults(bookObjects);
  return data.docs;
}

//Format user input for API: "book+title+with+plusses"
function processString(userInput) {
  const wordArr = [];
  const splitWord = userInput.split(" ");
  splitWord.forEach((word) => {
    wordArr.push(word);
  });
  return wordArr.join("+");
}

//Identify search button in document
const btn = document.querySelector("#searchButton");
//Identify results section
const resultsContainer = document.querySelector(".results-container");

//Triggers search and population of HTML with results
btn.addEventListener("click", (event) => {
  event.preventDefault();
  const form = new FormData(document.querySelector("form"));
  const searchTerm = form.get("search");
  const filter = selectText.innerText.toLowerCase();
  console.log(filter);
  const processedTerm = processString(searchTerm);
  bookLookUp(processedTerm, filter);
});

let select = document.getElementById("select");
let list = document.getElementById("list");
let selectText = document.getElementById("selectText");
let search = document.getElementById("search");
let options = document.getElementsByClassName("options");

select.onclick = function () {
  list.classList.toggle("open");
};

for (option of options) {
  option.onclick = function () {
    selectText.innerHTML = this.innerHTML;
    search.placeholder = "Search Book by " + selectText.innerHTML;
  };
}
