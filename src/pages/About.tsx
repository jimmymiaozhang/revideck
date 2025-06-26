import { Typography, Box, Container } from '@mui/material';

const About = () => {
  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: { xs: 4, sm: 6 },
      pb: { xs: 4, sm: 6 }
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
            mb: { xs: 6, sm: 8 }
          }}
        >
          About Nerdy.Archi
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'black',
            fontSize: { xs: '1rem', sm: '1.2rem' },
            fontFamily: '"Roboto Flex"',
            fontWeight: 100,
            mb: 3
          }}
        >
          We work with data scientists, designers, developers, engineers, and urbanists.
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'black',
            fontSize: { xs: '1rem', sm: '1.2rem' },
            fontFamily: '"Roboto Flex"',
            fontWeight: 100,
            mb: 3
          }}
        >
          We help explore ideas and support them with real-world data.
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            color: 'black',
            fontSize: { xs: '1rem', sm: '1.2rem' },
            fontFamily: '"Roboto Flex"',
            fontWeight: 100
          }}
        >
          We aim to make your work clearer, faster, and more grounded.
        </Typography>
      </Container>
    </Box>
  );
};

export default About; 