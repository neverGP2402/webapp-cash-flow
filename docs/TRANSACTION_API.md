# Transaction Module API Documentation

Module này quản lý các giao dịch thu chi, chi tiết giao dịch và hệ thống thông báo liên quan đến tài chính người dùng.

**Base URL:** `/api/v1/transaction`
**Authentication:** Yêu cầu Header `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Quản lý Giao dịch (Transactions)

### 1.1. Danh sách giao dịch
- **Endpoint:** `GET /transactions`
- **Query Params:**
    - `page` (int): Trang hiện tại (mặc định: 1)
    - `limit` (int): Số lượng bản ghi mỗi trang (mặc định: 10)
    - `type` (string): Lọc theo loại `INCOME` hoặc `EXPENSE`
    - `category_id` (int): Lọc theo danh mục
    - `status` (string): `PENDING`, `COMPLETED`, `FAILED`
    - `wallet_id` (int): Lọc theo ví
- **Response:**
```json
{
    "data": {
        "data": [...],
        "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
    },
    "message": "success",
    "status": 200
}
```

### 1.2. Tạo giao dịch mới
- **Endpoint:** `POST /transactions`
- **Content-Type:** `application/json` hoặc `multipart/form-data` (nếu có ảnh hóa đơn)
- **Body (JSON):**
```json
{
    "type": "EXPENSE",
    "category_id": 1,
    "amount": 50000,
    "date": "2025-05-20T10:00:00",
    "status": "COMPLETED",
    "formality_transaction": "CASH",
    "wallet_id": 1,
    "description": "Ăn sáng"
}
```
- **Body (FormData):** Sử dụng field `bill_image` hoặc `bill_image[]` để upload ảnh.

### 1.3. Chi tiết một giao dịch
- **Endpoint:** `GET /transactions/<transaction_id>`

### 1.4. Cập nhật giao dịch
- **Endpoint:** `PUT /transactions/<transaction_id>`
- **Body:** Các trường cần cập nhật (tương tự lúc tạo).

### 1.5. Xóa giao dịch (Soft Delete)
- **Endpoint:** `DELETE /transactions/<transaction_id>`

---

## 2. Chi tiết Giao dịch (Transaction Details)
Dùng khi một hóa đơn lớn có nhiều món hàng nhỏ cần liệt kê.

### 2.1. Lấy danh sách chi tiết của một giao dịch
- **Endpoint:** `GET /transactions/<transaction_id>/details`

### 2.2. Thêm chi tiết cho giao dịch
- **Endpoint:** `POST /transactions/<transaction_id>/details`
- **Body:**
```json
{
    "product_name": "Sữa tươi",
    "amount": 2,
    "price": 10000,
    "into_money": 20000,
    "description": "Mua lẻ"
}
```

### 2.3. Xóa một dòng chi tiết
- **Endpoint:** `DELETE /details/<detail_id>`

---

## 3. Thông báo (Notifications)

### 3.1. Danh sách thông báo
- **Endpoint:** `GET /notifications`
- **Query Params:** `page`, `limit`

### 3.2. Tạo thông báo (Thường dùng cho nhắc nhở)
- **Endpoint:** `POST /notifications`
- **Body:**
```json
{
    "title": "Nhắc nhở chi tiêu",
    "content": "Bạn đã tiêu quá 80% ngân sách tháng này",
    "type": "warning",
    "priority": "high"
}
```

### 3.3. Cập nhật thông báo (Đánh dấu đã đọc)
- **Endpoint:** `PUT /notifications/<notification_id>`
- **Body:** `{ "is_read": true, "read_at": "..." }`

### 3.4. Xóa thông báo
- **Endpoint:** `DELETE /notifications/<notification_id>`

---

## 4. Danh mục & Enums tham chiếu

### Transaction Type
- `INCOME`: Thu nhập
- `EXPENSE`: Chi tiêu

### Transaction Status
- `PENDING`: Đang chờ
- `COMPLETED`: Hoàn thành
- `FAILED`: Thất bại

### Formality (Hình thức)
- `CASH`: Tiền mặt
- `BANK`: Ngân hàng
- `OTHER`: Khác

---
*Ghi chú: Mọi API đều trả về định dạng chuẩn bao gồm `status`, `message`, `data` và `timestamp`.*