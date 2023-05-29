import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Stack,
} from '@mui/material';

const CreateNewButton = () => {
  return (
    <Accordion id="create-new-accordion" disableGutters elevation={0}>
      <AccordionSummary id="create-new-accordion-summary">
        <Button
          className="create-new-button"
          variant="contained"
          endIcon={<ExpandMoreIcon />}
          disableElevation
        >
          Create new
        </Button>
      </AccordionSummary>
      <AccordionDetails className="accordion-details">
        <Stack className="create-new-options" alignItems="start">
          <Button
            className="create-new-option-button"
            startIcon={<CardGiftcardIcon className="create-new-option-icon" />}
            disableElevation
          >
            Giveaway
          </Button>
          <Button
            className="create-new-option-button"
            startIcon={<LocationOnIcon className="create-new-option-icon" />}
            disableElevation
          >
            Location
          </Button>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default CreateNewButton;
