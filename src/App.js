import React from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AuthContext from './context/AuthContext';
import Modal from './components/Modal';
import Loading from './components/Loading';
import MainNotification from './components/MainNotification';
import Nav from './components/Nav';
import Upload from './components/upload/Upload';
import ImagesList from './components/imagesList/ImagesList';
import BrushIcon from '@mui/icons-material/Brush'; // Import the Brush icon

const theme = createTheme({
  typography: {
    fontFamily: 'Oswald, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: '3rem' }}>
        <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', color: 'purple',fontWeight:'Bold' }}>
          <BrushIcon sx={{ fontSize: '5rem', marginRight: '1rem' }} /> {/* Add the Brush icon */}
          Pixel- Digital Asset Manager
        </Typography>
        <AuthContext>
          <Loading />
          <Modal />
          <MainNotification />
          <Nav />
          <Upload />
          <ImagesList />
        </AuthContext>
      </Container>
    </ThemeProvider>
  );
}

export default App;
