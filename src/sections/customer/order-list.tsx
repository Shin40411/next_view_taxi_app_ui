import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
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
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ICustomerOrder } from 'src/types/service-point';

// ----------------------------------------------------------------------

import { TablePaginationCustom } from 'src/components/table';

import { keyframes } from '@mui/material/styles';

const moveRight = keyframes`
  0% { transform: translateX(-10px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(20px); opacity: 0; }
`;

type Props = {
    orders: ICustomerOrder[];
    onConfirm?: (orderId: string, actualGuests: number) => void;
    onCancel?: (orderId: string) => void;
    pagination?: {
        page: number;
        rowsPerPage: number;
        count: number;
        onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
        onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    };
};

export default function CustomerOrderList({ orders, onConfirm, onCancel, pagination }: Props) {
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
        if (onConfirm) {
            onConfirm(orderId, actualGuests);
        }
    };

    return (
        <Card>
            {orders.length > 0 ? (
                <Scrollbar>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="5%">Chuyến đi</TableCell>
                                    <TableCell width="5%" align="center">Thực tế</TableCell>
                                    <TableCell width="5%" align="center">Xác nhận</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {orders.map((order) => {
                                    const actualGuestsOnConfirm = actualGuestCounts[order.id] || order.declaredGuests;
                                    const actualGuests = order.actualGuestCount;
                                    const isConfirmed = order.status === 'confirmed';
                                    const isCancelled = order.status === 'cancelled';
                                    const isArrived = order.status === 'arrived';
                                    const isPending = order.status === 'pending';

                                    const isDiscrepancy = isConfirmed ? actualGuests !== order.declaredGuests : actualGuestsOnConfirm !== order.declaredGuests;

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
                                            <TableCell padding='checkbox'>
                                                <Stack direction={{ xs: "column", md: "row" }} my={2} mx={0.5} justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                                                    <Avatar
                                                        src={order.avatarUrl}
                                                        alt={order.driverName}
                                                        sx={{ width: 50, height: 50, alignSelf: "center" }}
                                                    />

                                                    <Stack direction="column" spacing={1} justifyContent="flex-start">
                                                        <Chip
                                                            label={order.driverName}
                                                            size="small"
                                                            variant="soft"
                                                        />
                                                        {order.tripCode && (
                                                            <Chip
                                                                label={`${order.tripCode}`}
                                                                size="small"
                                                                color="primary"
                                                                variant="soft"
                                                            />
                                                        )}

                                                        <Chip
                                                            label={`Khách báo: ${order.declaredGuests}`}
                                                            size="small"
                                                            color="info"
                                                            variant="soft"
                                                        />
                                                    </Stack>

                                                    <Stack direction="column" spacing={1} justifyContent="flex-start">
                                                        <Chip
                                                            label={`Ngày tạo: ${fDateTime(order.createdAt, 'dd/MM/yyyy')}`}
                                                            size="small"
                                                            variant="soft"
                                                        />

                                                        {order.arrivalTime && (
                                                            <Chip
                                                                label={`Thời gian: ${fDateTime(order.createdAt, 'HH:mm')} - ${fDateTime(order.arrivalTime, 'HH:mm')}`}
                                                                size="small"
                                                                variant="soft"
                                                            />
                                                        )}
                                                    </Stack>

                                                    <Stack direction="column" spacing={1} justifyContent="flex-start">
                                                        <Label
                                                            variant="soft"
                                                            color={
                                                                (order.status === 'confirmed' && 'success') ||
                                                                (order.status === 'cancelled' && 'error') ||
                                                                (order.status === 'arrived' && 'info') ||
                                                                'warning'
                                                            }
                                                            sx={{ width: 100, height: 32 }}
                                                            startIcon={<Iconify
                                                                icon={
                                                                    order.status === 'confirmed' ?
                                                                        "mdi:check-circle" : order.status === 'cancelled' ?
                                                                            "mdi:close-circle" : order.status === 'arrived' ?
                                                                                "mdi:check-circle" : "mdi:clock-outline"
                                                                } />}
                                                        >
                                                            {order.status === 'confirmed' && 'Hoàn thành'}
                                                            {order.status === 'cancelled' && 'Đã hủy'}
                                                            {order.status === 'arrived' && 'Đã đến'}
                                                            {order.status === 'pending' && 'Đang đến'}
                                                        </Label>

                                                        {order.rejectReason && (
                                                            <Typography variant="caption" sx={{ color: 'error.main' }}>
                                                                Lý do: {order.rejectReason}
                                                            </Typography>
                                                        )}
                                                    </Stack>

                                                </Stack>
                                            </TableCell>

                                            <TableCell align="center" padding='none'>
                                                <Stack direction="row" alignItems="center" mx={0.5} justifyContent="center" spacing={1}>
                                                    {isArrived && (
                                                        <IconButton
                                                            size="small"
                                                            disabled={isConfirmed || isCancelled}
                                                            onClick={() => handleGuestChange(order.id, String(Math.max(0, actualGuestsOnConfirm - 1)))}
                                                            sx={{
                                                                bgcolor: 'action.hover',
                                                                width: 28,
                                                                height: 28,
                                                            }}
                                                        >
                                                            <Iconify icon="eva:minus-fill" width={16} />
                                                        </IconButton>
                                                    )}

                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            minWidth: 5,
                                                            textAlign: 'center',
                                                            color: isDiscrepancy ? 'warning.main' : 'text.primary',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {isConfirmed ? actualGuests : actualGuestsOnConfirm}
                                                    </Typography>

                                                    {isArrived && (
                                                        <IconButton
                                                            size="small"
                                                            disabled={isConfirmed || isCancelled}
                                                            onClick={() => handleGuestChange(order.id, String(actualGuestsOnConfirm + 1))}
                                                            sx={{
                                                                bgcolor: 'action.hover',
                                                                width: 28,
                                                                height: 28,
                                                            }}
                                                        >
                                                            <Iconify icon="eva:plus-fill" width={16} />
                                                        </IconButton>
                                                    )}
                                                </Stack>
                                                {isDiscrepancy && (
                                                    <Typography variant="caption" sx={{ color: 'warning.main', display: 'block', mt: 0.5 }}>
                                                        Khác
                                                    </Typography>
                                                )}
                                            </TableCell>

                                            <TableCell align="center" padding='none'>
                                                <Stack direction={{ xs: 'column', sm: 'row' }} mx={0.5} spacing={1} justifyContent="center">
                                                    {isArrived && (
                                                        <Button
                                                            variant="soft"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => onCancel && onCancel(order.id)}
                                                            sx={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            Từ chối
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

                                                    {isPending && (
                                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'text.secondary' }}>
                                                            <Iconify
                                                                icon="mdi:car-side"
                                                                width={24}
                                                                sx={{
                                                                    animation: `${moveRight} 2s infinite linear`,
                                                                    mr: 0.5,
                                                                    color: 'info.main'
                                                                }}
                                                            />
                                                            <Iconify icon="mdi:map-marker-check" width={24} sx={{ color: 'success.main' }} />
                                                        </Box>
                                                    )}

                                                    {isArrived && onConfirm && (
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
            ) : (
                <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2">Hiện chưa có dữ liệu.</Typography>
                </Box>
            )}

            {pagination && (
                <TablePaginationCustom
                    sx={{
                        bgcolor: '#F4F6F8',
                        '& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input.css-14ddiyk-MuiInputBase-root-MuiTablePagination-select': { mr: '5px !important' }
                    }}
                    count={pagination.count}
                    page={pagination.page}
                    rowsPerPage={pagination.rowsPerPage}
                    onPageChange={pagination.onPageChange}
                    onRowsPerPageChange={pagination.onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            )}
        </Card>
    );
}
