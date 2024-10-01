import React, { useState } from 'react';
import images from '../../images';
import { useNavigate } from 'react-router-dom';

const Header_CCT = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
    setIsProfileDropdownVisible(false); // Đóng dropdown của profile nếu mở dropdown đăng bài
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownVisible(!isProfileDropdownVisible);
    setIsDropdownVisible(false); // Đóng dropdown đăng bài nếu mở dropdown profile
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    window.location.reload();
  };

  return (
    <div className="header-container">
      <div className="header-buttons">
        <button className="upload-button" onClick={toggleDropdown}>
          <span className="upload-text">Đăng bài</span>
        </button>
        <button className="profile-button" onClick={toggleProfileDropdown}>
          <img src={images['icon_ellipse.png']} alt="User" />
          <span className="login-text">Tên CCT</span>
        </button>
      </div>
      {isDropdownVisible && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => navigate('/baidadang')}>Bài đã đăng</div>
          <div className="dropdown-item" onClick={() => navigate('/dangtinmoi')}>Đăng thông tin mới</div>
          <div className="dropdown-item" onClick={() => navigate('/doanhthu')}>Doanh thu</div>
        </div>
      )}
      {isProfileDropdownVisible && (
        <div className="profile-dropdown-menu">
          <div className="dropdown-item" onClick={() => navigate('/thongtincanhan')}>Tài khoản của tôi</div>
          <div className="dropdown-item" onClick={handleLogout}>Đăng xuất</div>
        </div>
      )}
      <style jsx>{`
        .header-container {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 20px;
          padding-left: 1170px;
        }
        .header-buttons {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .upload-button {
          width: 130px;
          height: 35px;
          background: #FFFFFF;
          border: 1px solid #625E5E;
          border-radius: 5px; /* Keep border-radius for this button */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .profile-button {
          width: 130px;
          height: 35px;
          background: #FFFFFF;
          border: none; /* Remove border */
          border-radius: 0; /* Remove border-radius */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .upload-button img,
        .profile-button img {
          width: 20px;
          height: auto;
          margin-right: 10px;
        }
        .upload-text,
        .login-text {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 300;
          font-size: 18px;
          line-height: 20px;
          color: #525050;
        }
        .dropdown-menu, .profile-dropdown-menu {
          position: absolute;
          top: 75px;
          right: 60px;
          width: 200px;
          background: #FFFFFF;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
          padding: 10px;
          z-index: 1000;
        }
        .profile-dropdown-menu {
          top: 75px;
          right: 30px;
        }
        .dropdown-item {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 20px;
          line-height: 34px;
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
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
};

export default Header_CCT;