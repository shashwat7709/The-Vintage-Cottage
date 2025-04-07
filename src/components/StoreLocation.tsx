import React from 'react';

const StoreLocation: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif text-[#46392d] mb-6">Visit Our Store</h2>
        <p className="text-lg text-[#46392d]/70 mb-12">
          Step into our world of timeless elegance. We're here to help you discover the
          perfect pieces for your collection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-serif text-[#46392d] mb-4">Location</h3>
            <p className="text-[#46392d]/70 leading-relaxed">
              123 Heritage Lane<br />
              Vintage District, VD 12345
            </p>
          </div>

          <div>
            <h3 className="text-xl font-serif text-[#46392d] mb-4">Hours</h3>
            <div className="text-[#46392d]/70 leading-relaxed">
              <p>Monday - Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: 12:00 PM - 5:00 PM</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-serif text-[#46392d] mb-4">Contact</h3>
            <div className="text-[#46392d]/70 leading-relaxed">
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@vintagecottage.com</p>
            </div>
          </div>
        </div>

        <div className="w-full h-[400px] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2613112523096!2d73.87210057475225!3d18.517345871335283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c142459eb605%3A0x32475ea02c5c5a8a!2sThe%20vintage%20cottage!5e0!3m2!1sen!2sin!4v1710835436044!5m2!1sen!2sin"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreLocation; 