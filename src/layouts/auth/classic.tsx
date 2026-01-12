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

import { useRef, useState } from 'react';
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const { method } = useAuthContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      sx={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src="/assets/files/VIDEO-HDSD-GOXU.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        controls={false}
        onClick={() => videoRef.current?.pause()}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#FFC107',
          px: { xs: 5, md: 5 },
          zIndex: 9,
          transition: 'all 0.8s ease-in-out',
          cursor: 'pointer',
          overflow: 'hidden',
          opacity: isPlaying ? 0 : 1,
          pointerEvents: isPlaying ? 'none' : 'auto',
        }}
        onClick={() => {
          videoRef.current?.play();
          setIsPlaying(true);
        }}
      >
        {[...Array(6)].map((_, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
              width: [100, 150, 200, 80, 120, 180][index],
              height: [100, 150, 200, 80, 120, 180][index],
              top: ['-5%', '10%', 'auto', '40%', 'auto', '80%'][index],
              left: ['-5%', 'auto', '80%', 'auto', '10%', 'auto'][index],
              right: ['auto', '-5%', 'auto', '10%', 'auto', '20%'][index],
              bottom: ['auto', 'auto', '-10%', 'auto', '10%', 'auto'][index],
              opacity: 0.6,
              zIndex: 0,
            }}
          />
        ))}

        <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ zIndex: 1 }}>
          {/* Logo */}
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 100,
              height: 100,
              flexShrink: 0,
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

          {/* Text & Play Button */}
          <Stack spacing={2} sx={{ textAlign: 'left', maxWidth: 480 }} className="notranslate">
            <Typography variant="h3" sx={{ color: 'common.white', fontWeight: 800, textShadow: '0 4px 12px rgba(0,0,0,0.2)', fontStyle: 'italic' }}>
              {title || <>Goxu.vn</>}
            </Typography>
            <Typography variant="body1" sx={{ color: 'common.white', opacity: 0.9, fontWeight: 500, fontSize: 18, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
              Nền tảng tiếp thị liên kết dành cho tài xế
            </Typography>

            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'common.white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 24,
                mt: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <Iconify icon="solar:play-bold" width={28} color="primary.main" />
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Tooltip title="Xem đầy đủ">
        <Box
          onClick={(e) => {
            e.stopPropagation();
            videoRef.current?.requestFullscreen();
          }}
          sx={{
            position: 'absolute',
            height: 40,
            top: 24,
            right: 24,
            zIndex: 10,
            p: 1,
            color: 'common.white',
            cursor: 'pointer',
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            transition: 'all 0.2s',
            backdropFilter: 'blur(4px)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.4)',
              transform: 'scale(1.1)',
            }
          }}
        >
          <Iconify icon="solar:maximize-square-3-bold" width={24} />
        </Box>
      </Tooltip>
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
