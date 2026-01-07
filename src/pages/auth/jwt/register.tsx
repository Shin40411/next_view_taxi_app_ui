import { Helmet } from 'react-helmet-async';

import { JwtRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Đăng ký tài khoản - Goxu</title>
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
