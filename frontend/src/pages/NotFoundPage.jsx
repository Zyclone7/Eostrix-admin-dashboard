import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation on component mount
    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 100);

    return () => clearTimeout(animationTimer);
  }, []);

  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className={`
        transform transition-all duration-700 ease-in-out
        ${animate ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        bg-white shadow-2xl rounded-2xl p-8 text-center
        max-w-md w-full
      `}>
        <div className="relative mb-6">
          {/* Animated Error Illustration */}
          <div className={`
            absolute -top-20 left-1/2 -translate-x-1/2
            transform transition-all duration-1000
            ${animate ? 'rotate-12 scale-110' : 'rotate-0 scale-75'}
          `}>
            <AlertTriangle 
              size={120} 
              className="text-red-500 animate-pulse"
            />
          </div>

          {/* 404 Text */}
          <h1 className={`
            text-6xl font-bold text-gray-800 mt-16
            transition-all duration-1000 
            ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}>
            404
          </h1>

          <p className={`
            text-xl text-gray-600 mt-4
            transition-all duration-1000 delay-300
            ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}>
            Oops! Page Not Found
          </p>

          <p className={`
            text-sm text-gray-500 mt-2
            transition-all duration-1000 delay-500
            ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}>
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>
        </div>

        {/* Dashboard Navigation Button */}
        <button 
          onClick={handleGoToDashboard}
          className={`
            mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg
            hover:bg-blue-600 transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-400
            transform hover:scale-105
            transition-all duration-1000 delay-700
            ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;