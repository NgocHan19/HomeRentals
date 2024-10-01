import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import images from '../../images';
import axios from 'axios';

const PageThanhToan = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedBankOption, setSelectedBankOption] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { property, formData, userId } = location.state;

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleBankOptionChange = (option) => {
    setSelectedBankOption(option);
  };

  const handlePaymentSuccess = async () => {
    try {
      await axios.post(
        'http://localhost:3001/api/phieu-dat',
        {
          bookingType: formData.bookingType,
          hoTen: formData.fullName,
          fullName: formData.guestFullName,
          email: formData.email,
          sdt: formData.phone,
          cccd: formData.cccd,
          yeuCau: formData.additionalRequests,
          ngayNhan: formData.checkInDate,
          ngayTra: formData.checkOutDate,
          maCHBT: property.MaCHBT,
          tongTien: property.GiaTien
        },
        {
          headers: {
            'user-id': userId // Include user ID in headers
          }
        }
      );
      setSuccessMessage('Đặt thành công! Bạn sẽ được chuyển hướng về trang chủ.');
      setTimeout(() => navigate('/'), 2000); // Redirect to homepage after 2 seconds
    } catch (error) {
      console.error('Lỗi lưu đặt chỗ sau khi thanh toán', error);
    }
  };

  return (
    <div className="container-thanhtoan">
      <div className="background"></div>
      <img src={images['icon_2.png']} alt="Step 2" className="step-icon" />
      <div className="step-text">Thanh toán</div>
      <img src={images['icon_3.png']} alt="Step 3" className="step-icon step-icon-2" />
      <div className="step-text step-text-2">Gửi phiếu xác nhận</div>
      <img src={images['logoHomeRentals.png']} alt="Logo Home Rentals" className="logo" />
      <div className="payment-title">Thanh toán</div>
      <div className="main-content">
        <div className="header"></div>
        <div className="header-text">Đừng lo lắng, giá vẫn giữ nguyên. Hoàn tất thanh toán của bạn bằng (đếm tg 1h)</div>
        <div className="section-title">Bạn muốn thanh toán thế nào?</div>
        <div className="payment-options">
          <div className="payment-option">
            <input
              type="radio"
              id="vietqr"
              name="payment-method"
              value="vietqr"
              checked={selectedPaymentMethod === 'vietqr'}
              onChange={() => handlePaymentMethodChange('vietqr')}
            />
            <label htmlFor="vietqr" className="radio-label">VietQR</label>
          </div>
          {selectedPaymentMethod === 'vietqr' && (
            <div className="payment-info">
              <ul>
                <li>Đảm bảo bạn có ví điện tử hoặc ứng dụng ngân hàng di động hỗ trợ thanh toán bằng VietQR.</li>
                <li>Mã QR sẽ xuất hiện sau khi bạn nhấp vào nút 'Thanh toán'. Chỉ cần lưu hoặc chụp màn hình mã QR để hoàn tất thanh toán của bạn trong thời hạn từ/m-banking của bạn.</li>
                <li>Vui lòng sử dụng mã QR mới nhất được cung cấp để hoàn tất thanh toán của bạn.</li>
              </ul>
              <img src={images['QR_code.jpg']} alt="QR Code" className="qr-code" />
              <button onClick={handlePaymentSuccess} className="btn btn-primary mt-3">Xác nhận thanh toán</button>
            </div>
          )}
          <div className="payment-option">
            <input
              type="radio"
              id="atm"
              name="payment-method"
              value="atm"
              checked={selectedPaymentMethod === 'atm'}
              onChange={() => handlePaymentMethodChange('atm')}
            />
            <label htmlFor="atm" className="radio-label">ATM Cards/Mobile Banking</label>
          </div>
          {selectedPaymentMethod === 'atm' && (
            <div className="payment-info">
              <ul>
                <li>Thẻ của bạn phải được ngân hàng ở Việt Nam phát hành và bạn đã kích hoạt tài khoản Internet Banking.</li>
                <li>Danh sách các nhà cung cấp ngân hàng sẽ xuất hiện sau khi bạn nhấp vào nút thanh toán. Chọn nhà cung cấp thẻ của bạn và nhập các chi tiết cần thiết. Sau đó hoàn tất thanh toán của bạn bằng cách làm theo các bước xác minh.</li>
              </ul>
              <div className="bank-options">
                <div className="bank-option">
                  <input
                    type="radio"
                    id="local-atm"
                    name="bank-option"
                    checked={selectedBankOption === 'local-atm'}
                    onChange={() => handleBankOptionChange('local-atm')}
                  />
                  <label htmlFor="local-atm" className="bank-option-label">Thẻ ATM nội địa</label>
                </div>
                {selectedBankOption === 'local-atm' && (
                  <div className="bank-info">
                    <p>Nhập thông tin thẻ ATM nội địa của bạn:</p>
                    <input type="text" placeholder="Số thẻ" />
                    <input type="text" placeholder="Họ tên chủ thẻ" />
                    <input type="text" placeholder="Ngày hết hạn" />
                  </div>
                )}
                <div className="bank-option">
                  <input
                    type="radio"
                    id="mobile-banking"
                    name="bank-option"
                    checked={selectedBankOption === 'mobile-banking'}
                    onChange={() => handleBankOptionChange('mobile-banking')}
                  />
                  <label htmlFor="mobile-banking" className="bank-option-label">Ngân hàng di động</label>
                </div>
                {selectedBankOption === 'mobile-banking' && (
                  <div className="bank-info">
                    <p>Nhập thông tin tài khoản ngân hàng di động của bạn:</p>
                    <input type="text" placeholder="Số tài khoản" />
                    <input type="text" placeholder="Tên ngân hàng" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {successMessage && <div className="success-message">{successMessage}</div>}
        <div className="total-amount">Tổng giá tiền</div>
        <div className="agreement-text">
          Bằng việc tiếp tục thanh toán, bạn đã đồng ý với Điều khoản & Điều kiện cũng như Chính sách quyền riêng tư của HomeRentals.
        </div>
        <div className="payment-button" onClick={handlePaymentSuccess}>Thanh toán...</div>
      </div>
      <style jsx>{`
        .container-thanhtoan {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
        }
        .background {
          position: absolute;
          width: 100%;
          height: 1200px;
          top: 145px;
          background: #F2F8FF;
        }
        .logo {
          position: absolute;
          width: 190px;
          height: 145.49px;
          top: 0;
          left: 0;
        }
        .main-content {
          position: absolute;
          width: 1350px;
          height: 1020px;
          left: 63px;
          top: 250px;
          background: #FFFFFF;
          border-radius: 25px;
        }
        .header {
          position: absolute;
          width: 1350px;
          height: 96px;
          background: #7F92D7;
          border-radius: 25px 25px 0 0;
        }
        .header-text {
          position: absolute;
          width: 1100px;
          height: 25px;
          left: 50px;
          top: 30px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 28px;
          line-height: 30px;
          color: #FFFFFF;
        }
        .section-title {
          position: absolute;
          width: 446px;
          height: 36px;
          left: 70px;
          top: 120px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 30px;
          line-height: 36px;
          color: #525050;
        }
        .payment-options {
          position: absolute;
          left: 95px;
          top: 180px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .payment-option {
          display: flex;
          align-items: center;
        }
        .radio-label {
          margin-left: 10px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 25px;
          line-height: 30px;
          color: #525050;
        }
        .payment-info {
          margin-left: 10px;
          margin-top: 10px;
          font-family: 'Inter';
          font-weight: 400;
          font-size: 20px;
          line-height: 30px;
          color: #525050;
          background: #E8F0FE;
          padding: 10px;
          border-radius: 5px;
          width: 1200px;
        }
        .payment-info ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .payment-info ul li {
          margin-bottom: 5px;
        }
        .payment-info img.qr-code {
          display: block;
          margin-top: 10px;
          width: 320px;
          height: 320px;
        }
        .bank-options {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
        }
        .bank-option {
          display: flex;
          align-items: center;
        }
        .bank-option-label {
          margin-left: 10px;
          font-family: 'Inter';
          font-weight: 400;
          font-size: 20px;
          line-height: 30px;
          color: #525050;
        }
        .bank-info {
          margin-left: 30px;
          margin-top: 10px;
        }
        .bank-info input {
          display: block;
          margin-bottom: 10px;
          padding: 5px;
          font-size: 16px;
          width: 300px;
        }
        .total-amount {
          position: absolute;
          width: 208px;
          height: 40px;
          left: 60px;
          top: 820px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 33px;
          line-height: 40px;
          color: #525050;
        }
        .divider {
          position: absolute;
          width: 1747.51px;
          height: 0;
          left: 86.5px;
          top: 518px;
          border: 1px solid #525050;
        }
        .agreement-text {
          position: absolute;
          width: 1726px;
          height: 24px;
          left: 108px;
          top: 950px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          color: #A09696;
        }
        .payment-button {
          position: absolute;
          width: 1200px;
          height: 66px;
          left: 94px;
          top: 870px;
          background: #F8FB45;
          border-radius: 10px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 30px;
          line-height: 36px;
          color: #4F6F9F;
          text-align: center;
          line-height: 66px;
          cursor: pointer;
        }
        .payment-title {
          position: absolute;
          width: 278px;
          height: 61px;
          left: 14px;
          top: 168px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 50px;
          line-height: 61px;
          color: #525050;
        }
        .step-icon {
          position: absolute;
          width: 30px;
          height: 30px;
          left: 1060px;
          top: 53px;
        }
        .step-text {
          position: absolute;
          width: 167px;
          height: 36px;
          left: 1100px;
          top: 50px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 20px;
          line-height: 36px;
          color: #A09696;
        }
        .step-icon-2 {
          left: 1220px;
          top: 54px;
          width: 30px;
          height: 30px;
        }
        .step-text-2 {
          width: 282px;
          left: 1260px;
        }
        .success-message {
          position: absolute;
          width: 100%;
          height: 50px;
          top: 750px;
          font-family: 'Inter';
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          color: #28a745;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default PageThanhToan;