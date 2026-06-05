# Tài liệu tích hợp API - Thêm mới thông tin tài sản (My Info Asset)

Tài liệu này hướng dẫn Client (Web/Mobile) cách gọi API để lưu trữ thông tin tài sản cá nhân (vàng, bạc, kim cương, tiền trong ví...).

## 1. Thông tin chung
- **Endpoint:** `/api/v1/asset/info-assets`
- **Method:** `POST`
- **Authentication:** Yêu cầu `Bearer Token` trong Header.
- **Content-Type:** `application/json`

## 2. Cấu trúc Request Body

| Trường | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `asset_id` | BIGINT | Yes | ID loại tài sản (Lấy từ API `/api/v1/common/assets`) |
| `wallet_id` | BIGINT | Yes | ID ví thanh toán (Lấy từ API `/api/v1/common/wallets`) |
| `amount` | Double | Yes | Số lượng tài sản (VD: 2.5, 10, ...) |
| `price` | Double | Yes | Giá trị lúc mua (tính trên 1 đơn vị) |
| `unit_id` | BIGINT | Yes | ID đơn vị tính (Lấy từ API `/api/v1/common/units`) |
| `transaction_date`| String | Yes | Ngày giao dịch (Định dạng ISO: `YYYY-MM-DDTHH:mm:ss`) |
| `origin` | String | No | Nguồn gốc tài sản (VD: "Mua tại PNJ", "Thưởng cuối năm") |
| `status` | String | No | Trạng thái (VD: `HOLDING`, `SOLD`, `LENT`) |
| `description` | String | No | Ghi chú thêm |

### Ví dụ Request Payload:
```json
{
    "asset_id": 1,
    "wallet_id": 2,
    "amount": 5.0,
    "price": 82500000,
    "unit_id": 1,
    "transaction_date": "2025-05-20T10:30:00",
    "origin": "Cửa hàng SJC Quận 1",
    "status": "HOLDING",
    "description": "Mua tích trữ dài hạn"
}
```

## 3. Cấu trúc Response

### 3.1. Thành công (201 Created)
```json
{
    "data": {
        "id": 10,
        "user_id": 1,
        "asset_id": 1,
        "wallet_id": 2,
        "amount": 5.0,
        "price": 82500000,
        "unit_id": 1,
        "transaction_date": "2025-05-20T10:30:00",
        "origin": "Cửa hàng SJC Quận 1",
        "status": "HOLDING",
        "description": "Mua tích trữ dài hạn",
        "created_at": "2025-05-21T08:00:00Z"
    },
    "message": "success",
    "status": 201,
    "timestamp": "2025-05-21T08:00:00Z",
    "description": "Resource created successfully"
}
```

### 3.2. Lỗi dữ liệu đầu vào (400 Bad Request)
Xảy ra khi thiếu trường bắt buộc hoặc sai định dạng JSON.
```json
{
    "status": "error",
    "message": "Request body is required",
    "error_code": "BAD_REQUEST",
    "timestamp": "2025-05-21T08:00:00Z"
}
```

### 3.3. Lỗi xác thực (401 Unauthorized)
Xảy ra khi Token hết hạn hoặc không có Token.
```json
{
    "status": "error",
    "message": "Token has expired",
    "error_code": "UNAUTHORIZED",
    "timestamp": "2025-05-21T08:00:00Z"
}
```

## 4. Mã mẫu (Javascript - Fetch)
```javascript
const createInfoAsset = async (payload, token) => {
    const response = await fetch('http://localhost:5000/api/v1/asset/info-assets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    return result;
};
```

---
*Ghi chú: Đảm bảo các ID (asset, wallet, unit) đã tồn tại trong hệ thống trước khi gọi API này.*