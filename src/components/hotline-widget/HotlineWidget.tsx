import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { Box, Typography } from '@mui/material';

const HotlineWidget = () => {
    const { user } = useAuthContext();

    const shouldHide = !['PARTNER', 'CUSTOMER', 'INTRODUCER'].includes(user?.role as string);

    if (shouldHide) {
        return null;
    }

    return (
        <Box
            component="a"
            href="tel:0763800763"
            sx={{
                position: 'fixed',
                bottom: 130,
                right: 7,
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'primary.main',
                color: 'common.white',
                p: '14px',
                borderRadius: '50px',
                textDecoration: 'none',
                boxShadow: 3,
                transition: 'all 0.3s',
                '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'scale(1.05)',
                },
            }}
        >
            <Iconify icon="solar:phone-calling-bold" width={24} />
        </Box>
    );
};

export default HotlineWidget;
