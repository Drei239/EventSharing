import io from "socket.io-client";

const socketMiddleware = (url) => {
  const socket = io(url);

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

    socket.on("new_order", (response) => {
      store.dispatch({ type: "receive_notify", payload: response });
    });
    socket.on("new_comment", (response) => {
      store.dispatch({ type: "receive_notify", payload: response });
    });
    socket.on("send_comment_all", (response) => {
      store.dispatch({ type: "receive_comment", payload: response });
    });
  };
};

export default socketMiddleware;
