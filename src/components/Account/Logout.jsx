import React from 'react';
import images from '../../images';

const Logout = () => {
  return (
    <div className="logout-container">
      <div className="logout-box">
        <div className="logout-title">Đăng Xuất</div>
        <div className="logout-message">Bạn chắc chắn muốn đăng xuất ?</div>
        <div className="logout-buttons">
          <button className="btn back-btn">Quay lại</button>
          <button className="btn confirm-logout-btn">Đăng xuất</button>
        </div>
      </div>
      <button className="logout-icon right-icon">
          <img src={images['icon_exit.png']} className="icon-exit" alt="Exit Icon"/>
        </button>
      <style jsx>{`
        .logout-container {
          position: relative;
          width: 100%;
          height: 220px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #F2F8FF;
        }

        .logout-box {
          box-sizing: border-box;
          width: 400px;
          height: 180px;
          background: #FFFFFF;
          border: 2px solid #D8D8D8;
          border-radius: 25px;
          position: relative;
          padding: 20px;
        }

        .logout-title {
          position: absolute;
          width: 174px;
          height: 41px;
          left: 50%;
          transform: translateX(-50%);
          top: 20px;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 41px;
          color: #525050;
          text-align: center;
        }

        .logout-message {
          position: absolute;
          width: 385px;
          height: 29px;
          left: 50%;
          transform: translateX(-50%);
          top: 70px;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 29px;
          color: #A09696;
          text-align: center;
        }

        .logout-buttons {
          position: absolute;
          width: 350px;
          bottom: 20px;
          display: flex;
          justify-content: space-around;
        }

        .btn {
          width: 140px;
          height: 45px;
          background: #F1A22A;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 29px;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
        }

        .back-btn {
          background: #B97F27;
        }

        .confirm-logout-btn {
          background: #F1A22A;
        }

        .logout-icon {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 25px;
          height: 25px;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .icon-exit {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Logout;