import { useState, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// components
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import EmptyContent from 'src/components/empty-content';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useSupport } from 'src/hooks/api/use-support';
import { fDateTime } from 'src/utils/format-time';
import Markdown from 'src/components/markdown';
//
import SupportReplyDialog from '../support-reply-dialog';
import SupportContentDialog from '../support-content-dialog';
import { paths } from 'src/routes/paths';
import { ISupportTicket } from 'src/types/support';

// ----------------------------------------------------------------------

export default function SupportListView() {
    const settings = useSettingsContext();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const { useGetAllTickets } = useSupport();
    const { tickets, ticketsLoading, mutate } = useGetAllTickets({
        fromDate: startDate,
        toDate: endDate,
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
    const [viewContent, setViewContent] = useState<{ title: string; content: string } | null>(null);

    const replyDialog = useBoolean();
    const viewDialog = useBoolean();

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenReply = (ticket: ISupportTicket) => {
        setSelectedTicket(ticket);
        replyDialog.onTrue();
    };

    const handleCloseReply = () => {
        setSelectedTicket(null);
        replyDialog.onFalse();
    };

    const handleOpenView = (title: string, content: string) => {
        setViewContent({ title, content });
        viewDialog.onTrue();
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Danh sách yêu cầu hỗ trợ"
                links={[
                    { name: 'Trợ giúp', href: paths.dashboard.admin.support },
                    { name: 'Hỗ trợ' },
                ]}
                action={
                    <Stack direction="row" spacing={2} sx={{ mt: { xs: 3, md: 0 } }}>
                        <DatePicker
                            label="Từ ngày"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label="Đến ngày"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </Stack>
                }
                sx={{ my: { xs: 3, md: 5 } }}
            />

            <Card>
                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <Scrollbar>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead sx={{ bgcolor: 'background.neutral' }}>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>Người gửi</TableCell>
                                    <TableCell>Tiêu đề</TableCell>
                                    <TableCell>Nội dung</TableCell>
                                    <TableCell>Phản hồi</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell align="right">Hành động</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {tickets
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                            <TableCell>
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.user?.full_name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{row.subject}</TableCell>
                                            <TableCell sx={{ maxWidth: 300 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: 'primary.main',
                                                        textDecoration: 'underline',
                                                    }}
                                                    onClick={() => handleOpenView('Nội dung yêu cầu', row.content)}
                                                >
                                                    Xem nội dung
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ maxWidth: 300 }}>
                                                {row.admin_reply ? (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            cursor: 'pointer',
                                                            color: 'primary.main',
                                                            textDecoration: 'underline',
                                                        }}
                                                        onClick={() => handleOpenView('Phản hồi từ Admin', row.admin_reply || '')}
                                                    >
                                                        Xem phản hồi
                                                    </Typography>
                                                ) : (
                                                    'Chưa cập nhật'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status === 'RESOLVED' ? 'Đã giải quyết' : 'Chờ xử lý'}
                                                    color={row.status === 'RESOLVED' ? 'success' : 'warning'}
                                                    size="small"
                                                    variant="soft"
                                                />
                                            </TableCell>
                                            <TableCell>{fDateTime(row.created_at)}</TableCell>
                                            <TableCell align="right">
                                                {row.status !== 'RESOLVED' && (
                                                    <Tooltip title="Phản hồi">
                                                        <IconButton color="primary" onClick={() => handleOpenReply(row)}>
                                                            <Iconify icon="eva:message-circle-fill" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                {tickets.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            <EmptyContent
                                                title="Không có yêu cầu nào"
                                                imgUrl="/assets/icons/empty/ic_content.svg"
                                                sx={{ py: 10 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={tickets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên ${count}`}
                />
            </Card>

            <SupportReplyDialog
                open={replyDialog.value}
                onClose={handleCloseReply}
                ticket={selectedTicket}
                onUpdate={mutate}
            />

            {viewContent && (
                <SupportContentDialog
                    open={viewDialog.value}
                    onClose={viewDialog.onFalse}
                    title={viewContent.title}
                    content={viewContent.content}
                />
            )}
        </Container>
    );
}
