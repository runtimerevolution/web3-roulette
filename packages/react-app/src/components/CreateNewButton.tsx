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
  const handleCreateGiveaway = () => {
    // todo
  };

  const handleCreateLocation = () => {
    // todo
  };

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
            className="create-new-options-button"
            startIcon={<CardGiftcardIcon className="create-new-options-icon" />}
            onClick={handleCreateGiveaway}
            disableElevation
          >
            Giveaway
          </Button>
          <Button
            className="create-new-options-button"
            startIcon={<LocationOnIcon className="create-new-options-icon" />}
            onClick={handleCreateLocation}
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
