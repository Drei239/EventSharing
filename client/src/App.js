import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/footer/Footer';
import EventDetails from './pages/event-details/EventDetails';
import Header from './components/header/Header';
import LoginRegisterPage from './pages/login-register/LoginRegisterPage';
import CreateEventPage from './pages/create-event/CreateEventPage';
import { NextUIProvider } from '@nextui-org/react';
import { Home, Events } from './pages';
function App() {
  return (
    <NextUIProvider>
      <Header />
      <EventDetails />
      <Routes>
        <Route path="/login-register" element={<LoginRegisterPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
      </Routes>
      <Footer />
    </NextUIProvider>
  );
}

export default App;
