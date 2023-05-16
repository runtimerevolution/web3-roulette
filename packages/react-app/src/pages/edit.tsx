import { Box, Button, Container, Grid, Typography, TextField } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState, useMemo } from "react";
import { Giveaway, UserRole } from "../lib/types";
import { GetGiveawayDetails, UpdateGiveaway } from "../lib/queryClient";

import uploadIcon from './../assets/CloudUpload.svg';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useUserInfo from '../hooks/useUserInfo';

const textInputStyle = {
  '& .MuiInputBase-root': {
    backgroundColor: 'white',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#E1E6EF',
    }
  },
}
const datePickerStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: '100%',
  '& .MuiInputBase-root': {
    '& fieldset': {
      borderColor: '#E1E6EF',
    }
  },
}

const fieldLabelStyle = {
  color: '#000000'
}
const fieldErrorDescriptionStyle = {
  color: '#FF0000',
}

const EditGiveaway = () => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const { id } = useParams();
  const { data } = GetGiveawayDetails(id);
  const { handleSubmit, register, reset, control, formState, setError } = useForm<Giveaway>({
    defaultValues: useMemo(() => data, [data])
  });
  useEffect(() => {
    reset(data);
  }, [reset, data]);

  const [binImageFile, setBinImageFile] = useState<File>();
  const [imageURL, setImageURL] = useState<string>('')

  const onDrop = useCallback((files: File[]) => {
    setImageURL(URL.createObjectURL(files[0]));
    setBinImageFile(files[0]);
  }, [])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  function addServerErrors<Giveaway>(
    errors: { [P in keyof Giveaway]?: string },
    setError: (
      fieldName: keyof Giveaway,
      error: { type: string; message: string }
    ) => void
  ) {
    return Object.keys(errors).forEach((key) => {
      const field = key as keyof Giveaway;
      if (field !== undefined) {
        setError(field, {
          type: "server",
          message: errors[field] as string
        });
      }
    });
  }

  const savePress = async (data: FormData) => {
    const result = await UpdateGiveaway(data)
    if (!result.success && result.errors) {
      addServerErrors(result.errors, setError);
    } else {
      navigate(-1);
    }
  }

  return userInfo?.role === UserRole.ADMIN ? (
    <Container maxWidth={false}>
      <Box sx={{ px: '5rem', py: '2rem' }}>
        <Button
          sx={{ color: 'black', px: 0, textTransform: 'capitalize', mb: '1rem' }}
          variant="text"
          startIcon={<ChevronLeftIcon />}
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
        <Grid container spacing={10}>
          <Grid item xs={5}>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                Name
              </Typography>
              <TextField
                id="title"
                fullWidth
                size="small"
                sx={textInputStyle}
                {...register('title')}
                error={formState.errors.title ? true : false}
              />
              {formState.errors.title &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.title.message}
                </Typography>
              }
            </Box>
            {imageURL || data?.image ?
              <Box {...getRootProps()} sx={{
                mb: '1.5rem',
                borderRadius: '8px',
              }}>
                <img src={imageURL || data?.image} alt='' style={{ width: '100%', maxHeight: '250px', cursor: 'pointer', borderRadius: '8px' }} />
                <input {...getInputProps()} />
              </Box>
              :
              <Box {...getRootProps()} sx={{
                mb: '1.5rem',
                backgroundColor: 'white',
                py: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                borderStyle: 'dashed',
                borderColor: '#E1E6EF',
                borderRadius: '8px',
              }}>
                <img src={uploadIcon} alt='' style={{ width: '5rem' }} />
                <input {...getInputProps()} />
                <Typography sx={{ mt: '1rem', fontWeight: '800' }}>
                  Drag & drop files or <span style={{ color: '#6D6DF0' }}>Browse</span>
                </Typography>
                <Typography sx={{ color: '#676767', mt: '1rem' }}>
                  Supported formats: JPEG, PNG, GIF
                </Typography>
              </Box>
            }
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                Start date
              </Typography>
              <Controller
                control={control}
                defaultValue={data?.startTime || new Date()}
                name="startTime"
                render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      {...field}
                      sx={datePickerStyle}
                      format="dd/MM/yyyy"
                      inputRef={ref}
                      slotProps={{
                        textField: {
                          size: 'small',
                          onBlur,
                          name,
                          error: !!fieldState.error,
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              {formState.errors.startTime &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.startTime?.message}
                </Typography>
              }
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                End date
              </Typography>
              <Controller
                control={control}
                name="endTime"
                defaultValue={data?.endTime || new Date()}
                render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      {...field}
                      sx={datePickerStyle}
                      format="dd/MM/yyyy"
                      inputRef={ref}
                      slotProps={{
                        textField: {
                          size: 'small',
                          onBlur,
                          name,
                          error: !!fieldState.error,
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
              {formState.errors.endTime &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.endTime?.message}
                </Typography>
              }
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                Prize
              </Typography>
              <TextField
                id="prize"
                variant="outlined"
                fullWidth
                size="small"
                {...register('prize')}
                error={formState.errors.prize ? true : false}
                sx={textInputStyle}
              />
              {formState.errors.prize &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.prize?.message}
                </Typography>
              }
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                Number of winners
              </Typography>
              <TextField
                id="numberOfWinners"
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                {...register('numberOfWinners')}
                error={formState.errors.numberOfWinners ? true : false}
                sx={textInputStyle}
              />
              {formState.errors.numberOfWinners &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.numberOfWinners?.message}
                </Typography>
              }
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                Description
              </Typography>
              <TextField
                id="description"
                variant="outlined"
                minRows={4}
                fullWidth
                multiline
                size="small"
                {...register('description')}
                error={formState.errors.description ? true : false}
                sx={textInputStyle}
              />
              {formState.errors.description &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.description?.message}
                </Typography>
              }
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                Rules
              </Typography>
              <TextField
                id="rules"
                variant="outlined"
                minRows={4}
                fullWidth
                multiline
                size="small"
                {...register('rules')}
                error={formState.errors.rules ? true : false}
                sx={textInputStyle}
              />
              {formState.errors.rules &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.rules?.message}
                </Typography>
              }
            </Box>
            <Box sx={{ display: 'flex', mt: '2rem', justifyContent: 'flex-end' }}>
              <Box sx={{ borderRadius: '0.6rem', borderColor: '#6D6DF0', borderWidth: '3px', borderStyle: 'solid' }}>
                <Button onClick={() => navigate(-1)} sx={{ textTransform: 'capitalize', color: '#6D6DF0', fontWeight: 600, px: '1rem' }}>
                  Cancel
                </Button>
              </Box>
              <Button
                sx={{
                  ml: '1rem',
                  textTransform: 'capitalize',
                  backgroundColor: '#6D6DF0',
                  ":hover": {
                    bgcolor: '#6D6DF0',
                  },
                  borderRadius: '0.6rem',
                }}
                variant="contained"
                onClick={handleSubmit((data) => {
                  const formData = new FormData();
                  if (id) {
                    formData.append("id", id);
                  }
                  formData.append("title", data?.title || '');
                  if (binImageFile) {
                    formData.append("image", binImageFile);
                  }
                  formData.append("startTime", data?.startTime?.toISOString() || '');
                  formData.append("endTime", data?.endTime?.toISOString() || '');
                  formData.append("prize", `${data?.prize}`);
                  formData.append("numberOfWinners", `${data?.numberOfWinners}`);
                  formData.append("description", data?.description || '');
                  if (data?.rules) {
                    formData.append("rules", data.rules);
                  }
                  savePress(formData);
                })}>
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  ) : (
    <Navigate to="/" state={{ referrer: window.location.pathname }} />
  );
};

export default EditGiveaway;
