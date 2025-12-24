import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { getPartner, PartnerDetail } from 'src/services/admin';

// ----------------------------------------------------------------------

export default function PartnerDetailView() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [partner, setPartner] = useState<PartnerDetail | null>(null);
    const [currentTab, setCurrentTab] = useState('profile');

    useEffect(() => {
        if (id) {
            const fetchDetail = async () => {
                const data = await getPartner(id);
                setPartner(data);
            };
            fetchDetail();
        }
    }, [id]);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleBack = () => {
        router.push(paths.dashboard.admin.partners.root);
    };

    if (!partner) {
        return <Typography sx={{ p: 5 }}>Đang tải thông tin tài xế...</Typography>;
    }

    return (
        <>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <Iconify icon="eva:arrow-ios-back-fill" />
                </IconButton>
                <Typography variant="h4">
                    Chi tiết tài xế
                </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                <Typography variant="h4">{partner.fullName}</Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                        onClick={() => alert('Đã duyệt tài khoản!')}
                    >
                        Duyệt
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Iconify icon="eva:slash-fill" />}
                        onClick={() => alert('Đã khóa tài khoản!')}
                    >
                        Khóa
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:lock-fill" />}
                        onClick={() => alert('Đã reset mật khẩu!')}
                    >
                        Đổi mật khẩu
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {/* Profile Info */}
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center' }}>
                        <Avatar
                            alt={partner.fullName}
                            src={partner.avatarUrl}
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        >
                            {partner.fullName.charAt(0).toUpperCase()}
                        </Avatar>

                        <Chip
                            label={partner.status === 'active' ? 'Hoạt động' : partner.status === 'pending' ? 'Chờ duyệt' : 'Khóa'}
                            color={partner.status === 'active' ? 'success' : partner.status === 'pending' ? 'warning' : 'error'}
                            variant="soft"
                            sx={{ mb: 2 }}
                        />

                        <Typography variant="subtitle1" noWrap sx={{ mt: 1 }}>
                            {partner.id}
                        </Typography>

                        <Stack direction="row" sx={{ mt: 3, mb: 2 }}>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6">{partner.rating}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Đánh giá</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6">{partner.totalTrips}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Chuyến</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: 'warning.main' }}>
                                    {partner.rewardPoints.toLocaleString()}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Điểm thưởng</Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Box sx={{ py: 3, textAlign: 'left' }}>
                            <Stack spacing={2}>
                                <Stack direction="row">
                                    <Iconify icon="eva:person-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.fullName}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Iconify icon="eva:phone-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.phoneNumber}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Iconify icon="eva:email-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.email}</Typography>
                                </Stack>
                                <Stack direction="row">
                                    <Iconify icon="eva:car-fill" width={20} sx={{ mr: 2, color: 'text.disabled' }} />
                                    <Typography variant="body2">{partner.vehiclePlate}</Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Card>
                </Grid>

                {/* ID Cards & Tabs */}
                <Grid xs={12} md={8}>
                    <Card>
                        <Tabs
                            value={currentTab}
                            onChange={handleChangeTab}
                            sx={{
                                px: 3,
                                boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
                            }}
                        >
                            <Tab value="profile" label="Hồ sơ & CCCD" />
                            <Tab value="trips" label="Lịch sử chuyến đi" />
                            <Tab value="wallet" label="Lịch sử điểm thưởng" />
                        </Tabs>

                        <Divider />

                        <Box sx={{ p: 3 }}>
                            {currentTab === 'profile' && (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Ảnh CCCD / Giấy tờ</Typography>
                                    <Stack direction="row" spacing={3}>
                                        <Box>
                                            <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt trước</Typography>
                                            <Box
                                                component="img"
                                                alt="CCCD Front"
                                                src={partner.idCardFront}
                                                sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200' }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt sau</Typography>
                                            <Box
                                                component="img"
                                                alt="CCCD Back"
                                                src={partner.idCardBack}
                                                sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200' }}
                                            />
                                        </Box>
                                    </Stack>
                                </Box>
                            )}

                            {currentTab === 'trips' && (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Mã GD</TableCell>
                                                <TableCell>Điểm đón/đến</TableCell>
                                                <TableCell>Thời gian</TableCell>
                                                <TableCell align="right">Số tiền</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {partner.tripHistory.map((trip) => (
                                                <TableRow key={trip.id}>
                                                    <TableCell>{trip.id}</TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{trip.pickupAddress}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{trip.dropoffAddress}</Typography>
                                                    </TableCell>
                                                    <TableCell>{fDateTime(trip.timestamp)}</TableCell>
                                                    <TableCell align="right">{fCurrency(trip.amount)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {currentTab === 'wallet' && (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Mã GD</TableCell>
                                                <TableCell>Loại</TableCell>
                                                <TableCell>Mô tả</TableCell>
                                                <TableCell>Thời gian</TableCell>
                                                <TableCell align="right">Số điểm</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {partner.walletHistory.map((txn) => (
                                                <TableRow key={txn.id}>
                                                    <TableCell>{txn.id}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={txn.type}
                                                            size="small"
                                                            color={txn.amount > 0 ? 'success' : 'error'}
                                                            variant="soft"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{txn.description}</TableCell>
                                                    <TableCell>{fDateTime(txn.timestamp)}</TableCell>
                                                    <TableCell align="right" sx={{ color: txn.amount > 0 ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                                                        {txn.amount > 0 ? '+' : ''}{txn.amount} GoXu
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
