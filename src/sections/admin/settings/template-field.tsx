import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { RHFEditor } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type TemplateFieldProps = {
    name: string;
    label: string;
    control: any;
    setValue: any;
    watch: any;
};

export default function TemplateField({ name, label, control, setValue, watch }: TemplateFieldProps) {
    const value = watch(name);

    return (
        <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="subtitle2">{label}</Typography>
            <RHFEditor
                simple
                name={name}
                helperText={
                    (() => {
                        if (['tpl_contract_approved', 'tpl_contract_terminated'].includes(name)) {
                            return null;
                        }

                        const isWallet = name.includes('tpl_wallet_');
                        const isTripRequest = name === 'tpl_trip_request';

                        let tags = ['[user]', '[amount]', '[status]', '[reason]'];
                        if (isWallet) {
                            tags = ['[user]', '[amount]', '[status]', '[reason]', '[time]', '[account_number]', '[transaction_type]'];
                        } else if (isTripRequest) {
                            tags = ['[trip_code]', '[partner_name]', '[guest_count]', '[vehicle_plate]', '[created_time]'];
                        } else if (name === 'tpl_driver_arrived') {
                            tags = ['[trip_code]', '[partner_name]', '[guest_count]', '[vehicle_plate]', '[arrival_time]'];
                        } else if (name === 'tpl_trip_cancelled') {
                            tags = ['[trip_code]', '[partner_name]', '[guest_count]', '[reason]', '[created_time]'];
                        } else if (name === 'tpl_trip_rejected') {
                            tags = ['[trip_code]', '[reason]']
                        } else if (name === 'tpl_trip_confirmed') {
                            tags = ['[trip_code]', '[service_name]', '[partner_name]', '[guest_count]', '[vehicle_plate]', '[created_time]', '[arrival_time]'];
                        }

                        return (
                            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                                <span>Tiền tố áp dụng:</span>
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                        color="info"
                                        onClick={() => {
                                            const currentContent = value || '';
                                            setValue(name, currentContent + tag);
                                        }}
                                    />
                                ))}
                            </Stack>
                        );
                    })()
                }
            />
        </Stack>
    );
}
