import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from './Hooks/UseRoutes';

function App() {
    return <BrowserRouter>{useRoutes()}</BrowserRouter>;
}

export default App;
