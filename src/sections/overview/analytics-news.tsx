import { useState } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AssetCreationPopup, AssetFormData } from 'src/components/asset-creation-popup';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
    postedAt: string | number | null;
  }[];
  onAssetCreate?: (data: AssetFormData) => void;
};

export function AnalyticsNews({ title, subheader, list, onAssetCreate, sx, ...other }: Props) {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleAddAsset = () => {
    setPopupOpen(true);
  };

  const handleAssetSubmit = (data: AssetFormData) => {
    if (onAssetCreate) {
      onAssetCreate(data);
    }
  };
  return (
    <>
      <Card sx={sx} {...other}>
        <CardHeader 
          title={title} 
          subheader={subheader} 
          sx={{ mb: 1 }}
          action={
            <IconButton 
              onClick={handleAddAsset}
              size="small"
              sx={{ 
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <Iconify icon="mingcute:add-line" width={20} />
            </IconButton>
          }
        />

        <Scrollbar sx={{ minHeight: 405 }}>
          <Box sx={{ minWidth: 640 }}>
            {list.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          >
            Xem thêm
          </Button>
        </Box>
      </Card>

      <AssetCreationPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        onSubmit={handleAssetSubmit}
      />
    </>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: Props['list'][number];
};

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          py: 2,
          px: 3,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={item.title}
        src={item.coverUrl}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <ListItemText
        primary={<Link color="inherit">{item.title}</Link>}
        secondary={item.description}
        slotProps={{
          primary: { noWrap: true },
          secondary: {
            noWrap: true,
            sx: { mt: 0.5 },
          },
        }}
      />

      <Box sx={{ flexShrink: 0, typography: 'caption', color: 'text.disabled' }}>
        {fToNow(item.postedAt)}
      </Box>
    </Box>
  );
}
