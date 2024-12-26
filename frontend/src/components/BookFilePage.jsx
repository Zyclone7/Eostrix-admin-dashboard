import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Eye, Edit, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookFilePage = ( {onBookCount} ) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use navigation hook
  const navigate = useNavigate();

  // Navigate to add books page
  const handleAddBook = () => {
    navigate('/bookupload');
  };

  // Fetch the books from an API or database on page load
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5003/api/files');
        setBooks(response.data);
        setError(null);
                // Send book count to the parent component
        if (onBookCount) {
          onBookCount(response.data.length);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Failed to fetch books. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle deleting a book and refresh the page
  const handleDelete = async (bookId) => {
    if (!bookId) {
      console.error('Book ID is undefined');
      return;
    }

    try {
      await axios.delete(`http://localhost:5003/api/files/${bookId}`);
      // Update state instead of reloading
      setBooks(books.filter(book => (book._id || book.bookId || book.id) !== bookId));
           // Update book count after deletion
      if (onBookCount) {
        onBookCount(updatedBooks.length);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book. Please try again.');
    }
  };

  // Truncate long text
  const truncate = (text, maxLength = 50) => {
    return text && text.length > maxLength 
      ? `${text.substring(0, maxLength)}...` 
      : text;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header with Add Book Button */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Book Library
          </h2>
          <button 
            onClick={handleAddBook}
            className="flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus size={20} />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Books Table */}
        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book._id || book.bookId || book.id} className="hover:bg-gray-50 transition-colors duration-200">
                      {/* Cover Image */}
                      <td className="px-6 py-4">
                        <div className="flex-shrink-0">
                          <img
                            className="h-16 w-12 object-cover rounded-md shadow-md"
                            src={book.coverImage?.url || '/path/to/default-image.jpg'}
                            alt={`${book.title} cover`}
                          />
                        </div>
                      </td>
                      
                      
                      {/* Title */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {truncate(book.title, 30)}
                        </div>
                      </td>
                      
                      {/* Author */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {truncate(book.author, 25)}
                        </div>
                      </td>
                      
                      {/* Description */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {truncate(book.description, 50)}
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-colors"
                            title="View Details"
                          >
                            <Eye size={20} />
                          </button>
                          <button 
                            className="text-green-500 hover:text-green-700 hover:bg-green-50 p-2 rounded-full transition-colors"
                            title="Edit Book"
                          >
                            <Edit size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(book._id || book.bookId || book.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Delete Book"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No books found in your library.
                      <button 
                        onClick={handleAddBook}
                        className="ml-2 text-indigo-600 hover:underline"
                      >
                        Add your first book
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="bg-gray-50 border-t px-6 py-4 flex justify-end items-center">
  <p className="text-gray-600 text-sm">
    Total Books: <span className="font-semibold text-gray-900">{books.length}</span>
  </p>
</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookFilePage;