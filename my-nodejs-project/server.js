const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'user-id']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Kết nối đến database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'newuser',
  password: '123456',
  database: 'HomeRentalDB'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    throw err;
  }
  console.log('Connected to database');
});

// Cấu hình multer để lưu trữ file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Lấy đuôi tệp gốc
    cb(null, Date.now() + ext); // Lưu tệp với tên mới và đuôi tệp gốc
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Phục vụ các tệp tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Đăng ký người dùng
app.post('/api/register', (req, res) => {
  const { TenTK, MatKhau, Email, CCCD, role } = req.body;

  const table = role === 'KH' ? 'KhachHang' : 'ChuChoThue';
  const query = `INSERT INTO ${table} (TenTK, MatKhau, Email, CCCD, role) VALUES (?, AES_ENCRYPT(?, "7v!@g3Xk$8zZ1#Pf"), ?, ?, ?)`;
  db.query(query, [TenTK, MatKhau, Email, CCCD, role], (err, results) => {
    if (err) {
      console.error('Lỗi trong quá trình đăng ký:', err);
      res.status(500).send({ success: false, message: err.message });
    } else {
      res.status(200).send({ success: true, message: 'Đăng ký thành công!' });
    }
  });
});

// API đăng nhập người dùng
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = `
    SELECT MaCCT as userId, 'Chủ cho thuê' AS role FROM ChuChoThue WHERE TenTK = ? AND MatKhau = AES_ENCRYPT(?, '7v!@g3Xk$8zZ1#Pf')
    UNION
    SELECT MaKH as userId, 'Khách hàng' AS role FROM KhachHang WHERE TenTK = ? AND MatKhau = AES_ENCRYPT(?, '7v!@g3Xk$8zZ1#Pf')
  `;

  db.query(query, [username, password, username, password], (error, results) => {
    if (error) {
      console.error('Lỗi truy vấn cơ sở dữ liệu trong khi đăng nhập:', error);
      res.status(500).send({ message: 'Lỗi trong quá trình đăng nhập' });
    } else if (results.length === 0) {
      res.status(401).send({ message: 'Thông tin không hợp lệ' });
    } else {
      const user = results[0];
      res.send({ role: user.role, userId: user.userId });  // Trả về role và userId
    }
  });
});

// API lấy thông tin người dùng
app.get('/api/user/:username', (req, res) => {
  const username = req.params.username;
  const query = `
    SELECT TenTK, Email, SDT, CCCD, NgaySinh, DiaChi, 'Khách hàng' AS role FROM KhachHang WHERE TenTK = ?
    UNION
    SELECT TenTK, Email, SDT, CCCD, NgaySinh, DiaChi, 'Chủ cho thuê' AS role FROM ChuChoThue WHERE TenTK = ?
  `;
  db.query(query, [username, username], (error, results) => {
    if (error) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
      res.status(500).send(error);
    } else {
      if (results.length > 0) {
        res.send(results[0]);
      } else {
        res.status(404).send({ message: 'Không tìm thấy người dùng' });
      }
    }
  });
});

// API cập nhật thông tin người dùng
app.put('/api/user/:username', (req, res) => {
  const username = req.params.username;
  const { Email, SDT, CCCD, NgaySinh, DiaChi, role } = req.body;

  // Chuyển đổi định dạng ngày sinh nếu cần
  const formattedNgaySinh = new Date(NgaySinh).toISOString().substring(0, 10);

  let query = '';

  if (role === 'Khách hàng') {
    query = `
      UPDATE KhachHang SET Email = ?, SDT = ?, CCCD = ?, NgaySinh = ?, DiaChi = ? WHERE TenTK = ?
    `;
    db.query(query, [Email, SDT, CCCD, formattedNgaySinh, DiaChi, username], (error, results) => {
      if (error) {
        console.error('Lỗi cập nhật cơ sở dữ liệu:', error);
        res.status(500).send(error);
      } else {
        res.send({ message: 'Thông tin người dùng được cập nhật thành công' });
      }
    });
  } else if (role === 'Chủ cho thuê') {
    query = `
      UPDATE ChuChoThue SET Email = ?, SDT = ?, CCCD = ?, NgaySinh = ?, DiaChi = ? WHERE TenTK = ?
    `;
    db.query(query, [Email, SDT, CCCD, formattedNgaySinh, DiaChi, username], (error, results) => {
      if (error) {
        console.error('Lỗi cập nhật cơ sở dữ liệu:', error);
        res.status(500).send(error);
      } else {
        res.send({ message: 'Thông tin người dùng được cập nhật thành công' });
      }
    });
  } else {
    res.status(400).send({ message: 'Role không hợp lệ' });
  }
});

