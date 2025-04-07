import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessageType('success');
        setMessage('Thank you for subscribing to our Heritage Circle!');
        setEmail('');
        setIsSubscribed(true);
      } else {
        setMessageType('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center py-12 px-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <h2 className="text-3xl font-serif mb-4 text-green-800">Welcome to Our Heritage Circle!</h2>
          <p className="text-green-700 mb-4">
            Thank you for subscribing to our newsletter. We're excited to have you join our community!
          </p>
          <p className="text-green-600 text-sm">
            Please check your email for a verification link to complete your subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto text-center py-12 px-4">
      <h2 className="text-3xl font-serif mb-4">Join Our Heritage Circle</h2>
      <p className="text-muted-foreground mb-8">
        Subscribe to receive updates about new arrivals, exclusive invitations to cultural events,
        and insights into Indian heritage
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          variant="default"
          disabled={isLoading}
          className="bg-[#4A3E3E] hover:bg-[#3A2E2E] text-white"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe Now'}
        </Button>
      </form>
      
      {message && !isSubscribed && (
        <p className={`mt-4 ${messageType === 'success' ? 'text-green-600' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      
      <p className="text-sm text-muted-foreground mt-4">
        By subscribing, you agree to receive our newsletter. Your privacy is important to us.
      </p>
    </div>
  );
};

export default NewsletterSubscription; 