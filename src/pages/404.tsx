import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Container>
      <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
        <img src='/images/404.png' height='400px' width='500px' alt='404'/>
        <Typography variant="h3" paragraph>
          Xin lỗi không tìm thấy trang
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Chúng tôi không tìm thấy trang bạn đang tìm kiếm. Có lẽ đã sai URL? Chắc chắn ràng bạn đã nhập đúng chính tả.
        </Typography>
        <Button href='/' size="large" variant="contained" sx={{ mt: 3 }}>
          Quay về trang chủ
        </Button>
      </ContentStyle>
    </Container>
  );
}
