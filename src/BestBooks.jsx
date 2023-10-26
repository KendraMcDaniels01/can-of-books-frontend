import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';

const PORT = import.meta.env.VITE_server_url;

class BestBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      isModalOpen: false, // Track whether the modal is open
      newBook: {
        title: '',
        description: '',
        status: '',
      },
    };
  }

  fetchAllBooks = () => {
    axios.get(`${PORT}/books`)
      .then(response => {
        this.setState({ books: response.data });
      });
  }

  componentDidMount() {
    this.fetchAllBooks();
  }

  // Function to handle form input changes
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newBook: { ...prevState.newBook, [name]: value },
    }));
  }

  // Function to open the "New Book" form modal
  openModal = () => {
    this.setState({ isModalOpen: true });
  }

  // Function to close the "New Book" form modal
  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  openEditModal = (book) => {
    this.setState({ isModalOpen: true, editBook: book });
  }

  // Function to handle form submission for editing
  handleEdit = (event) => {
    event.preventDefault();
    const { title, description, status } = this.state.newBook;
    const bookId = this.state.editBook._id;

    axios.put(`${PORT}/books/${bookId}`, { title, description, status })
      .then(response => {
        // Update the application state with the updated book
        this.setState((prevState) => ({
          books: prevState.books.map(book =>
            book._id === response.data._id ? response.data : book
          ),
          newBook: {
            title: '',
            description: '',
            status: '',
          },
          isModalOpen: false, // Close the modal after editing the book
          editBook: null, // Clear the book being edited
        }));
      })
      .catch(error => {
        console.error(`Error editing the book with ID ${bookId}:`, error);
        // Handle errors here
      });
  }

  // Function to handle form submission
  handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`${PORT}/books`, this.state.newBook)
      .then(response => {
        // Update the application state with the new book
        this.setState((prevState) => ({
          books: [...prevState.books, response.data],
          newBook: {
            title: '',
            description: '',
            status: '',
          },
          isModalOpen: false, // Close the modal after creating the book
        }));
      })
      .catch(error => {
        console.error('Error creating a new book', error);
        // Handle errors here
      });
  }

  handleDeleteBook = (bookId) => {
    axios.delete(`${PORT}/books/${bookId}`)
      .then(response => {
        if (response.status === 200) {
          // Remove the book from state
          this.setState(prevState => ({
            books: prevState.books.filter(book => book._id !== bookId),
          }));
        }
      })
      .catch(error => {
        console.error(`Error deleting the book with ID ${bookId}:`, error);
      });
  }

render() {
    return (
      <>
        <h2>My Essential Lifelong Learning & Formation Shelf</h2>

        {/* Books list with Edit buttons */}
        {this.state.books.length > 0 ? (
          <Carousel>
            {this.state.books.map((book, idx) =>
              <Carousel.Item key={idx}>
                {/* Book content */}
                <button onClick={() => this.openEditModal(book)}>Edit</button>
              </Carousel.Item>
            )}
          </Carousel>
        ) : (
          <h3>No Books Found</h3>
        )}

        {/* "Add Book" button */}
        <button onClick={this.openModal}>Add Book</button>

        {/* "New Book" or "Edit Book" form modal */}
        {this.state.isModalOpen && (
          <div className="modal">
            <form onSubmit={this.state.editBook ? this.handleEdit : this.handleSubmit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={this.state.editBook ? this.state.newBook.title : this.state.newBook.title}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={this.state.editBook ? this.state.newBook.description : this.state.newBook.description}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                Status:
                <input
                  type="text"
                  name="status"
                  value={this.state.editBook ? this.state.newBook.status : this.state.newBook.status}
                  onChange={this.handleInputChange}
                />
              </label>
              <button type="submit">
                {this.state.editBook ? 'Update Book' : 'Create Book'}
              </button>
              <button onClick={this.closeModal}>Close</button>
            </form>
          </div>
        )}
      </>
    );
  }
}

export default BestBooks;