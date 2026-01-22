import { Helmet } from 'react-helmet-async';

import JwtNewPasswordView from 'src/sections/auth/jwt/jwt-new-password-view';

export default function NewPasswordPage() {
    return (
        <>
            <Helmet>
                <title> Mật khẩu mới | Goxu.vn </title>
                <meta name="description" content="Thiết lập mật khẩu mới an toàn cho tài khoản Goxu của bạn." />
            </Helmet>

            <JwtNewPasswordView />
        </>
    );
}