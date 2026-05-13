# Asset Detail Page Components

Đây là thư mục chứa các components cho trang "Chi tiết tài sản" của hệ thống quản lý tài chính cá nhân "My Cash Flow".

## Cấu trúc

```
asset-detail/
├── index.tsx                    # Component chính AssetDetailPage
├── asset-hero-overview.tsx      # Hero overview card
├── asset-statistic-grid.tsx     # Performance statistics grid
├── asset-performance-chart.tsx  # Biểu đồ hiệu suất
├── asset-allocation-card.tsx    # Portfolio allocation card
├── asset-timeline.tsx           # Timeline hoạt động
├── asset-transaction-list.tsx   # Danh sách giao dịch
├── asset-insight-section.tsx    # Phân tích thông tin chi tiết
├── asset-quick-action.tsx       # Hành động nhanh
├── asset-empty-state.tsx        # Empty state
└── README.md                    # Documentation
```

## Components Overview

### AssetDetailPage (index.tsx)
Component chính quản lý toàn bộ page, bao gồm:
- State management cho chart period
- Mock data generation
- Responsive layout
- Integration của tất cả sub-components

### AssetHeroOverview
Card lớn hiển thị overview tài sản:
- Icon, tên, symbol tài sản
- Tổng số lượng nắm giữ
- Giá trị hiện tại
- Lợi nhuận và % thay đổi
- Animation cho số liệu

### AssetStatisticGrid
Grid hiển thị performance metrics:
- Giá vốn trung bình
- Giá thị trường hiện tại
- Tổng vốn đầu tư
- Giá trị hiện tại
- Lợi nhuận chưa thực hiện
- Lợi nhuận đã thực hiện

### AssetPerformanceChart
Biểu đồ area chart hiển thị:
- Historical value trends
- Profit/loss trends
- Filter theo thời gian (7D, 30D, 90D, 1Y, ALL)
- Smooth animations
- Responsive design

### AssetAllocationCard
Card hiển thị phân bổ danh mục:
- Donut chart
- % allocation trong portfolio
- Ranking trong danh mục
- Animation cho percentage

### AssetTimeline
Timeline dạng vertical hiển thị:
- Các hoạt động gần đây
- Group by time (today, yesterday, this week, etc.)
- Icon và color theo loại hoạt động
- Hover effects

### AssetTransactionList
Danh sách giao dịch liên quan:
- Group by date
- Transaction cards với profit/loss realtime
- Action buttons
- Summary statistics

### AssetInsightSection
Grid cards hiển thị insights:
- Performance insights
- Growth metrics
- Recommendations
- Priority indicators

### AssetQuickAction
Floating actions cho desktop và mobile:
- Desktop: Side floating panel
- Mobile: Bottom sticky bar
- Contextual actions (buy, sell, update price, etc.)

### AssetEmptyState
Empty state khi chưa có dữ liệu:
- Beautiful illustration
- Feature highlights
- CTA button
- Educational content

## Usage

```tsx
import { AssetDetailPage } from 'src/components/asset-detail';

function App() {
  return (
    <AssetDetailPage
      assetId="gold-sjc"
      data={assetData}
      isLoading={false}
      onPeriodChange={(period) => console.log(period)}
      onActionClick={(action) => console.log(action)}
      onAddTransaction={() => console.log('Add transaction')}
    />
  );
}
```

## Features

### Design Principles
- **Wealth Management UI**: Premium fintech feeling
- **Modern Analytics**: Clean, data-focused design
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper semantic HTML and ARIA labels

### Technical Features
- **TypeScript**: Full type safety
- **i18n**: Multi-language support
- **Material-UI**: Consistent design system
- **ApexCharts**: Advanced charting capabilities
- **Performance**: Optimized rendering and memoization

### Data Flow
- **Mock Data**: Realistic sample data included
- **State Management**: Local state with hooks
- **Props Interface**: Clear prop contracts
- **Error Handling**: Graceful fallbacks

## Responsive Design

### Desktop (>1200px)
- Grid layout with sidebar
- Large charts and detailed metrics
- Floating action panel

### Tablet (768px - 1200px)
- Stacked layout
- Medium-sized charts
- Optimized spacing

### Mobile (<768px)
- Single column layout
- Compact charts
- Bottom sticky actions
- Touch-optimized interactions

## Animation Specifications

### Load Animations
- Fade-in effects: 800ms duration
- Staggered loading: 150ms delays
- Number counting: 50ms intervals

### Hover Effects
- Card lift: translateY(-2px)
- Shadow enhancement
- Color transitions: 200ms

### Chart Animations
- Smooth easing: ease-in-out
- Duration: 800ms
- Progressive rendering

## Customization

### Theming
All components support Material-UI theme customization:

```tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    // ... custom colors
  },
});
```

### Localization
Add new translations in `src/locales/vi/asset-detail.json`:

```json
{
  "newKey": "New translation",
  "section": {
    "nestedKey": "Nested translation"
  }
}
```

## Performance Considerations

- **Memoization**: useMemo for expensive calculations
- **Lazy Loading**: Chart components loaded on demand
- **Debouncing**: Filter inputs debounced
- **Virtualization**: Large lists virtualized if needed

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Khi thêm mới components:
1. Tuân thủ naming convention
2. Add proper TypeScript types
3. Include responsive design
4. Add loading states
5. Include error boundaries
6. Update documentation

## Future Enhancements

- [ ] Real-time data updates
- [ ] Advanced chart interactions
- [ ] Export functionality
- [ ] Advanced filtering
- [ ] Comparison tools
- [ ] Alert system
