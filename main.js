document.addEventListener("DOMContentLoaded", () => {
    const bookForm = document.getElementById('bookForm');
    const searchForm = document.getElementById('searchBook');
    const searchInput = document.getElementById('searchBookTitle');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    const bookFormSubmit = document.getElementById('bookFormSubmit');
    const bookFormIsComplete = document.getElementById('bookFormIsComplete');

    // Update button text based on checkbox status
    bookFormIsComplete.addEventListener('change', function () {
        if (bookFormIsComplete.checked) {
        bookFormSubmit.innerHTML = 'Masukkan Buku ke rak <span>Selesai dibaca</span>';
        } else {
        bookFormSubmit.innerHTML = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
        }
    });
  
    // Function to get books from localStorage
    function getBooks() {
      const books = localStorage.getItem('books');
      return books ? JSON.parse(books) : [];
    }
  
    // Function to save books to localStorage
    function saveBooks(books) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    // Function to render books in the UI
    function renderBooks(filter = "") {
      const books = getBooks();
      incompleteBookList.innerHTML = '';
      completeBookList.innerHTML = '';
  
      books
        .filter(book => book.title.toLowerCase().includes(filter.toLowerCase())) // Filter by search term
        .forEach(book => {
          const bookItem = document.createElement('div');
          bookItem.setAttribute('data-bookid', book.id);
          bookItem.setAttribute('data-testid', 'bookItem');
          bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
              <button data-testid="bookItemIsCompleteButton" onclick="toggleComplete(${book.id})">
                ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
              </button>
              <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">
                Hapus Buku
              </button>
              <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">
                Edit Buku
              </button>
            </div>
          `;
          if (book.isComplete) {
            completeBookList.appendChild(bookItem);
          } else {
            incompleteBookList.appendChild(bookItem);
          }
        });
    }
  
    // Handle form submission
    bookForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const title = document.getElementById('bookFormTitle').value;
      const author = document.getElementById('bookFormAuthor').value;
      const year = parseInt(document.getElementById('bookFormYear').value, 10);
      const isComplete = document.getElementById('bookFormIsComplete').checked;
  
      if (!title || !author || !year) {
        alert("Please fill in all fields");
        return;
      }
  
      const newBook = {
        id: Date.now(),
        title,
        author,
        year,
        isComplete
      };
  
      const books = getBooks();
      books.push(newBook);
      saveBooks(books);
      bookForm.reset();
      renderBooks();
    });
  
    // Function to toggle book completion status
    window.toggleComplete = function (id) {
      const books = getBooks();
      const book = books.find(b => b.id === id);
      if (book) {
        book.isComplete = !book.isComplete;
        saveBooks(books);
        renderBooks();
      }
    };
  
    // Function to delete a book
    window.deleteBook = function (id) {
      let books = getBooks();
      books = books.filter(book => book.id !== id);
      saveBooks(books);
      renderBooks();
    };
  
    // Function to edit a book
    window.editBook = function (id) {
      const books = getBooks();
      const book = books.find(b => b.id === id);
      if (book) {
        document.getElementById('bookFormTitle').value = book.title;
        document.getElementById('bookFormAuthor').value = book.author;
        document.getElementById('bookFormYear').value = book.year;
        document.getElementById('bookFormIsComplete').checked = book.isComplete;
        deleteBook(id);
      }
    };
  
    // Handle search functionality
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchTerm = searchInput.value;
      renderBooks(searchTerm);
    });
  
    // Initial render
    renderBooks();
  });
  