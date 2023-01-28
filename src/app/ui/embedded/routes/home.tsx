import React from 'react';
import { search } from '../core';

const Home: React.FC = () => {
  React.useEffect(() => {
    console.log('Active URL', location.href);
    search.scrapSearchedListingsDataFromDOM();
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
