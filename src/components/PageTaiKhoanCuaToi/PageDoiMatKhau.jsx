import React, { useState, useEffect } from 'react';
import axios from 'axios';
import images from '../../images';
import { useNavigate } from 'react-router-dom';

const PageDoiMatKhau = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            const username = localStorage.getItem('username');
            try {
                const response = await axios.get(`http://localhost:3001/api/user/${username}`);
                localStorage.setItem('role', response.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    const handleSave = async () => {
        if (newPassword !== confirmNewPassword) {
            setErrorMessage('Mật khẩu mới và nhập lại mật khẩu mới không khớp');
            return;
        }

        try {
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');
            const response = await axios.put('http://localhost:3001/api/change-password', {
                username,
                currentPassword,
                newPassword,
                role
            });

            setSuccessMessage('Đã cập nhật mật khẩu thành công');
            setErrorMessage('');
        } catch (error) {
            console.error('Lỗi cập nhật mật khẩu:', error);
            setErrorMessage('Mật khẩu cũ không đúng');
            setSuccessMessage('');
        }
    };

    return (
        <div className="app">
            <div className="account-form">
                <h1 className="title">Tài khoản của tôi</h1>
                <div className="form-container">
                    <div className="personal-info">
                        <h2 className="section-title">Thông tin cá nhân</h2>
                        <form>
                            <div className="form-group">
                                <label>Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nhập lại mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                            </div>
                        </form>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        <button className="save-button" onClick={handleSave}>Lưu thay đổi</button>
                    </div>
                    <div className="security-section">
                        <div className="security-box">
                            <button className='security-icon' onClick={() => navigate('/thongtincanhan')}>
                                <img src={images['icon_info.png']} alt="icon_info" />
                                <p>Thông tin cá nhân</p>
                            </button>
                            <div className='security-icon'>
                                <img src={images['icon_pass.png']} alt="icon_pass" />
                                <p>Bảo mật và đăng nhập</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .app {
                    font-family: 'Inter', sans-serif;
                }

                .account-form {
                    width: 100%;
                    height: 750px;
                    position: relative;
                    background: #F2F8FF;
                    border-radius: 25px;
                }

                .title {
                    position: absolute;
                    left: 30px;
                    top: 5px;
                    font-family: 'Inter', sans-serif;
                    font-style: normal;
                    font-weight: 700;
                    font-size: 35px;
                    color: #525050;
                }

                .form-container {
                    display: flex;
                    justify-content: flex-start;
                    position: absolute;
                    top: 95px;
                    left: 55px;
                    gap: 10px; /* Adding gap of 10px between elements */
                    width: calc(100% - 65px);
                    height: 762px;
                }

                .security-section {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    gap: 10px; /* Gap between security boxes */
                }

                .security-box {
                    width: 300px;
                    height: 120px;
                    background: #FFFFFF;
                    border-radius: 25px;
                    position: relative;
                    cursor: pointer; /* Make it clickable */
                }

                .security-icon {
                    margin-top: 15px;
                    margin-left: 15px;
                    display: flex; 
                    align-items: center;
                    text-align: center;
                    margin-right: 3px;
                    border: none;
                    background: none;
                    cursor: pointer;
                }

                .security-icon img {
                    width: 30px;
                    height: 30px;
                }

                .security-icon p {
                    margin: 0 0 0 10px;
                    font-size: 14px;
                    color: #A09696;
                    font-weight: bold;
                }

                .personal-info {
                    width: 1000px;
                    height: 350px;
                    background: #FFFFFF;
                    border-radius: 25px;
                }

                .section-title {
                    font-family: 'Inter', sans-serif;
                    font-style: normal;
                    font-weight: 700;
                    font-size: 24px;
                    color: #525050;
                    padding-left: 20px;
                    padding-bottom:15px;
                }

                .form-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .form-group label {
                    width: 200px;
                    font-family: 'Inter', sans-serif;
                    font-style: normal;
                    font-weight: 700;
                    font-size: 18px;
                    color: #A09696;
                    padding-left: 20px;
                }

                .form-group input {
                    width: 700px;
                    height: 35px;
                    padding: 5px;
                    margin-left: 10px;
                    background: #FFFFFF;
                    border: 1px solid #525050;
                    border-radius: 10px;
                }

                .save-button {
                    width: 323px;
                    height: 57px;
                    background: #F1A22A;
                    border-radius: 5px;
                    font-family: 'Inter', sans-serif;
                    font-weight: 700;
                    font-size: 22px;
                    color: #FFFFFF;
                    margin: 30px auto;
                    display: block;
                }

                .error-message {
                    color: red;
                    font-family: 'Inter', sans-serif;
                    font-size: 16px;
                    text-align: center;
                    margin-bottom: 10px;
                }

                .success-message {
                    color: green;
                    font-family: 'Inter', sans-serif;
                    font-size: 16px;
                    text-align: center;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
};

export default PageDoiMatKhau;