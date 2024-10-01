import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import images from '../../images';

const DetailPage = ({ favoriteProperties, handleAddFavorite, handleRemoveFavorite }) => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]); // State để lưu trữ các đánh giá
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/api/can-ho-biet-thu/${propertyId}`)
      .then(response => {
        setProperty(response.data);
        return axios.get(`http://localhost:3001/api/phieu-dat/${response.data.MaCHBT}/danh-gia`);
      })
      .then(response => {
        setReviews(response.data);
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi tìm nạp thông tin chi tiết hoặc bài đánh giá!', error);
      });
  }, [propertyId]);

  if (!property) {
    return <div>Loading...</div>;
  }

  const isFavorite = favoriteProperties.some(fav => fav.MaCHBT === property.MaCHBT);
  const handleFavoriteClick = () => {
    if (isFavorite) {
      handleRemoveFavorite(property.MaCHBT);
    } else {
      handleAddFavorite(property);
    }
  };

  const handleSelectRoom = () => {
    const userRole = localStorage.getItem('role');

    if (userRole === 'Khách hàng') {
      navigate(`/datcanho/${property.MaCHBT}`, { state: property });
    } else {
      setErrorMessage('Role này không hợp lệ!');
    }
  };

  const imagesArray = property.HinhCHBT ? property.HinhCHBT.split(',').map(img => img.trim()) : [];

  const showPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imagesArray.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imagesArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  const address = `${property.Duong_Pho}, ${property.Xa_Phuong}, ${property.Quan_Huyen}, ${property.Tinh_TP}`;

  return (
    <div className="app">
      <div className="main-container">
        <div className="image-gallery">
          <div className="icon left-icon" onClick={showPreviousImage}></div>
          <div className="image" style={{ backgroundImage: `url(http://localhost:3001/${imagesArray[currentImageIndex]})` }}></div>
          <div className="icon right-icon" onClick={showNextImage}></div>
        </div>
        <div className="property-details">
          <div className="property-info-and-actions">
            <div className="property-info">
              <h2>{property.TenCHBT}</h2>
              <p>Mã căn hộ: {property.MaCHBT}</p>
              <p>Địa chỉ: {address}</p>
              <p>Giá: {property.GiaTien.toLocaleString('vi-VN')} VND | Diện tích: {property.DienTich} m²</p>
              <p className="overview-title">Tổng quan</p>
              <p>{property.TongQuan}</p>
              <h3>Thông tin cơ bản</h3>
              <div className="basic-info">
                <p>Loại hình: {property.LoaiCongTrinh}</p>
                <p>Số tầng: {property.SoTang}</p>
                <p>Diện tích: {property.DienTich} m²</p>
                <p>Số phòng ngủ: {property.SoPhongNgu}</p>
                <p>Số phòng tắm: {property.SoPhongTam}</p>
                <p>Tình hình nội thất: {property.TinhHinhNoiThat}</p>
                <p>Tình trạng sử dụng: {property.TinhTrangSuDung}</p>
                <p>Phong cách: {property.PhongCach}</p>
              </div>
              <h3>Đánh giá</h3>
              {reviews.length > 0 ? (
                <div className="reviews-container">
                  {reviews.map(review => (
                    <div key={review.MaPDG} className="review-card">
                      <p className="review-makh">Mã KH: {review.MaKH}</p>
                      <p>Hạng mục đánh giá: {review.HangMucDG}</p>
                      <p>Tiện nghi: {review.TienNghi}</p>
                      <p>Dịch vụ hỗ trợ: {review.DichVuHoTro}</p>
                      <p>Giá cả: {review.GiaCa}</p>
                      <p>Nhận xét thêm: {review.NhanXetThem}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Chưa có đánh giá nào.</p>
              )}
            </div>
            <div className="property-actions">
              <div className="like-button" onClick={handleFavoriteClick}>
                <div className="heart-icon">
                  <img src={isFavorite ? images['icon_heartlike.png'] : images['icon_heart.png']} alt="Like" />
                </div>
                <p className="like-text">Yêu thích</p>
              </div>
              <button className="select-room-button" onClick={handleSelectRoom}>Chọn phòng</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .app {
          font-family: 'Inter', sans-serif;
        }
        .main-container {
          width: 100%;
          background: #FFFFFF;
          padding: 20px;
          border-radius: 25px;
          position: relative;
        }
        .image-gallery {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
          background: #C8C9CA;
        }
        .image {
          width: 80%;
          height: 400px;
          background-size: cover;
          background-position: center;
          border-radius: 5px;
        }
        .icon {
          width: 50px;
          height: 50px;
          background-size: cover;
          opacity: 1; /* Tăng độ hiển thị */
          cursor: pointer;
          position: absolute;
          z-index: 10; /* Đảm bảo các icon này luôn ở trên hình ảnh */
        }
        .left-icon {
          background-image: url(${images['icon_greater_than_left.png']});
          left: 10px;
        }
        .right-icon {
          background-image: url(${images['icon_greater_than_right.png']});
          right: 10px;
        }
        .property-details {
          width: 100%;
          background: #FFF;
          border-radius: 10px;
          padding: 20px;
        }
        .property-info-and-actions {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
        .property-info {
          flex: 1;
        }
        .property-info h2 {
          font-size: 24px;
          color: #525050;
        }
        .property-info p {
          font-size: 20px;
          color: #A09696;
        }
        .property-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .like-button {
          display: flex;
          align-items: center;
          background: #F1F1F1;
          border-radius: 5px;
          padding: 10px 20px;
          margin-bottom: 20px;
          cursor: pointer;
        }
        .heart-icon {
          width: 25px;
          height: 25px;
          background-size: cover;
        }
        .like-text {
          margin-left: 10px;
          font-size: 25px;
          color: #7BB0CF;
        }
        .select-room-button {
          background: #F1A22A;
          border: none;
          border-radius: 7px;
          color: #FFF;
          padding: 10px 20px;
          font-size: 25px;
          cursor: pointer;
        }
        .overview-title {
          font-size: 32px;
          color: #A09696;
        }
        .see-more {
          color: #7BB0CF;
          cursor: pointer;
        }
        .basic-info {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .basic-info p {
          width: 48%;
          font-size: 20px;
          color: #525050;
          margin: 5px 0;
        }
        .property-reviews {
          background: #FFF;
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }
        .property-reviews h3 {
          font-size: 32px;
          color: #A09696;
        }
        .error-message {
          color: red;
          font-size: 16px;
          margin-top: 10px;
        }
        .reviews-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .review-card {
          background: #F9F9F9;
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #E0E0E0;
        }
        .review-makh {
          font-weight: bold;
          margin-bottom: 10px;
          color: #525050;
        }
      `}</style>
    </div>
  );
};

export default DetailPage;