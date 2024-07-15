import axios from 'axios';

// Tạo một instance của Axios với các cấu hình mặc định
const axiosCustomize = axios.create({
    // Cho phép sử dụng cookies hoặc credential khi gọi API
    withCredentials: true
  });

// Thiết lập interceptors để cập nhật header trước mỗi yêu cầu
axiosCustomize.interceptors.request.use(config => {
  // Cập nhật hoặc thêm Referrer-Policy header vào config
  config.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosCustomize;
