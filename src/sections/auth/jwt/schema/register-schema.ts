import * as Yup from 'yup';

export const Step1Schema = Yup.object({
    fullName: Yup.string().required('Vui lòng nhập họ tên'),
    password: Yup.string()
        .required('Vui lòng nhập mật khẩu')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
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
        .matches(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
    address: Yup.string().optional(),
    taxiBrand: Yup.string().when('role', {
        is: 'driver',
        then: (s) => s.required('Vui lòng nhập hãng taxi'),
        otherwise: (s) => s.strip(),
    }),
    licensePlate: Yup.string().when('role', {
        is: 'driver',
        then: s => s
            .required('Vui lòng nhập biển số')
            .matches(/^\d{2}[A-Z]-\d{3}\.\d{2}$/, 'Biển số xe không hợp lệ'),
        otherwise: s => s.strip(),
    }),
    pointsPerGuest: Yup.number().optional(),
    taxCode: Yup.string().when('role', {
        is: 'cosokd',
        then: (s) => s.required('Vui lòng nhập mã số thuế'),
        otherwise: (s) => s.strip(),
    }),
    branches: Yup.string().when('role', {
        is: 'cosokd',
        then: (s) => s.required('Vui lòng nhập chi nhánh'),
        otherwise: (s) => s.strip(),
    }),
}).required();

export const Step2Schema = Yup.object({
    cccdFront: Yup.mixed<File>()
        .required('Vui lòng tải lên mặt trước CCCD'),
    cccdBack: Yup.mixed<File>()
        .required('Vui lòng tải lên mặt sau CCCD'),
}).required();

export const Step2SchemaOptional = Yup.object({
    cccdFront: Yup.mixed<File>().optional(),
    cccdBack: Yup.mixed<File>().optional(),
});

