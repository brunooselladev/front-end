import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { appRoutes } from './routes/appRoutes';

function App() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
