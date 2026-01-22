import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Autocomplete from '@mui/material/Autocomplete';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useWallet } from 'src/hooks/api/use-wallet';
import { useCompanyBankAccount } from 'src/hooks/api/use-company-bank-account';

// components
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IBank } from 'src/types/wallet';
import { ICompanyBankAccount } from 'src/types/company-bank-account';

// ----------------------------------------------------------------------

export default function CompanyBankAccountForm() {
    const { enqueueSnackbar } = useSnackbar();
    const { useGetCompanyBankAccounts, createCompanyBankAccount, updateCompanyBankAccount } = useCompanyBankAccount();
    const { accounts, accountsLoading, accountsMutate } = useGetCompanyBankAccounts();

    const { useGetBanks } = useWallet();
    const { banks } = useGetBanks();

    const bankOptions = useMemo(
        () => banks,
        [banks]
    );

    const [currentAccount, setCurrentAccount] = useState<ICompanyBankAccount | null>(null);
    const confirm = useBoolean();
    const [tempData, setTempData] = useState<any>(null);

    interface FormValues {
        bankName: IBank | null;
        accountName: string;
        accountNo: string;
        content: string;
        isActive: boolean;
    }

    const AccountSchema = Yup.object().shape({
        bankName: Yup.mixed().required('Tên ngân hàng là bắt buộc').nullable(),
        accountName: Yup.string().required('Tên chủ tài khoản là bắt buộc'),
        accountNo: Yup.string().required('Số tài khoản là bắt buộc'),
        content: Yup.string().required('Nội dung chuyển khoản mặc định là bắt buộc'),
        isActive: Yup.boolean(),
    });

    const defaultValues: FormValues = useMemo(
        () => {
            const selectedBank = banks.find((bank: IBank) => `${bank.shortName} - ${bank.name}` === currentAccount?.bankName) || null;

            return {
                bankName: selectedBank,
                accountName: currentAccount?.accountName || '',
                accountNo: currentAccount?.accountNo || '',
                content: currentAccount?.content || '',
                isActive: currentAccount?.isActive ?? true,
            };
        },
        [currentAccount, banks]
    );

    const methods = useForm<FormValues>({
        resolver: yupResolver(AccountSchema as any),
        defaultValues,
    });

    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (accounts && accounts.length > 0) {
            const account = accounts[0];
            setCurrentAccount(account);
        } else {
            setCurrentAccount(null);
        }
    }, [accounts]);

    useEffect(() => {
        if (currentAccount && banks.length > 0) {
            reset(defaultValues);
        } else {
            reset({
                bankName: null,
                accountName: '',
                accountNo: '',
                content: '',
                isActive: true,
            });
        }
    }, [currentAccount, defaultValues, reset, banks]);

    const onSubmit = (data: any) => {
        const payload = {
            ...data,
            bankName: data.bankName ? `${data.bankName.shortName} - ${data.bankName.name}` : '',
        };
        setTempData(payload);
        confirm.onTrue();
    };

    const handleConfirm = async () => {
        try {
            if (currentAccount) {
                await updateCompanyBankAccount(currentAccount.id, tempData);
                enqueueSnackbar('Cập nhật thành công!');
            } else {
                await createCompanyBankAccount(tempData);
                enqueueSnackbar('Thêm mới thành công!');
            }
            accountsMutate();
            confirm.onFalse();
        } catch (error) {
            console.error(error);
            enqueueSnackbar('Có lỗi xảy ra', { variant: 'error' });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ mb: 3 }}>
                <CardHeader title="Thông tin công ty" />

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid xs={12} md={12}>
                            <Stack spacing={3}>
                                <Controller
                                    name="bankName"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <Autocomplete
                                            {...field}
                                            options={bankOptions}
                                            getOptionLabel={(option: IBank | string) =>
                                                typeof option === 'string' ? option : `${option.shortName} - ${option.name}`
                                            }
                                            isOptionEqualToValue={(option, value) => (option as IBank).id === (value as IBank).id}
                                            onChange={(event, newValue) => setValue('bankName', newValue as IBank | null, { shouldValidate: true })}
                                            renderOption={(props, option) => {
                                                const bank = option as IBank;
                                                return (
                                                    <li {...props} key={bank.id}>
                                                        <Box
                                                            component="img"
                                                            alt={bank.shortName}
                                                            src={bank.logo}
                                                            sx={{ width: 48, height: 48, flexShrink: 0, mr: 2, objectFit: 'contain' }}
                                                        />
                                                        {bank.shortName} - {bank.name}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Tên ngân hàng"
                                                    placeholder='Chọn ngân hàng'
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <>
                                                                {field.value?.logo && (
                                                                    <Box
                                                                        component="img"
                                                                        alt="Bank Logo"
                                                                        src={field.value.logo}
                                                                        sx={{ width: 24, height: 24, mr: 1, objectFit: 'contain' }}
                                                                    />
                                                                )}
                                                                {params.InputProps.startAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                />
                                <RHFTextField
                                    name="accountName"
                                    label="Tên chủ tài khoản"
                                    onChange={(event) => setValue('accountName', event.target.value.toUpperCase())}
                                />
                                <RHFTextField name="accountNo" label="Số tài khoản" />
                                <RHFTextField
                                    name="content"
                                    label="Nội dung chuyển khoản mặc định"
                                    multiline
                                    rows={3}
                                    helperText={
                                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                            <span>Tiền tố áp dụng:</span>
                                            {['[user]', '[amount]'].map((tag) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => {
                                                        const currentContent = methods.getValues('content') || '';
                                                        setValue('content', currentContent + tag);
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    }
                                />
                                {/* <RHFSwitch name="isActive" label="Đang hoạt động" /> */}
                            </Stack>
                        </Grid>
                    </Grid>

                    <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                            {currentAccount ? 'Lưu thay đổi' : 'Thêm mới'}
                        </LoadingButton>
                    </Stack>
                </Box>
            </Card>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Xác nhận thay đổi"
                content="Bạn có chắc chắn muốn thay đổi thông tin tài khoản ngân hàng?"
                action={
                    <LoadingButton variant="contained" color="primary" loading={isSubmitting} onClick={handleConfirm}>
                        Xác nhận
                    </LoadingButton>
                }
            />
        </FormProvider>
    );
}
