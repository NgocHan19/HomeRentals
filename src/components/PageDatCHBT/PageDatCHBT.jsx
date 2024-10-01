import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import images from '../../images';

const PageDatCHBT = () => {
  const { propertyId } = useParams();
  const location = useLocation();
  const property = location.state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    cccd: '',
    email: '',
    phone: '',
    bookingType: 'guest',
    guestFullName: '',
    checkInDate: '',
    checkOutDate: '',
    additionalRequests: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Họ tên khách hàng không được để trống';
    }
    if (!formData.cccd) {
      newErrors.cccd = 'CCCD không được để trống';
    } else if (formData.cccd.length !== 12) {
      newErrors.cccd = 'CCCD phải có độ dài 12 ký tự';
    }
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    }
    if (!formData.phone) {
      newErrors.phone = 'Số điện thoại không được để trống';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Số điện thoại phải có độ dài 10 ký tự';
    }
    if (!formData.checkInDate) {
      newErrors.checkInDate = 'Ngày giờ nhận không được để trống';
    }
    if (!formData.checkOutDate) {
      newErrors.checkOutDate = 'Ngày giờ trả không được để trống';
    } else if (formData.checkOutDate <= formData.checkInDate) {
      newErrors.checkOutDate = 'Ngày giờ trả phải lớn hơn ngày giờ nhận';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('User ID is null. Please login first.');
        navigate('/login');
        return;
      }

      navigate('/thanhtoan', { state: { property, formData, userId } });
    } catch (error) {
      console.error('Lỗi gửi biểu mẫu', error);
    }
  };

  return (
    <div className="page-container">
      <div className="rectangle">
        <header>
          <div className="logo"></div>
          <div className="icon-row">
            <div className="icon-container">
              <img src={images['icon_1.png']} alt="icon_1" />
              <p>Đặt</p>
            </div>
            <div className="icon-container">
              <img src={images['icon_2.png']} alt="icon_2" />
              <p>Thanh toán</p>
            </div>
            <div className="icon-container">
              <img src={images['icon_3.png']} alt="icon_3" />
              <p>Xác nhận thanh toán</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="content">
          <div className="header">
            <div className="title">Đặt căn hộ, biệt thự</div>
            <div className="sub-title">Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính xác trước khi tiến hành thanh toán.</div>
          </div>

          <div className='container'>
            <div className="form form-info">
              <div className="form-header">Thông tin liên hệ</div>
              <div className="form-sub-title">Hãy điền chính xác tất cả thông tin để đảm bảo bạn nhận được Phiếu xác nhận đặt phòng qua email của mình.</div>
              <div className="form-container">
                <div className="form-group">
                  <label htmlFor="input-fullName">Họ và tên</label>
                  <input type="text" id="input-fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
                  {errors.fullName && <p className="error">{errors.fullName}</p>}
                  <p>Như trong Hộ chiếu/CMND/CCCD (không có danh xưng/ký tự đặc biệt)</p>
                </div>
                <div className="form-group">
                  <label htmlFor="input-cccd">CCCD</label>
                  <input type="text" id="input-cccd" name="cccd" value={formData.cccd} onChange={handleChange} />
                  {errors.cccd && <p className="error">{errors.cccd}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="input-email">E-mail</label>
                  <input type="email" id="input-email" name="email" value={formData.email} onChange={handleChange} />
                  {errors.email && <p className="error">{errors.email}</p>}
                  <p>Chúng tôi sẽ gửi e-voucher tới email này.</p>
                </div>
                <div className="form-group">
                  <label htmlFor="input-phone">Số điện thoại</label>
                  <input type="text" id="input-phone" name="phone" value={formData.phone} onChange={handleChange} />
                  {errors.phone && <p className="error">{errors.phone}</p>}
                </div>
                <div className="form-group-new">
                  <div className="radio-group">
                    <label>
                      <input type="radio" name="bookingType" value="guest" checked={formData.bookingType === 'guest'} onChange={handleChange} />
                      Tôi là khách lưu trú
                    </label>
                    <label>
                      <input type="radio" name="bookingType" value="other" checked={formData.bookingType === 'other'} onChange={handleChange} />
                      Tôi đang đặt cho người khác
                    </label>
                  </div>
                  {formData.bookingType === 'other' && (
                    <div>
                      <label htmlFor="guestFullName">Tên đầy đủ của khách</label>
                      <input type="text" id="guestFullName" name="guestFullName" value={formData.guestFullName} onChange={handleChange} className="input-fullName" />
                      <p>Nhập tên khách sẽ lưu trú</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="info-chbt">
              <div className="info-header">Tên căn hộ biệt thự: {property.TenCHBT}</div>
              <div className='form-sub-title'>ID: {propertyId}</div>
              <div className='img-chbt'>
                <img src={`http://localhost:3001/${property.HinhCHBT.split(',')[0].trim()}`} alt="Hình căn hộ biệt thự" />
              </div>
              <div className="form-container">
                <div className="form-group">
                  <label htmlFor="input-checkin">Ngày nhận</label>
                  <input type="date" id="input-checkin" name="checkInDate" value={formData.checkInDate} onChange={handleChange} className="input-checkin" />
                  {errors.checkInDate && <p className="error">{errors.checkInDate}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="input-checkout">Ngày trả</label>
                  <input type="date" id="input-checkout" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} className="input-checkout" />
                  {errors.checkOutDate && <p className="error">{errors.checkOutDate}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className='container'>
            <div className="additional-requests">
              <div className="requests-header">Bạn yêu cầu nào không?</div>
              <div className="requests-sub-title">Khi nhận phòng, khách sạn sẽ thông báo liệu yêu cầu này có được đáp ứng hay không. Một số yêu cầu cần trả thêm phí để sử dụng nhưng bạn hoàn toàn có thể hủy yêu cầu sau đó.</div>
              <textarea className="input-request" name="additionalRequests" value={formData.additionalRequests} onChange={handleChange}></textarea>
            </div>

            <div className="form-cancellation-policy">
              <div className="cancellation-header">Chính sách hủy</div>
              <div className="cancellation-policy">
                <div className="icon-check icon">
                  <img src={images['icon_tick.png']} alt="icon_tick" />
                  <p>Miễn phí hủy trong vào 1 giờ sau khi đã nhận được thông báo xác nhận</p>
                </div>
                <div className="icon-check icon">
                  <img src={images['icon_tick.png']} alt="icon_tick" />
                  <p>Trước 2 tiếng của thời gian nhận căn hộ, biệt thự, khách hàng sẽ không được hủy nữa.</p>
                </div>
                <div className="icon-cross icon">
                  <img src={images['icon_cancel.png']} alt="icon_cancel" />
                  <p>Phí hủy là 20%. Mức này sẽ áp dụng sau 1 giờ</p>
                </div>
                <div className="icon-cross icon">
                  <img src={images['icon_cancel.png']} alt="icon_cancel" />
                  <p>Phí hủy là 40%. Mức này sẽ áp dụng vào ngày nhận</p>
                </div>
              </div>
            </div>
          </div>

          <div className="price-details">
            <div className="price-header">Chi tiết giá</div>
            <div className="price-info">
              <span className="price-label">Giá căn hộ, biệt thự</span>
              <span className="price-value">{property.GiaTien.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="total-price-info">
              <span className="total-price-label">Tổng giá</span>
              <span className="total-price-value">{property.GiaTien.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="payment-info">
              <button type="submit" className="payment-button">Tiếp tục thanh toán</button>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        .page-container {
          position: relative;
          width: 100%;
          height: auto;
        }
        .container, .form, .form-empty, .additional-requests, .price-details, .payment-info {
          max-width: 100%;
          overflow: hidden;
        }
        .rectangle {
          width: 100%;
          height: auto;
          background: #ffffff;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: #ffffff;
        }
        .logo {
          width: 110px;
          height: 86px;
          background: url('./images/logoHomeRentals.png') no-repeat;
          background-size: contain;
          flex-shrink: 0;
          z-index: 1; 
        }
        .icon-row {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 10px;
          width: auto;
        }
        .icon-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          text-align: center;
          margin-right: 3px;
        }
        .icon-container img {
          width: 20px;
          height: 20px;
        }
        .icon-container p {
          margin: 0 0 0 10px;
          font-size: 14px;
          color: #A09696;
          font-weight: bold;
        }
        .content {
          position: relative;
          width: 100%;
          height: auto;
          background: #f2f8ff;
          border-radius: 15px 15px 0 0;
          padding: 20px;
          box-sizing: border-box;
        }
        .header {
          width: 100%;
          height: 80px;
          margin-bottom: 20px;
        }
        .title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 30px;
          color: #525050;
        }
        .sub-title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: #a09696;
        }
        .form, .info-chbt, .form-cancellation-policy {
          flex: 1;
          max-width: 35%;
          background: #ffffff;
          border-radius: 25px;
          padding: 20px;
          box-sizing: border-box;
        }
        .form-info, .price-details, .additional-requests {
          flex: 1;
          max-width: 65%;
          background: #ffffff;
          border-radius: 25px;
          padding: 20px;
          box-sizing: border-box;
        }
        .form-header {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #525050;
          margin-bottom: 10px;
        }
        .form-sub-title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #a09696;
          margin-bottom: 20px;
        }
        .form-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .form-group {
          flex: 1 1 calc(50% - 20px);
          box-sizing: border-box;
        }
        .form-group label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 17px;
          color: #a09696;
          margin-bottom: 5px;
        }
        .form-group input {
          width: 100%;
          height: 35px;
          background: #ffffff;
          border: 1px solid #525050;
          border-radius: 10px;
          padding: 5px;
          box-sizing: border-box;
        }
        .form-group p {
          color: #A09696;
          font-size: 12px;
          font-weight: bold;
          margin-top: 5px;
        }
        .form-group .error {
          color: red;
          font-size: 12px;
          margin-top: 5px;
        }
        .form-group-new {
          flex: 1 1 100%;
          margin-bottom: 20px;
        }
        .radio-group {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        .radio-group label {
          display: flex;
          align-items: center;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          color: #525050;
        }
        .radio-group input[type="radio"] {
          margin-right: 5px;
        }
        .form-group-new label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 17px;
          color: #a09696;
          margin-bottom: 5px;
        }
        .form-group-new p {
          color: #A09696;
          font-size: 12px;
          font-weight: bold;
          margin-top: 5px;
        }
        .form-group-new input[type="text"] {
          width: 100%;
          height: 35px;
          background: #ffffff;
          border: 1px solid #525050;
          border-radius: 10px;
          padding: 5px;
          box-sizing: border-box;
        }
        .info-header {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #525050;
          margin-bottom: 10px;
        }
        .img-chbt {
          text-align: center;
          margin-bottom: 20px;
        }
        .img-chbt img {
          width: 100px;
          height: 100px;
        }
        .form-empty {
          flex: 1;
          background: #ffffff;
          border-radius: 25px;
        }
        .additional-requests {
          flex: 1;
          max-width: 65%;
          background: #ffffff;
          border-radius: 25px;
          padding: 20px;
          box-sizing: border-box;
          margin-top: 20px;
        }
        .requests-header {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #525050;
          margin-bottom: 10px;
        }
        .requests-sub-title {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #a09696;
          margin-bottom: 20px;
        }
        .input-request {
          width: 100%;
          height: 200px;
          background: #ffffff;
          border: 1px solid #525050;
          border-radius: 10px;
          padding: 10px;
          box-sizing: border-box;
        }
        .container {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          width: 100%;
        }
        .form-cancellation-policy .additional-requests {
          margin: 5px;
        }
        .form-cancellation-policy {
          flex: 1;
          max-width: 35%;
          background: #ffffff;
          border-radius: 25px;
          padding: 20px;
          box-sizing: border-box;
          margin-top: 20px;
        }
        .cancellation-header {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #525050;
          margin-bottom: 10px;
        }
        .cancellation-policy {
          margin-left: 10px;
          margin-top: 10px;
          padding-bottom: 10px;
        }
        .icon-check {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .icon-cross {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        .icon img {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
        .icon p {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #a09696;
        }
        .price-details {
          flex: 1;
          max-width: 65%;
          background: #ffffff;
          border-radius: 25px;
          padding: 20px;
          box-sizing: border-box;
          margin-top: 20px;
        }
        .price-header {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #525050;
          margin-bottom: 10px;
        }
        .price-info, .tax-info, .total-price-info {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          padding: 0 20px;
        }
        .price-label, .tax-label {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #a09696;
        }
        .total-price-label {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #a09696;
        }
        .price-value, .tax-value {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #a09696;
        }
        .total-price-value {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 30px;
          color: #525050;
        }
        .name-chbt p {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #a09696;
        }
        .payment-info {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .payment-button {
          width: 700px;
          height: 50px;
          background: #ff7400;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #ffffff;
          border: none;
          cursor: pointer;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default PageDatCHBT;