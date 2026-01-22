import { useState } from 'react';

import Grid from '@mui/material/Grid';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// hooks
import { useSupport } from 'src/hooks/api/use-support';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SupportFaq from '../support-faq';
//
import SupportNewForm from '../support-new-form';
import SupportHistoryTable from '../support-history-table';

// ----------------------------------------------------------------------

export default function SupportView() {
    const settings = useSettingsContext();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const { useGetMyTickets } = useSupport();
    const { tickets, ticketsLoading, mutate } = useGetMyTickets({
        fromDate: startDate,
        toDate: endDate,
    });

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Hỗ trợ khách hàng"
                links={[
                    { name: 'Hỗ trợ', href: '#' },
                    { name: 'Yêu cầu hỗ trợ' },
                ]}
                action={
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: { xs: 3, md: 0 } }}>
                        <DatePicker
                            label="Từ ngày"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <DatePicker
                            label="Đến ngày"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                    </Stack>
                }
                sx={{ my: { xs: 3, md: 5 } }}
            />

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <SupportNewForm onSuccess={mutate} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <SupportHistoryTable tickets={tickets} loading={ticketsLoading} />
                </Grid>

                <Grid item xs={12} md={4}>
                    <SupportFaq />
                </Grid>
            </Grid>
        </Container>
    );
}
