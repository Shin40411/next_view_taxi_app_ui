import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';

import Iconify from 'src/components/iconify';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { fPoint } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { useAdmin } from 'src/hooks/api/use-admin';
import { ASSETS_API, HOST_API } from 'src/config-global';

import ProfileUpdateDialog from 'src/sections/driver/profile-update-dialog';
import PasswordReset from 'src/components/dialogs/password-reset';
import { _TAXIBRANDS } from 'src/_mock/_brands';
import { useContract } from 'src/hooks/api/use-contract';
import ContractPreview from 'src/sections/contract/contract-preview';
import { getFullImageUrl } from 'src/utils/get-image';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function PartnerDetailView() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [currentTab, setCurrentTab] = useState('profile');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [rejectReason, setRejectReason] = useState('');

    const { useGetUser, updateUser, useGetUserTrips, updatePartnerStatus } = useAdmin();
    const { user: partner, userLoading, userMutate } = useGetUser(id);
    const { tripsTotal, trips } = useGetUserTrips(id, page + 1, rowsPerPage);

    const confirmApproveProfile = useBoolean();
    const confirmRejectProfile = useBoolean();
    const openUpdateDialog = useBoolean();

    const openPasswordReset = useBoolean();
    const confirmTerminate = useBoolean();
    const confirmApproveContract = useBoolean();

    const { useGetContractByUserId, terminateContract, approveContract } = useContract();
    const { contract, contractLoading, mutate: contractMutate } = useGetContractByUserId(id || '');

    const handleTerminateContract = async () => {
        if (!contract) return;
        try {
            await terminateContract(contract.id);
            contractMutate();
            confirmTerminate.onFalse();
            enqueueSnackbar('Đã chấm dứt hợp đồng thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra khi chấm dứt hợp đồng', { variant: 'error' });
        }
    };

    const handleApproveContract = async () => {
        if (!contract) return;
        try {
            await approveContract(contract.id);
            contractMutate();
            confirmApproveContract.onFalse();
            enqueueSnackbar('Đã duyệt hợp đồng thành công', { variant: 'success' });
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra khi duyệt hợp đồng', { variant: 'error' });
        }
    };

    const slides = [
        { src: getFullImageUrl(partner?.partnerProfile?.id_card_front) },
        { src: getFullImageUrl(partner?.partnerProfile?.id_card_back) },
        { src: getFullImageUrl(partner?.partnerProfile?.driver_license_front) },
        { src: getFullImageUrl(partner?.partnerProfile?.driver_license_back) },
    ];

    const lightbox = useLightBox(slides);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const handleBack = () => {
        router.push(paths.dashboard.admin.partners.root);
    };

    const handleApproveProfile = async () => {
        if (!id) return;
        try {
            await updatePartnerStatus(id, 'APPROVED');
            enqueueSnackbar('Đã duyệt hồ sơ thành công', { variant: 'success' });
            userMutate();
            confirmApproveProfile.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Duyệt hồ sơ thất bại', { variant: 'error' });
        }
    };

    const handleRejectProfile = async () => {
        if (!id) return;
        try {
            await updatePartnerStatus(id, 'REJECTED', rejectReason);
            enqueueSnackbar('Đã từ chối hồ sơ', { variant: 'info' });
            userMutate();
            confirmRejectProfile.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Từ chối hồ sơ thất bại', { variant: 'error' });
        }
    };

    if (userLoading || !partner) {
        return (
            <Container maxWidth="lg" sx={{ mt: 5 }}>
                <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                    <Skeleton variant="rounded" width={120} height={36} />
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width={80} height={36} />
                        <Skeleton variant="rounded" width={80} height={36} />
                        <Skeleton variant="rounded" width={120} height={36} />
                    </Stack>
                </Stack>

                <Grid container spacing={3}>
                    <Grid xs={12} md={4}>
                        <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center' }}>
                            <Skeleton variant="circular" width={120} height={120} sx={{ mx: 'auto', mb: 2 }} />
                            <Skeleton variant="rounded" width={80} height={24} sx={{ mx: 'auto', mb: 2 }} />
                            <Skeleton variant="text" width={100} sx={{ mx: 'auto', mb: 1 }} />

                            <Stack direction="row" sx={{ mt: 3, mb: 2 }} justifyContent="space-between">
                                <Skeleton variant="rectangular" width={60} height={40} />
                                <Skeleton variant="rectangular" width={60} height={40} />
                                <Skeleton variant="rectangular" width={60} height={40} />
                            </Stack>

                            <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

                            <Stack spacing={2}>
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid xs={12} md={8}>
                        <Card>
                            <Skeleton variant="rectangular" width="100%" height={48} />
                            <Box sx={{ p: 3 }}>
                                <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                                <Stack direction="row" spacing={3}>
                                    <Skeleton variant="rectangular" width="48%" height={200} sx={{ borderRadius: 1 }} />
                                    <Skeleton variant="rectangular" width="48%" height={200} sx={{ borderRadius: 1 }} />
                                </Stack>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
                <Button
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    variant='contained'
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                    Quay lại
                </Button>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
                <Typography variant="h4">{partner.full_name}</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="solar:pen-bold" />}
                        onClick={openUpdateDialog.onTrue}
                    >
                        Chỉnh sửa thông tin
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon="eva:lock-fill" />}
                        onClick={openPasswordReset.onTrue}
                    >
                        Đổi mật khẩu
                    </Button>
                    {partner.partnerProfile?.status !== 'APPROVED' && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
                            onClick={confirmApproveProfile.onTrue}
                        >
                            Duyệt hồ sơ
                        </Button>
                    )}
                    {partner.partnerProfile?.status !== 'REJECTED' && (
                        <Button
                            variant="soft"
                            color="error"
                            startIcon={<Iconify icon="eva:close-circle-fill" />}
                            onClick={confirmRejectProfile.onTrue}
                        >
                            Từ chối hồ sơ
                        </Button>
                    )}
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {/* Left Column: Profile Overview */}
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 4, pb: 3, px: 3, textAlign: 'center' }}>
                        <Avatar
                            alt={partner.full_name}
                            src={getFullImageUrl(partner.avatarUrl || (partner as any).avatar)}
                            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                        >
                            {partner.full_name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Chip
                            label={partner.partnerProfile?.is_online ? 'Trực tuyến' : 'Ngoại tuyến'}
                            color={partner.partnerProfile?.is_online ? 'success' : 'default'}
                            variant="soft"
                            sx={{ mb: 2 }}
                        />

                        <Stack direction="row" sx={{ mt: 3, mb: 2 }}>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6">{tripsTotal}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Chuyến</Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ color: 'warning.main' }}>
                                    {fPoint(partner.partnerProfile?.wallet_balance || 0)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Điểm thưởng</Typography>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                {/* Right Column: Detailed Info & Tabs */}
                <Grid xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <Tabs
                            value={currentTab}
                            onChange={handleChangeTab}
                            sx={{
                                px: 3,
                                boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
                            }}
                        >
                            <Tab value="profile" label="Thông tin chung" />
                            <Tab value="documents" label="Giấy tờ / Tài liệu" />

                            <Tab value="trips" label="Lịch sử chuyến đi" />
                            <Tab value="contract" label="Hợp đồng đã ký" />
                        </Tabs>

                        <Divider />

                        <Box sx={{ p: 3 }}>
                            {currentTab === 'profile' && (
                                <Stack spacing={3}>
                                    {/* Contact Info */}
                                    <Box>
                                        <Typography variant="overline" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                                            Thông tin liên hệ
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid xs={12} md={6}>
                                                <Stack direction="row" alignItems="center">
                                                    <Iconify icon="eva:person-fill" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Họ và tên</Typography>
                                                        <Typography variant="subtitle2">{partner.full_name}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Stack direction="row" alignItems="center">
                                                    <Iconify icon="eva:phone-fill" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số điện thoại</Typography>
                                                        <Typography variant="subtitle2">{partner.phone_number || partner.username}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                            <Grid xs={12} md={6}>
                                                <Stack direction="row" alignItems="center">
                                                    <Iconify icon="eva:email-fill" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Email</Typography>
                                                        <Typography variant="subtitle2">{partner.email || '---'}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Divider sx={{ borderStyle: 'dashed' }} />

                                    {/* Bank Info */}
                                    {partner.bankAccount && (
                                        <Box>
                                            <Typography variant="overline" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                                                Thông tin ngân hàng
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid xs={12} md={6}>
                                                    <Stack direction="row" alignItems="center">
                                                        <Iconify icon="mdi:bank" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Ngân hàng</Typography>
                                                            <Typography variant="subtitle2">{partner.bankAccount.bank_name}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={6}>
                                                    <Stack direction="row" alignItems="center">
                                                        <Iconify icon="solar:card-bold" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Số tài khoản</Typography>
                                                            <Typography variant="subtitle2">{partner.bankAccount.account_number}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </Grid>
                                                <Grid xs={12} md={12}>
                                                    <Stack direction="row" alignItems="center">
                                                        <Iconify icon="solar:user-id-bold" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                        <Box>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Chủ tài khoản</Typography>
                                                            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase' }}>
                                                                {partner.bankAccount.account_holder_name}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* Vehicle Info */}
                                    {partner.role === 'PARTNER' && (
                                        <>
                                            <Divider sx={{ borderStyle: 'dashed' }} />
                                            <Box>
                                                <Typography variant="overline" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
                                                    Thông tin phương tiện
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid xs={12} md={6}>
                                                        <Stack direction="row" alignItems="center">
                                                            <Iconify icon="solar:tag-bold" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Hãng xe</Typography>
                                                                <Typography variant="subtitle2">
                                                                    {_TAXIBRANDS.find(b => b.code === partner.partnerProfile?.brand)?.name || partner.partnerProfile?.brand || '---'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid xs={12} md={6}>
                                                        <Stack direction="row" alignItems="center">
                                                            <Iconify icon="eva:car-fill" width={20} sx={{ mr: 1, color: 'text.disabled' }} />
                                                            <Box>
                                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Biển số xe</Typography>
                                                                <Typography variant="subtitle2">{partner.partnerProfile?.vehicle_plate || '---'}</Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}
                                </Stack>
                            )}

                            {currentTab === 'documents' && (
                                <Box>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Ảnh CCCD / Giấy tờ</Typography>
                                    <Grid container spacing={3}>
                                        <Grid xs={12} md={6}>
                                            <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt trước</Typography>
                                            <Box
                                                component="img"
                                                alt="CCCD Front"
                                                src={getFullImageUrl(partner.partnerProfile?.id_card_front)}
                                                onClick={() => lightbox.onOpen(getFullImageUrl(partner.partnerProfile?.id_card_front))}
                                                sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200', cursor: 'pointer' }}
                                            />
                                        </Grid>
                                        <Grid xs={12} md={6}>
                                            <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt sau</Typography>
                                            <Box
                                                component="img"
                                                alt="CCCD Back"
                                                src={getFullImageUrl(partner.partnerProfile?.id_card_back)}
                                                onClick={() => lightbox.onOpen(getFullImageUrl(partner.partnerProfile?.id_card_back))}
                                                sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200', cursor: 'pointer' }}
                                            />
                                        </Grid>
                                    </Grid>


                                    {partner.role === 'PARTNER' && (
                                        <>
                                            <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

                                            <Typography variant="h6" sx={{ mb: 2 }}>Giấy phép lái xe</Typography>
                                            <Grid container spacing={3}>
                                                <Grid xs={12} md={6}>
                                                    <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt trước</Typography>
                                                    <Box
                                                        component="img"
                                                        alt="GPLX Front"
                                                        src={getFullImageUrl(partner.partnerProfile?.driver_license_front)}
                                                        onClick={() => lightbox.onOpen(getFullImageUrl(partner.partnerProfile?.driver_license_front))}
                                                        sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200', cursor: 'pointer' }}
                                                    />
                                                </Grid>
                                                <Grid xs={12} md={6}>
                                                    <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>Mặt sau</Typography>
                                                    <Box
                                                        component="img"
                                                        alt="GPLX Back"
                                                        src={getFullImageUrl(partner.partnerProfile?.driver_license_back)}
                                                        onClick={() => lightbox.onOpen(getFullImageUrl(partner.partnerProfile?.driver_license_back))}
                                                        sx={{ width: 1, height: 200, objectFit: 'cover', borderRadius: 1, bgcolor: 'grey.200', cursor: 'pointer' }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}

                                    <Lightbox
                                        open={lightbox.open}
                                        close={lightbox.onClose}
                                        index={lightbox.selected}
                                        slides={slides}
                                    />
                                </Box>
                            )}

                            {currentTab === 'trips' && (
                                <>
                                    {trips.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: 'text.secondary', py: 5, textAlign: 'center' }}>
                                            Chưa có dữ liệu lịch sử chuyến đi.
                                        </Typography>
                                    ) : (
                                        <TableContainer component={Paper} sx={{ mt: 0.5 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Thời gian</TableCell>
                                                        <TableCell>Khách hàng</TableCell>
                                                        <TableCell align="right">Điểm nhận</TableCell>
                                                        <TableCell align="right">Trạng thái</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {trips.map((trip: any) => (
                                                        <TableRow key={trip.id}>
                                                            <TableCell>{fDateTime(trip.created_at)}</TableCell>
                                                            <TableCell>{trip.servicePoint?.name || '---'}</TableCell>
                                                            <TableCell align="right">{fPoint(trip.reward_snapshot)}</TableCell>
                                                            <TableCell align="right">
                                                                <Chip
                                                                    label={(trip.status === 'COMPLETED' && 'Hoàn thành') ||
                                                                        (trip.status === 'CANCELLED' && 'Đã hủy') ||
                                                                        (trip.status === 'PENDING_CONFIRMATION' && 'Chờ xác nhận') ||
                                                                        (trip.status === 'ARRIVED' && 'Đã đến') ||
                                                                        (trip.status === 'REJECTED' && 'Đã bị từ chối') ||
                                                                        trip.status}
                                                                    color={(trip.status === 'COMPLETED' && 'success') || (trip.status === 'CANCELLED' && 'error') || (trip.status === 'PENDING_CONFIRMATION' && 'warning') || 'default'}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25]}
                                                component="div"
                                                count={tripsTotal}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={(e, newPage) => setPage(newPage)}
                                                onRowsPerPageChange={(e) => {
                                                    setRowsPerPage(parseInt(e.target.value, 10));
                                                    setPage(0);
                                                }}
                                                labelRowsPerPage="Số dòng mỗi trang"
                                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                            />
                                        </TableContainer>
                                    )}
                                </>
                            )}

                            {currentTab === 'contract' && (
                                <Box>
                                    {!contract ? (
                                        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 5 }}>
                                            Người dùng này chưa ký hợp đồng.
                                        </Typography>
                                    ) : (
                                        <>
                                            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 2 }}>
                                                {contract.status !== 'ACTIVE' && (
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        onClick={confirmApproveContract.onTrue}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Duyệt hợp đồng
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={confirmTerminate.onTrue}
                                                >
                                                    Hủy hợp đồng
                                                </Button>
                                                {contract.status === 'TERMINATED' && (
                                                    <Chip label="Đã hủy hợp đồng" color="error" variant="soft" />
                                                )}
                                            </Stack>
                                            <Divider sx={{ mb: 2 }} />
                                            <ContractPreview
                                                id={contract.id}
                                                isSigned
                                                initialData={contract}
                                                title=''
                                                description=''
                                            />
                                        </>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grid>

                <ProfileUpdateDialog
                    open={openUpdateDialog.value}
                    onClose={openUpdateDialog.onFalse}
                    currentUser={partner}
                    onUpdate={userMutate}
                />

                <PasswordReset
                    open={openPasswordReset.value}
                    onClose={openPasswordReset.onFalse}
                    currentUser={partner}
                />

                <ConfirmDialog
                    open={confirmApproveProfile.value}
                    onClose={confirmApproveProfile.onFalse}
                    title="Duyệt hồ sơ"
                    content="Bạn có chắc chắn muốn duyệt hồ sơ này?"
                    action={
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleApproveProfile}
                        >
                            Duyệt
                        </Button>
                    }
                />

                <ConfirmDialog
                    open={confirmRejectProfile.value}
                    onClose={confirmRejectProfile.onFalse}
                    title="Từ chối hồ sơ"
                    content={
                        <>
                            <Typography sx={{ mb: 2 }}>Bạn có chắc chắn muốn từ chối hồ sơ này?</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Lý do từ chối"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                inputProps={{ maxLength: 500 }}
                                helperText={`${rejectReason.length}/500`}
                            />
                        </>
                    }
                    action={
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleRejectProfile}
                        >
                            Từ chối
                        </Button>
                    }
                />

                {contract && (
                    <ConfirmDialog
                        open={confirmTerminate.value}
                        onClose={confirmTerminate.onFalse}
                        title="Chấm dứt hợp đồng"
                        content={`Bạn có chắc chắn muốn hủy hợp đồng của ${partner.full_name}?`}
                        action={
                            <LoadingButton variant="contained" color="error" onClick={handleTerminateContract}>
                                Chấm dứt
                            </LoadingButton>
                        }
                    />
                )}

                {contract && (
                    <ConfirmDialog
                        open={confirmApproveContract.value}
                        onClose={confirmApproveContract.onFalse}
                        title="Duyệt hợp đồng"
                        content={`Bạn có chắc chắn muốn duyệt hợp đồng của ${partner.full_name}?`}
                        action={
                            <LoadingButton variant="contained" color="success" onClick={handleApproveContract}>
                                Duyệt
                            </LoadingButton>
                        }
                    />
                )}
            </Grid>
        </Container >
    );
}
