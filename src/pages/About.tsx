import React from 'react';
import { Typography, Box, Container } from '@mui/material';

const About = () => (
  <div style={{ maxWidth: 700, margin: '80px auto', paddingTop: '60px' }}>
    <div style={{ fontFamily: 'Roboto Flex', fontWeight: 100, fontSize: '1rem', color: 'rgba(0, 0, 0, 0.7)' }}>
      <Typography 
        sx={{ 
          fontFamily: '"Roboto Flex"',
          fontWeight: 100,
          fontSize: '1rem',
          color: 'rgba(0, 0, 0, 0.7)',
          lineHeight: 1.6,
          textAlign: 'center'
        }}
      >
        ReviDeck equips users with data-driven, AI-powered tools to analyze, understand, and envision the development of our living environments, and transform their insights into impactful presentation decks.
      </Typography>
    </div>
  </div>
);

export default About; 