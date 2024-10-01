import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import images from '../../images';

const PageDangThongTinMoi = ({ setIsPosted }) => {
  const [showForm, setShowForm] = useState(false);
  const [showDropdownPhongCach, setShowDropdownPhongCach] = useState(false);
  const [showDropdownDienTich, setShowDropdownDienTich] = useState(false);
  const [formData, setFormData] = useState({
    tenCanHo: '',
    loaiCongTrinh: '',
    phongCach: '',
    dienTich: '',
    tinhThanhPho: '',
    quanHuyen: '',
    xaPhuong: '',
    duongPho: '',
    giaTien: '',
    soPhongNgu: '',
    soPhongTam: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { post, isEditMode } = location.state || {};

  useEffect(() => {
    if (isEditMode && post) {
      setFormData({
        tenCanHo: post.TenCHBT,
        loaiCongTrinh: post.LoaiCongTrinh,
        phongCach: post.PhongCach,
        dienTich: post.DienTich,
        tinhThanhPho: post.Tinh_TP,
        quanHuyen: post.Quan_Huyen,
        xaPhuong: post.Xa_Phuong,
        duongPho: post.Duong_Pho,
        giaTien: post.GiaTien,
        soPhongNgu: post.SoPhongNgu,
        soPhongTam: post.SoPhongTam
      });
      setSelectedFiles(post.HinhCHBT.split(',').map(url => ({ preview: `http://localhost:3001/${url}` })));
    }
  }, [isEditMode, post]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleDropdown = (dropdown) => {
    if (dropdown === 'phongCach') {
      setShowDropdownPhongCach(!showDropdownPhongCach);
      setShowDropdownDienTich(false);
    } else if (dropdown === 'dienTich') {
      setShowDropdownDienTich(!showDropdownDienTich);
      setShowDropdownPhongCach(false);
    }
  };

  const selectValue = (dropdown, value) => {
    setFormData({ ...formData, [dropdown]: value });
    if (dropdown === 'phongCach') {
      setShowDropdownPhongCach(false);
    } else if (dropdown === 'dienTich') {
      setShowDropdownDienTich(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({ preview: URL.createObjectURL(file), file }));
    setSelectedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImages = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataWithImages.append(key, formData[key]);
    });

    selectedFiles.forEach(({ file }) => {
      if (file) formDataWithImages.append('images', file);
    });

    const userId = localStorage.getItem('userId');
    if (userId) {
      formDataWithImages.append('maCCT', userId);
    } else {
      console.error('Không tìm thấy mã người dùng trong localStorage');
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3001/api/can-ho-biet-thu/${post.MaCHBT}`, formDataWithImages, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Chỉnh sửa bài thành công!');
      } else {
        await axios.post('http://localhost:3001/api/can-ho-biet-thu', formDataWithImages, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Đăng bài thành công!');
      }
      setIsPosted(true);
      navigate('/');
    } catch (error) {
      console.error('Đăng bài thất bại:', error);
      alert('Đăng bài thất bại, vui lòng thử lại.');
    }
  };

  return (
    <div className="app">
      <div className="main-container">
        <div className='main-form'>
          <div className="header-instruct">
            <img src={images['icon_HDTBV.png']} alt="Menu" className="menu-icon" />
            <h1 className="header-title">Hướng dẫn tạo bài viết</h1>
            <p className='note-title'>*Hãy đọc thật kĩ trước khi đăng bài nhé!</p>
            <img src={images['icon_down.png']} alt="Toggle Form" className="toggle-button" onClick={toggleForm} />
            {showForm && (
              <div className="instruction-form">
                <h2>Tiêu đề bài đăng:</h2>
                <p>Phải rõ ràng và phản ánh đúng nội dung của căn hộ, biệt thự cho thuê.</p>
                <h2>Mô tả chi tiết:</h2>
                <p>Phải cung cấp mô tả chi tiết về căn hộ/biệt thự, bao gồm diện tích, số phòng ngủ, số phòng tắm, tiện nghi, và các dịch vụ đi kèm.</p>
                <h2>Hình ảnh:</h2>
                <p>Bài đăng phải có ít nhất 3 hình ảnh rõ ràng của căn hộ/biệt thự. Hình ảnh phải là ảnh thật, không chấp nhận ảnh mờ, ảnh giả, hoặc ảnh từ internet.</p>
                <h2>Giá thuê:</h2>
                <p>Phải minh bạch và rõ ràng. Không được phép để giá thuê 0 hoặc số âm hoặc quá thấp so với giá trị thực tế của căn hộ/biệt thự.</p>
                <h2>Địa chỉ cụ thể:</h2>
                <p>Phải cung cấp địa chỉ cụ thể của căn hộ/biệt thự, bao gồm số nhà, đường/phố, phường/xã, quận/huyện, và tỉnh/thành phố.</p>
                <h2>Địa chỉ phải chính xác:</h2>
                <p>Hệ thống sẽ kiểm tra tính chính xác của địa chỉ thông qua dịch vụ bản đồ và xác thực địa chỉ.</p>
                <h2>Ngôn ngữ sử dụng:</h2>
                <p>Bài đăng phải sử dụng ngôn ngữ chuẩn, không dùng ngôn ngữ thô tục, viết tắt, hoặc từ ngữ không phù hợp.</p>
              </div>
            )}
          </div>
          <div className="form-section">
            <h2 className="form-title">{isEditMode ? 'Chỉnh sửa bài viết' : 'Hoàn thiện thông tin'}</h2>
            <p className="form-description">
              Hãy hoàn thiện thông tin thật cẩn thận để chúng tôi hiểu rõ về không gian của bạn
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="tenCanHo" className="form-label">Tên căn hộ, biệt thự</label>
                    <input type="text" id="tenCanHo" className="form-input" placeholder="Nhập tên căn hộ, biệt thự" onChange={handleChange} value={formData.tenCanHo} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="loaiCongTrinh" className="form-label">Loại công trình</label>
                    <input type="text" id="loaiCongTrinh" className="form-input" placeholder="Chọn loại công trình" onChange={handleChange} value={formData.loaiCongTrinh} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phongCach" className="form-label">Phong cách</label>
                    <input type="text" id="phongCach" className="form-input" placeholder="Phong cách" onClick={() => toggleDropdown('phongCach')} readOnly value={formData.phongCach} />
                    {showDropdownPhongCach && (
                      <div className="dropdown">
                        {['Đương đại', 'Hiện đại', 'Tối giản', 'Truyền thống', 'Cổ điển', 'Tân cổ điển', 'Scandinavian', 'Vintage'].map((item) => (
                          <div key={item} className="dropdown-item" onClick={() => selectValue('phongCach', item)}>{item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="dienTich" className="form-label">Diện tích (m2)</label>
                    <input type="text" id="dienTich" className="form-input" placeholder="Chọn khoảng diện tích" onClick={() => toggleDropdown('dienTich')} readOnly value={formData.dienTich} />
                    {showDropdownDienTich && (
                      <div className="dropdown">
                        {['Dưới 50 m2', '50 - 100', '100- 150', '150- 300', '300 trở lên'].map((item) => (
                          <div key={item} className="dropdown-item" onClick={() => selectValue('dienTich', item)}>{item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="tinhThanhPho" className="form-label">Tỉnh/Thành Phố</label>
                    <input type="text" id="tinhThanhPho" className="form-input" placeholder="Nhập tên Tỉnh/Thành Phố" onChange={handleChange} value={formData.tinhThanhPho} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quanHuyen" className="form-label">Quận/Huyện</label>
                    <input type="text" id="quanHuyen" className="form-input" placeholder="Nhập tên Quận/Huyện" onChange={handleChange} value={formData.quanHuyen} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="xaPhuong" className="form-label">Xã/Phường</label>
                    <input type="text" id="xaPhuong" className="form-input" placeholder="Nhập tên Xã/Phường" onChange={handleChange} value={formData.xaPhuong} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="duongPho" className="form-label">Đường phố</label>
                    <input type="text" id="duongPho" className="form-input" placeholder="Nhập tên Đường phố" onChange={handleChange} value={formData.duongPho} />
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="giaTien" className="form-label">Giá tiền (VNĐ)</label>
                    <input type="text" id="giaTien" className="form-input" placeholder="Nhập giá tiền" onChange={handleChange} value={formData.giaTien} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="soPhongNgu" className="form-label">Số phòng ngủ</label>
                    <input type="text" id="soPhongNgu" className="form-input" placeholder="Nhập số phòng ngủ" onChange={handleChange} value={formData.soPhongNgu} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="soPhongTam" className="form-label">Số phòng tắm</label>
                    <input type="text" id="soPhongTam" className="form-input" placeholder="Nhập số phòng tắm" onChange={handleChange} value={formData.soPhongTam} />
                  </div>
                </div>
              </div>
              <div className="image-section">
                <h2 className="image-title">Thông tin hình ảnh</h2>
                <p className='note-image'>*Up ít nhất 3 ảnh cho bài đăng để đạt hiệu quả tốt nhất!</p>
                <div className="image-upload">
                  <input type="file" id="file" className="file-input" multiple onChange={handleFileChange} />
                  <label htmlFor="file" className="file-label">
                    <img src={images['icon_danganh.png']} alt="Camera" className="camera-icon" />
                    <p className="image-upload-text">Thêm ảnh</p>
                  </label>
                </div>
                <div className="uploaded-images">
                  {selectedFiles.map((file, index) => (
                    <img key={index} src={file.preview} alt={`Preview ${index}`} className="uploaded-image" />
                  ))}
                </div>
                <button type="submit" className="submit-button">{isEditMode ? 'Cập nhật bài viết' : 'Đăng bài'}</button>
                <button type="button" className="back-button" onClick={() => navigate(-1)}>Quay lại</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        .app {
          font-family: 'Inter', sans-serif;
        }
        
        .main-container {
          width: 100%;
          min-height: 1900px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #F2F8FF;
          border-radius: 25px;
          padding: 20px;
          position: relative;
          z-index: 1;
        }
        
        .main-form {
          width: 90%;
          background: #FFFFFF;
          border-radius: 25px;
          min-height: 1800px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        .header-instruct {
          box-sizing: border-box;
          width: 100%;
          height: 150px;
          background: #FFFFFF;
          border: 1px solid #525050; /* Thêm viền cho khung */
          border-radius: 25px;
          position: relative;
          z-index: 2;
        }
        
        .menu-icon {
          position: absolute;
          width: 30px;
          height: 30px;
          left: 15px;
          top: 16px;
        }

        .header-title {
          position: absolute;
          left: 40px;
          top: 14px;
          padding-left: 10px;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 36px;
          color: #525050;
        }
        
        .note-title {
          position: absolute;
          left: 40px;
          top: 60px;
          color: #C3C577;
        }
        
        .toggle-button {
          position: absolute;
          right: 20px;
          top: 45px;
          width: 40px;
          height: 40px;
          background-color: transparent;
          border: none;
          cursor: pointer;
        }
        
        .instruction-form {
          position: absolute;
          width: calc(100% - 400px);
          height: 300px;
          top: 100px;
          left: 380px;
          background: #FFFFFF;
          border: 1px solid #525050;
          border-radius: 25px;
          padding: 20px;
          overflow-y: auto;
          z-index: 3;
        }
        
        .instruction-form h2 {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 24px;
          color: #525050;
        }
        
        .instruction-form p {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;
          color: #525050;
          margin-bottom: 10px;
        }
        
        .form-section {
          box-sizing: border-box;
          width: 100%;
          height: auto;
          background: #FFFFFF;
          border: 1px solid #525050;
          border-radius: 25px;
          margin-top: 20px;
        }
        
        .form-title {
          padding-left: 40px;
          padding-top: 20px;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          color: #525050;
        }
        
        .form-description {
          padding-left: 40px;
          padding-top: 5px;
          font-family: 'Inter';
          font-style: italic;
          font-weight: 400;
          font-size: 20px;
          line-height: 24px;
          color: #A09696;
        }
        
        .form-group {
          margin-bottom: 20px;
          margin-left: 55px;
          display: flex;
          flex-direction: column;
        }
        
        .form-label {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-size: 18px;
          line-height: 22px;
          color: #525050;
          margin-bottom: 5px;
        }
        
        .form-input {
          width: 550px;
          height: 50px;
          box-sizing: border-box;
          background: #FFFFFF;
          border: 1px solid #A09696;
          border-radius: 10px;
          padding: 10px;
        }
        
        form {
          padding-top: 20px;
        }
        
        .form-columns {
          display: flex;
          justify-content: space-between;
        }
        
        .form-column {
          width: 60%;
        }
        
        .dropdown {
          width: 250px;
          background: #FFFFFF;
          border: 1px solid #A09696;
          border-radius: 10px;
          position: absolute;
          z-index: 1000;
        }
        
        .dropdown-item {
          padding: 10px;
          cursor: pointer;
        }
        
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }
        
        .image-section {
          box-sizing: border-box;
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #525050;
          border-radius: 25px;
          padding: 20px;
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .image-title {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 30px;
          color: #525050;
          margin-bottom: 20px;
        }
        
        .image-upload {
          width: 70%;
          height: 250px;
          border: 1px solid #A09696;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-top: 30px;
        }
        
        .file-input {
          display: none;
        }
        
        .file-label {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        
        .camera-icon {
          width: 130px;
          height: 120px;
        }
        
        .note-image {
          color: #C3C577;
        }
        
        .image-upload-text {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 32px;
          line-height: 39px;
          color: #4F6F9F;
          margin-left: 20px;
        }

        .uploaded-images {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .uploaded-image {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 10px;
        }

        .submit-button {
          width: 50%;
          height: 66px;
          background: #F8FB45;
          border-radius: 10px;
          border: 1px solid #4F6F9F; /* Thêm viền cho nút */
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 36px;
          color: #4F6F9F;
          margin-top: 30px;
          cursor: pointer;
          text-align: center;
        }

        .back-button {
          width: 50%;
          height: 66px;
          background: #FFFFFF;
          border: 1px solid #525050;
          border-radius: 10px;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 36px;
          color: #4F6F9F;
          margin-top: 20px;
          cursor: pointer;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default PageDangThongTinMoi;