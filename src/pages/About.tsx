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
          About ReviDeck
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
          ReviDeck provides data-driven tools for anyone seeking to analyze, understand, and anticipate the development of our living environments. It also transforms their findings into impactful presentation decks.
        </Typography>
      </Container>
    </Box>
  );
};

export default About; 