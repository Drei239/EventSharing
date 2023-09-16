import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import QrReader from 'modern-react-qr-reader';
import customFetch from "../../utils/axios.config";
import notify from "../../utils/notify.js";
import { Modal } from "@nextui-org/react";
import "./QRCode.css";

const QRCode = () => {
  const navigate = useNavigate(-1);
  const [searchParams] = useSearchParams();
  const [qrCode, setQrCode] = useState();
  const [order, setOrder] = useState();
  const [startScan, setStartScan] = useState(true);
  const [visible, setVisible] = useState(false);

  const closeHandler = () => {
    setVisible(false);
    setStartScan(true);
  };

  useEffect(() => {
    if (qrCode) {
      customFetch
        .get(`/orders/${qrCode}/${searchParams.get("id")}/checkQrcode`)
        .then((resp) => setOrder(resp.data))
        .catch((err) => {
          notify(`${err.response.data}`, "error");
        });
    }
  }, [qrCode]);

  useEffect(() => {
    if (order) {
      setVisible(true);
      setStartScan(false);
    }
  }, [order]);

  const handleScan = async (scanData) => {
    console.log(scanData);
    if (scanData) {
      setQrCode((prev) => {
        if (prev === scanData) {
          notify("QR code đã được quét", "error");
        }
        return scanData;
      });
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <section className="qrcode">
      <p onClick={() => navigate(-1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-chevron-left"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ verticalAlign: "top", color: "var(--color-primary2)" }}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M15 6l-6 6l6 6"></path>
        </svg>{" "}
        Quay lại
      </p>
      <section className="qrcode__scan">
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Quét QR code
        </h3>
        {/* {startScan && (
          <QrReader
            facingMode={'environment'}
            delay={300}
            onError={handleError}
            onScan={handleScan}
          />
        )} */}
      </section>

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
        width="40%"
        css={{ padding: "30px" }}
      >
        <h3>Thông tin vé</h3>
        <section className="qrcode__info">
          <p>Mã:</p>
          <p>#{order?._id}</p>
        </section>
        <section className="qrcode__info">
          <p>Tên sự kiện:</p>
          <p>{order?.event.title}</p>
        </section>
        <section className="qrcode__info">
          <p>Khách hàng:</p>
          <p>{order?.user.name}</p>
        </section>
        <section className="qrcode__info">
          <p>Email:</p>
          <p>{order?.user.email}</p>
        </section>
      </Modal>
    </section>
  );
};

export default QRCode;
