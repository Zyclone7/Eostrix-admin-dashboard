import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
  });
  const [epubFile, setEpubFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'epub') setEpubFile(files[0]);
    if (name === 'coverImage') setCoverImage(files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('author', formData.author);
    uploadData.append('description', formData.description);
    uploadData.append('epub', epubFile);
    uploadData.append('coverImage', coverImage);

    try {
      const result = await axios.post('http://localhost:5003/api/files/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded:', result.data);
      setUploading(false);
      
      navigate('/bookfile');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Upload Book
            </h2>
            <p className="text-gray-500 text-sm">
              Share your digital publication with the world
            </p>
          </div>
          
          <form onSubmit={handleUpload} className="space-y-5">
            {[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'author', label: 'Author', type: 'text' }
            ].map(({ name, label, type }) => (
              <div key={name} className="group">
                <label 
                  htmlFor={name} 
                  className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors"
                >
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
                />
              </div>
            ))}

            <div className="group">
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors"
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>

            {[
              { name: 'epub', label: 'EPUB File' },
              { name: 'coverImage', label: 'Cover Image' }
            ].map(({ name, label }) => (
              <div key={name} className="group">
                <label 
                  htmlFor={name} 
                  className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors"
                >
                  {label}
                </label>
                <input
                  type="file"
                  name={name}
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 transition-all duration-300"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={uploading}
              className={`
                w-full py-3.5 rounded-lg text-white font-bold tracking-wide uppercase 
                transition-all duration-300 ease-in-out transform 
                ${uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}
              `}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;