// API cập nhật mật khẩu người dùng
app.put('/api/change-password', (req, res) => {
  const { username, currentPassword, newPassword, role } = req.body;

  let checkQuery = '';
  let updateQuery = '';

  if (role === 'Khách hàng') {
    checkQuery = `
      SELECT * FROM KhachHang WHERE TenTK = ? AND MatKhau = AES_ENCRYPT(?, '7v!@g3Xk$8zZ1#Pf')
    `;
    updateQuery = `
      UPDATE KhachHang SET MatKhau = AES_ENCRYPT(?, '7v!@g3Xk$8zZ1#Pf') WHERE TenTK = ?
    `;
  } else if (role === 'Chủ cho thuê') {
    checkQuery = `
      SELECT * FROM ChuChoThue WHERE TenTK = ? AND MatKhau = AES_ENCRYPT(?, '7v!@g3Xk$8zZ1#Pf')
    `;
    updateQuery = `
      UPDATE ChuChoThue SET MatKhau = AES_ENCRYPT(?, '7v!@g3Xk$8zZ1#Pf') WHERE TenTK = ?
    `;
  }

  db.query(checkQuery, [username, currentPassword], (checkError, checkResults) => {
    if (checkError) {
      console.error('Lỗi kiểm tra mật khẩu hiện tại:', checkError);
      res.status(500).send({ message: 'Lỗi kiểm tra mật khẩu hiện tại' });
    } else if (checkResults.length === 0) {
      res.status(401).send({ message: 'Mật khẩu hiện tại không đúng' });
    } else {
      db.query(updateQuery, [newPassword, username], (updateError, updateResults) => {
        if (updateError) {
          console.error('Lỗi cập nhật mật khẩu:', updateError);
          res.status(500).send({ message: 'Lỗi cập nhật mật khẩu' });
        } else {
          res.send({ message: 'Cập nhật mật khẩu thành công' });
        }
      });
    }
  });
});

// API lấy danh sách căn hộ/biệt thự
app.get('/api/can-ho-biet-thu', (req, res) => {
  const query = 'SELECT * FROM CanHoBietThu';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', err);
      res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
    } else {
      const properties = results.map(property => {
        const images = property.HinhCHBT ? property.HinhCHBT.split(',') : [];
        const validImages = images.filter(image => {
          const filePath = path.join(__dirname, image);
          return fs.existsSync(filePath);
        });

        return { ...property, HinhCHBT: validImages.join(',') };
      });
      res.json(properties);
    }
  });
});

// API lấy chi tiết căn hộ/biệt thự theo mã
app.get('/api/can-ho-biet-thu/:id', (req, res) => {
  const propertyId = req.params.id;
  const query = 'SELECT * FROM CanHoBietThu WHERE MaCHBT = ?';
  db.query(query, [propertyId], (error, results) => {
    if (error) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
      res.status(500).send(error);
    } else {
      if (results.length > 0) {
        const property = results[0];
        const images = property.HinhCHBT ? property.HinhCHBT.split(',') : [];
        const validImages = images.filter(image => fs.existsSync(path.join(__dirname, image)));
        
        property.HinhCHBT = validImages.join(',');
        res.send(property);
      } else {
        res.status(404).send({ message: 'Không tìm thấy' });
      }
    }
  });
});

