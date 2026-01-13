import * as Yup from 'yup';

export const Step1Schema = Yup.object({
    fullName: Yup.string()
        .required('Vui lòng nhập họ tên')
        .max(100, 'Họ tên không được quá 100 ký tự'),
    password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .max(100, 'Mật khẩu không được quá 100 ký tự')
        .matches(
            /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).*$/,
            'Mật khẩu phải có ít nhất 1 chữ hoa và 1 ký tự đặc biệt'
        ),
    confirmPassword: Yup.string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([Yup.ref('password')], 'Mật khẩu không trùng khớp'),
    role: Yup.mixed<'ctv' | 'driver' | 'cosokd'>()
        .oneOf(['ctv', 'driver', 'cosokd'])
        .required('Vui lòng chọn vai trò'),
    phoneNumber: Yup.string()
        .required('Vui lòng nhập số điện thoại')
        .max(15, 'Số điện thoại không được quá 15 ký tự')
        .matches(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
    email: Yup.string()
        .required('Vui lòng nhập email')
        .email('Email không hợp lệ')
        .max(255, 'Email không được quá 255 ký tự'),
    address: Yup.string().when('role', {
        is: 'cosokd',
        then: (s) => s.required('Vui lòng nhập địa chỉ').max(255, 'Địa chỉ không được quá 255 ký tự'),
        otherwise: (s) => s.optional(),
    }),
    taxiBrand: Yup.string().when('role', {
        is: (val: string) => val === 'driver',
        then: (s) => s.required('Vui lòng nhập hãng taxi').max(100, 'Tên hãng taxi không được quá 100 ký tự'),
        otherwise: (s) => s.strip(),
    }),
    licensePlate: Yup.string().when('role', {
        is: (val: string) => val === 'driver',
        then: s => s
            .required('Vui lòng nhập biển số')
            .min(5, 'Biển số phải có ít nhất 5 ký tự')
            .max(20, 'Biển số không được quá 20 ký tự'),
        otherwise: (s) => s.strip(),
    }),
    pointsPerGuest: Yup.number().optional(),
    taxCode: Yup.string().when('role', {
        is: 'cosokd',
        then: (s) => s.required('Vui lòng nhập mã số thuế').max(50, 'Mã số thuế không được quá 50 ký tự'),
        otherwise: (s) => s.strip(),
    }),
    branches: Yup.string().when('role', {
        is: 'cosokd',
        then: (s) => s.required('Vui lòng nhập chi nhánh').max(100, 'Tên chi nhánh không được quá 100 ký tự'),
        otherwise: (s) => s.strip(),
    }),
    rewardAmount: Yup.number().optional(),
    otp: Yup.string(),
}).required();



