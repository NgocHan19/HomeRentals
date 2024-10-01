import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Account/Login';
import Register from './components/Account/Register';
import Logout from './components/Account/Logout';
import MainLayout from './layouts/MainLayout';
import SimpleLayout from './layouts/SimpleLayout';
import PageDoiMatKhau from './components/PageTaiKhoanCuaToi/PageDoiMatKhau';
import PageThongTinCaNhan from './components/PageTaiKhoanCuaToi/PageThongTinCaNhan';
import PageDatCHBT from './components/PageDatCHBT/PageDatCHBT';
import PageDangThongTinMoi from './components/PageDangBai/PageDangThongTinMoi';
import PageYeuThich from './components/PageYeuThich/PageYeuThich';
import PageLichSuTT from './components/PageLichSuTT/PageLichSuTT';
import DetailPage from './components/DetailPage/DetailPage';
import PageBaiDaDang from './components/PageDangBai/PageBaiDaDang';
import PageThanhToan from './components/PageDatCHBT/PageThanhToan';
import PageDoanhThuThang from './components/PageDangBai/PageDoanhThuThang';
import AdminPage from './components/AdminPage/AdminPage';
import ReviewForm from './components/ReviewForm/ReviewForm';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [isPosted, setIsPosted] = useState(false);
  const [postsOnHomePage, setPostsOnHomePage] = useState([]);

  const handleAddFavorite = (property) => {
    setFavoriteProperties([...favoriteProperties, property]);
  };

  const handleRemoveFavorite = (propertyId) => {
    setFavoriteProperties(favoriteProperties.filter(property => property.MaCHBT !== propertyId));
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const ProtectedRoute = ({ children, roles }) => {
    if (!roles.includes(role)) {
      return <div>Bạn không có quyền truy cập vào trang này.</div>;
    }
    return children;
  };
  

  return (
    <Router>
      <Routes>
        {/* Routes that use SimpleLayout */}
        <Route path="/login" element={<SimpleLayout><Login setRole={setRole} /></SimpleLayout>} />
        <Route path="/register" element={<SimpleLayout><Register /></SimpleLayout>} />
        <Route path="/logout" element={<SimpleLayout><Logout /></SimpleLayout>} />
        <Route path="/datcanho/:propertyId" element={<SimpleLayout><PageDatCHBT /></SimpleLayout>} />
        <Route path="/thanhtoan" element={<SimpleLayout><PageThanhToan /></SimpleLayout>} />

        {/* Routes that use MainLayout */}
        <Route path="/" element={<MainLayout role={role}><HomePage role={role} favoriteProperties={favoriteProperties} handleAddFavorite={handleAddFavorite} handleRemoveFavorite={handleRemoveFavorite} isPosted={isPosted} setPostsOnHomePage={setPostsOnHomePage} /></MainLayout>} />
        <Route path="/doimatkhau" element={<MainLayout role={role}><PageDoiMatKhau /></MainLayout>} />
        <Route path="/thongtincanhan" element={<MainLayout role={role}><PageThongTinCaNhan /></MainLayout>} />
        <Route path="/dangtinmoi" element={<MainLayout role={role}><PageDangThongTinMoi setIsPosted={setIsPosted} isEditMode={true} /></MainLayout>} />
        <Route path="/yeuthich" element={<MainLayout role={role}><PageYeuThich favoriteProperties={favoriteProperties} handleRemoveFavorite={handleRemoveFavorite} /></MainLayout>} />
        <Route path="/chitiet/:propertyId" element={<MainLayout role={role}><DetailPage favoriteProperties={favoriteProperties} handleAddFavorite={handleAddFavorite} handleRemoveFavorite={handleRemoveFavorite} /></MainLayout>} />
        <Route path="/lichsutt" element={<MainLayout role={role}><PageLichSuTT /></MainLayout>} />
        <Route path="/baidadang" element={<MainLayout role={role}><PageBaiDaDang setPostsOnHomePage={setPostsOnHomePage} setIsPosted={setIsPosted} /></MainLayout>} />
        <Route path="/doanhthu" element={<MainLayout role={role}><PageDoanhThuThang /></MainLayout>} />
        <Route path="/danhgia/:MaDat" element={<MainLayout role={role}><ReviewForm /></MainLayout>} />

        <Route path="/AdminPage" element={<SimpleLayout><AdminPage /></SimpleLayout>} />
      </Routes>
    </Router>
    // <div>
    //   <AdminPage/>
    // </div>
  );
}

export default App;