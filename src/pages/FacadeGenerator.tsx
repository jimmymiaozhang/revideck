import { Box, Container, Typography } from '@mui/material';

const FacadeGenerator = () => {
  return (
    <Box sx={{ 
      width: '100%',
      pt: { xs: 4, sm: 6 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Container 
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          px: { xs: 4, sm: 6, md: 8 }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            color: 'black',
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            fontFamily: '"Roboto Flex"',
            fontWeight: 100,
            mb: { xs: 6, sm: 8 },
            width: '100%'
          }}
        >
          Facade Generator
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: { xs: '1rem', sm: '1.2rem' },
            fontFamily: '"Roboto Flex"',
            fontWeight: 100,
            fontStyle: 'italic'
          }}
        >
          Tool under development. Coming soon!
        </Typography>
      </Container>
    </Box>
  );
};

export default FacadeGenerator; 