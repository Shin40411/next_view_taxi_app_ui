import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const FAQS = [
    {
        question: 'Làm thế nào để nạp tiền vào ví Goxu?',
        answer: 'Bạn có thể nạp tiền qua chuyển khoản ngân hàng, ví điện tử hoặc tại văn phòng hỗ trợ. Số dư sẽ được cập nhật ngay sau khi giao dịch thành công.',
    },
    {
        question: 'Làm sao để hủy chuyến đúng quy định?',
        answer: 'Bạn chỉ nên hủy chuyến trong trường hợp bất khả kháng hoặc khách hàng không xuất hiện sau 5 phút. Hủy chuyến quá nhiều có thể ảnh hưởng đến tài khoản.',
    },
    {
        question: 'Khách hàng để quên đồ trên xe phải làm sao?',
        answer: 'Vui lòng liên hệ tổng đài hoặc mang vật phẩm đến văn phòng gần nhất. Chúng tôi sẽ hỗ trợ liên hệ khách hàng để trả lại.',
    },
    {
        question: 'Tiền thưởng được tính như thế nào?',
        answer: 'Các chương trình thưởng được cập nhật hàng tuần trong mục "Thu nhập". Tiền thưởng sẽ được cộng vào Ví Goxu vào đầu tuần tiếp theo.',
    },
    {
        question: 'Tôi muốn thay đổi số điện thoại đăng ký?',
        answer: 'Để bảo mật, việc thay đổi SĐT cần thực hiện tại văn phòng hỗ trợ. Vui lòng mang theo CMND/CCCD để được hỗ trợ.',
    },
    {
        question: 'Tại sao tôi không nhận được cuốc xe?',
        answer: 'Vui lòng kiểm tra kết nối mạng, số dư ví và đảm bảo ứng dụng đang ở trạng thái "Sẵn sàng". Di chuyển đến khu vực nhu cầu cao cũng giúp tăng cơ hội nhận cuốc.',
    },
];

export default function SupportFaq() {
    return (
        <Card sx={{ mb: 2 }}>
            <CardHeader title="Câu hỏi thường gặp" />
            <CardContent>
                {FAQS.map((faq, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                            <Typography variant="subtitle2">{faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </CardContent>
        </Card>
    );
}
