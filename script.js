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
  let card = document.createElement("card")
  card.classList.add("results-card")
  let img = document.createElement("img")
  img.classList.add("img")
  img.setAttribute("src", "./images/icons8-story-book-96.png")
  let h3 = document.createElement("h3")
  h3.innerText = book.title
  h3.classList.add("h3")
    let p1 = document.createElement("p");
    p1.classList.add("p1")
    let p2 = document.createElement("p")
    p2.classList.add("p2")
   p1.innerText = "Author: " + book.author
   p2.innerText = "ISBN: " + book.isbn

    let btn = document.createElement("button");
    btn.classList.add("card-btn")
    btn.innerText = "Add";
    btn.id = `add-btn-${book.isbn}`;
    card.appendChild(img)
    card.appendChild(h3);
    card.appendChild(p1);
    card.appendChild(p2);
    card.appendChild(btn);
    li.appendChild(card)
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
