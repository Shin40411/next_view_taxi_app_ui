import { useState } from 'react';

import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fNumber } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DriverHomeView() {
    const theme = useTheme();
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);

    const handleToggleStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOnline(event.target.checked);
    };

    const handleFindService = () => {
        router.push(paths.dashboard.homeMap);
    };

    const handleStartTrip = () => {
        alert("Bắt đầu chuyến đi mới!");
    };

    return (
        <Grid container spacing={3}>
            {/* Header: Wallet & Status */}
            <Grid xs={12}>
                <Card sx={{
                    p: 3,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                            Số dư ví
                        </Typography>
                        <Typography variant="h3">
                            {fNumber(1500000)} pts
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle2">
                            {isOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'}
                        </Typography>
                        <Switch
                            checked={isOnline}
                            onChange={handleToggleStatus}
                            color="default"
                            sx={{
                                '& .MuiSwitch-track': { opacity: 0.5, bgcolor: 'common.white' },
                                '& .MuiSwitch-thumb': { color: 'common.white' },
                                '&.Mui-checked .MuiSwitch-track': { opacity: 0.5, bgcolor: 'common.white' },
                            }}
                        />
                    </Stack>
                </Card>
            </Grid>

            {/* Quick Stats */}
            <Grid xs={6}>
                <StatCard
                    title="Chuyến hôm nay"
                    total={12}
                    color="info"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
                />
            </Grid>
            <Grid xs={6}>
                <StatCard
                    title="Điểm kiếm được"
                    total={45000}
                    color="warning"
                    icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
                    suffix=" pts"
                />
            </Grid>

            {/* Action Buttons */}
            <Grid xs={12} md={12}>
                <Card
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            transform: 'scale(1.02)'
                        }
                    }}
                    onClick={handleFindService}
                >
                    <Iconify icon="eva:map-fill" width={64} sx={{ color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" paragraph>
                        Tìm điểm dịch vụ
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Xem bản đồ các quán liên kết, nạp điểm, đổi thưởng gần đây
                    </Typography>
                </Card>
            </Grid>
        </Grid>
    );
}

// ----------------------------------------------------------------------

interface StatCardProps extends CardProps {
    title: string;
    total: number;
    icon: React.ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    suffix?: string;
}

function StatCard({ title, total, icon, color = 'primary', suffix, sx, ...other }: StatCardProps) {
    return (
        <Card
            sx={{
                display: 'flex',
                alignItems: 'center',
                p: 3,
                ...sx,
            }}
            {...other}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="h3">
                    {fNumber(total)}
                    {suffix && <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary', ml: 0.5 }}>{suffix}</Typography>}
                </Typography>
            </Box>

            <Box
                sx={{
                    width: 120,
                    height: 120,
                    lineHeight: 0,
                    borderRadius: '50%',
                    bgcolor: 'background.neutral',
                }}
            >
                {icon}
            </Box>
        </Card>
    );
}
