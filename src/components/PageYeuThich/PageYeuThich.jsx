import React from 'react';
import images from '../../images';

const PageYeuThich = ({ favoriteProperties, handleRemoveFavorite }) => {
  return (
    <div className="app">
      <div className="main-container">
        <h1 className="title">Căn hộ, biệt thự yêu thích</h1>
        <div className="property-list">
          {favoriteProperties.map((property, index) => {
            const imageUrls = property.HinhCHBT.split(',').map(url => `http://localhost:3001/${url.trim()}`);
            console.log('Image URLs:', imageUrls); // Kiểm tra giá trị của imageUrls
            return (
              <div key={index} className="property-item">
                <div className="property-image" style={{ backgroundImage: `url(${imageUrls[0]})` }}></div>
                <div className="property-details">
                  <h2 className="property-name">{property.TenCHBT}</h2>
                  <p className="property-size">{property.DienTich} m²</p>
                  <p className="property-address">{property.Tinh_TP}, {property.Quan_Huyen}, {property.Duong_Pho}</p>
                  <div className="property-icons">
                    <div className="icon" style={{ backgroundImage: `url(${images['bed.png']})` }}></div>
                    <div className="icon" style={{ backgroundImage: `url(${images['bathtub.png']})` }}></div>
                    <div className="icon" style={{ backgroundImage: `url(${images['rounded-square.png']})` }}></div>
                  </div>
                </div>
                <div className="price-unlike-container">
                  <div className="property-price">
                    <p>{property.GiaTien.toLocaleString('vi-VN')} VND</p>
                  </div>
                  <div className="unlike-button" onClick={() => handleRemoveFavorite(property.MaCHBT)}>
                    <div className="heart-icon">
                      <img src={images['icon_unlike.png']} alt="Unlike" />
                    </div>
                    <p className="unlike-text">Bỏ thích</p>
                  </div>
                </div>
              </div>
            );
          })}
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
        .property-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .property-item {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border-radius: 10px;
          padding: 10px;
          position: relative;
        }
        .property-image {
          width: 270px;
          height: 240px;
          background-size: cover;
          background-position: center;
          border-radius: 5px 5px 0px 0px;
          margin-right: 20px;
        }
        .property-details {
          flex-grow: 1;
        }
        .property-name {
          font-weight: 700;
          font-size: 25px;
          color: #525050;
          margin-bottom: 5px;
        }
        .property-size {
          font-size: 20px;
          color: #A09696;
          margin-bottom: 10px;
        }
        .property-address {
          font-size: 18px;
          color: #525050;
          margin-bottom: 20px;
        }
        .property-icons {
          display: flex;
          gap: 20px;
        }
        .icon {
          width: 24px;
          height: 24px;
          background-size: cover;
          background-position: center;
        }
        .price-unlike-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-right: 20px
        }
        .property-price {
          font-weight: 700;
          font-size: 25px;
          color: #525050;
          margin-bottom: 20px;
        }
        .unlike-button {
          display: flex;
          align-items: center;
          background: #E6EFFF;
          border-radius: 8px;
          padding: 10px 10px;
          cursor: pointer;
          justify-content: center;
        }
        .heart-icon {
          width: 30px;
          height: 30px;
          background-size: cover;
          background-position: center;
          margin-right: 10px;
        }
        .unlike-text {
          font-weight: 700;
          font-size: 25px;
          color: #FFFFFF;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default PageYeuThich;