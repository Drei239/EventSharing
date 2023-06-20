import './App.css';
import Footer from './components/footer/Footer';
import EventDetails from './pages/event-details/EventDetails';
import Header from './components/header/Header';
import LoginRegisterPage from './pages/login-register/LoginRegisterPage';
import CreateEventPage from './pages/create-event/CreateEventPage';
import { Home, Events, Setting } from './pages';
import { RULES } from './constants/rules';
import eventService from './features/events/eventService';
import { Route, Routes } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
function App() {
  const open = useSelector((state) => state.user.open);
  return (
    <div className={open ? "hidden-scroll" : ""}>
      <NextUIProvider>
        <Header />
        <ToastContainer limit={3} />
        <Routes>
          <Route path="/login-register" element={<LoginRegisterPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path='/event/:id' element={<EventDetails eventService={eventService} rules={RULES} />} />
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/account/*" element={<Setting />} />
        </Routes>
        <Footer />
      </NextUIProvider>
    </div>
  );
}

export default App;


