// @mui
import {
    Avatar,
    IconButton,
    MenuItem,
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
    onRestoreRow: VoidFunction;
    index: number;
};

export default function DeletedAccountTableRow({ row, selected, onSelectRow, onRestoreRow, index }: Props) {
    const { full_name, username, role, avatarUrl } = row;

    const popover = usePopover();

    return (
        <>
            <TableRow hover selected={selected}>
                <TableCell>{index}</TableCell>

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
                            (role === 'MONITOR' && 'warning') ||
                            'default'
                        }
                    >
                        {role === 'ADMIN' ? 'Quản trị viên' : role === 'ACCOUNTANT' ? 'Kế toán' : role === 'MONITOR' ? 'Giám sát' : role === 'PARTNER' ? 'Tài xế' : role === 'INTRODUCER' ? 'Cộng tác viên' : 'Công ty/ CSKD'}
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
                sx={{ width: 140 }}
            >
                <MenuItem
                    onClick={() => {
                        onRestoreRow();
                        popover.onClose();
                    }}
                >
                    <Iconify icon="eva:refresh-fill" />
                    Khôi phục
                </MenuItem>
            </CustomPopover>
        </>
    );
}
