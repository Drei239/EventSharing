import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import LoginRegisterPage from './pages/login-register/LoginRegisterPage';
import CreateEventPage from './pages/create-event/CreateEventPage';
import { Home, Events, Setting } from './pages';
import { useSelector } from 'react-redux';
import { NextUIProvider } from '@nextui-org/react';

function App() {
  const open = useSelector((state) => state.user.open);
  return (
    <div className={open && 'hidden-scroll'}>
      <NextUIProvider>
        <Header />
        <Routes>
          <Route path='/login-register' element={<LoginRegisterPage />} />
          <Route path='/create-event' element={<CreateEventPage />} />
          <Route path='/' element={<Home />} />
          <Route path='/events' element={<Events />} />
          <Route path='/account/*' element={<Setting />} />
        </Routes>
        <Footer />
      </NextUIProvider>
    </div>
  );
}

export default App;
