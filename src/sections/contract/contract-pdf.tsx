import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Times New Roman',
    fonts: [
        { src: '/fonts/TimesNewRoman/SVN-Times New Roman 2.ttf' },
        { src: '/fonts/TimesNewRoman/SVN-Times New Roman 2 bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/TimesNewRoman/SVN-Times New Roman 2 italic.ttf', fontStyle: 'italic' },
        { src: '/fonts/TimesNewRoman/SVN-Times New Roman 2 bold italic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
    ]
});

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 40,
        paddingVertical: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Times New Roman',
        fontSize: 12,
    },
    logo: {
        position: 'absolute',
        top: 40,
        left: 40,
        width: 120,
        height: 'auto',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    headerSubText: {
        fontSize: 12,
        fontWeight: 'bold',
        textDecoration: 'underline',
        textAlign: 'center',
        marginTop: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    contractNumber: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    redText: {
        color: 'red',
    },
    section: {
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 12,
        textAlign: 'justify',
        textIndent: 20,
        marginBottom: 5,
        lineHeight: 1.5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'flex-end',
    },
    bold: {
        fontWeight: 'bold',
    },
    italic: {
        fontStyle: 'italic',
    },
    articleTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#2F5597',
        marginTop: 10,
        marginBottom: 5,
    },
    bulletPoint: {
        marginLeft: 10,
        flexDirection: 'row',
        marginBottom: 3,
    },
    bulletText: {
        fontSize: 12,
        textAlign: 'justify',
        lineHeight: 1.5,
    },
    signatureSection: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureBlock: {
        width: '45%',
        alignItems: 'center',
    },
    signatureImage: {
        width: 100,
        height: 60,
        marginTop: 10,
        objectFit: 'contain',
    },
});

type Props = {
    data: {
        fullName: string;
        birthYear: string;
        phoneNumber: string;
        cccd: string;
        address: string;
        vehicle: string;
        signature?: string | null;
        created_at?: string | Date;
    };
    role?: string;
};

