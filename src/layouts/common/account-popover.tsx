import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useAdmin } from 'src/hooks/api/use-admin';

import { getFullImageUrl } from 'src/utils/get-image';

import { useAuthContext } from 'src/auth/hooks';

import PasswordReset from 'src/components/dialogs/password-reset';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IUserAdmin } from 'src/types/user';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { user } = useAuthContext();
  const { useGetUser } = useAdmin();

  const { user: userData } = useGetUser(user?.id);

  const displayName = userData?.full_name || user?.displayName || 'Người dùng mẫu';
  const avatarUrl = userData?.avatarUrl || (userData as any)?.avatar || user?.photoURL;

  const isAdmin = user?.role === 'ADMIN';

  const popover = usePopover();
  const passwordReset = useBoolean();

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          p: 1,
          pl: 0,
          cursor: isAdmin ? 'pointer' : 'default',
        }}
        onClick={isAdmin ? popover.onOpen : undefined}
      >
        <Avatar
          src={avatarUrl?.toString().startsWith('http') ? avatarUrl : getFullImageUrl(avatarUrl)}
          alt={displayName}
          imgProps={{ referrerPolicy: 'no-referrer' }}
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

      {isAdmin && (
        <>
          <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
            <Box sx={{ p: 2, pb: 1.5 }}>
              <Typography variant="subtitle2" noWrap>
                {displayName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {user?.email}
              </Typography>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack sx={{ p: 1 }}>
              <MenuItem
                onClick={() => {
                  passwordReset.onTrue();
                  popover.onClose();
                }}
              >
                Đổi mật khẩu
              </MenuItem>
            </Stack>
          </CustomPopover>

          <PasswordReset
            open={passwordReset.value}
            onClose={passwordReset.onFalse}
            currentUser={user as IUserAdmin}
          />
        </>
      )}
    </>
  );
}
