import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import './login-register.css';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [displayForm, setDisplayForm] = useState(true);
  const [inputValue, setInputValue] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const notifyError = () => {
    toast.error('Email và mật khẩu không trùng khớp', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const notifySuccess = () => {
    toast.success('Đăng nhặp thành công', {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const changeForm = () => {
    setDisplayForm(false);
  };

  const handleOnchange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!(inputValue.email && inputValue.password)) {
      notifyError();
    } else {
      notifySuccess();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <>
      {displayForm ? (
        <div className="login">
          <h2>Xin chào</h2>
          <p>Mời bạn nhập thông tin mà bạn đã đang ký.</p>
          <form className="login__form" onSubmit={handleLogin}>
            <Input
              name="email"
              label="Email"
              value={inputValue.name}
              onChange={handleOnchange}
            />
            <br />
            <Input.Password
              name="password"
              label="Mật khẩu"
              value={inputValue.password}
              onChange={handleOnchange}
            />
            <Button type="submit">Đăng nhập</Button>
          </form>
          <p>
            Bạn chưa có tài khoản? <span onClick={changeForm}>đăng ký</span> tài
            khoản mới
          </p>
        </div>
      ) : (
        <Register />
      )}
      <ToastContainer />
    </>
  );
};

export default Login;
