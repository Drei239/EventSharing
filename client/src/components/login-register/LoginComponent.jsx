import React, { useEffect, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { ToastContainer } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Register from './RegisterComponent';
import { getUserInfo } from '../../features/user/userSlice';
import './LoginRegisterComponent.css';
import 'react-toastify/dist/ReactToastify.css';
import notify from '../../utils/notify';
import customFetch from '../../utils/axios.config';

const Login = () => {
  const dispatch = useDispatch();
  const [displayForm, setDisplayForm] = useState(true);
  const [inputValue, setInputValue] = useState({ email: '', password: '' });
  const [token, setToken] = useState('');
  const [googleInfo, setGoogleInfo] = useState({
    name: '',
    email: '',
    avatar: '',
  });
  const navigate = useNavigate();

  const changeForm = () => {
    setDisplayForm(false);
  };

  const handleOnchange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('click');
    if (inputValue.email && inputValue.password) {
      customFetch({
        method: 'post',
        url: '/users/login',
        data: JSON.stringify({
          email: inputValue.email,
          password: inputValue.password,
        }),
      })
        .then((res) => {
          if (res.data.success) {
            dispatch(getUserInfo());
            notify('Đăng nhập thành công', 'success');
            setTimeout(() => {
              navigate(-1);
            }, 2000);
          }
        })
        .catch((err) => {
          notify('Email và mật khẩu không trùng khớp', 'error');
        });
    } else {
      notify('Email và mật khẩu không trùng khớp', 'error');
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (response) => setToken(response.access_token),
    onError: (error) => console.log('Login failed: ' + error),
  });

  const handleLoginByGoogle = async () => {
    try {
      const registerResponse = await customFetch({
        method: 'post',
        url: '/users/register',
        data: JSON.stringify({
          name: googleInfo.name,
          email: googleInfo.email,
          avatar: googleInfo.avatar,
        }),
      });

      if (registerResponse.data.success) {
        const loginResponse = await customFetch.post(
          '/users/login',
          JSON.stringify({ email: googleInfo.email })
        );
        if (loginResponse.data.success) {
          dispatch(getUserInfo());
          notify('Đăng nhập thành công', 'success');
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        const loginResponse = await customFetch.post(
          '/users/login',
          JSON.stringify({ email: googleInfo.email })
        );
        if (loginResponse.data.success) {
          dispatch(getUserInfo());
          notify('Đăng nhập thành công', 'success');
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      }
    }
  };

  useEffect(() => {
    if (token) {
      axios
        .get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        .then((response) => {
          setGoogleInfo({
            name: response.data.name,
            email: response.data.email,
            avatar: response.data.picture,
          });
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  useEffect(() => {
    if (googleInfo.name && googleInfo.email && googleInfo.avatar) {
      handleLoginByGoogle();
    }
  }, [googleInfo]);

  return (
    <>
      <Link className='login__logo' to='/'>
        <img src={'../images/logo.png'} alt='logo' />
      </Link>
      {displayForm ? (
        <div className='login'>
          <h2>Xin chào</h2>
          <p>Mời bạn nhập thông tin mà bạn đã đăng ký.</p>
          <form className='login__form' onSubmit={handleLogin}>
            <Input
              name='email'
              label='Email'
              value={inputValue.name}
              onChange={handleOnchange}
            />
            <br />
            <Input.Password
              name='password'
              label='Mật khẩu'
              value={inputValue.password}
              onChange={handleOnchange}
            />
            <p
              className='login__forget-password'
              onClick={() => navigate('/forgot-password')}
            >
              Quên mật khẩu?
            </p>
            <Button type='submit'>Đăng nhập</Button>
          </form>
          <hr style={{ marginTop: '25px' }} />
          <p className='login__text-line'>Hoặc</p>
          <Button className='login__goole-button' onClick={loginWithGoogle}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 48 48'
              width='25px'
              height='25px'
              style={{ marginRight: '10px' }}
            >
              <path
                fill='#FFC107'
                d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
              />
              <path
                fill='#FF3D00'
                d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
              />
              <path
                fill='#4CAF50'
                d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
              />
              <path
                fill='#1976D2'
                d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
              />
            </svg>
            Đăng nhập bằng Google
          </Button>
          <p>
            Bạn chưa có tài khoản? <span onClick={changeForm}>đăng ký</span> tài
            khoản mới
          </p>
        </div>
      ) : (
        <Register />
      )}
    </>
  );
};

export default Login;
