import { useTheme } from "@mui/material/styles";
import { TableCell, Typography, Box, Tooltip, TableRow, alpha } from "@mui/material";
import { format } from "date-fns";
import { fNumber } from "src/utils/format-number";
import Iconify from "src/components/iconify";
import Label from "src/components/label";
import { IWalletTransaction } from "src/types/wallet";

export function TransactionTableRow({ row, index }: { row: IWalletTransaction; index: number }) {
    const theme = useTheme();

    const isDeposit = row.type === 'DEPOSIT';

    const renderDescription = () => {
        if (row.type === 'DEPOSIT') return 'Nạp Goxu';
        if (row.type === 'WITHDRAW') return 'Rút Goxu';
        if (row.type === 'TRANSFER') return `Chuyển Goxu cho ${row.receiver?.full_name || row.receiver?.username || 'người nhận'}`;
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
                        {isDeposit ? 'Nạp Goxu' : 'Chuyển Goxu'}
                    </Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Typography
                    variant="subtitle2"
                    sx={{ color: isDeposit ? 'success.main' : 'error.main' }}
                >
                    {isDeposit ? '+' : '-'}{fNumber(row.amount)} Goxu
                </Typography>
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

            {/* <TableCell align="right">
                <IconButton color="default">
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
            </TableCell> */}
        </TableRow>
    );
}