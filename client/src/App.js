import { Route, Routes } from 'react-router-dom';
import './App.css';
import LoginRegisterPage from './pages/login-register/LoginRegisterPage';
import { NextUIProvider } from '@nextui-org/react';
import Header from './components/header/Header.jsx';
import Footer from './components/footer/Footer';
import CreateEventPage from './pages/create-event/CreateEventPage';

function App() {
  return (
    <NextUIProvider>
      {window.location.pathname === '/login-register' ? null : <Header />}
      <Routes>
        <Route path="/login-register" element={<LoginRegisterPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
      </Routes>
      {window.location.pathname === '/login-register' ? null : <Footer />}
    </NextUIProvider>
  );
}

export default App;
