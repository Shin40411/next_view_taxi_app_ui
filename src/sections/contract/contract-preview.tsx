import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSnackbar } from 'notistack';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useContract } from 'src/hooks/api/use-contract';
import { useAuthContext } from 'src/auth/hooks';
import { useAdmin } from 'src/hooks/api/use-admin';
import ContractOtp from './contract-otp';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import { useScaleToFit, PAPER_H, PAPER_W } from 'src/utils/scale-pdf';

import ContractSignatureDialog from './contract-signature-dialog';
import Iconify from 'src/components/iconify';
import { ContractData } from 'src/types/contract';
import { DialogTitle, Theme, Tooltip, useMediaQuery } from '@mui/material';
import { ContractPaperContent } from './contract-paper-content';

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
    // ... existing hooks ...
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
        fullName: Yup.string().required('Vui lòng nhập họ tên bên B'),
        birthYear: Yup.string()
            .required('Vui lòng nhập năm sinh')
            .matches(/^[0-9]+$/, 'Năm sinh chỉ được nhập số')
            .max(4, 'Năm sinh tối đa 4 ký tự'),
        phoneNumber: Yup.string()
            .required('Vui lòng nhập số điện thoại')
            .matches(/^[0-9]+$/, 'Số điện thoại chỉ được nhập số')
            .max(10, 'Số điện thoại tối đa 10 số'),
        cccd: Yup.string()
            .required('Vui lòng nhập số CCCD')
            .matches(/^[0-9]+$/, 'CCCD chỉ được nhập số')
            .max(12, 'CCCD tối đa 12 số'),
        address: Yup.string().required('Vui lòng nhập địa chỉ'),
        vehicle: Yup.string().required('Vui lòng nhập phương tiện'),
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
        } else if (userData && !isDirty) {
            reset({
                fullName: userData.full_name || '',
                birthYear: '',
                phoneNumber: userData.username || '',
                cccd: '',
                address: userData.servicePoints?.[0]?.address || '',
                vehicle: '',
            });
        }
    }, [userData, initialData, reset]);

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
                vehicle: formData.vehicle,
                signature: signatureImage,
            });
        }
    };

    useImperativeHandle(ref, () => ({
        downloadPdf: async () => {
            const element = document.getElementById(`contract-paper-content-${id || 'default'}`);
            if (!element) return;

            try {
                const canvas = await html2canvas(element as HTMLElement, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    onclone: (clonedDoc) => {
                        const clonedElement = clonedDoc.getElementById(`contract-paper-content-${id || 'default'}`);
                        if (clonedElement) {
                            clonedElement.style.transform = 'scale(1)';
                            clonedElement.style.width = `${PAPER_W}px`;
                            clonedElement.style.height = 'auto';
                            clonedElement.style.overflow = 'visible';
                        }
                    }
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const pdfImageHeight = (imgHeight * pdfWidth) / imgWidth;

                let heightLeft = pdfImageHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                    position = heightLeft - pdfImageHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
                    heightLeft -= pdfHeight;
                }

                pdf.save(`HopDong_${methods.getValues('fullName') || 'DaKy'}.pdf`);
            } catch (error) {
                console.error('Download failed:', error);
                enqueueSnackbar('Tải xuống thất bại', { variant: 'error' });
            }
        }
    }));


    const handleRequestOtp = async () => {
        try {
            await requestContractOtp();
            enqueueSnackbar('Mã OTP đã được gửi đến Zalo của bạn', { variant: 'success' });
            setShowOtpInput(true);
        } catch (error: any) {
            console.error(error);
            enqueueSnackbar(error?.message || 'Không thể gửi mã OTP, vui lòng kiểm tra số điện thoại', { variant: 'error' });
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
                    <Button
                        variant="contained"
                        onClick={() => setOpenLightbox(false)}
                        startIcon={<Iconify icon="eva:close-fill" />}
                    >
                        Đóng
                    </Button>
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
                            sx={{
                                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>

            <Box sx={{ my: 0, p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {!isSigned && (
                    <Box>
                        <Typography variant="h4" textAlign="center" textTransform="uppercase">{title}</Typography>

                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            {description}
                        </Typography>
                    </Box>
                )}

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
                                        <Button variant="outlined" color="inherit" onClick={handleReset}>
                                            Nhập lại thông tin
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleRequestOtp}>
                                            Xác nhận và tiếp tục
                                        </Button>
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