// API thêm mới căn hộ/biệt thự
app.post('/api/can-ho-biet-thu', upload.array('images', 10), (req, res) => {
  const {
    tenCanHo, loaiCongTrinh, phongCach, dienTich, tinhThanhPho,
    quanHuyen, xaPhuong, duongPho, giaTien, soPhongNgu, soPhongTam, maCCT
  } = req.body;

  const images = req.files.map(file => 'uploads/' + file.filename).join(',');

  const query = `
    INSERT INTO CanHoBietThu (
      TenCHBT, LoaiCongTrinh, PhongCach, DienTich, Tinh_TP, Quan_Huyen, 
      Xa_Phuong, Duong_Pho, GiaTien, SoPhongNgu, SoPhongTam, HinhCHBT, MaCCT
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    tenCanHo, loaiCongTrinh, phongCach, dienTich, tinhThanhPho,
    quanHuyen, xaPhuong, duongPho, giaTien, soPhongNgu, soPhongTam, images, maCCT
  ], (err, results) => {
    if (err) {
      console.error('Lỗi chèn cơ sở dữ liệu:', err);
      res.status(500).send({ success: false, message: 'Không thể thêm thuộc tính' });
    } else {
      res.status(200).send({ success: true, message: 'Đã thêm thuộc tính thành công' });
    }
  });
});

// API lấy danh sách căn hộ/biệt thự đã đăng bởi một cct cụ thể
app.get('/api/baidang/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM CanHoBietThu WHERE MaCCT = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', err);
      res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
    } else {
      const properties = results.map(property => {
        const images = property.HinhCHBT ? property.HinhCHBT.split(',') : [];
        const validImages = images.filter(image => {
          const filePath = path.join(__dirname, image);
          return fs.existsSync(filePath);
        });

        return { ...property, HinhCHBT: validImages.join(',') };
      });
      res.json(properties);
    }
  });
});

// API xóa bài viết
app.delete('/api/baidang/:id', (req, res) => {
  const id = req.params.id;
  const checkQuery = `
    SELECT COUNT(*) AS bookingCount
    FROM PhieuDat
    WHERE MaCHBT = ? AND TrangThai IN ('Hoàn tất', 'Đã thanh toán', 'Đang thanh toán')
  `;
  const deleteQuery = 'DELETE FROM CanHoBietThu WHERE MaCHBT = ?';

  db.query(checkQuery, [id], (checkError, checkResults) => {
    if (checkError) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', checkError);
      return res.status(500).send(checkError);
    }

    const bookingCount = checkResults[0].bookingCount;
    if (bookingCount > 0) {
      return res.status(400).send({ message: 'Không thể xóa vì đang có khách đặt!' });
    }

    db.query(deleteQuery, [id], (deleteError, deleteResults) => {
      if (deleteError) {
        console.error('Lỗi xóa cơ sở dữ liệu:', deleteError);
        return res.status(500).send(deleteError);
      }

      res.status(200).send({ message: 'Xóa bài đăng thành công!' });
    });
  });
});

// API kiểm tra xem căn hộ/biệt thự có đang được đặt hay không
app.get('/api/check-booking/:id', (req, res) => {
  const propertyId = req.params.id;
  const query = `
    SELECT COUNT(*) AS bookingCount
    FROM PhieuDat
    WHERE MaCHBT = ? AND TrangThai IN ('Hoàn tất', 'Đã thanh toán', 'Đang thanh toán')
  `;
  db.query(query, [propertyId], (error, results) => {
    if (error) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
      res.status(500).send(error);
    } else {
      const bookingCount = results[0].bookingCount;
      if (bookingCount > 0) {
        res.status(400).send({ message: 'Không thể cập nhật vì đang có khách đặt!' });
      } else {
        res.status(200).send({ message: 'Có thể chỉnh sửa' });
      }
    }
  });
});

// API cập nhật căn hộ/biệt thự
app.put('/api/can-ho-biet-thu/:id', upload.array('images', 10), (req, res) => {
  const propertyId = req.params.id;
  const {
    tenCanHo, loaiCongTrinh, phongCach, dienTich, tinhThanhPho,
    quanHuyen, xaPhuong, duongPho, giaTien, soPhongNgu, soPhongTam, maCCT
  } = req.body;

  const images = req.files.map(file => 'uploads/' + file.filename).join(',');

  const checkQuery = `
    SELECT COUNT(*) AS bookingCount
    FROM PhieuDat
    WHERE MaCHBT = ? AND TrangThai IN ('Hoàn tất', 'Đã thanh toán', 'Đang thanh toán')
  `;
  const updateQuery = `
    UPDATE CanHoBietThu SET 
      TenCHBT = ?, LoaiCongTrinh = ?, PhongCach = ?, DienTich = ?, Tinh_TP = ?, Quan_Huyen = ?, 
      Xa_Phuong = ?, Duong_Pho = ?, GiaTien = ?, SoPhongNgu = ?, SoPhongTam = ?, HinhCHBT = ? 
    WHERE MaCHBT = ? AND MaCCT = ?
  `;

  db.query(checkQuery, [propertyId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', checkError);
      return res.status(500).send(checkError);
    }

    const bookingCount = checkResults[0].bookingCount;
    if (bookingCount > 0) {
      return res.status(400).send({ message: 'Không thể cập nhật vì đang có khách đặt!' });
    }

    db.query(updateQuery, [
      tenCanHo, loaiCongTrinh, phongCach, dienTich, tinhThanhPho,
      quanHuyen, xaPhuong, duongPho, giaTien, soPhongNgu, soPhongTam, images, propertyId, maCCT
    ], (updateError, updateResults) => {
      if (updateError) {
        console.error('Lỗi cập nhật cơ sở dữ liệu:', updateError);
        return res.status(500).send(updateError);
      }

      res.status(200).send({ message: 'Cập nhật bài đăng thành công!' });
    });
  });
});

//API lấy phiếu đánh giá
app.get('/api/phieu-dat/:maCHBT/danh-gia', (req, res) => {
  const { maCHBT } = req.params;
  const query = `
    SELECT PDG.*
    FROM PhieuDanhGia PDG
    JOIN PhieuDat PD ON PD.MaPDG = PDG.MaPDG
    WHERE PD.MaCHBT = ?
  `;
  db.query(query, [maCHBT], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
});

//API lấy lịch sử thanh toán
app.get('/api/payment-history/:userId', (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT PD.*, CONCAT_WS(', ', CHBT.Duong_Pho, CHBT.Xa_Phuong, CHBT.Quan_Huyen, CHBT.Tinh_TP) AS DiaChi
    FROM PhieuDat PD
    JOIN CanHoBietThu CHBT ON PD.MaCHBT = CHBT.MaCHBT
    WHERE PD.MaKH = ?
  `;
  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Lỗi truy vấn cơ sở dữ liệu:', error);
      res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
    } else {
      res.json(results);
    }
  });
});

