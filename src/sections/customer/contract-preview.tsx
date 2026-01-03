import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { useScaleToFit, PAPER_H, PAPER_W } from 'src/utils/scale-pdf';

// ----------------------------------------------------------------------

type Props = {
    onSign: () => void;
};

export default function ContractPreview({ onSign }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const scale = useScaleToFit(containerRef);

    const methods = useForm({
        defaultValues: {
            fullName: '',
            birthYear: '',
            phoneNumber: '',
            cccd: '',
            address: '',
            vehicle: '',
        },
    });

    return (
        <FormProvider methods={methods}>
            <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Typography variant="h4" textTransform="uppercase">Ký kết hợp đồng điện tử</Typography>

                <Typography variant="body2" color="text.secondary">
                    Vui lòng đọc kỹ và ký hợp đồng để kích hoạt ví điện tử của bạn.
                </Typography>

                {/* Scale Container */}
                <Box
                    ref={containerRef}
                    sx={{
                        width: '100%',
                        maxWidth: 800,
                        height: (containerRef.current?.offsetWidth || 800) * 1.414,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        border: '1px solid #ddd',
                        bgcolor: 'white',
                        position: 'relative',
                        borderRadius: 1,
                    }}
                >
                    {/* Scaled Content */}
                    <Box
                        sx={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            width: PAPER_W,
                            height: 'auto',
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
                                <Typography variant="h6" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Typography>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ textDecoration: 'underline' }}>Độc lập - Tự do - Hạnh phúc</Typography>
                            </Stack>

                            <Typography variant="h5" align="center" sx={{ fontWeight: 700, mt: 2 }}>
                                HỢP ĐỒNG HỢP TÁC <br />
                                CUNG CẤP DỊCH VỤ KẾT NỐI KHÁCH HÀNG
                            </Typography>

                            <Typography variant="subtitle1" align="center" sx={{ fontWeight: 700 }}>
                                Số: <Box component="span" sx={{ color: 'red' }}>......</Box>/2025/HĐHT-NV
                            </Typography>

                            <Box>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'justify', textIndent: '2em' }}>
                                    - Căn cứ vào Bộ Luật dân sự số 91/2015/QH13 được Quốc hội nước nước Cộng hoà xã hội chủ nghĩa Việt Nam thông qua ngày 24/11/2015 và có hiệu lực ngày 01/01/2017. <br />
                                </Typography>

                                <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'justify', textIndent: '2em' }}>
                                    - Căn cứ nhu cầu hợp tác dịch vụ truyền thông giữa hai bên.
                                </Typography>
                            </Box>
                            <Typography variant="body2" align="left">
                                Hôm nay, ngày <Box component="span" sx={{ color: 'red', fontWeight: 'bold' }}>...</Box> tháng <Box component="span" sx={{ color: 'red', fontWeight: 'bold' }}>...</Box> năm <b>20...</b>, hai bên chúng tôi gồm có:
                            </Typography>

                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>BÊN A : CÔNG TY CỔ PHẦN TRUYỀN THÔNG NEXTVIEW</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <Box component="span" sx={{ fontWeight: 700 }}>Đại diện là : Bà NGUYỄN HOÀNG MY</Box> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Chức vụ: <Box component="span" sx={{ fontWeight: 700 }}>Giám đốc</Box>
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>Địa chỉ: Số 20-22 Đường B21 KDC 91B, P.Tân An, Tp.Cần Thơ, Việt Nam</Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>Mã số thuế: 1801802783</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>Điện thoại: 0932 873 221</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>BÊN B :</Typography>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
                                    <Typography variant="body2" fontWeight="bold" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Họ và tên :</Typography>
                                    <RHFTextField
                                        name="fullName"
                                        variant="standard"
                                        fullWidth
                                        size="small"
                                        sx={{
                                            '& .MuiInput-input': { p: 0, fontWeight: 'bold' }
                                        }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                    <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ width: '40%' }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Năm sinh :</Typography>
                                        <RHFTextField name="birthYear" variant="standard" fullWidth size="small" sx={{ '& .MuiInput-input': { p: 0 } }} />
                                    </Stack>
                                    <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ width: '60%' }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Điện thoại:</Typography>
                                        <RHFTextField name="phoneNumber" variant="standard" fullWidth size="small" sx={{ '& .MuiInput-input': { p: 0 } }} />
                                    </Stack>
                                </Stack>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>CCCD/CC số:</Typography>
                                    <RHFTextField name="cccd" variant="standard" fullWidth size="small" sx={{ '& .MuiInput-input': { p: 0 } }} />
                                </Stack>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Địa chỉ:</Typography>
                                    <RHFTextField name="address" variant="standard" fullWidth size="small" sx={{ '& .MuiInput-input': { p: 0 } }} />
                                </Stack>

                                <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ mb: 2 }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap', pb: 0.5 }}>Phương tiện/Đơn vị:</Typography>
                                    <RHFTextField name="vehicle" variant="standard" fullWidth size="small" sx={{ '& .MuiInput-input': { p: 0 } }} />
                                </Stack>
                            </Box>

                            <Typography variant="body2" align="justify">
                                Hai bên cùng thống nhất ký kết hợp đồng hợp tác với các điều khoản sau:
                            </Typography>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Điều 1: Nội dung hợp tác</Typography>
                                <Typography variant="body2" align="justify">
                                    Bên A cung cấp nền tảng ứng dụng đặt xe và quản lý ví điện tử cho Bên B. Bên B sử dụng nền tảng để quản lý các yêu cầu đặt xe và thanh toán qua ví GoXu.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Điều 2: Quyền và nghĩa vụ của Bên A</Typography>
                                <Typography variant="body2" align="justify">
                                    - Đảm bảo hệ thống hoạt động ổn định 24/7. <br />
                                    - Hỗ trợ kỹ thuật và giải quyết các khiếu nại liên quan đến giao dịch.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Điều 3: Quyền và nghĩa vụ của Bên B</Typography>
                                <Typography variant="body2" align="justify">
                                    - Cung cấp thông tin trung thực, chính xác. <br />
                                    - Tuân thủ các quy định về sử dụng dịch vụ và thanh toán.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Điều 4: Hiệu lực hợp đồng</Typography>
                                <Typography variant="body2" align="justify">
                                    Hợp đồng này có hiệu lực kể từ ngày ký và có giá trị vô thời hạn cho đến khi một trong hai bên có thông báo chấm dứt bằng văn bản.
                                </Typography>
                            </Box>

                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 4, pt: 4 }}>
                                <Box sx={{ textAlign: 'center', width: '40%' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>ĐẠI DIỆN BÊN A</Typography>
                                    <Typography variant="caption">(Ký, ghi rõ họ tên)</Typography>
                                    <Box sx={{ height: 80 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Giám đốc Nextview</Typography>
                                </Box>

                                <Box sx={{ textAlign: 'center', width: '40%' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>ĐẠI DIỆN BÊN B</Typography>
                                    <Typography variant="caption">(Ký xác nhận điện tử)</Typography>
                                    <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>[Chưa ký]</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Khách hàng</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>

                <Divider sx={{ width: '100%', my: 2 }} />

                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="inherit">
                        Tải hợp đồng (PDF)
                    </Button>
                    <Button variant="contained" color="primary" onClick={onSign}>
                        Tôi đồng ý và Ký hợp đồng
                    </Button>
                </Stack>
            </Card>
        </FormProvider>
    );
}
