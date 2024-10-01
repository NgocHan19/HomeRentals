import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('DanhSachTaiKhoan');
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

  const fetchTableData = (section) => {
    let endpoint = '';
    switch (section) {
      case 'DanhSachTaiKhoan':
        endpoint = '/api/danhsachtaikhoan';
        break;
      case 'ChuChoThueViPham':
        endpoint = '/api/chuchothuevipham';
        break;
      case 'KhachHangViPham':
        endpoint = '/api/khachhangvipham';
        break;
      case 'DanhSachNhanVien':
        endpoint = '/api/nhanvien';
        break;
      case 'GiaoDichHoanTien':
        endpoint = '/api/quanlyhoantien';
        break;
      case 'BaoCaoThongKe':
        endpoint = `/api/bookings?month=1&year=2024&MaCCT=${userId}`; // Sử dụng userId để lấy dữ liệu báo cáo
        break;
      case 'DoanhThu':
        endpoint = `/api/bookings?month=1&year=2024&MaCCT=${userId}`; // Sử dụng userId để lấy dữ liệu doanh thu
        break;
      default:
        endpoint = '';
    }

    axios.get(`http://localhost:3001${endpoint}`)
      .then(response => {
        setTableData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchTableData(activeSection);
  }, [activeSection]);

  const renderTableHeaders = () => {
    switch (activeSection) {
      case 'DanhSachTaiKhoan':
        return ['Tên tài khoản', 'Role'];
      case 'ChuChoThueViPham':
      case 'KhachHangViPham':
        return ['Mã', 'Lỗi vi phạm', 'Số lần vi phạm', 'Xem chi tiết'];
      case 'DanhSachNhanVien':
        return ['Mã NV', 'Họ và tên', 'Bộ phận', 'Vị trí', 'Hành động'];
      case 'QuanLyHoanTien':
        return ['Mã', 'Ngày', 'Số tiền', 'Trạng thái', 'Hành động'];
      case 'BaoCaoThongKe':
        return ['Mã báo cáo', 'Tên báo cáo', 'Ngày tạo', 'Tải xuống'];
      case 'DoanhThu':
        return ['Tháng', 'Doanh thu', 'Lợi nhuận'];
      default:
        return [];
    }
  };

  const renderTableRows = () => {
    switch (activeSection) {
      case 'DanhSachTaiKhoan':
        return tableData.map(row => (
          <tr key={row.TenTK}>
            <td>{row.TenTK}</td>
            <td>{row.role}</td>
          </tr>
        ));
      case 'ChuChoThueViPham':
      case 'KhachHangViPham':
        return tableData.map(row => (
          <tr key={row.Ma}>
            <td>{row.Ma}</td>
            <td>{row.LoiVP}</td>
            <td>{row.SoLan}</td>
            <td><button onClick={() => handleViewDetails(row.Ma)}>Xem chi tiết</button></td>
          </tr>
        ));
      case 'DanhSachNhanVien':
return tableData.map(row => (
          <tr key={row.MaNV}>
            <td>{row.MaNV}</td>
            <td>{row.HoTenNV}</td>
            <td>{row.BoPhan}</td>
            <td>{row.ViTri}</td>
            <td>
              <button onClick={() => handleEdit(row.MaNV)}>Chỉnh sửa</button>
              <button onClick={() => handleDelete(row.MaNV)}>Xóa</button>
            </td>
          </tr>
        ));
      case 'QuanLyHoanTien':
        return tableData.map(row => (
          <tr key={row.Ma}>
            <td>{row.Ma}</td>
            <td>{row.Ngay}</td>
            <td>{row.SoTien}</td>
            <td>{row.TrangThai}</td>
            <td>
              <button onClick={() => handleEdit(row.Ma)}>Chỉnh sửa</button>
              <button onClick={() => handleDelete(row.Ma)}>Xóa</button>
            </td>
          </tr>
        ));
      case 'BaoCaoThongKe':
        return tableData.map(row => (
          <tr key={row.MaBaoCao}>
            <td>{row.MaBaoCao}</td>
            <td>{row.TenBaoCao}</td>
            <td>{row.NgayTao}</td>
            <td><button onClick={() => handleDownload(row.MaBaoCao)}>Tải xuống</button></td>
          </tr>
        ));
      case 'DoanhThu':
        return tableData.map(row => (
          <tr key={row.Thang}>
            <td>{row.Thang}</td>
            <td>{row.DoanhThu}</td>
            <td>{row.LoiNhuan}</td>
          </tr>
        ));
      default:
        return null;
    }
  };

  const handleViewDetails = (id) => {
    console.log('View details for', id);
    // Fetch and display details for the selected violation
  };

  const handleEdit = (id) => {
    console.log('Edit', id);
    // Handle edit action
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
    // Handle delete action
  };

  const handleDownload = (id) => {
    console.log('Download report', id);
    // Handle download action
  };

  const renderSectionLinks = () => {
    const sections = [];
    if (role === 'giamdoc') {
      sections.push('DanhSachTaiKhoan', 'ChuChoThueViPham', 'KhachHangViPham', 'DanhSachNhanVien', 'QuanLyHoanTien', 'BaoCaoThongKe', 'DoanhThu');
    } else if (role === 'TPTC') {
      sections.push('QuanLyHoanTien', 'BaoCaoThongKe', 'DoanhThu');
    } else if (role === 'TVTC') {
      sections.push('QuanLyHoanTien', 'DoanhThu');
    } else if (role === 'NVKD') {
      sections.push('ChuChoThueViPham', 'BaoCaoThongKe');
    } else if (role === 'NVCSKH') {
      sections.push('KhachHangViPham', 'BaoCaoThongKe');
    }
    return sections;
  };

  return (
    <div style={styles.adminPage}>
      <nav style={styles.sidebar}>
        <div style={styles.welcome}>
          Chào Admin
        </div>
        <ul style={styles.ul}>
          {renderSectionLinks().map(section => (
            <li
              key={section}
              style={activeSection === section ? { ...styles.li, ...styles.activeLi } : styles.li}
              onClick={() => setActiveSection(section)}
            >
{section}
            </li>
          ))}
        </ul>
        <button style={styles.backButton} onClick={() => navigate('/')}>Quay về trang chủ</button>
      </nav>
      <div style={styles.content}>
        <h1>{activeSection}</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              {renderTableHeaders().map(header => <th style={styles.th} key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  adminPage: {
    display: 'flex',
    fontFamily: 'Arial, sans-serif',
  },
  sidebar: {
    width: '200px',
    backgroundColor: '#333',
    color: '#fff',
    height: '100vh',
    paddingTop: '20px',
    position: 'fixed',
    overflowY: 'auto',
  },
  welcome: {
    padding: '10px 20px',
    fontWeight: 'bold',
    color: 'red'
  },
  ul: {
    listStyle: 'none',
    padding: 0,
  },
  li: {
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  activeLi: {
    backgroundColor: '#555',
  },
  backButton: {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    marginTop: '20px',
    width: '190px',
    textAlign: 'center',
  },
  content: {
    marginLeft: '220px',
    padding: '20px',
    flexGrow: 1,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'left',
    padding: '10px',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  '@media (max-width: 768px)': {
    sidebar: {
      width: '100%',
      height: 'auto',
      position: 'relative',
    },
    content: {
      marginLeft: '0',
    },
    li: {
      display: 'inline-block',
      width: 'auto',
    },
  },
};

export default AdminPage;
