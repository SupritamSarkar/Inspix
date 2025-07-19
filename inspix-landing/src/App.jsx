import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './Landing';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Landing />} />

      </Routes>
    </div>
  );
};

export default App;
