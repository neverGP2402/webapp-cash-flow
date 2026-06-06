# Add Asset Component

Màn hình "Thêm tài sản" - Component để thêm và quản lý tài sản cá nhân trong hệ thống My Cash Flow.

## 📁 Cấu trúc file

```
src/components/add-asset/
├── index.tsx                 # Component chính
├── asset-type-select.tsx     # Selector loại tài sản
├── wallet-selector.tsx       # Selector ví lưu trữ
├── amount-input.tsx          # Input số lượng
├── price-input.tsx           # Input giá nhập
├── exchange-rate-card.tsx    # Card hiển thị tỉ giá
├── profit-display.tsx        # Hiển thị lợi nhuận
├── status-chips.tsx          # Chips trạng thái
├── realtime-overview.tsx     # Overview realtime
├── quick-insight-card.tsx    # Card insight
├── styles.css                # Styles bổ sung
└── README.md                 # File này
```

## 🎯 Tính năng

- ✅ Form nhập thông tin tài sản với validation
- ✅ Real-time calculation lợi nhuận
- ✅ Responsive design (Desktop & Mobile)
- ✅ Multi-language support (Vietnamese/English)
- ✅ Modern fintech UI/UX
- ✅ Auto-save và save & continue
- ✅ Exchange rate integration
- ✅ Asset status management

## 🚀 Cách sử dụng

### 1. Import component

```tsx
import AddAssetPage from 'src/components/add-asset';
```

### 2. Sử dụng trong page

```tsx
function MyAssetPage() {
  return (
    <div>
      <AddAssetPage />
    </div>
  );
}
```

### 3. Hoặc sử dụng với routing

```tsx
import { Route, Routes } from 'react-router-dom';
import AddAssetPage from 'src/components/add-asset';

function App() {
  return (
    <Routes>
      <Route path="/add-asset" element={<AddAssetPage />} />
    </Routes>
  );
}
```

## 📊 Data Structure

### Form Data

```typescript
interface AddAssetFormData {
  asset_id: string; // ID loại tài sản
  wallet_id: string; // ID ví lưu trữ
  amount: number; // Số lượng
  price: number; // Giá nhập
  origin: string; // Nguồn gốc
  status: string; // Trạng thái
  description: string; // Ghi chú
  unit_id: string; // Đơn vị tính
  transaction_date: string; // Ngày giao dịch
}
```

### Asset Types

- Vàng 9999
- Bạc
- USD
- Bitcoin
- Ethereum
- Tiền mặt VND
- Ví điện tử (MoMo, etc.)
- Tài sản số
- Tài sản khác

### Wallets

- Ví tiền mặt
- Ngân hàng (VCB, TCB, etc.)
- Ví điện tử
- Ví Crypto

## 🎨 Customization

### Styles

Component sử dụng Material-UI và custom styles trong `styles.css`.

### Theme colors

- Primary: `#1976d2` (blue)
- Success: `#2e7d32` (green)
- Error: `#d32f2f` (red)
- Warning: `#ed6c02` (orange)

### Responsive breakpoints

- Mobile: `< 600px`
- Tablet: `600px - 1200px`
- Desktop: `> 1200px`

## 🌐 Localization

Component hỗ trợ đa ngôn ngữ thông qua i18next.

### Vietnamese (vi)

- Tất cả labels và messages bằng tiếng Việt
- Format số theo chuẩn Việt Nam

### English (en)

- English labels and messages
- Number formatting for international users

### Adding new language

1. Create locale file in `src/locales/[lang]/add-asset.json`
2. Translate all keys
3. Component tự động detect language

## 🔧 Integration với Backend

### API Endpoints (cần implement)

```typescript
// Get asset types
GET /api/com_asset

// Get wallets
GET /api/com_wallets

// Get units
GET /api/com_unit

// Get exchange rates
GET /api/com_exchange_rate?asset_id={asset_id}

// Create asset
POST /api/my_info_asset
{
  "wallet_id": string,
  "amount": number,
  "price": number,
  "origin": string,
  "status": string,
  "description": string,
  "unit_id": string,
  "transaction_date": string
}
```

### Replacing mock data

Trong `index.tsx`, replace các `mockAssetTypes`, `mockWallets`, etc. với data từ API calls.

## 📱 Mobile Features

- Sticky action buttons ở cuối màn hình
- Touch-friendly inputs
- Optimized spacing
- Swipe gestures support

## ✨ Animations

- Smooth transitions
- Loading skeletons
- Number count animations
- Hover effects
- Focus states

## 🎯 Best Practices

1. **Validation**: Form validation trước khi submit
2. **Error handling**: Hiển thị lỗi rõ ràng
3. **Loading states**: Show loading khi fetch data
4. **Responsive**: Test trên mọi thiết bị
5. **Accessibility**: ARIA labels, keyboard navigation
6. **Performance**: Memoization, lazy loading

## 🐛 Troubleshooting

### Issue: Form không submit

- Check validation errors
- Verify all required fields
- Check console for errors

### Issue: Real-time calculation không hoạt động

- Verify exchange rate data
- Check calculation logic in useEffect

### Issue: Responsive issues

- Test trên various screen sizes
- Check MUI breakpoint usage

## 📝 Notes

- Component được thiết kế để standalone, có thể tích hợp vào bất kỳ page nào
- Mock data được sử dụng cho demonstration
- Production cần integrate với actual APIs
- Component tuân thủ SOLID principles
- Clean code và reusable components

## 🤝 Contributing

Khi modify component:

1. Maintain TypeScript types
2. Add i18n support for new text
3. Test responsive design
4. Update documentation
5. Follow existing code patterns

## 📄 License

Same as main project license.
