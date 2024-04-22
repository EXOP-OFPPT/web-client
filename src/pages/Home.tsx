import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to My Website</h1>
            <p className="text-lg text-gray-600 mb-8">This is the description of my awesome website.</p>
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-xl font-bold mb-2">Card Title</h2>
                <p className="text-gray-700">This is the content of the card.</p>
            </div>
        </div>
    );
};

export default Home;
