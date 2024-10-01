import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const MainLayout = ({ children, role }) => {
  return (
    <div className="main-layout">
      <Header role={role} />
      <div className="content">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;