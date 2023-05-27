import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginRegisterPage from './pages/login-register/LoginRegisterPage';
import { NextUIProvider } from '@nextui-org/react';

function App() {
  return (
    <NextUIProvider>
      <Routes>
        <Route path="/login-register" element={<LoginRegisterPage />} />
      </Routes>
    </NextUIProvider>
  );
}

export default App;
