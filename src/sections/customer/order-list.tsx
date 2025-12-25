import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

// Define Props
type Props = {
    orders: any[]; // Replace 'any' with proper type if available, but for now matching mock structure
    onConfirm: (orderId: string, actualGuests: number) => void;
    onCancel?: (orderId: string) => void;
};

export default function CustomerOrderList({ orders, onConfirm, onCancel }: Props) {
    // State to track actual guests input for each order: { orderId: number }
    // Initialize lazily or with effect if orders change, but for simplicity initializing from props
    // Note: If orders prop updates, we might need to sync specific new orders.
    // However, since we only need simple tracking, we'll initialize once or use useEffect.
    // Better: use a derived state or separate logic.
    // For now, simple initialization:
    const [actualGuestCounts, setActualGuestCounts] = useState<Record<string, number>>(() =>
        orders.reduce((acc, order) => ({ ...acc, [order.id]: order.declaredGuests }), {})
    );

    const handleGuestChange = (orderId: string, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
            setActualGuestCounts(prev => ({ ...prev, [orderId]: numValue }));
        }
    };

    const handleConfirmWrapper = (orderId: string) => {
        const actualGuests = actualGuestCounts[orderId] ?? orders.find(o => o.id === orderId)?.declaredGuests ?? 0;
        onConfirm(orderId, actualGuests);
    };

    if (orders.length === 0) {
        return (
            <Card sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">Hiện chưa có lượt khách nào đang chờ xác nhận.</Typography>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 5 }}>
            <Scrollbar>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tài xế</TableCell>
                                <TableCell align="center">Thực tế</TableCell>
                                <TableCell align="right">Xác nhận</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {orders.map((order) => {
                                const actualGuests = actualGuestCounts[order.id];
                                const isDiscrepancy = actualGuests !== order.declaredGuests;
                                const isConfirmed = order.status === 'confirmed';
                                const isCancelled = order.status === 'cancelled';
                                // @ts-ignore
                                const totalPoints = actualGuests * (order.pointsPerGuest || 0);

                                return (
                                    <TableRow
                                        key={order.id}
                                        hover
                                        sx={{
                                            opacity: isConfirmed || isCancelled ? 0.6 : 1,
                                            '& .MuiTableCell-root': {
                                                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
                                            },
                                            '& .MuiTableCell-root:not(:last-of-type)': {
                                                borderRight: (theme) => `solid 1px ${theme.palette.divider}`
                                            }
                                        }}
                                    >
                                        <TableCell width={10} sx={{ pr: 0 }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Avatar src={order.avatarUrl} alt={order.driverName} />
                                                <Stack
                                                    direction={{ xs: 'column', md: 'row' }}
                                                    alignItems={{ xs: 'flex-start', md: 'center' }}
                                                    spacing={{ xs: 0.5, md: 1 }}
                                                    divider={
                                                        <Box
                                                            sx={{
                                                                width: 4,
                                                                height: 4,
                                                                borderRadius: '50%',
                                                                bgcolor: 'text.disabled',
                                                                display: { xs: 'none', md: 'block' }
                                                            }}
                                                        />
                                                    }
                                                >
                                                    <Typography variant="subtitle2" noWrap>
                                                        {order.driverName}
                                                    </Typography>

                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        Khách báo:
                                                        <Box component="span" sx={{ color: 'info.main', fontWeight: 'bold', ml: 0.5 }}>
                                                            {order.declaredGuests}
                                                        </Box>
                                                    </Typography>

                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        {order.licensePlate}
                                                    </Typography>

                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        {fDateTime(order.createdAt, 'HH:mm dd/MM')}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="center" width={10} sx={{ px: 0 }}>
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                <IconButton
                                                    size="small"
                                                    disabled={isConfirmed || isCancelled}
                                                    onClick={() => handleGuestChange(order.id, String(Math.max(0, actualGuests - 1)))}
                                                    sx={{
                                                        bgcolor: 'action.hover',
                                                        width: 28,
                                                        height: 28,
                                                    }}
                                                >
                                                    <Iconify icon="eva:minus-fill" width={16} />
                                                </IconButton>

                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        minWidth: 24,
                                                        textAlign: 'center',
                                                        color: isDiscrepancy ? 'warning.main' : 'text.primary',
                                                        fontWeight: isDiscrepancy ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {actualGuests}
                                                </Typography>

                                                <IconButton
                                                    size="small"
                                                    disabled={isConfirmed || isCancelled}
                                                    onClick={() => handleGuestChange(order.id, String(actualGuests + 1))}
                                                    sx={{
                                                        bgcolor: 'action.hover',
                                                        width: 28,
                                                        height: 28,
                                                    }}
                                                >
                                                    <Iconify icon="eva:plus-fill" width={16} />
                                                </IconButton>
                                            </Stack>
                                            {isDiscrepancy && (
                                                <Typography variant="caption" sx={{ color: 'warning.main', display: 'block', mt: 0.5 }}>
                                                    Khác
                                                </Typography>
                                            )}
                                        </TableCell>

                                        <TableCell width={10} align="right">

                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end">
                                                {!isConfirmed && !isCancelled && (
                                                    <Button
                                                        variant="soft"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => onCancel && onCancel(order.id)}
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                    >
                                                        Hủy
                                                    </Button>
                                                )}

                                                {isConfirmed && (
                                                    <Button
                                                        variant="soft"
                                                        color="success"
                                                        size="small"
                                                        disabled
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                    >
                                                        Đã xác nhận
                                                    </Button>
                                                )}

                                                {isCancelled && (
                                                    <Button
                                                        variant="soft"
                                                        color="error"
                                                        size="small"
                                                        disabled
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                    >
                                                        Đã hủy
                                                    </Button>
                                                )}

                                                {!isConfirmed && !isCancelled && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<Iconify icon="solar:check-circle-bold" />}
                                                        onClick={() => handleConfirmWrapper(order.id)}
                                                        sx={{
                                                            whiteSpace: 'nowrap',
                                                            '& .MuiButton-startIcon': {
                                                                display: { xs: 'none', sm: 'inherit' }
                                                            }
                                                        }}
                                                    >
                                                        Xác nhận
                                                    </Button>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>
        </Card>
    );
}