const ContractPdf = ({ data, role }: Props) => {
    const today = data.created_at ? new Date(data.created_at) : new Date();
    const currentDay = today.getDate().toString().padStart(2, '0');
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = today.getFullYear();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image src="/logo/nextview.png" style={styles.logo} />

                <View style={styles.header}>
                    <Text style={styles.headerText}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
                    <Text style={styles.headerSubText}>Độc lập - Tự do - Hạnh phúc</Text>
                </View>

                <Text style={styles.title}>HỢP ĐỒNG HỢP TÁC{'\n'}CUNG CẤP DỊCH VỤ KẾT NỐI KHÁCH HÀNG</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                    <Text style={[styles.contractNumber]}>Số: </Text>
                    <Text style={[styles.contractNumber, styles.redText]}>......</Text>
                    <Text style={[styles.contractNumber]}>/2025/HĐHT-NV</Text>
                </View>

                <Text style={[styles.paragraph, styles.italic]}>
                    - Căn cứ vào Bộ Luật dân sự số 91/2015/QH13 được Quốc hội nước nước Cộng hoà xã hội chủ nghĩa Việt Nam thông qua ngày 24/11/2015 và có hiệu lực ngày 01/01/2017.
                </Text>
                <Text style={[styles.paragraph, styles.italic]}>
                    - Căn cứ nhu cầu hợp tác dịch vụ truyền thông giữa hai bên.
                </Text>

                <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 20 }}>
                    <Text style={styles.paragraph}>Hôm nay, ngày </Text>
                    <Text style={[styles.paragraph, styles.bold, styles.redText]}>{currentDay}</Text>
                    <Text style={styles.paragraph}> tháng </Text>
                    <Text style={[styles.paragraph, styles.bold, styles.redText]}>{currentMonth}</Text>
                    <Text style={styles.paragraph}> năm </Text>
                    <Text style={[styles.paragraph, styles.bold]}>{currentYear}</Text>
                    <Text style={styles.paragraph}>, hai bên chúng tôi gồm có:</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.paragraph, styles.bold]}>BÊN A : CÔNG TY CỔ PHẦN TRUYỀN THÔNG NEXTVIEW</Text>
                    <View style={[styles.row, { marginLeft: 20 }]}>
                        <Text style={styles.bold}>Đại diện là : Bà NGUYỄN HOÀNG MY</Text>
                        <Text style={{ marginLeft: 20 }}>Chức vụ: </Text>
                        <Text style={styles.bold}>Giám đốc</Text>
                    </View>
                    <Text style={[styles.paragraph, { textIndent: 20 }]}>Địa chỉ: Số 20-22 Đường B21 KDC 91B, P.Tân An, Tp.Cần Thơ, Việt Nam</Text>
                    <Text style={[styles.paragraph, { textIndent: 20 }]}>Mã số thuế: 1801802783</Text>
                    <Text style={[styles.paragraph, { textIndent: 20 }, styles.bold]}>Điện thoại: 0932 873 221</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.paragraph, styles.bold]}>BÊN B :</Text>

                    <View style={[styles.row, { marginLeft: 20 }]}>
                        <Text style={styles.bold}>Họ và tên : </Text>
                        <Text style={[styles.bold, { textTransform: 'uppercase' }]}>{data.fullName}</Text>
                    </View>

                    <View style={[styles.row, { marginLeft: 20 }]}>
                        <View style={{ flexDirection: 'row', width: '40%' }}>
                            <Text>Năm sinh : </Text>
                            <Text style={styles.bold}>{data.birthYear}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '60%' }}>
                            <Text>Điện thoại: </Text>
                            <Text style={styles.bold}>{data.phoneNumber}</Text>
                        </View>
                    </View>

                    <View style={[styles.row, { marginLeft: 20 }]}>
                        <Text>CCCD/CC số: </Text>
                        <Text style={styles.bold}>{data.cccd}</Text>
                    </View>

                    <View style={[styles.row, { marginLeft: 20 }]}>
                        <Text>Địa chỉ: </Text>
                        <Text style={styles.bold}>{data.address}</Text>
                    </View>

                    {role !== 'INTRODUCER' && (
                        <View style={[styles.row, { marginLeft: 20 }]}>
                            <Text>Phương tiện/Đơn vị: </Text>
                            <Text style={styles.bold}>{data.vehicle}</Text>
                        </View>
                    )}
                </View>

                <Text style={[styles.paragraph, styles.bold, styles.italic]}>
                    Sau khi thỏa thuận, hai bên thống nhất ký kết hợp đồng với các nội dung sau:
                </Text>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 1. ĐỐI TƯỢNG HỢP ĐỒNG</Text>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Bên A là đơn vị vận hành ứng dụng kết nối tài xế taxi với nhà hàng, quán ăn, điểm dịch vụ,... (gọi chung là điểm dịch vụ)</Text>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Bên B tham gia ứng dụng với tư cách đối tác độc lập, thực hiện việc đưa khách hàng đến các nhà hàng, quán ăn, điểm dịch vụ có liên kết trên ứng dụng.</Text>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Khi đưa khách đến nơi được ghi nhận hợp lệ trên hệ thống, Bên B được nhận khoản thưởng theo chính sách công bố trên ứng dụng.</Text>
                </View>

                <View style={{ ...styles.section }}>
                    <Text style={styles.articleTitle}>ĐIỀU 2. NGUYÊN TẮC HỢP TÁC</Text>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Hai bên xác định đây là quan hệ hợp tác thương mại, không phải quan hệ lao động.</Text>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Bên B tự chủ đồng về thời gian, phương tiện, chi phí vận hành, không chịu sự quản lý chi phí vận hành, không chịu sự quản lý hành chính như người lao động.</Text>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Bên A đóng vai trò trung gian công nghệ - quản lý hệ thống – phân phối thưởng</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 3: ĐIỀU KIỆN GHI NHẬN CHUYẾN KHÁCH HỢP LỆ</Text>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Một chuyến khách được ghi nhận hợp lệ khi đáp ứng đầy đủ:</Text>
                    <View style={{ marginLeft: 30 }}>
                        <Text style={styles.bulletText}>1. Bên B thao tác đúng quy trình trên ứng dụng.</Text>
                        <Text style={styles.bulletText}>2. Điểm dịch vụ xác nhận chuyến khách trên ứng dụng.</Text>
                        <Text style={styles.bulletText}>3. Dữ liệu vị trí, thời gian phù hợp với quy định của hệ thống.</Text>
                        <Text style={styles.bulletText}>4. Không có dấu hiệu gian lận hoặc vi phạm chính sách.</Text>
                    </View>
                    <Text style={[styles.bulletText, { marginLeft: 10 }]}>- Bên A có quyền từ chối thanh toán đối với các chuyến vi phạm.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 4. THƯỞNG VÀ THANH TOÁN</Text>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={styles.bulletText}>1. Mức thưởng cụ thể được hiển thị trực tiếp trên ứng dụng theo từng điểm dịch vụ.</Text>
                        <Text style={styles.bulletText}>2. Tiền thưởng được ghi nhận trong tài khoản (user/account) của Bên B trên ứng dụng.</Text>
                        <Text style={styles.bulletText}>3. Bên B được rút tiền theo chu kỳ do Bên A quy định.</Text>
                        <Text style={styles.bulletText}>4. Bên A có quyền khấu trừ:</Text>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={styles.bulletText}>• Phí nền tảng (nếu có);</Text>
                            <Text style={styles.bulletText}>• Các khoản hoàn trả do gian lận hoặc vi phạm hợp đồng.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA BÊN A</Text>
                    <Text style={[styles.bulletText, styles.bold]}>5.1. Quyền lợi của Bên A:</Text>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.bulletText}>- Điều chỉnh chính sách thưởng, quy trình vận hành.</Text>
                        <Text style={styles.bulletText}>- Tạm khóa hoặc chấm dứt hợp tác nếu Bên B vi phạm.</Text>
                        <Text style={styles.bulletText}>- Từ chối thanh toán chuyến không hợp lệ.</Text>
                        <Text style={styles.bulletText}>- Hủy toàn bộ thưởng liên quan khi phát hiện Bên B vi phạm hợp đồng.</Text>
                        <Text style={styles.bulletText}>- Yêu cầu bồi thường thiệt hại (nếu có).</Text>
                        <Text style={styles.bulletText}>- Được quyền từ chối thanh toán hoa hồng cho số doanh thu phát sinh từ điểm dịch vụ phá sản, không thanh toán hoặc thanh toán không đủ.</Text>
                    </View>

                    <Text style={[styles.bulletText, styles.bold, { marginTop: 5 }]}>5.2. Nghĩa vụ của Bên A:</Text>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.bulletText}>- Vận hành hệ thống ổn định.</Text>
                        <Text style={styles.bulletText}>- Minh bạch dữ liệu thưởng.</Text>
                        <Text style={styles.bulletText}>- Thanh toán đầy đủ các khoản hợp lệ cho Bên B.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 6. QUYỀN VÀ NGHĨA VỤ CỦA BÊN B</Text>
                    <Text style={[styles.bulletText, styles.bold]}>6.1. Quyền của Bên B</Text>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.bulletText}>- Nhận thưởng đúng quy định.</Text>
                        <Text style={styles.bulletText}>- Tra cứu lịch sử chuyến và thu nhập.</Text>
                        <Text style={styles.bulletText}>- Được hỗ trợ kỹ thuật khi cần.</Text>
                    </View>

                    <Text style={[styles.bulletText, styles.bold, { marginTop: 5 }]}>6.2. Nghĩa vụ của Bên B</Text>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={styles.bulletText}>- Không gian lận, không tạo chuyến ảo.</Text>
                        <Text style={styles.bulletText}>- Không thỏa thuận riêng với điểm dịch vụ.</Text>
                        <Text style={styles.bulletText}>- Không cố ý tạo lệnh giả hoặc né tránh ghi nhận trên ứng dụng.</Text>
                        <Text style={styles.bulletText}>- Tuân thủ pháp luật về giao thông, kinh doanh vận tải.</Text>
                        <Text style={styles.bulletText}>- Giữ gìn hình ảnh, uy tín của ứng dụng.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 7. SỰ KIỆN BẤT KHẢ KHÁNG VÀ SỰ CỐ AN NINH MẠNG</Text>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={styles.bulletText}>
                            1. Sự kiện bất khả kháng về công nghệ: Bên A không chịu trách nhiệm đối với bất kỳ thiệt hại trực tiếp hoặc gián tiếp nào phát sinh từ:
                        </Text>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={styles.bulletText}>- Hành vi tấn công mạng, xâm nhập trái phép, hack hệ thống;</Text>
                            <Text style={styles.bulletText}>- Virus máy tính, mã độc, mã độc tống tiền;</Text>
                            <Text style={styles.bulletText}>- Lỗi bảo mật phát sinh ngoài khả năng kiểm soát hợp lý của Bên A;</Text>
                            <Text style={styles.bulletText}>- Sự cố kỹ thuật từ hạ tầng viễn thông, máy chủ, nền tảng lưu trữ của bên thứ ba.</Text>
                        </View>

                        <Text style={[styles.bulletText, { marginTop: 5 }]}>
                            2. Phạm vi giới hạn trách nhiệm: Trong mọi trường hợp, kể từ khi xảy ra sự cố an ninh mạng:
                        </Text>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={styles.bulletText}>- Bên A không chịu trách nhiệm bồi thường đối với:</Text>
                            <View style={{ marginLeft: 20 }}>
                                <Text style={styles.bulletText}>• Mất dữ liệu tạm thời hoặc vĩnh viễn;</Text>
                                <Text style={styles.bulletText}>• Gián đoạn hoạt động, mất thu nhập dự kiến;</Text>
                                <Text style={styles.bulletText}>• Mất thưởng, lợi ích gián tiếp hoặc lợi nhuận kỳ vọng của Bên B.</Text>
                            </View>
                            <Text style={styles.bulletText}>
                                - Trách nhiệm tài chính tối đa (nếu có) của Bên A, nếu được cơ quan thẩm quyền xác định là có lỗi trực tiếp, không vượt quá tổng số tiền thưởng mà Bên B đã thực nhận trong 30 ngày gần nhất trước thời điểm xảy ra sự cố.
                            </Text>
                        </View>

                        <Text style={[styles.bulletText, { marginTop: 5 }]}>
                            3. Không cam kết tuyệt đối về an toàn hệ thống: Bên B hiểu và đồng ý rằng:
                        </Text>
                        <View style={{ marginLeft: 20 }}>
                            <Text style={styles.bulletText}>- Không hệ thống công nghệ nào an toàn tuyệt đối;</Text>
                            <Text style={styles.bulletText}>- Việc tham gia ứng dụng đồng nghĩa với việc chấp nhận các rủi ro công nghệ hợp lý;</Text>
                            <Text style={styles.bulletText}>- Đây là căn cứ loại trừ trách nhiệm của Bên A theo quy định pháp luật hiện hành.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 8. XỬ LÝ DỮ LIỆU CÁ NHÂN</Text>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={[styles.bulletText, styles.bold, { color: '#2F5597' }]}>8.1. Phạm vi dữ liệu cá nhân được thu thập</Text>
                        <Text style={styles.bulletText}>Bên B đồng ý để Bên A thu thập và xử lý các dữ liệu cá nhân sau đây nhằm phục vụ việc thiết lập và thực hiện hợp đồng: Họ và tên; Số định danh cá nhân; Căn cước công dân; Ảnh chụp Căn cước công dân (mặt trước, mặt sau); Ảnh chân dung để đối chiếu danh tính; Thông tin liên hệ (số điện thoại, email); Thông tin tài khoản nhận thanh toán.</Text>

                        <Text style={[styles.bulletText, styles.bold, { color: '#2F5597', marginTop: 5 }]}>8.2. Mục đích xử lý dữ liệu cá nhân</Text>
                        <Text style={styles.bulletText}>Bên A chỉ xử lý dữ liệu cá nhân của Bên B cho các mục đích sau:</Text>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.bulletText}>- Xác minh danh tính của Bên B khi đăng ký trở thành tài xế trên ứng dụng;</Text>
                            <Text style={styles.bulletText}>- Thiết lập, thực hiện và quản lý Hợp đồng hợp tác;</Text>
                            <Text style={styles.bulletText}>- Thực hiện việc đối soát và thanh toán thù lao cho Bên B;</Text>
                            <Text style={styles.bulletText}>- Phòng ngừa gian lận, giải quyết khiếu nại, tranh chấp phát sinh trong quá trình cung cấp dịch vụ;</Text>
                            <Text style={styles.bulletText}>- Thực hiện nghĩa vụ theo yêu cầu hợp pháp của cơ quan nhà nước có thẩm quyền (nếu có).</Text>
                        </View>

                        <Text style={[styles.bulletText, styles.bold, { color: '#2F5597', marginTop: 5 }]}>8.3. Thời hạn lưu trữ dữ liệu</Text>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.bulletText}>- Dữ liệu cá nhân của Bên B được lưu trữ trong thời hạn:</Text>
                            <View style={{ marginLeft: 20 }}>
                                <Text style={styles.bulletText}>• Hợp đồng còn hiệu lực; và</Text>
                                <Text style={styles.bulletText}>• Một khoảng thời gian cần thiết sau khi chấm dứt Hợp đồng này để phục vụ đối soát, giải quyết khiếu nại, tranh chấp hoặc nghĩa vụ pháp lý liên quan.</Text>
                            </View>
                            <Text style={styles.bulletText}>- Sau khi hết thời hạn nêu trên, Bên A có trách nhiệm xóa, hủy hoặc ẩn danh dữ liệu cá nhân theo quy định pháp luật.</Text>
                        </View>

                        <Text style={[styles.bulletText, styles.bold, { color: '#2F5597', marginTop: 5 }]}>8.4. Bảo mật và an toàn dữ liệu</Text>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.bulletText}>- Bên A áp dụng các biện pháp kỹ thuật và tổ chức phù hợp, tương ứng với tính chất, mức độ rủi ro và phạm vi xử lý dữ liệu cá nhân, nhằm bảo vệ dữ liệu cá nhân của Bên B.</Text>
                            <Text style={styles.bulletText}>- Các biện pháp bảo mật được Bên A áp dụng có thể bao gồm:</Text>
                            <View style={{ marginLeft: 20 }}>
                                <Text style={styles.bulletText}>• Mã hóa dữ liệu ở mức độ phù hợp;</Text>
                                <Text style={styles.bulletText}>• Phân quyền truy cập dữ liệu theo chức năng, nhiệm vụ;</Text>
                                <Text style={styles.bulletText}>• Giới hạn số lượng cá nhân, bộ phận được tiếp cận dữ liệu cá nhân;</Text>
                                <Text style={styles.bulletText}>• Áp dụng các biện pháp giám sát, phòng ngừa truy cập trái phép trong phạm vi khả năng kỹ thuật Bên A tại từng thời điểm.</Text>
                            </View>
                            <Text style={styles.bulletText}>- Bên A không đảm bảo và không chịu trách nhiệm tuyệt đối đối với mọi rủi ro phát sinh như Điều 7 của Hợp đồng này.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 9. GIẢI QUYẾT TRANH CHẤP</Text>
                    <Text style={styles.bulletText}>- Mọi tranh chấp phát sinh trong quá trình thực hiện Hợp đồng này trước hết sẽ được hai Bên giải quyết thông qua thương lượng và hòa giải trên tinh thần hợp tác. Thời hạn thương lượng tối đa là 15 (mười lăm) ngày kể từ ngày một Bên thông báo bằng văn bản cho Bên kia về tranh chấp.</Text>
                    <Text style={[styles.bulletText, { marginTop: 5 }]}>- Trường hợp thương lượng, hòa giải không đạt kết quả, tranh chấp sẽ được đưa ra giải quyết ở Tòa án có thẩm quyền tại TP. Cần Thơ để giải quyết theo pháp luật Việt Nam.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.articleTitle}>ĐIỀU 10. ĐIỀU KHOẢN CHUNG</Text>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={styles.bulletText}>1. Hợp đồng có hiệu lực từ ngày ký.</Text>
                        <Text style={styles.bulletText}>2. Thời hạn: 01 năm, tự động gia hạn nếu không bên nào chấm dứt.</Text>
                        <Text style={styles.bulletText}>3. Mỗi bên có quyền chấm dứt hợp đồng với thông báo trước 03 ngày.</Text>
                        <Text style={styles.bulletText}>4. Được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản.</Text>
                    </View>
                </View>

                <View style={styles.signatureSection}>
                    <View style={styles.signatureBlock}>
                        <Text style={[styles.bold, { textTransform: 'uppercase' }]}>ĐẠI DIỆN BÊN B</Text>
                        {data.signature ? (
                            <>
                                <Image src={data.signature} style={styles.signatureImage} />
                                <Text style={styles.bold}>{data.fullName.toUpperCase()}</Text>
                            </>
                        ) : (
                            <Text style={{ marginTop: 60 }}>........................................</Text>
                        )}
                    </View>
                    <View style={styles.signatureBlock}>
                        <Text style={[styles.bold, { textTransform: 'uppercase' }]}>ĐẠI DIỆN BÊN A</Text>
                        <View style={{ height: 60, marginTop: 10 }} />
                        <Text style={styles.bold}>NGUYỄN HOÀNG MY</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ContractPdf;
