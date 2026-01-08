import { useCallback } from 'react';
// @mui
import { Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from 'src/components/iconify';
// types
import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
    filters: IUserTableFilters;
    onFilters: (name: string, value: IUserTableFilterValue) => void;
};

export default function EmployeeTableToolbar({
    filters,
    onFilters,
}: Props) {
    const handleFilterName = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onFilters('name', event.target.value);
        },
        [onFilters]
    );

    return (
        <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{
                p: 2.5,
            }}
        >
            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                <TextField
                    fullWidth
                    value={filters.name}
                    onChange={handleFilterName}
                    placeholder="Tìm kiếm nhân viên..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
        </Stack>
    );
}
