import React, { useRef, useState } from 'react';
import './LoginRegisterPage.css';
import Login from '../../components/login-register/LoginComponent';
import Register from '../../components/login-register/RegisterComponent';

const LoginRegisterPage = () => {
  const contentRef = useRef(null);
  const mainRef = useRef(null);
  const [displayContent, setDisplayContent] = useState(true); // True = giao diện đăng nhập, False = giao diện đăng ký

  // Thay đổi sang giao diện đăng ký
  const changeRegisterContent = () => {
    const contentElement = contentRef.current;
    const mainElement = mainRef.current;
    setDisplayContent(!displayContent);
    contentElement.style.transform = 'translateX(100%)';
    contentElement.style.justifyContent = 'flex-start';
    mainElement.style.transform = 'translateX(-100%)';
  };

  // Thay đổi sang giao diện dăng nhập
  const changeLoginContent = () => {
    const contentElement = contentRef.current;
    const mainElement = mainRef.current;
    setDisplayContent(!displayContent);
    contentElement.style.transform = 'translateX(0)';
    contentElement.style.justifyContent = 'flex-end';
    mainElement.style.transform = 'translateX(0)';
  };

  return (
    <div className='login-register'>
      <div className='login-register__content' ref={contentRef}>
        {displayContent ? (
          <div className='login-register__register-content'>
            <p>
              Nếu bạn chưa có tài khoản,
              <br />
              hãy{' '}
              <span onClick={changeRegisterContent}>
                đăng ký{' '}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='icon icon-tabler icon-tabler-arrow-big-right-lines'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  style={{ verticalAlign: 'middle' }}
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M12 9v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-3v-6h3z'></path>
                  <path d='M3 9v6'></path>
                  <path d='M6 9v6'></path>
                </svg>
              </span>
              <br />
              tài khoản mới
            </p>
          </div>
        ) : (
          <div className='login-register__login-content'>
            <p>
              Nếu bạn đã có tài khoản,
              <br />
              bạn hãy{' '}
              <span onClick={changeLoginContent}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='icon icon-tabler icon-tabler-arrow-big-left-lines'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  style={{ verticalAlign: 'middle', marginRight: '2px' }}
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M12 15v3.586a1 1 0 0 1 -1.707 .707l-6.586 -6.586a1 1 0 0 1 0 -1.414l6.586 -6.586a1 1 0 0 1 1.707 .707v3.586h3v6h-3z'></path>
                  <path d='M21 15v-6'></path>
                  <path d='M18 15v-6'></path>
                </svg>
                đăng nhập
              </span>
              <br />
              để có trải nghiệm tốt hơn
            </p>
          </div>
        )}
      </div>
      <div className='login-register__main' ref={mainRef}>
        {displayContent ? (
          <Login />
        ) : (
          <Register changeLoginContent={changeLoginContent} />
        )}
      </div>
    </div>
  );
};

export default LoginRegisterPage;
