import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  // Bạn có thể thêm các cài đặt mặc định khác ở đây
  timeout: 60000,
  // headers: {'X-Custom-Header': 'foobar'}
});

// Interceptor cho Request
axiosInstance.interceptors.request.use(
  (config) => {
    // Bạn có thể chỉnh sửa config của request trước khi nó được gửi đi
    // Ví dụ: thêm token xác thực vào header
    const token = localStorage.getItem("token"); // Giả sử bạn lưu token trong localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("Starting Request", JSON.stringify(config, null, 2));
    return config;
  },
  (error) => {
    // Xử lý lỗi của request
    console.error("Request Error", error);
    return Promise.reject(error);
  }
);

// Interceptor cho Response
axiosInstance.interceptors.response.use(
  (response) => {
    // Bất kỳ mã trạng thái nào nằm trong phạm vi 2xx sẽ kích hoạt hàm này
    console.log("Response:", JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    // Bất kỳ mã trạng thái nào nằm ngoài phạm vi 2xx sẽ kích hoạt hàm này
    // Bạn có thể xử lý lỗi toàn cục ở đây
    console.error("Response Error:", error.response);
    return Promise.reject(error);
  }
);

export default axiosInstance;
