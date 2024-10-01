import React from 'react';
import images from '../../images';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-section logos">
          <img src={images['icon_BCT.png']} alt="Bo Cong Thuong" className="icon large"/>
          <div className="social-icons">
            <img src={images['icon_tiktok.png']} alt="TikTok" className="icon"/>
            <img src={images['icon_fb.png']} alt="Facebook" className="icon"/>
            <img src={images['icon_ytb.png']} alt="YouTube" className="icon"/>
          </div>
          {/* <div className="partner-logos">
            <img src={images['logo_agoda.png']} alt="Agoda" className="logo"/>
            <img src={images['logo_booking.png']} alt="Booking" className="logo"/>
            <img src={images['logo_priceline.png']} alt="Priceline" className="logo"/>
          </div> */}
        </div>

        <div className="footer-section info-section">
          <h3>Hỗ Trợ</h3>
          <p>Email: Minhtri@gmail.com</p>
        </div>

        <div className="footer-section info-section">
          <h3>Thông tin</h3>
          <p>Văn phòng công ty</p>
          <p>Mã số thuế</p>
          <p>Địa Chỉ: SVH, quận 10, TP HCM</p>
        </div>

        <div className="footer-section info-section">
          <h3>Liên hệ</h3>
          <p>Hotline: 0123456789</p>
          <p>Liên Hệ Hợp Tác</p>
          <p>Liên Hệ Nhân Viên Tư Vấn</p>
          <p>Liên Hệ Lễ Tân</p>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background: #FFFFFF;
          color: #525050;
          padding: 10px 0;
          text-align: center;
          border-top: 1px solid #e7e7e7;
        }
        
        .footer .container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .footer-section {
          margin: 10px;
        }
        
        .footer-section h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .footer-section p {
          margin: 5px 0;
        }
        
        .logos {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .logos .icon.large {
          width: 200px;
          height: auto;
          margin-bottom: 10px;
        }
        
        .social-icons, .partner-logos {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        
        .social-icons .icon {
          width: 40px;
          height: auto;
        }
        
        .partner-logos .logo {
          width: 100px;
          height: auto;
        }
        
        .info-section {
          text-align: left;
        }
        
        @media (max-width: 768px) {
          .footer .container {
            flex-direction: column;
            align-items: center;
          }
        
          .footer-section {
            text-align: center;
          }
        
          .info-section {
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;