// API lưu thông tin đặt phòng
app.post('/api/phieu-dat', (req, res) => {
  const { bookingType, hoTen, fullName, email, sdt, cccd, yeuCau, ngayNhan, ngayTra, maCHBT, tongTien } = req.body;

  const maKH = req.headers['user-id']; // Lấy mã KH
  if (!maKH) {
    return res.status(400).send({ success: false, message: 'User ID is missing in the request headers' });
  }

  const hoTenKH = bookingType === 'guest' ? hoTen : fullName; 
  const hoaHong = tongTien * 0.15; 

  const query = `
    INSERT INTO PhieuDat (
      TrangThai, TongTien, HoTenKH, Email, YeuCau, HoaHong, CCCD, SDT, NgayDat, NgayGioNhan, NgayGioTra, MaCHBT, MaKH
    ) VALUES (
      'Đã thanh toán', ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?
    )
  `;

  db.query(query, [
    tongTien, hoTenKH, email, yeuCau, hoaHong, cccd, sdt, ngayNhan, ngayTra, maCHBT, maKH
  ], (error, results) => {
    if (error) {
      console.error('Lỗi chèn cơ sở dữ liệu:', error);
      res.status(500).send({ success: false, message: 'Failed to create booking' });
    } else {
      res.status(200).send({ success: true, message: 'Booking created successfully', maDat: results.insertId });
    }
  });
});

//API lấy thông tin phiếu đặt theo MaCCT
app.get('/api/bookings', (req, res) => {
  const { month, year, MaCCT } = req.query;
  const query = `
    SELECT * FROM PhieuDat 
    WHERE MONTH(NgayDat) = ? AND YEAR(NgayDat) = ? AND MaCCT = ? AND TrangThai = 'Hoàn tất'
  `;
  connection.query(query, [month, year, MaCCT], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results);
    }
  });
});

// API lưu đánh giá của người dùng
app.post('/api/review', (req, res) => {
  const { HangMucDG, TienNghi, DichVuHoTro, GiaCa, NhanXetThem, MaKH, MaDat } = req.body;
  const query = `
    INSERT INTO PhieuDanhGia (HangMucDG, TienNghi, DichVuHoTro, GiaCa, NhanXetThem, MaKH)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [HangMucDG, TienNghi, DichVuHoTro, GiaCa, NhanXetThem, MaKH], (error, results) => {
    if (error) {
      console.error('Lỗi chèn cơ sở dữ liệu:', error);
      res.status(500).send({ success: false, message: 'Failed to submit review' });
    } else {
      // Cập nhật mã đánh giá vào phiếu đặt
      const MaPDG = results.insertId;
      const updateBookingQuery = `
        UPDATE PhieuDat
        SET MaPDG = ?
        WHERE MaDat = ?
      `;
      db.query(updateBookingQuery, [MaPDG, MaDat], (updateError, updateResults) => {
        if (updateError) {
          console.error('Lỗi cập nhật cơ sở dữ liệu:', updateError);
          res.status(500).send({ success: false, message: 'Failed to update booking with review ID' });
        } else {
          res.status(200).send({ success: true, message: 'Review submitted successfully' });
        }
      });
    }
  });
});

// API để hủy đặt phòng
app.post('/api/phieudat/cancel', (req, res) => {
  const { MaDat } = req.body;
  const query = 'UPDATE PhieuDat SET TrangThai = "Đã hủy" WHERE MaDat = ?';
  db.query(query, [MaDat], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('Đã hủy đặt phòng thành công');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});