# Troubleshooting - Màn hình trắng

## Các bước kiểm tra:

1. **Mở Developer Console (F12)** và kiểm tra lỗi:
   - Lỗi JavaScript sẽ hiển thị ở đây
   - Kiểm tra tab Console và Network

2. **Kiểm tra backend có đang chạy không:**
   ```bash
   cd backend
   php artisan serve
   ```
   Backend cần chạy ở `http://localhost:8000`

3. **Kiểm tra file .env trong frontend:**
   Tạo file `.env` trong thư mục `frontend`:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Kiểm tra CORS:**
   Đảm bảo backend cho phép CORS từ frontend. Kiểm tra file `backend/config/cors.php`

5. **Xóa cache và cài lại:**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   npm run dev
   ```

6. **Kiểm tra browser console:**
   - Mở F12
   - Xem tab Console có lỗi gì không
   - Xem tab Network có request nào fail không

## Lỗi thường gặp:

### 1. "Cannot read property of undefined"
- Nguyên nhân: Component đang cố truy cập property của object chưa được load
- Giải pháp: Thêm null check hoặc loading state

### 2. "Network Error" hoặc "Failed to fetch"
- Nguyên nhân: Backend chưa chạy hoặc CORS chưa được cấu hình
- Giải pháp: 
  - Chạy backend: `php artisan serve`
  - Cấu hình CORS trong Laravel

### 3. "Token is invalid"
- Nguyên nhân: Token trong localStorage đã hết hạn
- Giải pháp: Xóa token và đăng nhập lại

### 4. Màn hình trắng hoàn toàn
- Nguyên nhân: Có lỗi JavaScript nghiêm trọng
- Giải pháp: 
  - Kiểm tra console
  - Kiểm tra xem tất cả imports có đúng không
  - Kiểm tra xem có component nào throw error không

## Debug steps:

1. Mở browser console (F12)
2. Kiểm tra lỗi trong Console tab
3. Kiểm tra Network tab xem có request nào fail không
4. Kiểm tra React DevTools (nếu có cài)
5. Thêm console.log vào các component để debug

