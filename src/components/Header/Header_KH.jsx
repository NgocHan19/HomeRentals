import React, { useState } from 'react';
import images from '../../images';
import { useNavigate } from 'react-router-dom';

const Header_KH = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <div className="header-container">
      <div className="header-buttons">
        <button className="profile-button" onClick={toggleDropdown}>
          <img src={images['icon_ellipse.png']} alt="User" />
          <span className="login-text">Tên KH</span>
        </button>
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-item" onClick={() => navigate('/yeuthich')}>Yêu thích</div>
            <div className="dropdown-item" onClick={() => navigate('/lichsutt')}>Lịch sử thanh toán</div>
            <div className="dropdown-item" onClick={() => navigate('/thongtincanhan')}>Tài khoản của tôi</div>
            <div className="dropdown-item" onClick={handleLogout}>Đăng xuất</div>
          </div>
        )}
      </div>
      <style jsx>{`
        .header-container {
          display: flex;
          align-items: center;
          padding-left: 1280px
        }
        .header-buttons {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .profile-button {
          width: 150px;
          height: 35px;
          background: #FFFFFF;
          border: 1px solid #625E5E;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          
        }
        .profile-button img {
          width: 20px;
          height: auto;
          margin-right: 10px;
        }
        .login-text {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 18px;
          line-height: 34px;
          color: #525050;
        }
        .dropdown-menu {
          position: absolute;
          top: 80px;
          right: 20px;
          width: 200px;
          background: #FFFFFF;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
          padding: 15px;
          z-index: 1000;
        }
        .dropdown-item {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 18px;
          line-height: 20px;
          color: #525050;
          margin: 10px 0;
          cursor: pointer;
        }
        .dropdown-item:hover {
          color: #000;
        }
        .dropdown-item:not(:last-child)::after {
          content: "";
          display: block;
          width: 100%;
          border-bottom: 1px solid #D0CDCD;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Header_KH;