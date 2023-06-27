import "./App.css";
import Footer from "./components/footer/Footer";
import EventDetails from "./pages/event-details/EventDetails";
import Header from "./components/header/Header";
import LoginRegisterPage from "./pages/login-register/LoginRegisterPage";
import EventCreateUpdate from "./pages/create-event-update/EventCreateUpdate";
import { Home, Events, Setting, EventManagement, MyEvent } from "./pages";
import { RULES } from "./constants/rules";
import eventService from "./features/events/eventService";
import { Route, Routes } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { NotLoggedInOnly, LoggedInOnly } from "./components";
function App() {
  const open = useSelector((state) => state.user.open);
  const openSendEmail = useSelector((state) => state.order.open);
  return (
    <div className={open || openSendEmail ? "hidden-scroll" : ""}>
      <NextUIProvider>
        <Header />
        <ToastContainer limit={3} />
        <Routes>
          <Route path="/event-create-update" element={<EventCreateUpdate />} />
          <Route
            path="/login-register"
            element={
              <NotLoggedInOnly>
                <LoginRegisterPage />
              </NotLoggedInOnly>
            }
          />
          {/* <Route
            path="/create-event"
            element={
              <LoggedInOnly>
                <CreateEventPage />
              </LoggedInOnly>
            }
          /> */}
          <Route path="/management-event" element={<EventManagement />} />
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route
            path="/account/*"
            element={
              <LoggedInOnly>
                <Setting />
              </LoggedInOnly>
            }
          />
          <Route path="/my-events/:id" element={<MyEvent />} />
          <Route
            path="/event/:id"
            element={<EventDetails eventService={eventService} rules={RULES} />}
          />
        </Routes>
        <Footer />
      </NextUIProvider>
    </div>
  );
}

export default App;
