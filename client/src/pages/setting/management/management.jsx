import React, { useEffect, useState } from "react";
import "./management.css";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Input, Button, Modal, Text } from "@nextui-org/react";
import { updateInfo, deleteUser } from "../../../features/user/userSlice";
import notify from "../../../utils/notify";
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
  const dispatch = useDispatch();
  const { isLoading, userInfo, message, isSuccess, isSuccess2, isError } =
    useSelector((state) => state.user);
  const formik = useFormik({
    initialValues: {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      dispatch(
        updateInfo({
          data: {
            oldPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
          id: userInfo._id,
        })
      );
    },
  });
  const formik2 = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: object().shape({
      password: string().required("password is required"),
    }),
    onSubmit: async (values) => [
      dispatch(
        deleteUser({ id: userInfo._id, data: { password: values.password } })
      ),
    ],
  });
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  useEffect(() => {
    if (message && requestError) {
      notify(message, "error");
    }
    setRequestError(true);
  }, [message]);
  const handlePasswordChange = (e) => {
    formik2.setFieldValue("password", e.target.value);
    setRequestError(false);
  };
  useEffect(() => {
    if (isSuccess && requestSuccess) {
      notify("Thay đổi mật khẩu thành công", "success");
    }
    setRequestSuccess(true);
  }, [isSuccess]);
  useEffect(() => {
    setRequestError(isError);
  }, [isError]);
  useEffect(() => {
    if (isSuccess2) {
      notify("Xoá tài khoản thành công", "success");
      setOpenDeleteAccount(false);
    }
  }, [isSuccess2]);
  return (
    <motion.div layout className="management">
      <h2 className="management-title">Quản lý tài khoản</h2>
      <div>
        <h3>Thay đổi mật khẩu</h3>
        <p className="management-info">
          Khi bạn thay đổi mật khẩu, bạn sẽ tự động đăng xuất từ các phiên khác
          của bạn
        </p>
        <Button
          className="btn-show-changePass"
          bordered
          onClick={() => setOpenChangePassword(!openChangePassword)}
        >
          Thay đổi mật khẩu
        </Button>
        {openChangePassword && (
          <motion.div
            key={openChangePassword}
            // initial={{ height: 0, opacity: 0 }}
            // animate={{ height: 400, opacity: 1 }}
            // exit={{ height: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={formik.handleSubmit}>
              <div className="password-input-items">
                <div className="password-input-item">
                  <label htmlFor="current-password">Mật khẩu hiện tại</label>
                  <Input.Password
                    id="current-password"
                    value={formik.values.currentPassword}
                    name="currentPassword"
                    onChange={formik.handleChange}
                    // labelPlaceholder="Current Password"
                    width={400}
                  />
                  <span className="password-err-text">
                    {formik.errors.currentPassword &&
                      formik.errors.currentPassword}
                  </span>
                </div>
                <div className="password-input-item">
                  <label>Mật khẩu mới</label>
                  <Input.Password
                    value={formik.values.newPassword}
                    name="newPassword"
                    onChange={formik.handleChange}
                    // labelPlaceholder="New Password"
                    width={400}
                  />
                  <span className="password-err-text">
                    {formik.errors.newPassword && formik.errors.newPassword}
                  </span>
                </div>
                <div className="password-input-item">
                  <label>Xác nhận mật khẩu</label>
                  <Input.Password
                    value={formik.values.confirmPassword}
                    s
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    // labelPlaceholder="Confirm Password"
                    width={400}
                  />
                  <span className="password-err-text">
                    {formik.errors.confirmPassword &&
                      formik.errors.confirmPassword}
                  </span>
                </div>
              </div>
              <Button type="submit">Lưu</Button>
            </form>
          </motion.div>
        )}
      </div>
      <motion.div layout className="mangement-deactivate">
        <h3>Khóa tài khoản của bạn</h3>
        <p className="management-info">
          Nếu quyết định sử dụng lại Meetup, bạn sẽ cần tạo một tài khoản mới
          tài khoản
        </p>
        <Button
          onClick={() => setOpenDeleteAccount(true)}
          bordered
          className="btn-show-deleteAcc"
        >
          Hủy kích hoạt tài khoản
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
          <h4 className="deactivate-title">Hủy kích hoạt tài khoản của bạn</h4>
          <p className="deactivate-info1">
            Bạn có chắc chắn muốn làm điều này?
          </p>
          <p className="deactivate-info2">
            Nếu quyết định sử dụng lại Meetup, bạn sẽ cần tạo một tài khoản mới
            tài khoản.
          </p>
          <div className="deactivate-password">
            <div className="deactive-password-info">
              <span>Mật Khẩu</span>
              <button>Quên mật khẩu?</button>
            </div>
            <form onSubmit={formik2.handleSubmit}>
              <div className="password-input-item">
                <Input.Password
                  bordered
                  width={"100%"}
                  // autoComplete="password"
                  value={formik2.values.password}
                  name="password"
                  onChange={handlePasswordChange}
                  color={
                    formik2.errors.password || isError ? "error" : "default"
                  }
                  // style={{
                  //   boder: `1px solid ${
                  //     formik2.errors.password || isError ? "red" : "gray"
                  //   } `,
                  // }}
                />
                <span className="password-err-text">
                  {formik2.errors.password
                    ? formik2.errors.password
                    : requestError && message}
                </span>
              </div>
              <Button className="btn-submit-deactivate" type="submit">
                Xoá
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Management;
