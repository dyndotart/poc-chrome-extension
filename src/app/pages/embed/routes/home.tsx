import React from 'react';
import { scrapListingDataFromDOM } from '../core';

const Home: React.FC = () => {
  React.useEffect(() => {
    scrapListingDataFromDOM();
  });
  return (
    <div>
      <p className="text-3xl text-green-500">Options</p>
      <ul>
        <li>
          <a href="#/about">About</a>
        </li>
      </ul>
    </div>
  );
};

export default Home;
