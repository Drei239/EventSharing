import io from "socket.io-client";

const socketMiddleware = (url) => {
  const socket = io(url);
  const dispatchedEvents = {};
  return (store) => (next) => (action) => {
    if (typeof action === "function") {
      return action(store.dispatch, store.getState);
    }

    const { event, data, emit, ...rest } = action;

    if (!event) {
      return next(action);
    }

    if (emit) {
      socket.emit(event, data);
    }
    const dispatchAndMarkEvent = (eventType, response) => {
      if (!dispatchedEvents[eventType]) {
        dispatchedEvents[eventType] = true;
        store.dispatch({ type: eventType, payload: response });
      }
    };
    socket.on("new_order", (response) => {
      dispatchAndMarkEvent("receive_notify", response);
    });
    socket.on("new_comment", (response) => {
      dispatchAndMarkEvent("receive_notify", response);
    });
    socket.on("send_comment_all", (response) => {
      store.dispatch({ type: "receive_comment", payload: response });
    });
    socket.on("reply_comment", (response) => {
      dispatchAndMarkEvent("receive_notify", response);
    });
    socket.on("reply_comment_show_all", (response) => {
      dispatchAndMarkEvent("receive_comment_reply", response);
    });
  };
};

export default socketMiddleware;
