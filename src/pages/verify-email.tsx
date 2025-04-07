import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully! You will now receive our newsletter updates.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to verify email. Please try subscribing again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Something went wrong. Please try subscribing again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-serif text-[#4A3E3E] mb-4">
          Email Verification
        </h1>

        {status === 'verifying' && (
          <div className="text-[#4A3E3E]">
            <p>Verifying your email address...</p>
            <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3E3E] mx-auto"></div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <p className="text-green-600">{message}</p>
            <a
              href="/"
              className="mt-6 inline-block px-6 py-2 bg-[#4A3E3E] text-white rounded-md hover:bg-[#3A2E2E] transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <p className="text-red-500">{message}</p>
            <a
              href="/"
              className="mt-6 inline-block px-6 py-2 bg-[#4A3E3E] text-white rounded-md hover:bg-[#3A2E2E] transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 