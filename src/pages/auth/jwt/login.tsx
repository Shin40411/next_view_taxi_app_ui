import { Helmet } from 'react-helmet-async';

import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Goxu | Tiếp thị liên kết dành cho tài xế</title>
      </Helmet>

      <JwtLoginView />
    </>
  );
}
