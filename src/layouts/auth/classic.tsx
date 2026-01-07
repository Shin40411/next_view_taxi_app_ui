import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useAuthContext } from 'src/auth/hooks';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------
type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const { method } = useAuthContext();

  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        right: 0,
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        flex: 1,
        mx: 'auto',
        px: { xs: 2, md: 8 },
      }}
      justifyContent="center"
      alignItems="center"
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flex={1}
      height="100%"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#FFC107"
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '100%',
          maxWidth: 480,
          aspectRatio: '1/1',
          borderRadius: '50%',
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Box
          component="img"
          alt="auth"
          src={image || '/logo/goxuvn.png'}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </Stack>
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
        }),
        minHeight: '100vh',
      }}
    >
      {/* {renderLogo} */}
      {mdUp && renderSection}
      {renderContent}
    </Stack>
  );
}
