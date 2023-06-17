import React, { useState } from "react";
import "./management.css";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { Input, Button, Modal, Text } from "@nextui-org/react";
const validateSchema = object().shape({
  currentPassword: string().required("Password is required"),
  newPassword: string().required("New Password is required"),
  confirmPassword: string()
    .required("ConfirmPassword is required")
    .test("password-match", "Password do not match", function (value) {
      return value === this.resolve(ref("newPassword"));
    }),
});
const Management = () => {
  const formik = useFormik({
    initialValues: {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  return (
    <motion.div layout className="management">
      <h2 className="management-title">Account management</h2>
      <div>
        <h3>Change your password</h3>
        <p className="management-info">
          When you change your password, you will be automatically signed out
          from your other sessions
        </p>
        <Button
          className="btn-show-changePass"
          bordered
          onClick={() => setOpenChangePassword(!openChangePassword)}
        >
          Change password
        </Button>
        {openChangePassword && (
          <motion.div
            key={openChangePassword}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 300, opacity: 1 }}
            exit={{ height: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={formik.handleSubmit}>
              <div className="password-input-items">
                <Input.Password labelPlaceholder="Current Password" />
                <Input.Password labelPlaceholder="New Password" />
                <Input.Password labelPlaceholder="Current Password" />
              </div>
              <Button>Submit</Button>
            </form>
          </motion.div>
        )}
      </div>
      <motion.div layout>
        <h3>Deactivate your account</h3>
        <p className="management-info">
          If your decide to use Meetup again, you'll need to created a new
          account
        </p>
        <Button
          onClick={() => setOpenDeleteAccount(true)}
          bordered
          className="btn-show-deleteAcc"
        >
          Deactivate account
        </Button>
      </motion.div>
      <Modal
        closeButton
        aria-aria-labelledby="modal-title"
        open={openDeleteAccount}
        onClose={() => setOpenDeleteAccount(false)}
        width={500}
      >
        <div className="deactivate-content">
          <h4 className="deactivate-title">Deactive your account</h4>
          <p className="deactivate-info1">Are your sure you want to do this?</p>
          <p className="deactivate-info2">
            If you decide to use Meetup again, you'll need to create a new
            account.
          </p>
          <div className="deactivate-password">
            <div className="deactive-password-info">
              <span>Password</span>
              <button>Forgot password?</button>
            </div>
            <Input.Password bordered width={"100%"} />
            <Button className="btn-submit-deactivate">Submit</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Management;
