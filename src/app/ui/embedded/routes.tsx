import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';

// Routes
import Home from './routes/home';

const Routes: React.FC = () => {
  return (
    <div>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
      </RouterRoutes>
    </div>
  );
};

export default Routes;
