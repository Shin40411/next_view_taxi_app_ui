import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import { useAuthContext } from 'src/auth/hooks';
import { useAdmin } from 'src/hooks/api/use-admin';
import { getFullImageUrl } from 'src/utils/get-image';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useAuthContext();
  const { useGetUser } = useAdmin();

  const { user: userData } = useGetUser(user?.id);

  // Mock User Name if API not available, or use user.displayName if available from context
  const displayName = userData?.full_name || user?.displayName || 'Người dùng mẫu';
  const avatarUrl = userData?.avatarUrl || (userData as any)?.avatar || user?.photoURL;

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1, pl: 0 }}>
      <Avatar
        src={getFullImageUrl(avatarUrl)}
        alt={displayName}
        sx={{
          width: 36,
          height: 36,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
      >
        {displayName.toString().charAt(0).toUpperCase()}
      </Avatar>

      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
        }}
      >
        {displayName}
      </Typography>
    </Stack>
  );
}
