import { Helmet } from 'react-helmet-async';

import { JwtRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Đăng ký tài khoản | Goxu.vn</title>
        <meta name="description" content="Đăng ký tài khoản Goxu miễn phí. Tham gia mạng lưới tiếp thị liên kết dành cho tài xế taxi, gia tăng thu nhập cực kỳ hấp dẫn." />
        <meta property="og:title" content="Đăng ký tài khoản Goxu | Tiếp thị liên kết dành cho tài xế" />
        <meta property="og:description" content="Trở thành đối tác của Goxu ngay hôm nay để tối ưu hóa thu nhập từ nghề lái xe." />
        <meta property="og:image" content="/assets/images/about/hero.jpg" />
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
