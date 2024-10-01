import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PageBaiDaDang = ({ setPostsOnHomePage, setIsPosted }) => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('Không tìm thấy mã người dùng trong localStorage');
      return;
    }
    console.log('Fetching posts for userId:', userId);
    axios.get(`http://localhost:3001/api/baidang/${userId}`)
      .then(response => {
        console.log('Fetched posts:', response.data);
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi tìm nạp bài đăng!', error);
      });
  }, []);

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPost) {
      console.log('Đang xóa bài đăng:', selectedPost);
      axios.delete(`http://localhost:3001/api/baidang/${selectedPost.MaCHBT}`)
        .then(response => {
          console.log('Deleted post:', response.data);
          setPosts(posts.filter(post => post.MaCHBT !== selectedPost.MaCHBT));
          setPostsOnHomePage(prevPosts => prevPosts.filter(post => post.MaCHBT !== selectedPost.MaCHBT));
          setIsPosted(prevState => !prevState);
          setIsModalOpen(false);
        })
        .catch(error => {
          console.error('Đã xảy ra lỗi khi xóa bài đăng!', error);
          setErrorMessage(error.response?.data?.message || 'Không thể xóa vì đang có khách đặt!');
          setIsModalOpen(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleEditClick = (post) => {
    axios.get(`http://localhost:3001/api/check-booking/${post.MaCHBT}`)
      .then(response => {
        // If no error, navigate to the edit page
        navigate(`/dangtinmoi`, { state: { post, isEditMode: true } });
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.message || 'Không thể cập nhật vì đang có khách đặt!');
      });
  };

  return (
    <div className="container-baidadang">
      <h1 className="title">Bài viết đã đăng</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {posts.length === 0 ? (
        <p>Không có bài viết nào</p>
      ) : (
        posts.map(post => (
          <div className="post" key={post.MaCHBT}>
            <img src={post.HinhCHBT ? `http://localhost:3001/${post.HinhCHBT.split(',')[0]}` : ''} alt="Property" className="post-image" />
            <div className="post-details">
              <div className="details-top">
                <div>
                  <p className="room-id">ID phòng: {post.MaCHBT}</p>
                  <p className="name">{post.TenCHBT}</p>
                  <p className="address">{post.DiaChi}</p>
                </div>
                <p className="price">{post.GiaTien.toLocaleString('vi-VN')} VND</p>
              </div>
              <div className="details-bottom">
                <div className="buttons">
                  <button className="delete-button" onClick={() => handleDeleteClick(post)}>Xóa bài</button>
                  <button className="edit-button" onClick={() => handleEditClick(post)}>Chỉnh sửa</button>
                  <button className="schedule-button">Lịch đã đặt</button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Xóa bài</h2>
            <p>Bạn chắc chắn muốn xóa bài này?</p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelDelete}>Quay lại</button>
              <button className="confirm-button" onClick={handleConfirmDelete}>Xóa bài</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container-baidadang {
          width: 100%;
          min-height: 100vh;
          background: #F2F8FF;
          border-radius: 25px;
          padding: 20px;
          box-sizing: border-box;
        }

        .title {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 30px;
          line-height: 40px;
          color: #525050;
          margin-bottom: 15px;
        }

        .error-message {
          color: red;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .post {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border-radius: 8px;
          margin-bottom: 20px;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .post-image {
          width: 250px;
          height: 140px;
          border-radius: 8px;
          margin-right: 20px;
        }

        .post-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .details-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .price {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 28px;
          line-height: 58px;
          color: #525050;
          margin-bottom: 10px;
        }

        .room-id, .name, .address, .status {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 15px;
          line-height: 24px;
          color: #A7A2A2;
          margin-bottom: 10px;
        }

        .name {
          font-size: 20px;
          line-height: 36px;
          color: #525050;
        }

        .status {
          font-size: 20px;
          line-height: 36px;
          color: #525050;
        }

        .details-bottom {
          display: flex;
          justify-content: flex-end;
        }

        .buttons {
          display: flex;
          gap: 10px;
        }

        .delete-button, .edit-button, .schedule-button {
          width: 150px;
          height: 50px;
          background: #DFE4FF;
          border-radius: 5px;
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 700;
          font-size: 20px;
          line-height: 30px;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
        }

        .delete-button {
          color: #FF4E4E;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          background: #F2F8FF;
          border-radius: 10px;
          width: 545px;
          padding: 20px;
          text-align: center;
          position: relative;
        }

        .modal h2 {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 34px;
          color: #525050;
          margin-bottom: 15px;
        }

        .modal p {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #A09696;
          margin-bottom: 30px;
        }

        .modal-buttons {
          display: flex;
          justify-content: space-around;
        }

        .cancel-button, .confirm-button {
          width: 160px;
          height: 49px;
          background: #F1A22A;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default PageBaiDaDang;