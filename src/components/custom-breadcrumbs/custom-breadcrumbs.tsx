import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// components
import Iconify from 'src/components/iconify';

import LinkItem from './link-item';
import { CustomBreadcrumbsProps } from './types';

// ----------------------------------------------------------------------

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  sx,
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1].name;

  return (
    <Box sx={{ ...sx }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          {/* {heading && (
            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
          )} */}

          {!!links.length && (
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: 3,
              }}
            >
              <Breadcrumbs separator={<Separator />} {...other}>
                <Link color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Iconify icon="eva:home-fill" width={20} />
                </Link>

                {links.map((link) => (
                  <LinkItem
                    key={link.name || ''}
                    link={link}
                    activeLast={activeLast}
                    disabled={link.name === lastLink}
                  />
                ))}
              </Breadcrumbs>
            </Box>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function Separator() {
  return <Iconify icon="eva:arrow-ios-forward-fill" width={16} />;
}
