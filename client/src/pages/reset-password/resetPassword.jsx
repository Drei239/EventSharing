import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Loading, Input } from "@nextui-org/react";
import { IoIosArrowBack } from "react-icons/io";
import notify from "../../utils/notify";
import "./resetPassword.css";
import { resetPassword } from "../../features/user/userSlice";

const validateSchema = object().shape({
  newPassword: string()
    .min(8, "Mật khẩu của bạn phải có ít nhất 8 kí tự")
    .required("Mật khẩu mới là bắt buộc"),
  confirmPassword: string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .test("password-match", "Password do not match", function (value) {
      return value === this.resolve(ref("newPassword"));
    }),
});
const ResetPassword = () => {
  const { userId, token } = useParams();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError } = useSelector((state) => state.user);
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      await dispatch(
        resetPassword({ userId, token, newPassword: values.newPassword })
      );
    },
  });
  const handleChangeNewPassword = (e) => {
    formik.setFieldValue("newPassword", e.target.value);
  };
  const handleChangeConfirmPassword = (e) => {
    formik.setFieldValue("confirmPassword", e.target.value);
  };
  useEffect(() => {
    if (isSuccess) {
      notify("Cập nhật mật khẩu thành công", "success");
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      notify("Cập nhật mật khẩu thất bại", "error");
    }
  }, [isError]);
  return (
    <>
      <div className="reset-password">
        <div className="reset-password-content">
          <h2>Mật khẩu mới</h2>
          <p>
            Vui lòng tạo một mật khẩu mới không trùng với mật khẩu cũ của bạn.
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div style={{ position: "relative", marginTop: "30px" }}>
              <Input.Password
                type="password"
                width="100%"
                height="100%"
                placeholder="Mật khẩu mới"
                name="newPassword"
                value={formik.values.newPassword}
                onChange={handleChangeNewPassword}
                status={formik.errors.newPassword ? "error" : "primary"}
              />
              <span className="reset-password-input-message">
                {formik.errors.newPassword && formik.errors.newPassword}
              </span>
            </div>
            <div style={{ position: "relative", marginTop: "30px" }}>
              <Input.Password
                width="100%"
                type="password"
                placeholder="Xác nhận mật khẩu"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={handleChangeConfirmPassword}
                status={formik.errors.confirmPassword ? "error" : "primary"}
              />
              <span className="reset-password-input-message">
                {formik.errors.confirmPassword && formik.errors.confirmPassword}
              </span>
            </div>
            <button type="submit">Thay đổi</button>
          </form>
        </div>
        <Link to="/" className="reset-password-link-back">
          <IoIosArrowBack style={{ fontSize: "30px" }} />
          <span>Back to home</span>
        </Link>
      </div>
      {isLoading && (
        <div className="forgot-password-loading">
          <Loading size="md" />
        </div>
      )}
    </>
  );
};

export default ResetPassword;
