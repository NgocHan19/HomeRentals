import React, { useState, useEffect } from 'react';
import axios from 'axios';
import images from '../../images';
import { useNavigate } from 'react-router-dom';

const PageThongTinCaNhan = () => {
  const [userInfo, setUserInfo] = useState({
    TenTK: '',
    Email: '',
    SDT: '',
    CCCD: '',
    NgaySinh: '',
    DiaChi: ''
  });

  const [isEditing, setIsEditing] = useState({
    Email: false,
    SDT: false,
    CCCD: false,
    NgaySinh: false,
    DiaChi: false
  });

  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Lấy username từ localStorage
  const role = localStorage.getItem('role'); // Lấy role từ localStorage

  useEffect(() => {
    axios.get(`http://localhost:3001/api/user/${username}`)
      .then(response => {
        const userData = response.data;
        userData.NgaySinh = userData.NgaySinh ? new Date(userData.NgaySinh).toISOString().substring(0, 10) : ''; // Định dạng ngày sinh về YYYY-MM-DD
        setUserInfo(userData);
      })
      .catch(error => {
        console.error('Lỗi khi tìm nạp dữ liệu người dùng:', error);
      });
  }, [username]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleSave = () => {
    const dataToSend = { ...userInfo, role };
    axios.put(`http://localhost:3001/api/user/${username}`, dataToSend)
      .then(response => {
        alert('Thông tin được cập nhật thành công');
        setIsEditing({
          Email: false,
          SDT: false,
          CCCD: false,
          NgaySinh: false,
          DiaChi: false
        });
      })
      .catch(error => {
        console.error('Lỗi cập nhật dữ liệu người dùng:', error);
        alert('Lỗi cập nhật thông tin');
      });
  };

  return (
    <div className="app">
      <div className="account-form">
        <h1 className="title">Tài khoản của tôi</h1>
        <div className="form-container">
          <div className="personal-info">
            <h2 className="section-title">Thông tin cá nhân</h2>
            <form>
              {[
                { label: 'Tên tài khoản', field: 'TenTK' },
                { label: 'E-mail', field: 'Email' },
                { label: 'Số điện thoại', field: 'SDT' },
                { label: 'CCCD', field: 'CCCD' },
                { label: 'Ngày sinh', field: 'NgaySinh' },
                { label: 'Địa chỉ', field: 'DiaChi' }
              ].map(({ label, field }, index) => (
                <div className="form-group" key={index}>
                  <label>{label}</label>
                  <input
                    type="text"
                    name={field}
                    value={userInfo[field]}
                    onChange={handleChange}
                    disabled={!isEditing[field]}
                  />
                  <button type="button" className="edit-button" onClick={() => handleEdit(field)}>Chỉnh sửa</button>
                </div>
              ))}
            </form>
            <button className="save-button" onClick={handleSave}>Lưu thay đổi</button>
          </div>
          <div className="security-section">
            <div className="security-box">
              <div className='security-icon'>
                <img src={images['icon_info.png']} alt="icon_info" />
                <p>Thông tin cá nhân</p>
              </div>
              <button className='security-icon' onClick={() => navigate('/doimatkhau')}>
                <img src={images['icon_pass.png']} alt="icon_pass" />
                <p>Bảo mật và đăng nhập</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .app {
          font-family: 'Inter', sans-serif;
        }

        .account-form {
          width: 100%;
          height: 750px;
          position: relative;
          background: #F2F8FF;
          border-radius: 25px;
        }

        .title {
          position: absolute;
          left: 30px;
          top: 5px;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 35px;
          color: #525050;
        }

        .form-container {
          display: flex;
          justify-content: flex-start;
          position: absolute;
          top: 95px;
          left: 55px;
          gap: 10px;
          width: calc(100% - 65px);
          height: 762px;
        }

        .security-section {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 10px;
        }

        .security-box {
          width: 300px;
          height: 120px;
          background: #FFFFFF;
          border-radius: 25px;
          position: relative;
          cursor: pointer;
        }

        .security-icon {
          margin-top: 15px;
          margin-left: 15px;
          display: flex;
          align-items: center;
          text-align: center;
          margin-right: 3px;
          border: none;
          background: none;
          cursor: pointer;
        }

        .security-icon img {
          width: 30px;
          height: 30px;
        }

        .security-icon p {
          margin: 0 0 0 10px;
          font-size: 14px;
          color: #A09696;
          font-weight: bold;
        }

        .personal-info {
          width: 1000px;
          height: 500px;
          background: #FFFFFF;
          border-radius: 25px;
        }

        .section-title {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 24px;
          color: #525050;
          padding-left: 20px;
          padding-bottom: 20px;
        }

        .form-group {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
        }

        .form-group label {
          width: 150px;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 18px;
          color: #A09696;
          padding-left: 20px;
        }

        .form-group input {
          width: 650px;
          height: 35px;
          padding: 5px;
          margin-left: 10px;
          background: #FFFFFF;
          border: 1px solid #525050;
          border-radius: 10px;
        }

        .edit-button {
          width: 140px;
          height: 34px;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 18px;
          color: #5C8AB5;
          background: none;
          border: none;
          cursor: pointer;
        }

        .save-button {
          width: 323px;
          height: 57px;
          background: #F1A22A;
          border-radius: 5px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #FFFFFF;
          margin: 30px auto;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default PageThongTinCaNhan;