import { Box, Button, Container, Grid, Typography } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Giveaway } from "../lib/types";

const EditGiveaway = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [binFile, setBinFile] = useState<any>();

  const onDrop = useCallback((files: any) => {
    setBinFile(files[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    maxFiles: 1,
  })

  const { handleSubmit, register } = useForm<Giveaway>({});

  return (
    <Container maxWidth={false}>
      <Box sx={{ px: '5rem', py: '2rem' }}>
        <Button
          sx={{ color: 'black', px: 0, textTransform: 'capitalize', }}
          variant="text"
          startIcon={<ChevronLeftIcon />} onClick={() => { navigate(-1) }}
        >
          Back
        </Button>

        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Box sx={{ mt: '1rem' }}>
              <Typography>
                Name
              </Typography>
              <TextField
                id="title"
                variant="outlined"
                required
                fullWidth
                margin="none"
                {...register('title', { required: "Required" })}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  borderColor: '#E1E6EF',
                }}
              />
            </Box>

            <div {...getRootProps()}>
              <input {...getInputProps()} />

              {/* <img src={`${config.API}/${data?.picture}`} alt='' /> */}
              <Box
                sx={{
                  mt: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <Typography>
                  Drag & drop files or Browse
                </Typography>
                <Typography>
                  Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
                </Typography>
              </Box>

              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag 'n' drop some files here, or click to select files</p>
              }
            </div>

            <Box sx={{ mt: '1rem' }}>
              <Typography>
                Start date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker />
                {/* {...register('startDate', { required: "Required" })} */}
              </LocalizationProvider>
            </Box>
            <Box sx={{ mt: '1rem' }}>
              <Typography>
                End date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker />
                {/* {...register('endDate', { required: "Required" })} */}
              </LocalizationProvider>
            </Box>
            <Box sx={{ mt: '1rem' }}>
              <Typography>
                Prize
              </Typography>
              <TextField
                id="prize"
                variant="outlined"
                required
                fullWidth
                margin="none"
                {...register('prize', { required: "Required" })}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  borderColor: '#E1E6EF',
                }}
              />
            </Box>
            <Box sx={{ mt: '1rem' }}>
              <Typography>
                Number of Winners
              </Typography>
              <TextField
                id="numberOfWinners"
                variant="outlined"
                required
                fullWidth
                margin="none"
                {...register('numberOfWinners', { required: "Required" })}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  borderColor: '#E1E6EF',
                }}
              />
            </Box>

          </Grid>
          <Grid item xs={7}>
            <TextField
              id="description"
              label="Description"
              variant="standard"
              required
              fullWidth
              margin="normal"
              {...register('description', { required: "Required" })}
            />
            {/* <TextField
              id="rules"
              label="Rules"
              variant="standard"
              required
              fullWidth
              margin="normal"
              {...register('rules', { required: "Required" })}
            /> */}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default EditGiveaway;
