import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '@nextui-org/react';
import notify from '../../utils/notify';
import './forgotPassword.css';
import { forgotPassword } from '../../features/user/userSlice';

const validateSchema = object().shape({
  email: string().email('Email không hợp lệ').required('Vui lòng nhập email'),
});
const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError } = useSelector((state) => state.user);
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      await dispatch(forgotPassword(values.email));
    },
  });
  useEffect(() => {
    if (isSuccess) {
      notify(
        'Vui lòng kiểm tra hộp thư của bạn để lấy lại mật khẩu',
        'success'
      );
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError) {
      notify('Đã có lỗi xảy ra vui lòng kiểm tra lại email của bạn', 'error');
    }
  }, [isError]);
  return (
    <>
      <div className='forgot-password'>
        <div className='forgot-password-content'>
          <h2>Quên mật khẩu </h2>
          <p>Nhập email của bạn</p>
          <form onSubmit={formik.handleSubmit}>
            <div style={{ position: 'relative' }}>
              <input
                type='email'
                placeholder='Enter email address'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                className={`${
                  formik.errors.email
                    ? 'forgot-password-input-error'
                    : 'forgot-password-input-success'
                } forgot-password-input`}
              />
              <span className='forgot-password-input-message'>
                {formik.errors.email && formik.errors.email}
              </span>
            </div>
            <button type='submit'>Tiếp tục</button>
          </form>
        </div>
        <a className='reset-password-link-back' onClick={() => navigate(-1)}>
          <IoIosArrowBack style={{ fontSize: '30px' }} />
          <span>Quay lại</span>
        </a>
      </div>
      {isLoading && (
        <div className='forgot-password-loading'>
          <Loading size='md' />
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
