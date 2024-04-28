import { Card } from "@/components/ui/card";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to My Website</h1>
      <p className="text-lg text-gray-500 mb-8">
        This is the description of my awesome website.
      </p>
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-2">Card Title</h2>
        <p className="text-gray-500">This is the content of the card.</p>
      </Card>
    </div>
  );
};

export default Home;
