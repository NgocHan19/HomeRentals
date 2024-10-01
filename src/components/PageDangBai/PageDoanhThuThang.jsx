import React, { useState, useEffect } from 'react';
import axios from 'axios';
import images from '../../images';

const PageDoanhThuThang = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [bookings, setBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const userId = localStorage.getItem('userId'); // Lấy mã người dùng từ localStorage

  useEffect(() => {
    if (userId) {
      axios.get('http://localhost:3001/api/bookings', {
        params: {
          month,
          year,
          MaCCT: userId // Sử dụng mã người dùng từ localStorage
        }
      })
      .then(response => {
        setBookings(response.data);
        calculateTotalRevenue(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the bookings!', error);
      });
    }
  }, [month, year, userId]);

  const calculateTotalRevenue = (bookings) => {
    const total = bookings.reduce((acc, booking) => {
      const commission = booking.TongTien * 0.15;
      return acc + (booking.TongTien - commission);
    }, 0);
    setTotalRevenue(total);
  };

  const handleMonthChange = (e) => {
    const [selectedMonth, selectedYear] = e.target.value.split('/');
    setMonth(parseInt(selectedMonth, 10));
    setYear(parseInt(selectedYear, 10));
  };

  const getMonthYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const options = [];
    for (let y = currentYear; y >= currentYear - 3; y--) {
      for (let m = 12; m >= 1; m--) {
        options.push(`${m}/${y}`);
      }
    }
    return options;
  };

  return (
    <div className="page-doanhthu">
      <div className="title">Doanh thu</div>
      <div className="month-selector">
        <select onChange={handleMonthChange}>
          {getMonthYearOptions().map(option => (
            <option key={option} value={option}>
              Tháng {option.split('/')[0]} / {option.split('/')[1]}
            </option>
          ))}
        </select>
      </div>

      <div className="main-content">
        {bookings.map((booking, index) => (
          <div key={index} className="image-container">
            <img src={images['image.jpg']} alt={`image ${index}`} className="image" />
            <div className="room-info">
              <div className="room-id">ID phòng: {booking.MaCHBT}</div>
              <div className="booking-id">Mã đặt: {booking.MaDat}</div>
              <div className="room-name">Tên: {booking.HoTenKH}</div>
            </div>
            <div className="price-info">
              <div className="price">Giá tiền: {booking.TongTien} VND</div>
              <div className="commission">Hoa hồng: {booking.TongTien * 0.15} VND</div>
            </div>
          </div>
        ))}
        <div className="total-revenue">Tổng doanh thu: {totalRevenue} VND</div>
      </div>
      <style jsx>{`
        .page-doanhthu {
          width: 100%;
          padding: 20px;
          background: #F2F8FF;
        }
        .title {
          width: 253px;
          height: 61px;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 61px;
          color: #525050;
          margin-bottom: 20px;
        }
        .main-content {
          width: 100%;
          background: #FFFFFF;
          border-radius: 25px;
          padding: 20px;
          box-sizing: border-box;
        }
        .image-container {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          background: #FFFFFF;
          padding: 20px;
          border-radius: 25px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        .image {
          width: 200px;
          height: 150px;
          border-radius: 8px;
        }
        .room-info {
          margin-left: 20px;
          flex: 1;
        }
        .room-id, .room-name, .booking-id, .price, .commission, .total-revenue {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          line-height: 20px;
          margin-bottom: 10px;
        }
        .room-id, .booking-id {
          font-size: 18px;
          color: #A7A2A2;
        }
        .room-name {
          font-size: 25px;
          color: #525050;
        }
        .price-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .price, .commission {
          font-size: 22px;
          color: #525050;
        }
        .total-revenue {
          font-size: 30px;
          color: #525050;
          margin-top: 20px;
        }
        .month-selector {
          display: flex;
          align-items: center;
          position: absolute;
          right: 40px;
          top: 145px;
        }
        .month-selector select {
          font-family: 'Inter';
          font-size: 18px;
          padding: 5px;
          border: none;
          background: none;
        }
      `}</style>
    </div>
  );
};

export default PageDoanhThuThang;