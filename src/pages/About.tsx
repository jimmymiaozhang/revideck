import React from 'react';
import { Typography, Box, Container } from '@mui/material';

const About = () => (
  <div style={{ maxWidth: 700, margin: '40px auto' }}>
    <div style={{ fontFamily: 'Roboto Flex', fontWeight: 100, fontSize: '1rem', color: 'rgba(0, 0, 0, 0.7)' }}>
      <b style={{ fontWeight: 100 }}>ReviDeck aims to:</b>
      <ol style={{ marginTop: 16, marginBottom: 16, paddingLeft: 24 }}>
        <li style={{ marginBottom: 12 }}>
          Equip users with data-driven tools to analyze, understand, and envision the development of our living environments
        </li>
        <li>
          Translate their insights and proposals into impactful presentation decks
        </li>
      </ol>
    </div>
  </div>
);

export default About; 