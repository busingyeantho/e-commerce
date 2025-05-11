import React from 'react';

const ChatPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Chat</h1>
      <p className="text-gray-600 mb-8">Communicate with customers or the store owner.</p>
      
      {/* Chat interface will go here. This is a very basic placeholder. */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="h-96 border border-gray-300 rounded-md p-4 overflow-y-auto mb-4">
          {/* Messages will appear here */}
          <div className="mb-2">
            <p className="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 inline-block">
              Hello! How can I help you today?
            </p>
          </div>
          <div className="mb-2 text-right">
            <p className="bg-indigo-500 text-white rounded-lg py-2 px-4 inline-block">
              Hi, I have a question about a product.
            </p>
          </div>
        </div>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-r-md transition duration-300">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
