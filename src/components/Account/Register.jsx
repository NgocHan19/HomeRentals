import React, { useState } from 'react';
import axios from 'axios';
import images from '../../images';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [role, setRole] = useState('KH');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cccd, setCccd] = useState('');
  const navigate = useNavigate();

  const generateMaKH = () => {
    const prefix = role === 'KH' ? 'KH' : 'CCT';
    return prefix + Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleRegister = async () => {
    const user = {
      MaKH: generateMaKH(),
      TenTK: username,
      MatKhau: password,
      Email: email,
      CCCD: cccd,
      role: role
    };

    try {
      const response = await axios.post('http://localhost:3001/api/register', user);
      if (response.data.success) {
        localStorage.setItem('role', role); // Lưu role vào localStorage
        navigate('/login');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi khi đăng ký!', error);
      alert('Đã xảy ra lỗi khi đăng ký! Vui lòng thử lại.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-title">Đăng Ký</div>
        <div className="register-field">
          <label className="register-label">Vai trò</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="register-input">
            <option value="KH">Khách hàng</option>
            <option value="CCT">Chủ cho thuê</option>
          </select>
        </div>
        <div className="register-field">
          <label className="register-label">Tên tài khoản</label>
          <input type="text" className="register-input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="register-field">
          <label className="register-label">Mật khẩu</label>
          <input type="password" className="register-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="register-field">
          <label className="register-label">Email</label>
          <input type="email" className="register-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="register-field">
          <label className="register-label">CCCD</label>
          <input type="text" className="register-input" value={cccd} onChange={(e) => setCccd(e.target.value)} />
        </div>
        <div className="register-buttons">
          <button className="btn register-btn" onClick={handleRegister}>Đăng ký</button>
          <button className="btn login-btn" onClick={() => navigate('/login')}>Đăng nhập</button>
        </div>
      </div>
      <div className="register-icon right-icon" onClick={() => navigate('/')}>
        <img src={images['icon_exit.png']} className="icon-exit" />
      </div>
      <style jsx>{`
        .register-container {
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
        .register-box {
          box-sizing: border-box;
          width: 500px;
          background: #ffffff;
          border: 2px solid #d8d8d8;
          border-radius: 25px;
          position: relative;
          padding: 20px;
        }
        .register-title {
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
        .register-field {
          margin-bottom: 10px;
        }
        .register-label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 29px;
          color: #a09696;
          margin-bottom: 10px;
        }
        .register-input {
          box-sizing: border-box;
          width: 100%;
          height: 39px;
          background: #ffffff;
          border: 1px solid #a09696;
          border-radius: 10px;
          padding: 10px;
        }
        .register-buttons {
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
          background: #b97f27;
        }
        .login-btn {
          background: #f1a22a;
        }
        .register-icon {
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

export default Register;