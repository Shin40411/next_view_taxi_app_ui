import { Helmet } from 'react-helmet-async';

import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Goxu | Tiếp thị liên kết dành cho tài xế</title>
        <meta name="description" content="Đăng nhập Goxu - Tiếp thị liên kết dành cho tài xế và khách hàng. Quản lý thu nhập, chuyến đi và kết nối cộng đồng tài xế." />
        <meta property="og:title" content="Đăng nhập Goxu | Tiếp thị liên kết dành cho tài xế" />
        <meta property="og:description" content="Đăng nhập tài khoản Goxu để quản lý hoạt động và theo dõi thu nhập của bạn." />
        <meta property="og:image" content="/assets/images/about/hero.jpg" />
      </Helmet>

      <JwtLoginView />
    </>
  );
}
