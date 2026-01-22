import { Helmet } from 'react-helmet-async';

import JwtForgotPasswordView from 'src/sections/auth/jwt/jwt-forgot-password-view';

export default function ForgotPasswordPage() {
    return (
        <>
            <Helmet>
                <title> Quên mật khẩu | Goxu Taxi </title>
                <meta name="description" content="Khôi phục mật khẩu tài khoản Goxu của bạn một cách nhanh chóng và an toàn." />
            </Helmet>

            <JwtForgotPasswordView />
        </>
    );
}