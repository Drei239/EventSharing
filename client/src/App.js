import "./App.css";
import Footer from "./components/footer/Footer";
import EventDetails from "./pages/event-details/EventDetails";
import Header from "./components/header/Header";
import LoginRegisterPage from "./pages/login-register/LoginRegisterPage";
import EventCreateUpdate from "./pages/create-event-update/EventCreateUpdate";
import {
  Home,
  Events,
  Setting,
  EventManagement,
  MyEvent,
  Organizers,
  ForgotPassword,
  ResetPassword,
  EventPurchased,
} from "./pages";
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
          <Route
            path="/event-create-update"
            element={
              <LoggedInOnly>
                <EventCreateUpdate />
              </LoggedInOnly>
            }
          />
          <Route path="/login-register" element={<LoginRegisterPage />} />
          {/* <Route
            path="/create-event"
            element={
              <LoggedInOnly>
                <CreateEventPage />
              </LoggedInOnly>
            }
          /> */}
          <Route
            path="/management-event"
            element={
              <LoggedInOnly>
                <EventManagement />
              </LoggedInOnly>
            }
          />
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
          <Route
            path="/my-event/:id"
            element={
              <LoggedInOnly>
                <MyEvent />
              </LoggedInOnly>
            }
          />

          <Route
            path="/event/:id"
            element={<EventDetails eventService={eventService} rules={RULES} />}
          />
          <Route path="/organizers/:id" element={<Organizers />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/newPass/:userId/:token" element={<ResetPassword />} />
          <Route path="/event-purchased" element={<EventPurchased />} />
          <Route path="/*" element={<Home />} />
        </Routes>
        <Footer />
      </NextUIProvider>
    </div>
  );
}

export default App;
