import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
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

import { useScaleToFit, PAPER_H, PAPER_W } from 'src/utils/scale-pdf';

import ContractSignatureDialog from './contract-signature-dialog';
import Iconify from 'src/components/iconify';
import { ContractData } from 'src/types/contract';

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
    }, [userData, initialData, reset]); // Intentionally omitting isDirty to prevent re-running when user types

    const onSubmit = (data: any) => {
        // console.info('Contract data:', data);
        setOpenSignature(true);
    };

    const handleConfirmSignature = (signature: string, fullName: string) => {
        // console.info('Signature:', signature);
        // console.info('Signer:', fullName);
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
                    scale: 2, // Higher quality
                    useCORS: true,
                    logging: false,
                    onclone: (clonedDoc) => {
                        const clonedElement = clonedDoc.getElementById(`contract-paper-content-${id || 'default'}`);
                        if (clonedElement) {
                            clonedElement.style.transform = 'scale(1)';
                            clonedElement.style.width = `${PAPER_W}px`;
                            clonedElement.style.height = `${PAPER_H}px`;
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

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImageHeight);
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
        // console.info('OTP Verified');
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
                    }}
                >
                    <Box
                        id={`contract-paper-content-${id || 'default'}`}
                        sx={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            width: PAPER_W,
                            height: '100vh',
                            minHeight: PAPER_H,
                            p: 4,
                            bgcolor: 'white',
                        }}
                    >
                        <Box
                            component="img"
                            src="/logo/nextview.png"
                            sx={{
                                position: 'absolute',
                                top: 40,
                                left: 40,
                                width: 120,
                                height: 'auto',
                                objectFit: 'contain'
                            }}
                        />

                        <Stack spacing={2}>
                            <Stack alignItems="center" spacing={0.5}>
                                <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700, fontFamily: 'Times New Roman' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ textDecoration: 'underline' }}>Độc lập - Tự do - Hạnh phúc</Typography>
                            </Stack>

                            <Typography variant="h5" align="center" sx={{ fontWeight: 700, fontFamily: 'Times New Roman', mt: 2 }}>
                                HỢP ĐỒNG HỢP TÁC <br />
                                CUNG CẤP DỊCH VỤ KẾT NỐI KHÁCH HÀNG
                            </Typography>

                            <Typography variant="subtitle1" align="center" fontFamily="Times New Roman" sx={{ fontWeight: 700 }}>
                                Số: <Box component="span" sx={{ color: 'red' }}>......</Box>/2025/HĐHT-NV
                            </Typography>

                            <Box>
                                <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ fontStyle: 'italic', textAlign: 'justify', textIndent: '2em' }}>
                                    - Căn cứ vào Bộ Luật dân sự số 91/2015/QH13 được Quốc hội nước nước Cộng hoà xã hội chủ nghĩa Việt Nam thông qua ngày 24/11/2015 và có hiệu lực ngày 01/01/2017. <br />
                                </Typography>

                                <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ fontStyle: 'italic', textAlign: 'justify', textIndent: '2em' }}>
                                    - Căn cứ nhu cầu hợp tác dịch vụ truyền thông giữa hai bên.
                                </Typography>
                            </Box>
                            <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" align="left" sx={{ textIndent: '2em' }}>
                                Hôm nay, ngày <Box component="span" sx={{ color: 'red', fontWeight: 'bold' }}>{currentDay.toString().padStart(2, '0')}</Box> tháng <Box component="span" sx={{ color: 'red', fontWeight: 'bold' }}>{currentMonth.toString().padStart(2, '0')}</Box> năm <b>{currentYear}</b>, hai bên chúng tôi gồm có:
                            </Typography>

                            <Box>
                                <Typography variant="subtitle1" fontSize={16} fontFamily="Times New Roman" sx={{ fontWeight: 700, mb: 0.5 }}>BÊN A : CÔNG TY CỔ PHẦN TRUYỀN THÔNG NEXTVIEW</Typography>
                                <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ mb: 0.5 }}>
                                    <Box component="span" sx={{ fontWeight: 700 }}>Đại diện là : Bà NGUYỄN HOÀNG MY</Box> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Chức vụ: <Box component="span" sx={{ fontWeight: 700 }}>Giám đốc</Box>
                                </Typography>
                                <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ mb: 0.5 }}>Địa chỉ: Số 20-22 Đường B21 KDC 91B, P.Tân An, Tp.Cần Thơ, Việt Nam</Typography>
                                <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ mb: 0.5 }}>Mã số thuế: 1801802783</Typography>
                                <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ fontWeight: 700 }}>Điện thoại: 0932 873 221</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" fontSize={16} fontFamily="Times New Roman" sx={{ fontWeight: 700, mb: 0.5 }}>BÊN B :</Typography>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
                                    <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" fontWeight="bold" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Họ và tên :</Typography>
                                    {signatureImage ? (
                                        <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" fontWeight="bold" sx={{ pb: 0.5, pl: 1 }}>{methods.getValues('fullName').toUpperCase()}</Typography>
                                    ) : (
                                        <RHFTextField
                                            name="fullName"
                                            variant="standard"
                                            fullWidth
                                            size="small"
                                            sx={{
                                                '& .MuiInput-input': { p: 0, fontWeight: 'bold' }
                                            }}
                                        />
                                    )}
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                    <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ width: '40%' }}>
                                        <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Năm sinh :</Typography>
                                        {signatureImage ? (
                                            <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" fontWeight="bold" sx={{ pb: 0.5, pl: 1 }}>{methods.getValues('birthYear')}</Typography>
                                        ) : (
                                            <RHFTextField
                                                name="birthYear"
                                                variant="standard"
                                                fullWidth
                                                size="small"
                                                sx={{ '& .MuiInput-input': { p: 0 } }}
                                                inputProps={{
                                                    maxLength: 4,
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                    }
                                                }}
                                            />
                                        )}
                                    </Stack>
                                    <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ width: '60%' }}>
                                        <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Điện thoại:</Typography>
                                        {signatureImage ? (
                                            <Typography
                                                variant="body2"
                                                fontSize={16}
                                                fontFamily="Times New Roman"
                                                fontWeight="bold"
                                                sx={{ pb: 0.5, pl: 1 }}
                                            >
                                                {methods.getValues('phoneNumber')}
                                            </Typography>
                                        ) : (
                                            <RHFTextField
                                                name="phoneNumber"
                                                variant="standard"
                                                fullWidth
                                                size="small"
                                                sx={{ '& .MuiInput-input': { p: 0 } }}
                                                inputProps={{
                                                    maxLength: 10,
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                    }
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </Stack>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
                                    <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>CCCD/CC số:</Typography>
                                    {signatureImage ? (
                                        <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" fontWeight="bold" sx={{ pb: 0.5, pl: 1 }}>{methods.getValues('cccd')}</Typography>
                                    ) : (
                                        <RHFTextField
                                            name="cccd"
                                            variant="standard"
                                            fullWidth
                                            size="small"
                                            sx={{ '& .MuiInput-input': { p: 0 } }}
                                            inputProps={{
                                                maxLength: 12,
                                                inputMode: 'numeric',
                                                pattern: '[0-9]*',
                                                onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                                }
                                            }}
                                        />
                                    )}
                                </Stack>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
                                    <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Địa chỉ:</Typography>
                                    {signatureImage ? (
                                        <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" fontWeight="bold" sx={{ pb: 0.5, pl: 1 }}>{methods.getValues('address')}</Typography>
                                    ) : (
                                        <RHFTextField name="address" variant="standard" fullWidth size="small" sx={{ '& .MuiInput-input': { p: 0 } }} />
                                    )}
                                </Stack>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 2 }}>
                                    <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Phương tiện/Đơn vị:</Typography>
                                    {signatureImage ? (
                                        <Typography variant="body2" fontSize={16} fontFamily="Times New Roman" fontWeight="bold" sx={{ pb: 0.5, pl: 1 }}>{methods.getValues('vehicle')}</Typography>
                                    ) : (
                                        <RHFTextField name="vehicle" variant="standard" fullWidth size="small" sx={{ '& .MuiInput-input': { p: 0 } }} />
                                    )}
                                </Stack>
                            </Box>

                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman" sx={{ fontWeight: 700, fontStyle: 'italic' }}>
                                Sau khi thỏa thuận, hai bên thống nhất ký kết hợp đồng với các nội dung sau:
                            </Typography>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 1. ĐỐI TƯỢNG HỢP ĐỒNG
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Bên A là đơn vị vận hành ứng dụng kết nối tài xế taxi với nhà hàng, quán ăn, điểm dịch vụ,... (gọi chung là điểm dịch vụ)
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    -	Bên B tham gia ứng dụng với tư cách đối tác độc lập, thực hiện việc đưa khách hàng đến các nhà hàng, quán ăn, điểm dịch vụ có liên kết trên ứng dụng.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    -	Khi đưa khách đến nơi được ghi nhận hợp lệ trên hệ thống, Bên B được nhận khoản thưởng theo chính sách công bố trên ứng dụng.
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 2. NGUYÊN TẮC HỢP TÁC
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Hai bên xác định đây là quan hệ hợp tác thương mại, không phải quan hệ lao động.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Bên B tự chủ đồng về thời gian, phương tiện, chi phí vận hành, không chịu sự quản lý chi phí vận hành, không chịu sự quản lý hành chính như người lao động.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Bên A đóng vai trò trung gian công nghệ - quản lý hệ thống – phân phối thưởng
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 3: ĐIỀU KIỆN GHI NHẬN CHUYẾN KHÁCH HỢP LỆ
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Một chuyến khách được ghi nhận hợp lệ khi đáp ứng đầy đủ:
                                </Typography>
                                <Box sx={{ ml: 4 }}>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        1. Bên B thao tác đúng quy trình trên ứng dụng.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        2. Điểm dịch vụ xác nhận chuyến khách trên ứng dụng.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        3. Dữ liệu vị trí, thời gian phù hợp với quy định của hệ thống.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        4. Không có dấu hiệu gian lận hoặc vi phạm chính sách.
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Bên A có quyền từ chối thanh toán đối với các chuyến vi phạm.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 4. THƯỞNG VÀ THANH TOÁN
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        1. Mức thưởng cụ thể được hiển thị trực tiếp trên ứng dụng theo từng điểm dịch vụ.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        2. Tiền thưởng được ghi nhận trong tài khoản (user/account) của Bên B trên ứng dụng.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        3. Bên B được rút tiền theo chu kỳ do Bên A quy định.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        4. Bên A có quyền khấu trừ:
                                    </Typography>
                                    <Box sx={{ ml: 3 }}>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            • Phí nền tảng (nếu có);
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            • Các khoản hoàn trả do gian lận hoặc vi phạm hợp đồng.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA BÊN A
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    5.1. Quyền lợi của Bên A:
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Điều chỉnh chính sách thưởng, quy trình vận hành.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Tạm khóa hoặc chấm dứt hợp tác nếu Bên B vi phạm.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Từ chối thanh toán chuyến không hợp lệ.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Hủy toàn bộ thưởng liên quan khi phát hiện Bên B vi phạm hợp đồng.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Yêu cầu bồi thường thiệt hại (nếu có).
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Được quyền từ chối thanh toán hoa hồng cho số doanh thu phát sinh từ điểm dịch vụ phá sản, không thanh toán hoặc thanh toán không đủ.
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    5.2. Nghĩa vụ của Bên A:
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Vận hành hệ thống ổn định.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Minh bạch dữ liệu thưởng.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Thanh toán đầy đủ các khoản hợp lệ cho Bên B.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 6. QUYỀN VÀ NGHĨA VỤ CỦA BÊN B
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    6.1. Quyền của Bên B
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Nhận thưởng đúng quy định.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Tra cứu lịch sử chuyến và thu nhập.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Được hỗ trợ kỹ thuật khi cần.
                                </Typography>

                                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    6.2. Nghĩa vụ của Bên B
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Không gian lận, không tạo chuyến ảo.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Không thỏa thuận riêng với điểm dịch vụ.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Không cố ý tạo lệnh giả hoặc né tránh ghi nhận trên ứng dụng.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Tuân thủ pháp luật về giao thông, kinh doanh vận tải.
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Giữ gìn hình ảnh, uy tín của ứng dụng.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 7. SỰ KIỆN BẤT KHẢ KHÁNG VÀ SỰ CỐ AN NINH MẠNG
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        1. Sự kiện bất khả kháng về công nghệ: Bên A không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ:
                                    </Typography>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Hành vi tấn công mạng, xâm nhập trái phép, hack hệ thống;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Virus máy tính, mã độc, mã độc tống tiền;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Lỗi bảo mật phát sinh ngoài khả năng kiểm soát hợp lý của Bên A;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Sự cố kỹ thuật từ hạ tầng viễn thông, máy chủ, nền tảng lưu trữ của bên thứ ba.
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ mt: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                        2. Phạm vi giới hạn trách nhiệm: Trong mọi trường hợp, kể từ khi xảy ra sự cố an ninh mạng:
                                    </Typography>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Bên A không chịu trách nhiệm bồi thường đối với:
                                        </Typography>
                                        <Box sx={{ ml: 4 }}>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Mất dữ liệu tạm thời hoặc vĩnh viễn;
                                            </Typography>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Gián đoạn hoạt động, mất thu nhập dự kiến;
                                            </Typography>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Mất thưởng, lợi ích gián tiếp hoặc lợi nhuận kỳ vọng của Bên B.
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Trách nhiệm tài chính tối đa (nếu có) của Bên A, nếu được cơ quan thẩm quyền xác định là có lỗi trực tiếp, không vượt quá tổng số tiền thưởng mà Bên B đã thực nhận trong 30 ngày gần nhất trước thời điểm xảy ra sự cố.
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ mt: 1 }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                        3. Không cam kết tuyệt đối về an toàn hệ thống: Bên B hiểu và đồng ý rằng:
                                    </Typography>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Không hệ thống công nghệ nào an toàn tuyệt đối;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Việc tham gia ứng dụng đồng nghĩa với việc chấp nhận các rủi ro công nghệ hợp lý;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Đây là căn cứ loại trừ trách nhiệm của Bên A theo quy định pháp luật hiện hành.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>


                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 8. XỬ LÝ DỮ LIỆU CÁ NHÂN
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: '#2F5597' }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                        8.1. Phạm vi dữ liệu cá nhân được thu thập
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        Bên B đồng ý để Bên A thu thập và xử lý các dữ liệu cá nhân sau đây nhằm phục vụ việc thiết lập và thực hiện hợp đồng: Họ và tên; Số định danh cá nhân; Căn cước công dân; Ảnh chụp Căn cước công dân (mặt trước, mặt sau); Ảnh chân dung để đối chiếu danh tính; Thông tin liên hệ (số điện thoại, email); Thông tin tài khoản nhận thanh toán.
                                    </Typography>

                                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: '#2F5597' }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                        8.2. Mục đích xử lý dữ liệu cá nhân
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        Bên A chỉ xử lý dữ liệu cá nhân của Bên B cho các mục đích sau:
                                    </Typography>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Xác minh danh tính của Bên B khi đăng ký trở thành tài xế trên ứng dụng;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Thiết lập, thực hiện và quản lý Hợp đồng hợp tác;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Thực hiện việc đối soát và thanh toán thù lao cho Bên B;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Phòng ngừa gian lận, giải quyết khiếu nại, tranh chấp phát sinh trong quá trình cung cấp dịch vụ;
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Thực hiện nghĩa vụ theo yêu cầu hợp pháp của cơ quan nhà nước có thẩm quyền (nếu có).
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: '#2F5597' }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                        8.3. Thời hạn lưu trữ dữ liệu
                                    </Typography>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Dữ liệu cá nhân của Bên B được lưu trữ trong thời hạn:
                                        </Typography>
                                        <Box sx={{ ml: 4 }}>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Hợp đồng còn hiệu lực; và
                                            </Typography>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Một khoảng thời gian cần thiết sau khi chấm dứt Hợp đồng này để phục vụ đối soát, giải quyết khiếu nại, tranh chấp hoặc nghĩa vụ pháp lý liên quan.
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Sau khi hết thời hạn nêu trên, Bên A có trách nhiệm xóa, hủy hoặc ẩn danh dữ liệu cá nhân theo quy định pháp luật.
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: '#2F5597' }} align="justify" fontSize={16} fontFamily="Times New Roman">
                                        8.4. Bảo mật và an toàn dữ liệu
                                    </Typography>
                                    <Box sx={{ ml: 1 }}>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Bên A áp dụng các biện pháp kỹ thuật và tổ chức phù hợp, tương ứng với tính chất, mức độ rủi ro và phạm vi xử lý dữ liệu cá nhân, nhằm bảo vệ dữ liệu cá nhân của Bên B.
                                        </Typography>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Các biện pháp bảo mật được Bên A áp dụng có thể bao gồm:
                                        </Typography>
                                        <Box sx={{ ml: 4 }}>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Mã hóa dữ liệu ở mức độ phù hợp;
                                            </Typography>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Phân quyền truy cập dữ liệu theo chức năng, nhiệm vụ;
                                            </Typography>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Giới hạn số lượng cá nhân, bộ phận được tiếp cận dữ liệu cá nhân;
                                            </Typography>
                                            <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                                • Áp dụng các biện pháp giám sát, phòng ngừa truy cập trái phép trong phạm vi khả năng kỹ thuật Bên A tại từng thời điểm.
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                            - Bên A không đảm bảo và không chịu trách nhiệm tuyệt đối đối với mọi rủi ro phát sinh như Điều 7 của Hợp đồng này.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 9. GIẢI QUYẾT TRANH CHẤP
                                </Typography>
                                <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                    - Mọi tranh chấp phát sinh trong quá trình thực hiện Hợp đồng này trước hết sẽ được hai Bên giải quyết thông qua thương lượng và hòa giải trên tinh thần hợp tác. Thời hạn thương lượng tối đa là 15 (mười lăm) ngày kể từ ngày một Bên thông báo bằng văn bản cho Bên kia về tranh chấp.
                                </Typography>
                                <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman" sx={{ mt: 1 }}>
                                    - Trường hợp thương lượng, hòa giải không đạt kết quả, tranh chấp sẽ được đưa ra giải quyết ở Tòa án có thẩm quyền tại TP. Cần Thơ để giải quyết theo pháp luật Việt Nam.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        color: '#2F5597',
                                        fontFamily: 'Times New Roman',
                                        fontSize: 16
                                    }}
                                >
                                    ĐIỀU 10. ĐIỀU KHOẢN CHUNG
                                </Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        1. Hợp đồng có hiệu lực từ ngày ký.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        2. Thời hạn: 01 năm, tự động gia hạn nếu không bên nào chấm dứt.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        3. Mỗi bên có quyền chấm dứt hợp đồng với thông báo trước 03 ngày.
                                    </Typography>
                                    <Typography variant="body2" align="justify" fontSize={16} fontFamily="Times New Roman">
                                        4. Được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản.
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack direction="row" justifyContent="space-between" sx={{ my: 4 }}>
                                <Box sx={{ textAlign: 'center', width: '45%' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Times New Roman', fontSize: 16 }}>ĐẠI DIỆN BÊN B</Typography>
                                    <Box sx={{ height: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'end' }}>
                                        {signatureImage ? (
                                            <>
                                                <Box
                                                    component="img"
                                                    src={signatureImage}
                                                    sx={{ height: 80, width: 'auto' }}
                                                    alt="Chữ ký bên B"
                                                />
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Times New Roman', fontSize: 16 }}>{signerName.toUpperCase()}</Typography>
                                            </>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontFamily: 'Times New Roman', fontSize: 16 }}>........................................................</Typography>
                                        )}
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: 'center', width: '45%' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Times New Roman', fontSize: 16 }}>ĐẠI DIỆN BÊN A</Typography>
                                    <Box sx={{ height: 100, display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Times New Roman', fontSize: 16 }}>NGUYỄN HOÀNG MY</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
                {!isSigned && (
                    <Stack direction="row" spacing={2}>
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
                            <Stack direction="row" spacing={2}>
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
                            <Button variant="contained" color="primary" onClick={methods.handleSubmit(onSubmit)}>
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
