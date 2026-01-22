import { useState } from 'react';

import Box from '@mui/material/Box';
// @mui
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { fDateTime } from 'src/utils/format-time';

// components
import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';

import SupportContentDialog from 'src/sections/admin/support/support-content-dialog';

import { ISupportTicket } from 'src/types/support';

// ----------------------------------------------------------------------

type Props = {
    tickets: ISupportTicket[];
    loading: boolean;
};

export default function SupportHistoryTable({ tickets, loading }: Props) {
    const mdUp = useResponsive('up', 'md');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [viewContent, setViewContent] = useState<{ title: string; content: string } | null>(null);
    const viewDialog = useBoolean();

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenView = (title: string, content: string) => {
        setViewContent({ title, content });
        viewDialog.onTrue();
    };

    const renderDesktop = (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
                <Table sx={{ minWidth: 600 }}>
                    <TableHead sx={{ bgcolor: 'background.neutral' }}>
                        <TableRow>
                            <TableCell>Mã yêu cầu</TableCell>
                            <TableCell>Chủ đề</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Phản hồi</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tickets
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" noWrap>
                                            #{row.id.slice(0, 8).toUpperCase()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{row.subject}</TableCell>
                                    <TableCell>{fDateTime(row.created_at)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status === 'RESOLVED' ? 'Đã giải quyết' : 'Đang xử lý'}
                                            color={row.status === 'RESOLVED' ? 'success' : 'warning'}
                                            size="small"
                                            variant="soft"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ maxWidth: 300 }}>
                                        {/* <Markdown children={row.admin_reply || 'Đang chờ'} /> */}
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
                                            'Đang chờ'
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}

                        {!loading && tickets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <EmptyContent
                                        title="Chưa có yêu cầu nào"
                                        imgUrl="/assets/icons/empty/ic_content.svg"
                                        sx={{ py: 5 }}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>
    );

    const renderMobile = (
        <Stack spacing={2} sx={{ p: 2 }}>
            {tickets
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                    <Card key={row.id} sx={{ p: 2, bgcolor: 'background.neutral' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">
                                #{row.id.slice(0, 8).toUpperCase()}
                            </Typography>
                            <Chip
                                label={row.status === 'RESOLVED' ? 'Đã giải quyết' : 'Đang xử lý'}
                                color={row.status === 'RESOLVED' ? 'success' : 'warning'}
                                size="small"
                                variant="soft"
                            />
                        </Stack>

                        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                            {row.subject}
                        </Typography>

                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                            {fDateTime(row.created_at)}
                        </Typography>

                        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Phản hồi:
                            </Typography>
                            {/* <Markdown children={row.admin_reply || 'Đang chờ...'} /> */}
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
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Đang chờ...
                                </Typography>
                            )}
                        </Box>
                    </Card>
                ))}

            {!loading && tickets.length === 0 && (
                <EmptyContent
                    title="Chưa có yêu cầu nào"
                    imgUrl="/assets/icons/empty/ic_content.svg"
                    sx={{ py: 5 }}
                />
            )}
        </Stack>
    );

    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader title="Lịch sử hỗ trợ gần đây" sx={{ mb: mdUp ? 2 : 0 }} />
            {mdUp ? renderDesktop : renderMobile}

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

            {viewContent && (
                <SupportContentDialog
                    open={viewDialog.value}
                    onClose={viewDialog.onFalse}
                    title={viewContent.title}
                    content={viewContent.content}
                />
            )}
        </Card>
    );
}
