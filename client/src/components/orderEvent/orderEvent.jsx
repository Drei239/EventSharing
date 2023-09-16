import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Text, useModal } from "@nextui-org/react";
import { newCreateOrder } from "../../features/order/orderSlice";

import { useDispatch, useSelector } from "react-redux";
import { newConnetion } from "../../features/action";

const OrderEvent = () => {
  const navigate = useNavigate();
  const { setVisible, bindings } = useModal();
  const dispatch = useDispatch();
  const eventDetail = useSelector((state) => state?.event?.getEventById);
  const { isLogin, userInfo } = useSelector((state) => state.user);

  const handler = () => {
    if (isLogin) {
      setVisible(true);
    } else {
      navigate("/login-register");
    }
  };

  const handleBuyTicket = () => {
    dispatch(newCreateOrder({ eventId: eventDetail?._id, userInfo }));
    setVisible(false);
  };

  useEffect(() => {
    if (isLogin) {
      dispatch(newConnetion(userInfo?._id));
    }
  }, [isLogin]);
  return (
    <div>
      <Button
        size="lg"
        className="btn__buy"
        color="primary"
        bordered="false"
        onPress={handler}
      >
        Mua vé
      </Button>
      <Modal {...bindings} closeButton aria-labelledby="modal-title">
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Xác nhận mua vé
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Button auto flat color="primary" onClick={handleBuyTicket}>
            Mua vé
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OrderEvent;
