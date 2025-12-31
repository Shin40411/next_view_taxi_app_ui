import { Helmet } from 'react-helmet-async';
// Đảm bảo bạn tạo file View đúng tên này nhé
import JwtNewPasswordView from 'src/sections/auth/jwt/jwt-new-password-view';

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