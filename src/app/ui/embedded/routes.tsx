import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import FloatLayout from './components/FloatLayout';

// Routes
import Home from './routes/home';

const Routes: React.FC = () => {
  return (
    <FloatLayout>
      <RouterRoutes>
        <Route path="/" element={<Home />} />
      </RouterRoutes>
    </FloatLayout>
  );
};

export default Routes;
