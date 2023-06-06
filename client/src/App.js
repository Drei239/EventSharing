import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/footer/Footer';
import Header from './components/header/Header.jsx';
import EventDetails from './pages/event-details/EventDetails';
import LoginRegisterPage from './pages/login-register/LoginRegisterPage';
import { NextUIProvider } from '@nextui-org/react';

function App() {
  return (  
    <div className='App'>
      <Header />  
      <EventDetails />
      <NextUIProvider>      
        <Routes>
          <Route path="/login-register" element={<LoginRegisterPage />} />
        </Routes>     
      </NextUIProvider>  
      <Footer />  
    </div>     
  );
}

export default App;
