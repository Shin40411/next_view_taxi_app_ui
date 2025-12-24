import Typography from '@mui/material/Typography';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useAuthContext();

  // Mock User Name if API not available, or use user.displayName if available from context
  const displayName = user?.displayName || 'Người dùng mẫu';

  return (
    <Typography
      variant="subtitle2"
      sx={{
        p: 1,
        ml: 1,
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
