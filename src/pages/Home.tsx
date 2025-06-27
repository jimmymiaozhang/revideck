import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

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
          px: { xs: 4, sm: 6, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Map Scanner Section */}
        <Box 
          onClick={() => navigate('/MS')}
          sx={{ 
            width: '80%',
            maxWidth: '1200px',
            mb: { xs: 4, sm: 6 },
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: 'black',
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontFamily: '"Roboto Flex"',
              fontWeight: 100,
              mb: 2,
              width: '100%'
            }}
          >
            Map Scanner
          </Typography>

          <Box sx={{ 
            width: '100%',
            height: { xs: '250px', sm: '400px' },
            bgcolor: '#e0e0e0',
            backgroundImage: 'url("/map-scanner.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 2,
            borderRadius: 2
          }} />

          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              fontFamily: '"Roboto Flex"',
              fontWeight: 100,
              width: '100%'
            }}
          >
            Analyze urban accessibility, transportation networks, and spatial relationships. Perfect for architects and urban planners working with location-based data and site analysis.
          </Typography>
        </Box>

        {/* Near Me Section */}
        <Box 
          onClick={() => navigate('/NM')}
          sx={{ 
            width: '80%',
            maxWidth: '1200px',
            mb: { xs: 4, sm: 6 },
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: 'black',
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontFamily: '"Roboto Flex"',
              fontWeight: 100,
              mb: 2,
              width: '100%'
            }}
          >
            Near Me
          </Typography>

          <Box sx={{ 
            width: '100%',
            height: { xs: '250px', sm: '400px' },
            bgcolor: '#e0e0e0',
            backgroundImage: 'url("/near-me.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 2,
            borderRadius: 2
          }} />

          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              fontFamily: '"Roboto Flex"',
              fontWeight: 100,
              width: '100%'
            }}
          >
            Discover nearby amenities, services, and points of interest with intelligent location-based analysis. Essential for real estate professionals and urban planners.
          </Typography>
        </Box>

        {/* Facade Generator Section */}
        <Box 
          onClick={() => navigate('/FG')}
          sx={{ 
            width: '80%',
            maxWidth: '1200px',
            mb: { xs: 4, sm: 6 },
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: 'black',
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              fontFamily: '"Roboto Flex"',
              fontWeight: 100,
              mb: 2,
              width: '100%'
            }}
          >
            Facade Generator
          </Typography>

          <Box sx={{ 
            width: '100%',
            height: { xs: '250px', sm: '400px' },
            bgcolor: '#e0e0e0',
            backgroundImage: 'url("/facade-generator.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 2,
            borderRadius: 2
          }} />

          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              fontFamily: '"Roboto Flex"',
              fontWeight: 100,
              width: '100%'
            }}
          >
            Create and customize building facades with intelligent design patterns. Streamline architectural workflows and explore design variations efficiently.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;