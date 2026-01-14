import { format } from 'date-fns';
// @mui
import {
    Avatar,
    Box,
    Button,
    IconButton,
    MenuItem,
    Stack,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import { IUserAdmin } from 'src/types/user';
// utils
import { getFullImageUrl } from 'src/utils/get-image';

// ----------------------------------------------------------------------

type Props = {
    row: IUserAdmin;
    selected: boolean;
    onSelectRow: VoidFunction;

    onEditRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function EmployeeTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }: Props) {
    const { full_name, username, role, avatarUrl } = row;

    const popover = usePopover();

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={full_name} src={getFullImageUrl(avatarUrl || (row as any).avatar)} sx={{ mr: 2 }} />
                    <Typography variant="subtitle2" noWrap>
                        {full_name}
                    </Typography>
                </TableCell>

                <TableCell>{username}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (role === 'ADMIN' && 'primary') ||
                            (role === 'PARTNER' && 'secondary') ||
                            (role === 'ACCOUNTANT' && 'info') ||
                            'default'
                        }
                    >
                        {role === 'ADMIN' ? 'Quản trị viên' : role === 'ACCOUNTANT' ? 'Kế toán' : 'Khách hàng'}
                    </Label>
                </TableCell>

                <TableCell align="right">
                    <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                arrow="right-top"
                sx={{ width: 200 }}
            >
                <MenuItem
                    onClick={() => {
                        onEditRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="solar:pen-bold" />
                    Chỉnh sửa
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        onDeleteRow();
                        popover.onClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="eva:lock-fill" />
                    Khoá tài khoản
                </MenuItem>
            </CustomPopover>
        </>
    );
}
