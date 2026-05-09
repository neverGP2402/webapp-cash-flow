import { Card, CardContent, Typography, Box } from '@mui/material';
import Chart from 'react-apexcharts';

// ----------------------------------------------------------------------

export function AssetsGrowthChart() {
  const chartOptions: any = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: 'transparent',
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    theme: {
      mode: 'light',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
      ],
    },
    yaxis: {
      title: {
        text: 'Giá trị tài sản (VND)',
        style: {
          fontSize: '12px',
          fontWeight: 500,
        },
      },
      labels: {
        formatter: (val: number) => `${val.toLocaleString('vi-VN')} đ`,
        style: {
          fontSize: '11px',
        },
      },
    },
    tooltip: {
      theme: 'light',
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: (val: number) => `${val.toLocaleString('vi-VN')} đ`,
      },
    },
    colors: ['#667eea'],
  };

  const chartSeries = [
    {
      name: 'Tổng tài sản',
      data: [95000000, 98000000, 102000000, 108000000, 115000000, 118000000, 122000000, 125000000],
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.0.08)',
        height: '100%',
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Biểu đồ tăng trưởng tài sản
        </Typography>
        <Box sx={{ height: 350 }}>
          <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
        </Box>
      </CardContent>
    </Card>
  );
}
