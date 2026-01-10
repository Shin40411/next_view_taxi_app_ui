import { Helmet } from 'react-helmet-async';
// Đảm bảo tên file View này khớp với file bạn đã tạo (VerifyCodeView.tsx)
import VerifyCodeView from 'src/sections/auth/jwt/VerifyCodeView';

export default function VerifyPage() {
    return (
        <>
            <Helmet>
                <title> Xác thực OTP | Goxu.vn </title>
            </Helmet>

            <VerifyCodeView />
        </>
    );
}