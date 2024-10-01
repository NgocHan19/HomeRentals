import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header_CCT from './Header_CCT';
import Header_KH from './Header_KH';
import images from '../../images';

const Header = ({ role }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };
  

  return (
    <header className="header">
      <div className="logo">
        <img src={images['logoHomeRentals.png']} alt="Logo" />
      </div>
      <div className="search-bar">
        <span className="search-text">Tìm kiếm...</span>
        <div className="search-icon">
          <img src={images['icon_search.png']} alt="Search" />
        </div>
      </div>
      {role === 'Khách hàng' ? (
        <Header_KH />
      ) : role === 'Chủ cho thuê' ? (
        <Header_CCT />
      ) : (
        <button className="login-button" onClick={handleLogin}>
          <span className="login-text">Đăng nhập</span>
        </button>
      )}
      <style jsx>{`
        .header {
          position: relative;
          display: flex;
          align-items: center;
          height: 110px;
        }
        .logo {
          position: absolute;
          width: 140px;
          height: 110px;
          left: 3px;
          top: 0px;
        }
        .search-bar {
          position: absolute;
          width: 900px;
          height: 45px;
          left: 250px;
          top: 35px;
          background: #D9D9D9;
          border-radius: 15px;
          display: flex;
          align-items: center;
          padding-left: 24px;
        }
        .search-text {
          color: #A7A2A2;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 18px;
          line-height: 27px;
          margin-left: 10px;
        }
        .search-icon {
          position: absolute;
          left: 850px;
          top: 10px;
        }
        .search-icon img {
          width: 35px;
          height: 28px;
        }
        .login-button {
          position: absolute;
          right: 20px;
          top: 35px;
          width: 180px;
          height: 35px;
          background: #FFFFFF;
          border: 1px solid #625E5E;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-text {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 22px;
          line-height: 34px;
          color: #525050;
        }
      `}</style>
    </header>
  );
};

export default Header;