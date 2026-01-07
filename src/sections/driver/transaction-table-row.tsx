import { alpha, Box, TableCell, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import Iconify from "src/components/iconify";
import Label from "src/components/label";
import { IWalletTransaction } from "src/types/wallet";
import { fPoint } from "src/utils/format-number";
import { format } from 'date-fns';

export const TransactionTableRow = ({ row, index, currentUserId }: { row: IWalletTransaction; index: number; currentUserId?: string }) => {
    const theme = useTheme();

    const isDeposit = row.type === 'DEPOSIT' || (row.type === 'TRANSFER' && row.receiver?.id === currentUserId);

    const renderDescription = () => {
        if (row.type === 'DEPOSIT') return 'Nạp Goxu';
        if (row.type === 'WITHDRAW') return 'Rút Goxu';
        if (row.type === 'TRANSFER') {
            if (row.receiver?.id === currentUserId) {
                return `Nhận Goxu từ ${row.sender?.full_name || row.sender?.username || 'đối tác'}`;
            }
            return `Chuyển Goxu cho ${row.receiver?.full_name || row.receiver?.username || 'người nhận'}`;
        }
        return 'Giao dịch';
    };

    return (
        <TableRow hover>
            <TableCell>{index}</TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify
                        icon={isDeposit ? 'eva:arrow-downward-fill' : 'eva:arrow-upward-fill'}
                        sx={{
                            mr: 1,
                            color: isDeposit ? 'success.main' : 'error.main',
                            bgcolor: isDeposit ? alpha(theme.palette.success.main, 0.16) : alpha(theme.palette.error.main, 0.16),
                            p: 0.5,
                            borderRadius: '50%',
                            width: 28,
                            height: 28
                        }}
                    />
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {row.type === 'DEPOSIT' ? 'Nạp Goxu' : row.type === 'WITHDRAW' ? 'Rút Goxu' : row.type === 'TRANSFER' ? (row.receiver?.id === currentUserId ? 'Nhận Goxu' : 'Chuyển Goxu') : 'Giao dịch'}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Typography
                    variant="subtitle2"
                    sx={{ color: isDeposit ? 'success.main' : 'error.main' }}
                >
                    {isDeposit ? '+' : '-'}{fPoint(row.amount)}
                </Typography>
            </TableCell>

            <TableCell>
                {row.sender ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{row.sender.id === currentUserId ? 'Bạn' : row.sender.full_name}</Typography>
                    </Box>
                ) : '-'}
            </TableCell>

            <TableCell>
                {row.receiver ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{row.receiver.id === currentUserId ? 'Bạn' : row.receiver.full_name}</Typography>
                    </Box>
                ) : '-'}
            </TableCell>

            <TableCell>{renderDescription()}</TableCell>

            <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">
                        {format(new Date(row.created_at), 'dd/MM/yyyy')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {format(new Date(row.created_at), 'p')}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Label
                    variant="soft"
                    color={
                        (row.status === 'SUCCESS' && 'success') ||
                        (row.status === 'PENDING' && 'warning') ||
                        (row.status === 'FALSE' && 'error') ||
                        'default'
                    }
                >
                    {row.status === 'SUCCESS' && 'Thành công'}
                    {row.status === 'PENDING' && 'Đang xử lý'}
                    {row.status === 'FALSE' && 'Thất bại'}
                </Label>
            </TableCell>

            <TableCell>
                {row.reason ? (
                    <Tooltip title={row.reason}>
                        <Typography variant="caption" noWrap sx={{ maxWidth: 140, display: 'block' }}>
                            {row.reason}
                        </Typography>
                    </Tooltip>
                ) : '-'}
            </TableCell>
        </TableRow>
    );
}