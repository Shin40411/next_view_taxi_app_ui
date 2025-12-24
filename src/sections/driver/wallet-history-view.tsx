import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { alpha, useTheme } from '@mui/material/styles';

// hooks
import { useSearchParams } from 'react-router-dom';
import { useRouter } from 'src/routes/hooks';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fPoint } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
//
import WithdrawRequestDialog from './withdraw-request-dialog';

// ----------------------------------------------------------------------

const TABS = [
    { value: 'history', label: 'Lịch sử chuyến đi', icon: <Iconify icon="eva:car-fill" /> },
    { value: 'wallet', label: 'Ví điểm', icon: <Iconify icon="eva:credit-card-fill" /> },
];

const MOCK_TRIPS = [
    { id: '1', time: new Date(), shopName: 'Nhà hàng Biển Đông', licensePlate: '30A-123.45', amount: 500 },
    { id: '2', time: new Date(Date.now() - 86400000), shopName: 'Cafe Trung Nguyên', licensePlate: '29H-987.65', amount: 300 },
    { id: '3', time: new Date(Date.now() - 172800000), shopName: 'Khách sạn Metropole', licensePlate: '30A-123.45', amount: 1000 },
];

const MOCK_TRANSACTIONS = [
    { id: '1', time: new Date(), type: 'add', description: 'Hoàn thành chuyến đi #1', amount: 500 },
    { id: '2', time: new Date(Date.now() - 86400000), type: 'add', description: 'Hoàn thành chuyến đi #2', amount: 300 },
    { id: '3', time: new Date(Date.now() - 200000000), type: 'withdraw', description: 'Rút điểm về ngân hàng', amount: -2000 },
];

// Mock Bank Info (change to null to test validation)
const MOCK_BANK_INFO = {
    bankName: 'Vietcombank',
    accountNumber: '0123456789',
    accountName: 'NGUYEN VAN A',
};

// ----------------------------------------------------------------------

export default function WalletHistoryView() {
    const theme = useTheme();
    const router = useRouter();
    const settings = useSettingsContext();
    const withdrawDialog = useBoolean();

    const [searchParams] = useSearchParams();
    const [currentTab, setCurrentTab] = useState('history');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setCurrentTab(tab);
        }
    }, [searchParams]);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleRequestWithdraw = () => {
        if (!MOCK_BANK_INFO) {
            alert('Bạn chưa cập nhật thông tin ngân hàng! Chuyển hướng đến trang cập nhật...');
            router.push(paths.dashboard.driver.profile);
            return;
        }
        withdrawDialog.onTrue();
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4">
                    Lịch sử & Ví điểm
                </Typography>
            </Box>

            <Card
                sx={{
                    mb: 3,
                    height: 280,
                    position: 'relative',
                    color: 'common.black',
                    background: 'linear-gradient(135deg, #FFF176 0%, #FBC02D 100%)',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                    }}
                >
                    <img
                        src="/assets/illustrations/taxi_driver.png"
                        alt="taxi driver"
                        style={{ height: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                </Box>
                <Box
                    sx={{
                        p: 3,
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="overline" sx={{ opacity: 0.64, mb: 1 }}>
                        Tổng điểm tích lũy
                    </Typography>
                    <Typography variant="h2">
                        {fPoint(15000)}
                    </Typography>
                </Box>
            </Card>

            <Card>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    sx={{
                        px: 2,
                        bgcolor: 'background.neutral',
                    }}
                >
                    {TABS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} icon={tab.icon} />
                    ))}
                </Tabs>

                {currentTab === 'history' && (
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <Scrollbar>
                            <Table sx={{ minWidth: 800 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Thời gian</TableCell>
                                        <TableCell>Tên quán</TableCell>
                                        <TableCell>Biển số xe</TableCell>
                                        <TableCell align="right">Số điểm</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {MOCK_TRIPS.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{fDateTime(row.time)}</TableCell>
                                            <TableCell>{row.shopName}</TableCell>
                                            <TableCell>{row.licensePlate}</TableCell>
                                            <TableCell align="right">{fPoint(row.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>
                )}

                {currentTab === 'wallet' && (
                    <Box sx={{ p: 3 }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            justifyContent="space-between"
                            spacing={2}
                            sx={{ mb: 3 }}
                        >
                            <Typography variant="h6">Lịch sử giao dịch</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Iconify icon="eva:diagonal-arrow-right-up-fill" />}
                                onClick={handleRequestWithdraw}
                            >
                                Yêu cầu rút điểm
                            </Button>
                        </Stack>

                        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                            <Scrollbar>
                                <Table sx={{ minWidth: 800 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Thời gian</TableCell>
                                            <TableCell>Loại giao dịch</TableCell>
                                            <TableCell>Mô tả</TableCell>
                                            <TableCell align="right">Số điểm</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {MOCK_TRANSACTIONS.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{fDateTime(row.time)}</TableCell>
                                                <TableCell>
                                                    <Typography color={row.type === 'add' ? 'success.main' : 'error.main'}>
                                                        {row.type === 'add' ? 'Cộng điểm' : 'Trừ điểm'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell align="right" sx={{ color: row.type === 'add' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                                                    {row.type === 'add' ? '+' : ''}{fPoint(row.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Scrollbar>
                        </TableContainer>
                    </Box>
                )}
            </Card>

            <WithdrawRequestDialog
                open={withdrawDialog.value}
                onClose={withdrawDialog.onFalse}
                currentBalance={15000}
                bankInfo={MOCK_BANK_INFO}
            />
        </Container>
    );
}
