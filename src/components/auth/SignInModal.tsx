import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/Close';
import { signInSchema, validateForm, ValidationErrors } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SignInModal = ({ open, onClose, onSuccess }: SignInModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      console.log('Starting Google sign-in process...');
      await signInWithGoogle();
      console.log('Sign in successful');
      if (onSuccess) {
        onSuccess();
      }
      handleClose();
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked by your browser. Please allow pop-ups for this site.');
      } else {
        setError(`Authentication error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { 
          bgcolor: 'white',
          borderRadius: 1
        }
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'grey.500'
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 3, pt: 4 }}>
        <Typography 
          variant="h5" 
          align="center" 
          sx={{ 
            mb: 3,
            fontFamily: '"Roboto Flex"',
            fontWeight: 100
          }}
        >
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          startIcon={<GoogleIcon />}
          sx={{
            fontFamily: '"Roboto Flex"',
            textTransform: 'none',
            fontSize: '1rem',
            py: 1,
            color: 'black',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Continue with Google
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontFamily: '"Roboto Flex"',
              fontWeight: 100
            }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal; 