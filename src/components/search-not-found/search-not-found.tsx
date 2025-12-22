import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Paper
      sx={{
        bgcolor: 'unset',
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" gutterBottom>
        Không tìm thấy kết quả
      </Typography>

      <Typography variant="body2">
        Không tìm thấy kết quả cho &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Kiểm tra lại từ khoá hoặc từ chính xác.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Vui lòng nhập từ khoá
    </Typography>
  );
}
