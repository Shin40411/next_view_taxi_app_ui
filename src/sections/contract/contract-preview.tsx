import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { pdf } from '@react-pdf/renderer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useState, useEffect, forwardRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContent from '@mui/material/DialogContent';
import { Theme, Tooltip, DialogTitle, useMediaQuery } from '@mui/material';

import { useAdmin } from 'src/hooks/api/use-admin';
import { useContract } from 'src/hooks/api/use-contract';

import { useScaleToFit } from 'src/utils/scale-pdf';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form';

import { ContractData } from 'src/types/contract';

import ContractOtp from './contract-otp';
import ContractPdf from './contract-pdf';
import { ContractPaperContent } from './contract-paper-content';
import ContractSignatureDialog from './contract-signature-dialog';

// ----------------------------------------------------------------------
export type ContractPreviewHandle = {
    downloadPdf: () => Promise<void>;
};

type Props = {
    id?: string;
    onSign?: (data: ContractData) => void;
    title?: string;
    description?: string;
    isSigned?: boolean;
    initialData?: ContractData;
};

const ContractPreview = forwardRef<ContractPreviewHandle, Props>(({
    id,
    onSign,
    title = 'Ký kết hợp đồng điện tử',
    description = 'Vui lòng đọc kỹ và ký hợp đồng để kích hoạt ví Goxu của bạn.',
    isSigned = false,
    initialData,
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { enqueueSnackbar } = useSnackbar();
    const { requestContractOtp } = useContract();
    const { user } = useAuthContext();
    const { useGetUser } = useAdmin();
    const { user: userData } = useGetUser(user?.id);

    const [openLightbox, setOpenLightbox] = useState(false);
    const [openSignature, setOpenSignature] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | null>(initialData?.signature || null);
    const [signerName, setSignerName] = useState<string>(initialData?.full_name || '');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const today = initialData ? (initialData.created_at ? new Date(initialData.created_at) : new Date()) : new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const scale = useScaleToFit(containerRef, [showOtpInput]);
    const lg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

    const ContractSchema = Yup.object().shape({
        fullName: Yup.string().required('Vui lòng nhập họ tên bên B').max(100, 'Họ tên tối đa 100 ký tự'),
        birthYear: Yup.string()
            .required('Vui lòng nhập năm sinh')
            .matches(/^[0-9]+$/, 'Năm sinh chỉ được nhập số')
            .max(4, 'Năm sinh tối đa 4 ký tự'),
        phoneNumber: Yup.string()
            .required('Vui lòng nhập số điện thoại')
            .matches(/^[0-9]+$/, 'Số điện thoại chỉ được nhập số')
            .max(15, 'Số điện thoại tối đa 15 ký tự'),
        cccd: Yup.string()
            .required('Vui lòng nhập số CCCD')
            .matches(/^[0-9]+$/, 'CCCD chỉ được nhập số')
            .max(12, 'CCCD tối đa 12 số'),
        address: Yup.string().required('Vui lòng nhập địa chỉ').max(255, 'Địa chỉ tối đa 255 ký tự'),
        vehicle: Yup.string().when([], {
            is: () => userData?.role !== 'INTRODUCER',
            then: (schema) => schema.required('Vui lòng nhập phương tiện').max(100, 'Phương tiện tối đa 100 ký tự'),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const defaultValues = {
        fullName: '',
        birthYear: '',
        phoneNumber: '',
        cccd: '',
        address: '',
        vehicle: '',
    };

    const methods = useForm({
        resolver: yupResolver(ContractSchema),
        defaultValues,
    });

    const { reset, formState: { isDirty } } = methods;

    useEffect(() => {
        if (initialData) {
            reset({
                fullName: initialData.full_name,
                birthYear: initialData.birth_year,
                phoneNumber: initialData.phone_number,
                cccd: initialData.cccd,
                address: initialData.address,
                vehicle: initialData.vehicle,
            });
            setSignatureImage(initialData.signature || null);
            setSignerName(initialData.full_name || '');
        } else if (userData && !isDirty) {
            const birthDate = userData.partnerProfile?.date_of_birth;
            let birthYear = '';
            if (birthDate) {
                const parts = birthDate.split(/[-/]/);
                if (parts.length === 3) {
                    if (parts[0].length === 4) birthYear = parts[0];
                    else if (parts[2].length === 4) birthYear = parts[2];
                }
            }

            reset({
                fullName: userData.full_name || '',
                birthYear: birthYear || '',
                phoneNumber: userData.phone_number || '',
                cccd: userData.partnerProfile?.id_card_num || '',
                address: userData.servicePoints?.[0]?.address || '',
                vehicle: userData.partnerProfile?.brand || '',
            });
        }
    }, [userData, initialData, reset, isDirty]);

    const onError = (errors: any) => {
        const errorMessages = Object.values(errors).map((error: any) => error.message).join(', ');
        enqueueSnackbar(errorMessages || 'Vui lòng điền đầy đủ thông tin', { variant: 'error' });
    };

    const onSubmit = (data: any) => {
        setOpenSignature(true);
    };

    const handleConfirmSignature = (signature: string, fullName: string) => {
        setSignatureImage(signature);
        setSignerName(fullName);
        setOpenSignature(false);
    };

    const handleReset = () => {
        setSignatureImage(null);
        setSignerName('');
        setShowOtpInput(false);
        setIsVerified(false);
        reset();
    };

    const handleFinish = () => {
        const formData = methods.getValues();
        if (signatureImage && onSign) {
            onSign({
                full_name: formData.fullName,
                birth_year: formData.birthYear,
                phone_number: formData.phoneNumber,
                cccd: formData.cccd,
                address: formData.address,
                vehicle: formData.vehicle || '',
                signature: signatureImage,
            });
        }
    };

    const [loading, setLoading] = useState(false);

    const handleRequestOtp = async () => {
        setLoading(true);
        try {
            await requestContractOtp();
            enqueueSnackbar('Mã OTP đã được gửi qua Zalo và Email của bạn', { variant: 'success' });
            setShowOtpInput(true);
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Không thể gửi mã OTP, vui lòng kiểm tra lại thông tin', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOtp = (otp: string) => {
        setShowOtpInput(false);
        setIsVerified(true);
        handleFinish();
    };

    if (showOtpInput) {
        return (
            <ContractOtp
                phoneNumber={methods.getValues('phoneNumber')}
                onConfirm={handleConfirmOtp}
                onBack={() => setShowOtpInput(false)}
            />
        );
    }

    return (
        <FormProvider methods={methods}>
            <Dialog maxWidth="lg" fullWidth open={openLightbox} onClose={() => setOpenLightbox(false)} PaperProps={{ sx: { borderRadius: 0 } }}>
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between">
                        <Button
                            variant="contained"
                            onClick={() => setOpenLightbox(false)}
                            startIcon={<Iconify icon="eva:close-fill" />}
                        >
                            Đóng
                        </Button>

                        {!['PARTNER', 'INTRODUCER', 'CUSTOMER'].includes(userData?.role || '') && (
                            <Button
                                variant='contained'
                                startIcon={<Iconify icon="eva:file-text-fill" />}
                                color='secondary'
                                onClick={async () => {
                                    try {
                                        const formData = methods.getValues();
                                        const blob = await pdf(
                                            <ContractPdf
                                                data={{
                                                    fullName: formData.fullName,
                                                    birthYear: formData.birthYear,
                                                    phoneNumber: formData.phoneNumber,
                                                    cccd: formData.cccd,
                                                    address: formData.address,
                                                    vehicle: formData.vehicle || '',
                                                    signature: signatureImage,
                                                    created_at: initialData?.created_at
                                                }}
                                                role={userData?.role}
                                            />
                                        ).toBlob();
                                        const url = URL.createObjectURL(blob);
                                        window.open(url, '_blank');
                                    } catch (error) {
                                        console.error('PDF generation failed:', error);
                                        enqueueSnackbar('Không thể tạo PDF', { variant: 'error' });
                                    }
                                }}
                            >
                                Xem dạng PDF
                            </Button>
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ pb: 0, display: 'flex', bgcolor: 'grey.200', justifyContent: 'center', overflow: 'auto' }}>
                    <Box sx={{ p: 4, height: '100%' }}>
                        <ContractPaperContent
                            id={`${id}-lightbox`}
                            currentDay={currentDay}
                            currentMonth={currentMonth}
                            currentYear={currentYear}
                            signatureImage={signatureImage}
                            signerName={signerName}
                            role={userData?.role}
                            sx={{
                                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>

            <Box sx={{ my: 0, p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {title !== '' && description !== '' ?
                    <Box>
                        <Typography variant="h4" textAlign="center" textTransform="uppercase">{title}</Typography>

                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            {description}
                        </Typography>
                    </Box>
                    :
                    <></>
                }

                {/* Scale Container */}
                <Box
                    ref={containerRef}
                    sx={{
                        width: '100%',
                        maxWidth: 800,
                        height: (containerRef.current?.offsetWidth || 800) * 1.414,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderTop: '1px solid #ddd',
                        borderRight: '1px solid #ddd',
                        borderLeft: '1px solid #ddd',
                        borderBottom: '1px solid #ddd',
                        bgcolor: 'white',
                        position: 'relative',
                        borderRadius: 0,
                        '&:hover .zoom-overlay': {
                            opacity: 1,
                        },
                    }}
                >
                    <ContractPaperContent
                        id={id}
                        scale={scale}
                        currentDay={currentDay}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        signatureImage={signatureImage}
                        signerName={signerName}
                        role={userData?.role}
                    />

                    {isSigned && lg && (
                        <Box
                            className="zoom-overlay"
                            sx={{
                                position: 'sticky',
                                height: '100%',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: 'rgba(0,0,0,0.3)',
                                backdropFilter: 'blur(4px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.3s',
                                zIndex: 9,
                                cursor: 'pointer',
                            }}
                            onClick={() => setOpenLightbox(true)}
                        >
                            <Tooltip title="Xem hợp đồng">
                                <IconButton
                                    sx={{
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: 'primary.lighter' },
                                        width: 64,
                                        height: 64,
                                    }}
                                >
                                    <Iconify icon="hugeicons:view" width={40} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
                {!isSigned && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            href="/assets/files/Hop Dong Taxi Nextview V2.pdf"
                            target="_blank"
                            startIcon={<Iconify icon="eva:download-outline" />}
                            download
                        >
                            Tải về
                        </Button>
                        {signatureImage ? (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                {isVerified ? null : (
                                    <>
                                        <Button variant="outlined" color="inherit" onClick={handleReset} disabled={loading}>
                                            Nhập lại thông tin
                                        </Button>
                                        <LoadingButton
                                            variant="contained"
                                            color="primary"
                                            onClick={handleRequestOtp}
                                            loading={loading}
                                        >
                                            Xác nhận và tiếp tục
                                        </LoadingButton>
                                    </>
                                )}
                            </Stack>
                        ) : (
                            <Button variant="contained" color="primary" onClick={methods.handleSubmit(onSubmit, onError)}>
                                Tôi đồng ý và Ký hợp đồng
                            </Button>
                        )}
                    </Stack>
                )}
            </Box>

            <ContractSignatureDialog
                open={openSignature}
                onClose={() => setOpenSignature(false)}
                onConfirm={handleConfirmSignature}
            />
        </FormProvider >
    );
});

export default ContractPreview;
