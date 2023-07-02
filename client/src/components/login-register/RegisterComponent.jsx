import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Input } from '@nextui-org/react';
import {
  useValidateAuthPassword,
  useValidateRegex,
} from '../../hooks/validateHooks';
import { emailRegex, passwordRegex, nameRegex } from '../../constants/regex';
import Login from './LoginComponent';
import customFetch from '../../utils/axios.config';
import notify from '../../utils/notify';
import './LoginRegisterComponent.css';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const Register = ({ changeLoginContent }) => {
  const [displayForm, setDisplayForm] = useState(true);
  const [inputValue, setInputValue] = useState({});

  const changeForm = () => {
    setDisplayForm(false);
  };

  const nameHelper = useValidateRegex(
    inputValue.name,
    nameRegex,
    'Có ít nhất 6 ký tự không chứa số và ký tự đặc biệt'
  );

  const emailHelper = useValidateRegex(
    inputValue.email,
    emailRegex,
    'Email không đúng định dạng'
  );

  const passwordHelper = useValidateRegex(
    inputValue.password,
    passwordRegex,
    'Mật khẩu có ít nhất 6 ký tự bao gồm chữ và số'
  );

  const authPasswordHelper = useValidateAuthPassword(
    inputValue.password,
    inputValue.authPass,
    'Mật khẩu không trùng khớp'
  );

  const handleOnchange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (
      nameHelper.isValid &&
      emailHelper.isValid &&
      passwordHelper.isValid &&
      authPasswordHelper.isValid
    ) {
      customFetch({
        method: 'post',
        url: '/users/register',
        data: JSON.stringify({
          name: inputValue.name,
          email: inputValue.email,
          password: inputValue.authPass,
        }),
      })
        .then((res) => {
          if (res.data.success) {
            notify('Tạo tài khoản thành công', 'success');
          }
        })
        .catch((err) => {
          notify('Tạo tài khoản thất bại', 'error');
        });
      if (document.body.clientWidth > 768) {
        setTimeout(() => {
          changeLoginContent();
        }, 2000);
      } else {
        setTimeout(() => {
          setDisplayForm(false);
        }, 2000);
      }
    } else {
      notify('Tạo tài khoản thất bại', 'error');
    }
  };

  return (
    <>
      <Link className='register__logo' to='/'>
        <img src={'../images/logo.png'} alt='logo' />
      </Link>
      {displayForm ? (
        <div className='login'>
          <h2>Tạo tài khoản mới</h2>
          <p>Các thông tin bên dưới bắt buộc nhập đầy đủ.</p>
          <form className='login__form' onSubmit={handleRegister}>
            <Input
              label='Họ tên'
              name='name'
              value={inputValue.name}
              status={nameHelper.color}
              color={nameHelper.color}
              helperText={nameHelper.text}
              helperColor={nameHelper.color}
              onChange={handleOnchange}
            />
            <Input
              name='email'
              label='Email'
              value={inputValue.email}
              status={emailHelper.color}
              color={emailHelper.color}
              helperText={emailHelper.text}
              helperColor={emailHelper.color}
              onChange={handleOnchange}
            />
            <br />
            <Input.Password
              name='password'
              label='Mật khẩu'
              value={inputValue.password}
              status={passwordHelper.color}
              color={passwordHelper.color}
              helperText={passwordHelper.text}
              helperColor={passwordHelper.color}
              onChange={handleOnchange}
            />
            <Input.Password
              label='Nhập lại mật khẩu'
              name='authPass'
              value={inputValue.authPass}
              status={authPasswordHelper.color}
              color={authPasswordHelper.color}
              helperText={authPasswordHelper.text}
              helperColor={authPasswordHelper.color}
              onChange={handleOnchange}
            />
            <Button type='submit'>Đăng ký</Button>
          </form>
          <p>
            Bạn đã có tài khoản, <span onClick={changeForm}>đăng nhập</span>{' '}
            ngay
          </p>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Register;
