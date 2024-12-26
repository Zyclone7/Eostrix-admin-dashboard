import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import EditUser from './pages/EditUser'; // Import the EditUser component
import Table from './pages/Table';
import CreateUsers from './pages/CreateUsers';
import NotFoundPage from './pages/NotFoundPage';
import Booksfile from './pages/Booksfile';
import BookUpload from './pages/BookUpload';

function App() {
  return (
    <>
      <Router>
        
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit/:id" element={<EditUser />} /> {/* Add the EditUser route */}
            <Route path="/table" element={<Table/>} />
            <Route path="/bookfile" element={<Booksfile/>}/>
            <Route path="/createusers" element={<CreateUsers/>} />
            <Route path="/bookupload" element={<BookUpload/>} />
            <Route path='*' element={<NotFoundPage/>} />

          </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
