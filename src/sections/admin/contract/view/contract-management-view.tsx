'use client';

import { useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import { useTheme } from '@mui/material/styles';

import { useContract } from 'src/hooks/api/use-contract';
import { useSettingsContext } from 'src/components/settings';
import ContractPreview, { ContractPreviewHandle } from 'src/sections/contract/contract-preview';
import { useScaleToFit } from 'src/utils/scale-pdf';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

import IconButton from '@mui/material/IconButton';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ContractManagementView() {
    const settings = useSettingsContext();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { useGetAllContracts } = useContract();
    const { contracts, contractsCount, contractsLoading } = useGetAllContracts(page + 1, rowsPerPage);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Card sx={{ p: 3, mt: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Quản lý hợp đồng</Typography>
                </Box>

                <Grid container spacing={3}>
                    {contractsLoading ? (
                        <Typography>Đang tải...</Typography>
                    ) : contracts?.map((contract) => (
                        <Grid key={contract.id} xs={12} sm={6} md={4} lg={3}>
                            <ContractCard contract={contract} />
                        </Grid>
                    ))}

                    {!contractsLoading && contracts?.length === 0 && (
                        <Grid xs={12}>
                            <Typography align="center">Chưa có hợp đồng nào</Typography>
                        </Grid>
                    )}
                </Grid>

                <TablePagination
                    component="div"
                    count={contractsCount || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`}
                />
            </Card>
        </Container>
    );
}

function ContractCard({ contract }: { contract: any }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contractPreviewRef = useRef<ContractPreviewHandle>(null);
    const [downloading, setDownloading] = useState(false);
    // const scale = useScaleToFit(containerRef);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await contractPreviewRef.current?.downloadPdf();
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Card sx={{ p: 1, overflow: 'hidden', height: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1, borderBottom: '1px dashed', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>{contract.full_name}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(contract.created_at).toLocaleDateString()}</Typography>
                </Box>
                <IconButton
                    // onClick={handleDownload}
                    onClick={() => alert('Chức năng đang phát triển')}
                    disabled={downloading}
                    color="primary">
                    <Iconify icon={downloading ? "eos-icons:loading" : "eva:download-outline"} />
                </IconButton>
            </Box>

            <Box
                ref={containerRef}
                sx={{
                    flexGrow: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    mt: 1,
                    userSelect: 'none',
                }}
            >
                <Box>
                    <ContractPreview
                        ref={contractPreviewRef}
                        id={contract.id}
                        isSigned
                        initialData={contract}
                    />
                </Box>
            </Box>
        </Card>
    );
}
