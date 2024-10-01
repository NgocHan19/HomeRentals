import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import images from '../../images';

const PageLichSuTT = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get the userId from localStorage

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/payment-history/${userId}`);
        setPaymentHistory(response.data);
      } catch (error) {
        console.error('Đã xảy ra lỗi khi tìm nạp lịch sử thanh toán!', error);
      }
    };

    fetchPaymentHistory();
  }, [userId]);

  const handleReviewClick = (payment) => {
    const today = new Date();
    const completionDate = new Date(payment.NgayHoanTat); // Assuming you have a field for the completion date when status became 'Hoàn tất'

    if (payment.TrangThai === 'Đã hủy' || payment.TrangThai === 'Đã hoàn tiền') {
      alert('Không thể đánh giá vì đã hủy!');
    } else if (payment.TrangThai === 'Hoàn tất') {
      const daysSinceCompletion = Math.floor((today - completionDate) / (1000 * 60 * 60 * 24));
      if (daysSinceCompletion > 2) {
        alert('Đã qua thời gian được đánh giá!');
      } else {
        navigate(`/danhgia/${payment.MaDat}`);
      }
    } else {
      alert('Bạn chưa thể đánh giá!');
    }
  };

  const handleCancel = (MaDat) => {
    axios.post('http://localhost:3001/api/phieudat/cancel', { MaDat }) // Sử dụng cổng 3001
      .then(response => {
        alert(response.data); // Hiển thị thông báo hủy đặt thành công
        fetchPaymentHistory(); // refresh orders list
      })
      .catch(error => {
        console.error('There was an error cancelling the order!', error);
      });
  };

  return (
    <div className="app">
      <div className="main-container">
        <h1 className="title">Lịch sử thanh toán</h1>
        <div className="payment-history">
          {paymentHistory.map((payment) => (
            <div key={payment.MaDat} className="payment-item">
              <div className="payment-image" style={{ backgroundImage: `url(${images['image.jpg']})` }}></div>
              <div className="payment-details">
                <p className="payment-id">ID: {payment.MaDat}</p>
                <h2 className="payment-name">Tên: {payment.HoTenKH}</h2>
                <p className="payment-address">Địa chỉ: {payment.DiaChi}</p>
                <p className="payment-date">Ngày đặt: {new Date(payment.NgayDat).toLocaleDateString()}</p>
                <p className="payment-status">Trạng thái: {payment.TrangThai}</p>
              </div>
              <div className="payment-price">
                <p>{payment.TongTien.toLocaleString('vi-VN')} VND</p>
              </div>
              <div className="payment-actions">
                <button className="rate-button" onClick={() => handleReviewClick(payment)}>Đánh giá</button>
                <button type="button" className="cancel-button" onClick={() => handleCancel(payment.MaDat)}>Hủy đặt</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .app {
          font-family: 'Inter', sans-serif;
          background: #F2F8FF;
          border-radius: 25px 25px 0px 0px;
          padding: 20px;
        }
        .main-container {
          max-width: 1920px;
          margin: 0 auto;
        }
        .title {
          font-weight: 700;
          font-size: 30px;
          color: #525050;
          margin-bottom: 20px;
        }
        .payment-history {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .payment-item {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border-radius: 10px;
          padding: 20px;
          position: relative;
        }
        .payment-image {
          width: 270px;
          height: 240px;
          background-size: cover;
          background-position: center;
          border-radius: 5px 5px 0px 0px;
          margin-right: 20px;
        }
        .payment-details {
          flex-grow: 1;
        }
        .payment-id {
          font-weight: 700;
          font-size: 20px;
          color: #A7A2A2;
          margin-bottom: 5px;
        }
        .payment-name {
          font-weight: 700;
          font-size: 25px;
          color: #525050;
          margin-bottom: 10px;
        }
        .payment-address {
          font-size: 20px;
          color: #A7A2A2;
          margin-bottom: 10px;
        }
        .payment-date, .payment-status {
          font-weight: 700;
          font-size: 20px;
          color: #525050;
          margin-bottom: 10px;
        }
        .payment-price {
          font-weight: 700;
          font-size: 40px;
          color: #525050;
          position: absolute;
          top: 20px;
          right: 20px;
        }
        .payment-actions {
          display: flex;
          gap: 10px;
          position: absolute;
          bottom: 20px;
          right: 20px;
        }
        .rate-button, .cancel-button {
          width: 150px;
          height: 50px;
          border-radius: 5px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 25px;
          line-height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .rate-button {
          background: #DFE4FF;
          color: #FFFFFF;
        }
        .cancel-button {
          background: #DFE4FF;
          color: #FF4E4E;
        }
      `}</style>
    </div>
  );
};

export default PageLichSuTT;