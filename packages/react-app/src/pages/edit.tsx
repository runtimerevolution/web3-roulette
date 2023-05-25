import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box, Button, Checkbox, Container, FormControlLabel, Grid, MenuItem, Select, Snackbar, TextField, Typography
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import uploadIcon from './../assets/CloudUpload.svg';
import useUserInfo from '../hooks/useUserInfo';
import queryClient, { SaveGiveaway, GetGiveawayDetails } from '../lib/queryClient';
import {
  ConditionType,
  ConditionValue,
  Giveaway,
  GiveawayCondition,
  LocationValue,
  Unit,
  UserRole
} from '../lib/types';

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
};
const selectInputStyle = {
  '& .MuiInputBase-input': {
    backgroundColor: 'white',
    borderRadius: '8px',
    minWidth: '100px',
  },
  mr: '1rem',
};
const fieldLabelStyle = {
  color: '#000000'
};
const fieldErrorDescriptionStyle = {
  color: '#FF0000',
};

const EditGiveaway = () => {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const { giveawayId } = useParams();
  const { data } = GetGiveawayDetails(giveawayId)
  const { handleSubmit, register, reset, control, formState, setError } = useForm<Giveaway>({
    defaultValues: useMemo(() => data, [data])
  });
  useEffect(() => {
    if (data) {
      reset(data);
      setImageURL(data.image || '');
    }
  }, [reset, data]);

  const [binImageFile, setBinImageFile] = useState<File>();
  const [imageURL, setImageURL] = useState<string>('');
  const [imageError, setImageError] = useState<string | undefined>(undefined);

  const onDrop = useCallback((files: File[]) => {
    setImageURL(URL.createObjectURL(files[0]));
    setBinImageFile(files[0]);
    setImageError(undefined);
  }, [])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  const addServerErrors = (
    errors: { field: string; message: string }[],
    setError: (
      fieldName: keyof Giveaway,
      error: { type: string; message: string }
    ) => void
  ) => {
    errors.forEach((error) => {
      const field = error.field as keyof Giveaway;
      if (field !== undefined) {
        setError(field, {
          type: "server",
          message: error.message,
        });
      }
    });
  };

  const savePress = async (data: FormData) => {
    const result = await SaveGiveaway(data);

    if (result.response?.status === 500) {
      if (Array.isArray(result.response.data.error)) {
        addServerErrors(result.response.data.error, setError);
      } else if (result.response.data.error) {
        setErrorMessage(result.response.data.error);
      }
    } else {
      navigate(-1);
      queryClient.invalidateQueries('active')
    }
  }

  const [giveawayConditions, setGiveawayConditions] = useState<GiveawayCondition[]>([]);

  const handleConditionTypeChange = (index: number, value: ConditionType) => {
    const newGiveawayConditions = [...giveawayConditions];
    newGiveawayConditions.splice(index, 1, { type: value, value: newGiveawayConditions[index].type === value ? newGiveawayConditions[index].value : null });
    setGiveawayConditions(newGiveawayConditions);
  }

  const handleConditionValueChange = (index: number, value: ConditionValue) => {
    const newGiveawayConditions = [...giveawayConditions];
    newGiveawayConditions.splice(index, 1, { type: newGiveawayConditions[index].type, value });
    setGiveawayConditions(newGiveawayConditions);
  }

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  return userInfo?.role === UserRole.ADMIN ? (
    <Container maxWidth={false}>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(undefined)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert severity="error" onClose={() => setErrorMessage(undefined)}>
          {errorMessage}
        </MuiAlert>
      </Snackbar>
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
                {...register('title', { required: "Name is required!" })}
                error={formState.errors.title ? true : false}
              />
              {formState.errors.title &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.title.message}
                </Typography>
              }
            </Box>
            {imageURL ?
              <Box sx={{
                borderRadius: '8px',
                position: 'relative',
              }}>
                <Button
                  onClick={e => {
                    setImageURL('');
                    setBinImageFile(undefined);
                  }}
                  sx={{ color: '#6D6DF0', px: '1rem', position: 'absolute', right: 0 }}
                >
                  <DeleteIcon />
                </Button>
                <Box {...getRootProps()}>
                  <img src={imageURL} alt='' style={{ width: '100%', maxHeight: '250px', cursor: 'pointer', borderRadius: '8px' }} />
                  <input {...getInputProps()} />
                </Box>
              </Box>
              : <>
                <Box {...getRootProps()} sx={{
                  backgroundColor: 'white',
                  py: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  borderColor: imageError ? '#FF0000' : '#E1E6EF',
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
                {imageError && <Typography sx={{ color: '#FF0000' }}>
                  {imageError}
                </Typography>}
              </>
            }
            <Box sx={{ my: '1.5rem' }}>
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
                      disabled={!!giveawayId}
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
                      disabled={!!giveawayId}
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
                {...register('prize', { required: "Prize is required!" })}
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
                {...register('numberOfWinners', { required: "Number of winners is required!" })}
                error={formState.errors.numberOfWinners ? true : false}
                sx={textInputStyle}
                disabled={!!giveawayId}
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
                {...register('description', { required: "Description is required!" })}
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
            <Box sx={{ mb: '1.5rem' }}>
              <Typography sx={fieldLabelStyle}>
                Who is eligible to participate?
              </Typography>
              {giveawayConditions.map((value, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: '1rem' }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value.type}
                    onChange={e => handleConditionTypeChange(index, e.target.value as ConditionType)}
                    size="small"
                    sx={selectInputStyle}
                    disabled={!!giveawayId}
                  >
                    <MenuItem value={'unit'}>Unit</MenuItem>
                    <MenuItem value={'location'}>Location</MenuItem>
                  </Select>

                  {value.type === "unit" ? (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={value.value || ''}
                      onChange={e => handleConditionValueChange(index, e.target.value as Unit)}
                      size="small"
                      sx={selectInputStyle}
                      disabled={!!giveawayId}
                    >
                      {Object.values(Unit).map(unit => (<MenuItem key={unit} value={unit}>{unit}</MenuItem>))}
                    </Select>
                  ) : (
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={value.value || ''}
                      onChange={e => handleConditionValueChange(index, e.target.value as LocationValue)}
                      size="small"
                      sx={selectInputStyle}
                      disabled={!!giveawayId}
                    >
                      <MenuItem value="Lisbon Office">Lisbon Office</MenuItem>
                      <MenuItem value="Porto Office">Porto Office</MenuItem>
                    </Select>
                  )}
                  <Button
                    onClick={() => {
                      const newConditions = [...giveawayConditions];
                      newConditions.splice(index, 1);
                      setGiveawayConditions(newConditions)
                    }}
                    sx={{ textTransform: 'capitalize', px: '1rem' }}
                    disabled={!!giveawayId}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>))
              }
            </Box>

            <Button
              onClick={() => {
                const newConditions = [...giveawayConditions];
                newConditions.push({ type: 'unit', value: Unit.NODE });
                setGiveawayConditions(newConditions);
              }}
              sx={{ textTransform: 'capitalize', px: '1rem' }}
              disabled={!!giveawayId}
            >
              + Add condition
            </Button>

            <Box>
              <FormControlLabel
                control={
                  <Controller
                    name={'manual'}
                    control={control}
                    defaultValue={data?.manual}
                    render={({ field: { ref, ...field }, fieldState }) => (
                      <Checkbox
                        {...field}
                        defaultChecked={field.value}
                        inputRef={ref}
                        disabled={!!giveawayId}
                      />
                    )}
                  />
                }
                label="Manual giveaway"
              />
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
                  formData.append("title", data.title);
                  if (!binImageFile && !imageURL) {
                    setImageError("Image is required");
                    return;
                  } else if (binImageFile) {
                    formData.append("image", binImageFile);
                  }
                  formData.append("startTime", data?.startTime?.toISOString() || '');
                  formData.append("endTime", data?.endTime?.toISOString() || '');
                  formData.append("prize", `${data?.prize}`);
                  formData.append("numberOfWinners", `${data?.numberOfWinners}`);
                  formData.append("description", data?.description || '');
                  formData.append("rules", data.rules || '');
                  // if (giveawayConditions) {
                    //formData.append("requirements", giveawayConditions);
                  // }
                  formData.append("isManual", `${data?.manual}`);
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
