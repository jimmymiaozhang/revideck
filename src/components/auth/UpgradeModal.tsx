import { Dialog, DialogContent, IconButton, Button, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UpgradeIcon from '@mui/icons-material/WorkspacePremium';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
  const textStyles = {
    fontFamily: '"Roboto Flex"',
    fontWeight: 100
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'grey.500',
          zIndex: 1
        }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: 3, pt: 4 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, ...textStyles }}
        >
          Upgrade Your Plan
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4, ...textStyles }}
        >
          Sorry, you need to be a <b>Pro</b> or <b>Pro+</b> subscriber to use this tool.
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<UpgradeIcon />}
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
            },
            mb: 2
          }}
        >
          Become a Pro / Pro+ User
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ...textStyles }}
          >
            By upgrading, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal; 