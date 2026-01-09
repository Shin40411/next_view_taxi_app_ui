import { format } from 'date-fns';
// @mui
import {
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Tooltip,
    MenuItem,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// types
import { IFaq } from 'src/hooks/api/use-support';

// ----------------------------------------------------------------------

type Props = {
    row: IFaq;
    index: number;
    onEditRow: VoidFunction;
    onDeleteRow: VoidFunction;
};

export default function FaqTableRow({ row, index, onEditRow, onDeleteRow }: Props) {
    const { question, answer, created_at } = row;

    const popover = usePopover();

    return (
        <>
            <TableRow hover>
                <TableCell>{index}</TableCell>

                <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="subtitle2" noWrap>
                        {question}
                    </Typography>
                </TableCell>

                <TableCell sx={{ maxWidth: 400 }}>
                    <Typography variant="body2" noWrap>
                        {answer}
                    </Typography>
                </TableCell>

                <TableCell>{format(new Date(created_at), 'dd/MM/yyyy HH:mm')}</TableCell>

                <TableCell align="right">
                    <Tooltip title="Thao tác">
                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Tooltip>
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
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Xóa
                </MenuItem>
            </CustomPopover>
        </>
    );
}
