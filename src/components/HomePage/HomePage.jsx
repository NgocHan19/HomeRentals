import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import images from '../../images';

const HomePage = ({ setPostsOnHomePage, isPosted }) => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/can-ho-biet-thu')
      .then(response => {
        console.log('Data fetched from API:', response.data);
        setProperties(response.data);
        setPostsOnHomePage(response.data); // Truyền dữ liệu lên trên
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi tìm nạp thuộc tính!', error);
      });
  }, [isPosted]); // Theo dõi isPosted để cập nhật danh sách khi có thay đổi

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/chitiet/${propertyId}`);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageItems = properties.slice(offset, offset + itemsPerPage);

  return (
    <div className="home-page">
      <div className="divider top-divider"></div>
      <div className="featured">
        <span className="featured-text">Nổi bật</span>
        <img src={images['down_arrow.png']} alt="Down Arrow" className="down-arrow" />
      </div>
      <div className="property-list">
        {currentPageItems.length > 0 ? currentPageItems.map((property, index) => (
          <div className="property-card" key={index} onClick={() => handlePropertyClick(property.MaCHBT)}>
            <img src={property.HinhCHBT ? `http://localhost:3001/${property.HinhCHBT.split(',')[0]}` : ''} alt="Property" className="property-image" />
            <div className="property-price">
              {property.GiaTien.toLocaleString('vi-VN')} VND/tháng
              <img src={images['icon_heart.png']} alt="Heart" className="heart-icon"/>
            </div>
            <div className="property-details">
              <span className="property-name">{property.TenCHBT}</span>
              <span className="property-address">
                {property.DiaChi}
              </span>
              <div className="property-icons">
                <div className="property-icon-group">
                  <img src={images['icon_bed.png']} alt="Bed" className="property-icon" />
                  <span>{property.SoPhongNgu}</span>
                </div>
                <div className="property-icon-group">
                  <img src={images['icon_bat.png']} alt="Bathtub" className="property-icon" />
                  <span>{property.SoPhongTam}</span>
                </div>
                <div className="property-icon-group">
                  <img src={images['icon_area.png']} alt="Area" className="property-icon" />
                  <span>{property.DienTich} m²</span>
                </div>
              </div>
            </div>
          </div>
        )) : <p>No properties available</p>}
      </div>
      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={Math.ceil(properties.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
      <style jsx>{`
        .home-page {
          padding: 20px;
          background: #FFFFFF;
        }
        .divider {
          width: 100%;
          height: 2px;
          background: #D8D8D8;
          margin: 20px 0;
        }
        .top-divider {
          margin-top: 0;
        }
        .featured {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 8px;
        }
        .featured-text {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          color: #625E5E;
        }
        .down-arrow {
          width: 24px;
          height: 27px;
          margin-left: 10px;
        }
        .property-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .property-card {
          width: calc(25% - 15px);
          background: #FFFFFF;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 30px;
          position: relative;
          cursor: pointer;
        }
        .property-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .property-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 24px;
          color: #525050;
        }
        .property-details {
          padding: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          color: #343333;
        }
        .property-name {
          display: block;
          margin-bottom: 5px;
        }
        .property-address {
          color: #787676;
          display: block;
          margin-bottom: 10px;
        }
        .property-icons {
          display: flex;
          gap: 10px;
        }
        .property-icon-group {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .property-icon {
          width: 24px;
          height: auto;
        }
        .heart-icon {
          width: 30px;
          height: 27px;
        }
        .pagination {
          display: flex;
          justify-content: center;
          padding: 20px;
          list-style: none;
        }
        .pagination li {
          margin: 0 5px;
        }
        .pagination li a {
          padding: 8px 12px;
          border: 1px solid #ddd;
          color: #333;
          cursor: pointer;
        }
        .pagination li.active a {
          background-color: #337ab7;
          color: white;
          border: 1px solid #337ab7;
        }
      `}</style>
    </div>
  );
};

export default HomePage;