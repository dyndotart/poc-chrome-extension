import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';

// Routes
import Home from './routes/home';
import About from './routes/about';

const Routes: React.FC = () => {
  return (
    <div>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </RouterRoutes>
    </div>
  );
};

export default Routes;
