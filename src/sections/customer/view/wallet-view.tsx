import { SyntheticEvent, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CountUp from 'react-countup';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { alpha, useTheme } from '@mui/material/styles';

import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { useContract } from 'src/hooks/api/use-contract';
import { useAdmin } from 'src/hooks/api/use-admin';
import { fNumber, fPoint } from 'src/utils/format-number';

import WalletDepositForm from '../wallet-deposit-form';
import WalletTransactionsTable from '../wallet-transactions-table';
import WalletWithdrawForm from '../wallet-withdraw-form';
import EmptyContent from 'src/components/empty-content';
import { paths } from 'src/routes/paths';
import Button from '@mui/material/Button';
import { useRouter } from 'src/routes/hooks';

import ContractPreview from '../../contract/contract-preview';
import { ICreateContractRequest } from 'src/types/contract';

// ----------------------------------------------------------------------

export default function CustomerWalletView() {
    const settings = useSettingsContext();
    const theme = useTheme();
    const router = useRouter();

    const [searchParams, setSearchParams] = useSearchParams();

    const currentTab = searchParams.get('tab') || 'deposit';

    const { useGetMyContract, createContract } = useContract();
    const { contract, contractLoading, mutate } = useGetMyContract();

    const { user } = useAuthContext();
    const { useGetUser } = useAdmin();
    const { user: refreshedUser, userMutate } = useGetUser(user?.id);

    const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
        setSearchParams({ tab: newValue });
    };

    const handleSignContract = async (data: any) => {
        try {
            await createContract(data as ICreateContractRequest);
            mutate();
        } catch (error) {
            console.error(error);
        }
    };

    const balanceRef = useRef(0);

    const currentBalanceValue = Number(refreshedUser?.servicePoints?.[0]?.advertising_budget || 0);
    const currentBalance = fPoint(currentBalanceValue);

    const expiryDate = refreshedUser?.servicePoints?.[0]?.wallet_expiry_date;
    const isExpired = expiryDate ? new Date(expiryDate) < new Date() : true;

    if (refreshedUser && isExpired) {
        return (
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                <EmptyContent
                    filled
                    title="Ví Goxu đã hết hạn"
                    description="Vui lòng liên hệ quản trị viên để gia hạn sử dụng ví."
                    sx={{
                        py: 10,
                        height: '80vh',
                        flexGrow: 'unset',
                    }}
                />
            </Container>
        );
    }

    if (refreshedUser && !refreshedUser?.bankAccount) {
        return (
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                <EmptyContent
                    filled
                    title="Thông tin ngân hàng chưa cập nhật"
                    description="Vui lòng cập nhật thông tin ngân hàng để sử dụng ví Goxu."
                    sx={{
                        py: 10,
                        height: '80vh',
                        flexGrow: 'unset',
                    }}
                />
            </Container>
        );
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Card
                sx={{
                    my: 3,
                    height: 200,
                    position: 'relative',
                    color: 'common.black',
                    background: 'linear-gradient(135deg, #FFF176 0%, #FBC02D 100%)',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                    }}
                >
                    <img
                        src="/assets/illustrations/wallet_illustration.png"
                        alt="taxi driver"
                        style={{ height: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                </Box>
                <Box
                    sx={{
                        p: 3,
                        height: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="overline" sx={{ opacity: 0.64, mb: 1 }}>
                        Tổng số dư ví hiện tại
                    </Typography>
                    <Stack direction="row" alignItems="flex-end" spacing={1}>
                        <Typography variant="h2">
                            <CountUp
                                start={balanceRef.current}
                                end={currentBalanceValue}
                                onEnd={() => { balanceRef.current = currentBalanceValue; }}
                                formattingFn={(value) => fPoint(value)}
                            />
                        </Typography>
                        {currentBalanceValue > 0 ?
                            <Iconify icon="fluent-color:arrow-trending-lines-24" width={40} />
                            :
                            <Typography variant='caption' sx={{ pb: '10px' }}>(Goxu)</Typography>
                        }
                    </Stack>
                </Box>
            </Card>
            <Card sx={{ my: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleChangeTab}
                    sx={{
                        px: 3,
                        bgcolor: 'background.neutral',
                    }}
                >
                    <Tab
                        value="deposit"
                        label="Nạp Goxu"
                        icon={<Iconify icon="eva:download-fill" width={20} />}
                        iconPosition="start"
                    />
                    <Tab
                        value="withdraw"
                        label="Chuyển Goxu"
                        icon={<Iconify icon="solar:card-send-bold" width={20} />}
                        iconPosition="start"
                    />
                    <Tab
                        value="deposit-history"
                        label="Lịch sử nạp"
                        icon={<Iconify icon="eva:clock-outline" width={20} />}
                        iconPosition="start"
                    />
                    <Tab
                        value="transfer-history"
                        label="Lịch sử chuyển"
                        icon={<Iconify icon="solar:history-bold" width={20} />}
                        iconPosition="start"
                    />
                </Tabs>
            </Card>

            {currentTab === 'deposit' && <WalletDepositForm onRefreshUser={userMutate} />}
            {currentTab === 'withdraw' && <WalletWithdrawForm currentBalance={currentBalance} onRefreshUser={userMutate} />}
            {currentTab === 'deposit-history' && <WalletTransactionsTable filterType="deposit" />}
            {currentTab === 'transfer-history' && <WalletTransactionsTable filterType="spend" />}

        </Container>
    );
}
