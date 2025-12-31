import Typography from '@mui/material/Typography';
import { useAuthContext } from 'src/auth/hooks';
import { useAdmin } from 'src/hooks/api/use-admin';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useAuthContext();
  const { useGetUser } = useAdmin();

  const { user: userData } = useGetUser(user?.id);

  // Mock User Name if API not available, or use user.displayName if available from context
  const displayName = userData?.full_name || user?.displayName || 'Người dùng mẫu';

  return (
    <Typography
      variant="subtitle2"
      sx={{
        p: 1,
        pl: 0,
        // ml: 1,
        fontWeight: 'bold',
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {displayName}
    </Typography>
  );
}
