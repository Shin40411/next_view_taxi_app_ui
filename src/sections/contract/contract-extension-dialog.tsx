
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
    open: boolean;
    onClose: VoidFunction;
    onConfirm: VoidFunction;
};

export default function ContractExtensionDialog({ open, onClose, onConfirm }: Props) {
    const agreed = useBoolean();

    const handleClose = () => {
        onClose();
        agreed.onFalse();
    };

    const handleConfirm = () => {
        onConfirm();
        handleClose();
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ pb: 2 }}>Gia hạn hợp đồng</DialogTitle>

            <DialogContent>
                <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                    Vui lòng xem lại các điều khoản và chính sách dưới đây trước khi gia hạn hợp đồng.
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 1. ĐỐI TƯỢNG HỢP ĐỒNG</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph align="justify">
                                - Bên A là đơn vị vận hành ứng dụng kết nối tài xế taxi với nhà hàng, quán ăn, điểm dịch vụ,... (gọi chung là điểm dịch vụ)
                            </Typography>
                            <Typography variant="body2" paragraph align="justify">
                                - Bên B tham gia ứng dụng với tư cách đối tác độc lập, thực hiện việc đưa khách hàng đến các nhà hàng, quán ăn, điểm dịch vụ có liên kết trên ứng dụng.
                            </Typography>
                            <Typography variant="body2" paragraph align="justify">
                                - Khi đưa khách đến nơi được ghi nhận hợp lệ trên hệ thống, Bên B được nhận khoản thưởng theo chính sách công bố trên ứng dụng.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 2. NGUYÊN TẮC HỢP TÁC</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph align="justify">
                                - Hai bên xác định đây là quan hệ hợp tác thương mại, không phải quan hệ lao động.
                            </Typography>
                            <Typography variant="body2" paragraph align="justify">
                                - Bên B tự chủ đồng về thời gian, phương tiện, chi phí vận hành, không chịu sự quản lý chi phí vận hành, không chịu sự quản lý hành chính như người lao động.
                            </Typography>
                            <Typography variant="body2" paragraph align="justify">
                                - Bên A đóng vai trò trung gian công nghệ - quản lý hệ thống – phân phối thưởng
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 3: ĐIỀU KIỆN GHI NHẬN CHUYẾN KHÁCH HỢP LỆ</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph align="justify">
                                - Một chuyến khách được ghi nhận hợp lệ khi đáp ứng đầy đủ:
                            </Typography>
                            <Box sx={{ ml: 2, mb: 1 }}>
                                <Typography variant="body2" paragraph align="justify">1. Bên B thao tác đúng quy trình trên ứng dụng.</Typography>
                                <Typography variant="body2" paragraph align="justify">2. Điểm dịch vụ xác nhận chuyến khách trên ứng dụng.</Typography>
                                <Typography variant="body2" paragraph align="justify">3. Dữ liệu vị trí, thời gian phù hợp với quy định của hệ thống.</Typography>
                                <Typography variant="body2" paragraph align="justify">4. Không có dấu hiệu gian lận hoặc vi phạm chính sách.</Typography>
                            </Box>
                            <Typography variant="body2" paragraph align="justify">
                                - Bên A có quyền từ chối thanh toán đối với các chuyến vi phạm.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 4. THƯỞNG VÀ THANH TOÁN</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph align="justify">1. Mức thưởng cụ thể được hiển thị trực tiếp trên ứng dụng theo từng điểm dịch vụ.</Typography>
                            <Typography variant="body2" paragraph align="justify">2. Tiền thưởng được ghi nhận trong tài khoản (user/account) của Bên B trên ứng dụng.</Typography>
                            <Typography variant="body2" paragraph align="justify">3. Bên B được rút tiền theo chu kỳ do Bên A quy định.</Typography>
                            <Typography variant="body2" paragraph align="justify">4. Bên A có quyền khấu trừ:</Typography>
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body2" paragraph align="justify">• Phí nền tảng (nếu có);</Typography>
                                <Typography variant="body2" paragraph align="justify">• Các khoản hoàn trả do gian lận hoặc vi phạm hợp đồng.</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA BÊN A</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>5.1. Quyền lợi của Bên A:</Typography>
                            <Box sx={{ ml: 1, mb: 2 }}>
                                <Typography variant="body2" paragraph align="justify">- Điều chỉnh chính sách thưởng, quy trình vận hành.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Tạm khóa hoặc chấm dứt hợp tác nếu Bên B vi phạm.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Từ chối thanh toán chuyến không hợp lệ.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Hủy toàn bộ thưởng liên quan khi phát hiện Bên B vi phạm hợp đồng.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Yêu cầu bồi thường thiệt hại (nếu có).</Typography>
                                <Typography variant="body2" paragraph align="justify">- Được quyền từ chối thanh toán hoa hồng cho số doanh thu phát sinh từ điểm dịch vụ phá sản, không thanh toán hoặc thanh toán không đủ.</Typography>
                            </Box>

                            <Typography variant="subtitle2" sx={{ mb: 1 }}>5.2. Nghĩa vụ của Bên A:</Typography>
                            <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" paragraph align="justify">- Vận hành hệ thống ổn định.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Minh bạch dữ liệu thưởng.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Thanh toán đầy đủ các khoản hợp lệ cho Bên B.</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 6. QUYỀN VÀ NGHĨA VỤ CỦA BÊN B</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>6.1. Quyền của Bên B</Typography>
                            <Box sx={{ ml: 1, mb: 2 }}>
                                <Typography variant="body2" paragraph align="justify">- Nhận thưởng đúng quy định.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Tra cứu lịch sử chuyến và thu nhập.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Được hỗ trợ kỹ thuật khi cần.</Typography>
                            </Box>

                            <Typography variant="subtitle2" sx={{ mb: 1 }}>6.2. Nghĩa vụ của Bên B</Typography>
                            <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" paragraph align="justify">- Không gian lận, không tạo chuyến ảo.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Không thỏa thuận riêng với điểm dịch vụ.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Không cố ý tạo lệnh giả hoặc né tránh ghi nhận trên ứng dụng.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Tuân thủ pháp luật về giao thông, kinh doanh vận tải.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Giữ gìn hình ảnh, uy tín của ứng dụng.</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 7. SỰ KIỆN BẤT KHẢ KHÁNG VÀ SỰ CỐ AN NINH MẠNG</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph align="justify">1. Sự kiện bất khả kháng về công nghệ: Bên A không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ:</Typography>
                            <Box sx={{ ml: 2, mb: 1 }}>
                                <Typography variant="body2" paragraph align="justify">- Hành vi tấn công mạng, xâm nhập trái phép, hack hệ thống;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Virus máy tính, mã độc, mã độc tống tiền;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Lỗi bảo mật phát sinh ngoài khả năng kiểm soát hợp lý của Bên A;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Sự cố kỹ thuật từ hạ tầng viễn thông, máy chủ, nền tảng lưu trữ của bên thứ ba.</Typography>
                            </Box>

                            <Typography variant="body2" paragraph align="justify">2. Phạm vi giới hạn trách nhiệm: Trong mọi trường hợp, kể từ khi xảy ra sự cố an ninh mạng:</Typography>
                            <Box sx={{ ml: 2, mb: 1 }}>
                                <Typography variant="body2" paragraph align="justify">- Bên A không chịu trách nhiệm bồi thường đối với:</Typography>
                                <Box sx={{ ml: 2, mb: 1 }}>
                                    <Typography variant="body2" paragraph align="justify">• Mất dữ liệu tạm thời hoặc vĩnh viễn;</Typography>
                                    <Typography variant="body2" paragraph align="justify">• Gián đoạn hoạt động, mất thu nhập dự kiến;</Typography>
                                    <Typography variant="body2" paragraph align="justify">• Mất thưởng, lợi ích gián tiếp hoặc lợi nhuận kỳ vọng của Bên B.</Typography>
                                </Box>
                                <Typography variant="body2" paragraph align="justify">- Trách nhiệm tài chính tối đa (nếu có) của Bên A, nếu được cơ quan thẩm quyền xác định là có lỗi trực tiếp, không vượt quá tổng số tiền thưởng mà Bên B đã thực nhận trong 30 ngày gần nhất trước thời điểm xảy ra sự cố.</Typography>
                            </Box>

                            <Typography variant="body2" paragraph align="justify">3. Không cam kết tuyệt đối về an toàn hệ thống: Bên B hiểu và đồng ý rằng:</Typography>
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body2" paragraph align="justify">- Không hệ thống công nghệ nào an toàn tuyệt đối;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Việc tham gia ứng dụng đồng nghĩa với việc chấp nhận các rủi ro công nghệ hợp lý;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Đây là căn cứ loại trừ trách nhiệm của Bên A theo quy định pháp luật hiện hành.</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 8. XỬ LÝ DỮ LIỆU CÁ NHÂN</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>8.1. Phạm vi dữ liệu cá nhân được thu thập</Typography>
                            <Typography variant="body2" paragraph align="justify">
                                Bên B đồng ý để Bên A thu thập và xử lý các dữ liệu cá nhân sau đây nhằm phục vụ việc thiết lập và thực hiện hợp đồng: Họ và tên; Số định danh cá nhân; Căn cước công dân; Ảnh chụp Căn cước công dân (mặt trước, mặt sau); Ảnh chân dung để đối chiếu danh tính; Thông tin liên hệ (số điện thoại, email); Thông tin tài khoản nhận thanh toán.
                            </Typography>

                            <Typography variant="subtitle2" sx={{ mb: 1 }}>8.2. Mục đích xử lý dữ liệu cá nhân</Typography>
                            <Typography variant="body2" paragraph align="justify">
                                Bên A chỉ xử lý dữ liệu cá nhân của Bên B cho các mục đích sau:
                            </Typography>
                            <Box sx={{ ml: 2, mb: 2 }}>
                                <Typography variant="body2" paragraph align="justify">- Xác minh danh tính của Bên B khi đăng ký trở thành tài xế trên ứng dụng;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Thiết lập, thực hiện và quản lý Hợp đồng hợp tác;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Thực hiện việc đối soát và thanh toán thù lao cho Bên B;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Phòng ngừa gian lận, giải quyết khiếu nại, tranh chấp phát sinh trong quá trình cung cấp dịch vụ;</Typography>
                                <Typography variant="body2" paragraph align="justify">- Thực hiện nghĩa vụ theo yêu cầu hợp pháp của cơ quan nhà nước có thẩm quyền (nếu có).</Typography>
                            </Box>

                            <Typography variant="subtitle2" sx={{ mb: 1 }}>8.3. Thời hạn lưu trữ dữ liệu</Typography>
                            <Box sx={{ ml: 2, mb: 2 }}>
                                <Typography variant="body2" paragraph align="justify">- Dữ liệu cá nhân của Bên B được lưu trữ trong thời hạn:</Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" paragraph align="justify">• Hợp đồng còn hiệu lực; và</Typography>
                                    <Typography variant="body2" paragraph align="justify">• Một khoảng thời gian cần thiết sau khi chấm dứt Hợp đồng này để phục vụ đối soát, giải quyết khiếu nại, tranh chấp hoặc nghĩa vụ pháp lý liên quan.</Typography>
                                </Box>
                                <Typography variant="body2" paragraph align="justify">- Sau khi hết thời hạn nêu trên, Bên A có trách nhiệm xóa, hủy hoặc ẩn danh dữ liệu cá nhân theo quy định pháp luật.</Typography>
                            </Box>

                            <Typography variant="subtitle2" sx={{ mb: 1 }}>8.4. Bảo mật và an toàn dữ liệu</Typography>
                            <Box sx={{ ml: 2 }}>
                                <Typography variant="body2" paragraph align="justify">- Bên A áp dụng các biện pháp kỹ thuật và tổ chức phù hợp, tương ứng với tính chất, mức độ rủi ro và phạm vi xử lý dữ liệu cá nhân, nhằm bảo vệ dữ liệu cá nhân của Bên B.</Typography>
                                <Typography variant="body2" paragraph align="justify">- Các biện pháp bảo mật được Bên A áp dụng có thể bao gồm:</Typography>
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="body2" paragraph align="justify">• Mã hóa dữ liệu ở mức độ phù hợp;</Typography>
                                    <Typography variant="body2" paragraph align="justify">• Phân quyền truy cập dữ liệu theo chức năng, nhiệm vụ;</Typography>
                                    <Typography variant="body2" paragraph align="justify">• Giới hạn số lượng cá nhân, bộ phận được tiếp cận dữ liệu cá nhân;</Typography>
                                    <Typography variant="body2" paragraph align="justify">• Áp dụng các biện pháp giám sát, phòng ngừa truy cập trái phép trong phạm vi khả năng kỹ thuật Bên A tại từng thời điểm.</Typography>
                                </Box>
                                <Typography variant="body2" paragraph align="justify">- Bên A không đảm bảo và không chịu trách nhiệm tuyệt đối đối với mọi rủi ro phát sinh như Điều 7 của Hợp đồng này.</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 9. GIẢI QUYẾT TRANH CHẤP</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" paragraph align="justify">
                                - Mọi tranh chấp phát sinh trong quá trình thực hiện Hợp đồng này trước hết sẽ được hai Bên giải quyết thông qua thương lượng và hòa giải trên tinh thần hợp tác. Thời hạn thương lượng tối đa là 15 (mười lăm) ngày kể từ ngày một Bên thông báo bằng văn bản cho Bên kia về tranh chấp.
                            </Typography>
                            <Typography variant="body2" paragraph align="justify">
                                - Trường hợp thương lượng, hòa giải không đạt kết quả, tranh chấp sẽ được đưa ra giải quyết ở Tòa án có thẩm quyền tại TP. Cần Thơ để giải quyết theo pháp luật Việt Nam.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle1" color="black">ĐIỀU 10. ĐIỀU KHOẢN CHUNG</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" paragraph align="justify">1. Hợp đồng có hiệu lực từ ngày ký.</Typography>
                                <Typography variant="body2" paragraph align="justify">2. Thời hạn: 01 năm, tự động gia hạn nếu không bên nào chấm dứt.</Typography>
                                <Typography variant="body2" paragraph align="justify">3. Mỗi bên có quyền chấm dứt hợp đồng với thông báo trước 03 ngày.</Typography>
                                <Typography variant="body2" paragraph align="justify">4. Được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản.</Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={agreed.value}
                            onChange={agreed.onToggle}
                        />
                    }
                    label="Tôi đồng ý với các điều khoản"
                    sx={{ mt: 2 }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="inherit">
                    Hủy
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!agreed.value}
                >
                    Gia hạn
                </Button>
            </DialogActions>
        </Dialog>
    );
}
