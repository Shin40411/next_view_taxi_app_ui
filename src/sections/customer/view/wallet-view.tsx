import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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
import Iconify from 'src/components/iconify';
import { fNumber } from 'src/utils/format-number';

import WalletDepositForm from '../wallet-deposit-form';
import WalletTransactionsTable from '../wallet-transactions-table';
import WalletWithdrawForm from '../wallet-withdraw-form';

// ----------------------------------------------------------------------

export default function CustomerWalletView() {
    const settings = useSettingsContext();
    const theme = useTheme();

    const [searchParams, setSearchParams] = useSearchParams();

    // Get 'tab' from URL or default to 'deposit'
    const currentTab = searchParams.get('tab') || 'deposit';

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setSearchParams({ tab: newValue });
    };

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                <Typography variant="h4">Ví GoXu</Typography>
            </Stack>

            {/* MAIN CONTENT */}
            <Card sx={{ mb: 3 }}>
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
                        label="Nạp GoXu"
                        icon={<Iconify icon="eva:download-fill" width={20} />}
                        iconPosition="start"
                    />
                    <Tab
                        value="withdraw"
                        label="Rút tiền"
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

            {currentTab === 'deposit' && <WalletDepositForm />}
            {currentTab === 'withdraw' && <WalletWithdrawForm />}
            {currentTab === 'deposit-history' && <WalletTransactionsTable filterType="deposit" />}
            {currentTab === 'transfer-history' && <WalletTransactionsTable filterType="spend" />}

        </Container>
    );
}
