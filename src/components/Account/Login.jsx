import React, { useState } from 'react';
import axios from 'axios';
import images from '../../images';
import { useNavigate } from 'react-router-dom';

const Login = ({ setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Xử lý các tài khoản đặc biệt với quyền truy cập cụ thể
      if (username === 'nva' && password === 'securePass1$') {
        localStorage.setItem('role', 'giamdoc');
        navigate('/AdminPage');
        return;
      }
      if (username === 'pte' && password === 'financePass$') {
        localStorage.setItem('role', 'TPTC');
        navigate('/AdminPage');
        return;
      }
      if (username === 'nvf' && password === 'financePass2$') {
        localStorage.setItem('role', 'TVTC');
        navigate('/AdminPage');
        return;
      }
      if (username === 'nti' && password === 'salesPass1$') {
        localStorage.setItem('role', 'NVKD');
        navigate('/AdminPage');
        return;
      }
      if (username === 'ttm' && password === 'cskhPass1$') {
        localStorage.setItem('role', 'NVCSKH');
        navigate('/AdminPage');
        return;
      }

      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      const { role, userId } = response.data;
      if (role && userId) {
        localStorage.setItem('role', role); // Lưu role vào localStorage
        localStorage.setItem('username', username); // Lưu username vào localStorage
        localStorage.setItem('userId', userId); // Lưu userId vào localStorage
        setRole(role); // Cập nhật role trong state
        navigate('/'); // Điều hướng về trang chủ hoặc trang theo vai trò
      } else {
        setErrorMessage('Thông tin không hợp lệ');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại', error);
      setErrorMessage('Đăng nhập thất bại! Vui lòng thử lại.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">Đăng Nhập</div>
        <div className="login-field">
          <label className="login-label">Tên tài khoản</label>
          <input type="text" className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="login-field">
          <label className="login-label">Mật khẩu</label>
          <input type="password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="login-buttons">
          <button className="btn register-btn" onClick={() => navigate('/register')}>Đăng ký</button>
          <button className="btn login-btn" onClick={handleLogin}>Đăng nhập</button>
</div>
      </div>
      <div className="login-icon right-icon" onClick={() => navigate('/')}>
        <img src={images['icon_exit.png']} className="icon-exit" />
      </div>
      <style jsx>{`
        .login-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #F2F8FF;
        }
        .login-box {
          box-sizing: border-box;
          width: 500px;
          background: #ffffff;
          border: 2px solid #d8d8d8;
          border-radius: 25px;
          position: relative;
          padding: 20px;
        }
        .login-title {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 41px;
          color: #525050;
          text-align: center;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .login-field {
          margin-bottom: 10px;
        }
        .login-label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 29px;
          color: #a09696;
          margin-bottom: 10px;
        }
        .login-input {
          box-sizing: border-box;
          width: 100%;
          height: 39px;
          background: #ffffff;
          border: 1px solid #a09696;
          border-radius: 10px;
          padding: 10px;
        }
        .error-message {
          color: red;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          text-align: center;
          margin-bottom: 10px;
        }
        .login-buttons {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
        }
        .btn {
          width: 180px;
          height: 45px;
          border-radius: 5px;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 34px;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .register-btn {
          background: #f1a22a;
        }
        .login-btn {
          background: #b97f27;
        }
        .login-icon {
          position: absolute;
          width: 40px;
          height: 40px;
          background: url('image.png') no-repeat center center;
          background-size: contain;
          cursor: pointer;
        }
        .right-icon {
          right: 5px;
          top: 6px;
        }
        .icon-exit {
          width: 30px;
          height: 30px;
        }
      `}</style>
    </div>
  );
};

export default Login;