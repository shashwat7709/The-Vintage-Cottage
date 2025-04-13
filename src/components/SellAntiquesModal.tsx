import React from 'react';

interface SellAntiquesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellAntiquesModal: React.FC<SellAntiquesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#FAF6F1] p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#46392d] hover:text-[#46392d]/70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-serif text-[#46392d] mb-6">Sell Your Antiques</h2>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-[#46392d] font-medium mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="itemTitle" className="block text-[#46392d] font-medium mb-2">Item Title</label>
            <input
              type="text"
              id="itemTitle"
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter the title of your antique item"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-[#46392d] font-medium mb-2">Description</label>
            <textarea
              id="description"
              rows={4}
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Describe your item's history, condition, and unique features"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="address" className="block text-[#46392d] font-medium mb-2">Address</label>
            <textarea
              id="address"
              rows={3}
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter your complete address"
              required
            ></textarea>
            <p className="text-sm text-[#46392d]/60 mt-1">This address will be used for item pickup/inspection if needed</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-[#46392d] font-medium mb-2">Contact Phone Number</label>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50">
                <option value="+1">+91 India</option>
              </select>
              <input
                type="tel"
                id="phone"
                className="flex-1 px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <p className="text-sm text-[#46392d]/60 mt-1">Please enter a valid phone number without spaces or special characters</p>
          </div>

          <div>
            <label htmlFor="price" className="block text-[#46392d] font-medium mb-2">Asking Price ($)</label>
            <input
              type="number"
              id="price"
              className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
              placeholder="Enter your asking price"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#46392d] text-[#F5F1EA] py-3 rounded-md hover:bg-[#46392d]/90 transition-colors duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellAntiquesModal; 