import { format } from "date-fns";

import { Box, Card, alpha, Stack, useTheme, Typography } from "@mui/material";

import { fPoint } from "src/utils/format-number";

import Label from "src/components/label";
import Iconify from "src/components/iconify";

import { IWalletTransaction } from "src/types/wallet";

export function TransactionMobileItem({ row, currentUserId }: { row: IWalletTransaction; currentUserId?: string }) {
    const theme = useTheme();
    const isDeposit = row.type === 'DEPOSIT' || (row.type === 'TRANSFER' && row.receiver?.id === currentUserId);

    const renderTitle = () => {
        if (row.type === 'DEPOSIT') return 'Nạp Goxu';
        if (row.type === 'WITHDRAW') return 'Rút Goxu';
        if (row.type === 'TRANSFER') {
            if (row.receiver?.id === currentUserId) return 'Nhận Goxu';
            return 'Chuyển Goxu';
        }
        return 'Giao dịch';
    };

    return (
        <Card sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Iconify
                        icon={isDeposit ? 'eva:arrow-downward-fill' : 'eva:arrow-upward-fill'}
                        sx={{
                            mr: 1,
                            color: isDeposit ? 'success.main' : 'error.main',
                            bgcolor: isDeposit ? alpha(theme.palette.success.main, 0.16) : alpha(theme.palette.error.main, 0.16),
                            p: 0.5,
                            borderRadius: '50%',
                            width: 32,
                            height: 32
                        }}
                    />
                    <Box>
                        <Typography variant="subtitle2">{renderTitle()}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {format(new Date(row.created_at), 'dd/MM/yyyy p')}
                        </Typography>
                    </Box>
                </Box>
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
            </Stack>

            <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số Goxu</Typography>
                    <Typography variant="subtitle1" sx={{ color: isDeposit ? 'success.main' : 'error.main' }}>
                        {isDeposit ? '+' : '-'}{fPoint(row.amount)}
                    </Typography>
                </Stack>

                {row.sender && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Người gửi</Typography>
                        <Typography variant="body2">{row.sender.full_name}</Typography>
                    </Stack>
                )}

                {row.receiver && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Người nhận</Typography>
                        <Typography variant="body2">{row.receiver.id === currentUserId ? 'Bạn' : row.receiver.full_name}</Typography>
                    </Stack>
                )}

                {row.reason && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Lý do</Typography>
                        <Typography variant="body2" sx={{ maxWidth: '60%', textAlign: 'right' }}>{row.reason}</Typography>
                    </Stack>
                )}
            </Stack>
        </Card>
    );
}