import React, { useEffect, useRef, useState } from "react";
import { Modal } from "@nextui-org/react";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosSend } from "react-icons/io";
import { motion } from "framer-motion";

import notify from "../../../utils/notify";
import {
  closeModalSendEmail,
  sendEmailSelect,
  sendEmailAllOrder,
} from "../../../features/order/orderSlice";
import "./sendEmail.css";
const SendEmail = ({ selected }) => {
  const dispatch = useDispatch();
  const { open, typeSend, orders, isSuccessEmail, isErrorEmail } = useSelector(
    (state) => state.order
  );
  const editorRef = useRef(null);

  const [subjectEmail, setSubjectEmail] = useState("");
  const handleChangeSubject = (e) => {
    setSubjectEmail(e.target.value);
  };
  const log = async () => {
    if (editorRef.current && subjectEmail) {
      const editorContent = editorRef.current.getContent();
      if (typeSend === "all") {
        await dispatch(
          sendEmailAllOrder({
            content: editorContent,
            subject: subjectEmail,
            eventId: orders[0]?.event?._id,
          })
        );
      } else if (typeSend === "select") {
        await dispatch(
          sendEmailSelect({
            content: editorContent,
            subject: subjectEmail,
            ordersId: selected,
          })
        );
      }
      //   console.log(editorRef.current.getContent());
    }
  };
  const closeModal = () => {
    dispatch(closeModalSendEmail());
  };
  useEffect(() => {
    if (isSuccessEmail) {
      dispatch(closeModalSendEmail());
      notify("Gửi mail thành công", "success");
    }
  }, [isSuccessEmail]);
  useEffect(() => {
    if (isErrorEmail) {
      notify("Gửi mail thất bại", "error");
    }
  }, [isErrorEmail]);
  return (
    <>
      {open && (
        <motion.div
          key={open}
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -200, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="send-email"
        >
          <div className="send-email-bg" onClick={closeModal}></div>
          <div className="send-email-modal">
            <div className="send-email-left">
              <div className="send-email-left-dear">
                <span>Đến: </span>
                {typeSend === "all" && <span>Tất cả người mua vé</span>}
              </div>
              <div className="send-email-left-content">
                {typeSend === "select" && (
                  <div className="send-email-left-info">
                    {selected.map((select, index) => {
                      const { name, email } = orders.find(
                        (item) => item._id === select
                      )?.user;
                      return (
                        <div key={index}>
                          <span>{email || ""}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="send-email-right">
              <div className="send-email-right-header">
                <input
                  type="text"
                  placeholder="Tiêu đề email"
                  value={subjectEmail}
                  onChange={handleChangeSubject}
                />
              </div>
              <div className="send-email-right-content">
                <Editor
                  apiKey="g5gefqfa9aseg305uetdofxk90iaoyhlyjrtwsewiaadf6sq"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  // initialValue="<p>This is the initial content of the editor.</p>"
                  init={{
                    height: 350,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
                <button onClick={log} className="send-email-btn-submit">
                  <IoIosSend />
                  <span>Send Email</span>
                </button>
              </div>
            </div>
            <button className="send-email-btn-close" onClick={closeModal}>
              <AiFillCloseCircle />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SendEmail;
