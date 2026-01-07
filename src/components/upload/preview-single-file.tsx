import Box from '@mui/material/Box';

import Image from '../image';
import FileThumbnail, { fileFormat } from '../file-thumbnail';

// ----------------------------------------------------------------------

type Props = {
  imgUrl?: string;
};

export default function SingleFilePreview({ imgUrl = '' }: Props) {
  const format = fileFormat(imgUrl);

  return (
    <Box
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
      }}
    >
      {format === 'image' ? (
        <Image
          alt="file preview"
          src={imgUrl}
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
          }}
        />
      ) : (
        <Box
          sx={{
            width: 1,
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
            borderRadius: 1,
          }}
        >
          <FileThumbnail file={imgUrl} sx={{ width: 64, height: 64 }} />
        </Box>
      )}
    </Box>
  );
}
