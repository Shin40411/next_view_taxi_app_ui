import { Helmet } from 'react-helmet-async';
import JwtNewPasswordView from 'src/sections/auth/jwt/jwt-new-password-view';
// Đảm bảo bạn tạo file View đúng tên này nhé

export default function NewPasswordPage() {
    return (
        <>
            <Helmet>
                <title> Mật khẩu mới | Goxu Taxi </title>
            </Helmet>

            <JwtNewPasswordView />
        </>
    );
}