import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewForm = () => {
  const { MaDat } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState({
    HangMucDG: '',
    TienNghi: '',
    DichVuHoTro: '',
    GiaCa: '',
    NhanXetThem: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    axios.post('http://localhost:3001/api/review', {
      ...reviewData,
      MaKH: userId,
      MaDat: MaDat,
    }).then(response => {
      alert('Đánh giá đã được gửi thành công!');
      navigate('/lichsutt');
    }).catch(error => {
      console.error('Có lỗi xảy ra khi gửi đánh giá.:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá.');
    });
  };

  return (
    <div className="review-form-container">
      <div className="review-form">
        <h2 className="form-title">Đánh giá</h2>
        <p className="form-subtitle">(Hãy đánh giá bằng số từ 1 đến 5)</p>
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Hạng mục đánh giá:
            <input className="form-input" type="text" name="HangMucDG" value={reviewData.HangMucDG} onChange={handleChange} required />
          </label>
          <label className="form-label">
            Tiện nghi:
            <input className="form-input" type="text" name="TienNghi" value={reviewData.TienNghi} onChange={handleChange} />
          </label>
          <label className="form-label">
            Dịch vụ hỗ trợ:
            <input className="form-input" type="text" name="DichVuHoTro" value={reviewData.DichVuHoTro} onChange={handleChange} />
          </label>
          <label className="form-label">
            Giá cả:
            <input className="form-input" type="text" name="GiaCa" value={reviewData.GiaCa} onChange={handleChange} />
          </label>
          <label className="form-label">
            Nhận xét thêm:
            <textarea className="form-textarea" name="NhanXetThem" value={reviewData.NhanXetThem} onChange={handleChange} />
          </label>
          <div className="form-buttons">
            <button className="submit-button" type="submit">Đăng đánh giá</button>
            <button className="cancel-button" type="button" onClick={() => navigate('/lichsutt')}>Quay lại</button>
          </div>
        </form>
      </div>
      <style>{`
        .review-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 120vh;
          background: #F2F8FF;
          border-radius: 25px;
        }
        .review-form {
          width: 921px;
          background: #FFFFFF;
          border: 1px solid #525050;
          border-radius: 25px;
          padding: 26px;
          box-sizing: border-box;
        }
        .form-title {
          width: 100%;
          text-align: center;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 36px;
          color: #525050;
          margin-bottom: 10px;
        }
        .form-subtitle {
          width: 100%;
          text-align: center;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          color: #A09696;
          margin-bottom: 30px;
        }
        .form-label {
          display: block;
          margin-bottom: 20px;
          color: #A09696;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 29px;
        }
        .form-input, .form-textarea {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #A09696;
          border-radius: 10px;
        }
        .form-textarea {
          height: 98px;
        }
        .form-buttons {
          display: flex;
          justify-content: space-between;
        }
        .submit-button, .cancel-button {
          background: #007BFF;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
        }
        .cancel-button {
          background: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default ReviewForm;