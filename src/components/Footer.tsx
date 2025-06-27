import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bgcolor: '#f5f5f5',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        mt: 'auto',
        py: { xs: 3, sm: 4 }
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          px: { xs: 4, sm: 6, md: 8 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Roboto Flex"',
            fontWeight: 100,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: 'rgba(0, 0, 0, 0.6)'
          }}
        >
          © {new Date().getFullYear()} ReviDeck. All rights reserved.
        </Typography>
        
        <Typography
          sx={{
            fontFamily: '"Roboto Flex"',
            fontWeight: 100,
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: 'rgba(0, 0, 0, 0.6)',
            textAlign: { xs: 'center', sm: 'right' }
          }}
        >
          Designed & Developed by ReviDeck Team
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 