import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
// @mui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSupport } from 'src/hooks/api/use-support';

// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
} from 'src/components/table';

import { IFaq } from 'src/types/support';

import FaqTableRow from '../faq-table-row';
//
import FaqNewEditForm from '../faq-new-edit-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'stt', label: 'STT' },
    { id: 'question', label: 'Câu hỏi' },
    { id: 'answer', label: 'Câu trả lời' },
    { id: 'created_at', label: 'Ngày tạo' },
    { id: '' },
];

export default function FaqListView() {
    const table = useTable({ defaultDense: true });
    const settings = useSettingsContext();
    const { enqueueSnackbar } = useSnackbar();

    const [filterName, setFilterName] = useState('');
    const debouncedFilterName = useDebounce(filterName, 500);

    const { useGetFaqs, deleteFaq } = useSupport();
    const { faqs, totalFaqs, faqsLoading, mutateFaqs } = useGetFaqs(
        table.page + 1,
        table.rowsPerPage,
        debouncedFilterName
    );

    const quickEdit = useBoolean();
    const confirm = useBoolean();
    const [currentFaq, setCurrentFaq] = useState<IFaq | null>(null);
    const [deleteId, setDeleteId] = useState<string>('');

    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
        table.onResetPage();
    };

    const handleDeleteRow = useCallback(async () => {
        try {
            await deleteFaq(deleteId);
            mutateFaqs();
            enqueueSnackbar('Xóa thành công!');
            confirm.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Xóa thất bại!', { variant: 'error' });
        }
    }, [deleteId, deleteFaq, mutateFaqs, enqueueSnackbar, confirm]);

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Danh sách câu hỏi thường gặp"
                links={[
                    { name: 'Cấu hình hệ thống', href: paths.dashboard.admin.overview },
                    { name: 'FAQ' },
                ]}
                action={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => {
                            setCurrentFaq(null);
                            quickEdit.onTrue();
                        }}
                    >
                        Tạo mới
                    </Button>
                }
                sx={{ my: { xs: 3, md: 5 } }}
            />

            <Card>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
                    <TextField
                        value={filterName}
                        onChange={handleFilterName}
                        placeholder="Tìm kiếm câu hỏi..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: 1, md: 260 } }}
                    />
                </Stack>

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={totalFaqs}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                            />

                            <TableBody>
                                {faqs.map((row, index) => (
                                    <FaqTableRow
                                        key={row.id}
                                        row={row}
                                        index={(table.page * table.rowsPerPage) + index + 1}
                                        onEditRow={() => {
                                            setCurrentFaq(row);
                                            quickEdit.onTrue();
                                        }}
                                        onDeleteRow={() => {
                                            setDeleteId(row.id);
                                            confirm.onTrue();
                                        }}
                                    />
                                ))}

                                <TableEmptyRows
                                    height={table.dense ? 52 : 72}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, totalFaqs)}
                                />

                                <TableNoData notFound={!faqsLoading && totalFaqs === 0} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalFaqs}
                    rowsPerPage={table.rowsPerPage}
                    page={table.page}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
            </Card>

            <FaqNewEditForm
                open={quickEdit.value}
                onClose={quickEdit.onFalse}
                currentFaq={currentFaq}
                onUpdate={mutateFaqs}
            />

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xóa FAQ"
                content="Bạn có chắc chắn muốn xóa câu hỏi này không?"
                action={
                    <Button variant="contained" color="error" onClick={handleDeleteRow}>
                        Xóa
                    </Button>
                }
            />
        </Container>
    );
}
