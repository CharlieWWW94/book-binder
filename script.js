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
    let card = document.createElement("card");
    card.classList.add("results-card");
    let imgContainer = document.createElement("imgContainer");
    imgContainer.classList.add("img-container");

    let img = document.createElement("img");
    img.classList.add("img");
    img.setAttribute("src", "./images/icons8-story-book-96.png");

    let btn = document.createElement("button");
    btn.classList.add("card-btn");
    btn.innerText = "Add";
    btn.id = `${book.isbn}`;

    let textContainer = document.createElement("div");
    textContainer.classList.add("text-container");

    let h3 = document.createElement("h3");
    h3.innerText = book.title;
    h3.classList.add("h3");
    let p1 = document.createElement("p");
    p1.classList.add("p1");
    let p2 = document.createElement("p");
    p2.classList.add("p2");
    p1.innerText = "Author: " + book.author;
    p2.innerText = "ISBN: " + book.isbn;

    card.appendChild(imgContainer);
    imgContainer.appendChild(img);
    imgContainer.appendChild(btn);
    card.appendChild(textContainer);
    textContainer.appendChild(h3);
    textContainer.appendChild(p1);
    textContainer.appendChild(p2);

    li.appendChild(card);
    ul.appendChild(li);
  }
  addEvents();
}
let bookArray = [];
//Creates array of book objects to populate HTML with
function createBookObjects(allData) {
  bookArray = [];
  for (let i = 0; i <= 11; i++) {
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

function findBook(isbn) {
  // Iterate over bookArray and find the target and return it

  for (let i = 0; i < bookArray.length; i++) {
    if (isbn === bookArray[i].isbn) {
      return bookArray[i];
    }
  }
}

function createCard(targetBook) {
  let binder = document.querySelector(".binder");
  let div1 = document.createElement("div");
  div1.classList.add("binderContents");
  let h2 = document.createElement("h2");
  let div2 = document.createElement("div");
  div2.classList.add("binderContentsMain");
  let p1 = document.createElement("p");
  let p2 = document.createElement("p");
  let p3 = document.createElement("p");
  p3.classList.add("subjects");
  let p4 = document.createElement("p");

  h2.innerText = targetBook.title;
  p1.innerText = targetBook.author;
  p2.innerText = "Published " + targetBook.firstPublishYear;
  if (targetBook.subjects) {
    p3.innerText = `${targetBook.subjects[0]}, ${targetBook.subjects[1]}, ${targetBook.subjects[2]}`;
  }
  if (targetBook.firstSentence) {
    p4.innerHTML = `<em>${targetBook.firstSentence[0]}</em>`;
  }

  binder.appendChild(div1);
  div1.appendChild(h2);
  div1.appendChild(div2);
  div2.appendChild(p1);
  div2.appendChild(p2);
  div2.appendChild(p3);
  div2.appendChild(p4);
}

function addEvents() {
  const cardBtn = document.getElementsByClassName("card-btn");
  const cardArray = Array.from(cardBtn);
  cardArray.forEach((target) => {
    target.addEventListener("click", () => {
      const targetBook = findBook(target.id);
      createCard(targetBook);
    });
  });
}

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
