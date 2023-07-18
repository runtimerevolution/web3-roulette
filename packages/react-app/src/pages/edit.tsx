import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useDropzone } from 'react-dropzone';
import {
  Controller,
  useForm,
} from 'react-hook-form';
import { useMutation } from 'react-query';
import {
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import uploadIcon from '../assets/CloudUpload.png';
import WarningBox from '../components/WarningBox';
import queryClient, {
  useGiveawayDetails,
  useLocations,
} from '../lib/queryClient';
import {
  ConditionType,
  Giveaway,
  GiveawayCondition,
  Unit,
  UserInfo,
  UserRole,
} from '../lib/types';
import { UserContext } from '../routes/AuthRoute';
import API from '../services/backend';

const EditGiveaway = () => {
  const navigate = useNavigate();
  const userInfo = useContext(UserContext) as UserInfo;
  const { giveawayId } = useParams();
  const { data } = useGiveawayDetails(giveawayId);
  const locations = useLocations();
  const { handleSubmit, register, reset, control, formState, setError } =
    useForm<Giveaway>({
      defaultValues: useMemo(() => data, [data]),
    });
  useEffect(() => {
    if (data) {
      reset(data);
      setImageURL(data.image || '');
      if (data.requirements) {
        const requirements: GiveawayCondition[] = [];
        if (data.requirements.unit) {
          requirements.push({ type: 'unit', value: data.requirements.unit });
        }
        if (data.requirements.location) {
          requirements.push({
            type: 'location',
            value: data.requirements.location,
          });
        }
        setGiveawayConditions(requirements);
      }
    }
  }, [reset, data]);

  const [binImageFile, setBinImageFile] = useState<File>();
  const [imageURL, setImageURL] = useState<string>('');
  const [imageError, setImageError] = useState<string | undefined>(undefined);

  const onDrop = useCallback((files: File[]) => {
    setImageURL(URL.createObjectURL(files[0]));
    setBinImageFile(files[0]);
    setImageError(undefined);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
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
          type: 'server',
          message: error.message,
        });
      }
    });
  };

  const saveMutation = useMutation({
    mutationFn: (data: FormData) => API.saveGiveaway(data),
    onError: (e: any) => {
      if (Array.isArray(e.data.error)) {
        addServerErrors(e.data.error, setError);
      } else if (e.data.error) {
        setErrorMessage(e.data.error);
      }
    },
    onSuccess: () => {
      navigate(-1);
      queryClient.invalidateQueries('giveaways');
      if (giveawayId) {
        queryClient.invalidateQueries(['details', giveawayId]);
      }
    },
  });

  const saveGiveaway = (data: Giveaway) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (!binImageFile && !imageURL) {
      setImageError('Image is required');
      return;
    } else if (binImageFile) {
      formData.append('image', binImageFile);
    }
    if (giveawayId) {
      formData.append('_id', giveawayId);
    } else {
      formData.append('startTime', data?.startTime?.toISOString() || '');
      formData.append('endTime', data?.endTime?.toISOString() || '');
      formData.append('numberOfWinners', `${data?.numberOfWinners}`);
      formData.append('manual', `${data?.manual ? data?.manual : false}`);
    }
    formData.append('prize', `${data?.prize}`);
    formData.append('description', data?.description || '');
    formData.append('rules', data.rules || '');
    if (giveawayConditions) {
      giveawayConditions.forEach((condition) => {
        if (condition.value) {
          if (condition.type === 'unit') {
            formData.append('requirements[unit]', condition.value);
          } else if (condition.type === 'location') {
            formData.append('requirements[location]', condition.value);
          }
        }
      });
    }
    saveMutation.mutate(formData);
  };

  const [giveawayConditions, setGiveawayConditions] = useState<
    GiveawayCondition[]
  >([]);

  const handleNewCondition = () => {
    const newConditions = [...giveawayConditions];

    if (giveawayConditions.length) {
      if (giveawayConditions[0].type === 'unit') {
        newConditions.push({ type: 'location', value: '' });
      } else {
        newConditions.push({ type: 'unit', value: Unit.NODE });
      }
    } else {
      newConditions.push({ type: 'unit', value: Unit.NODE });
    }

    setGiveawayConditions(newConditions);
  };

  const handleConditionTypeChange = (index: number, value: ConditionType) => {
    const newGiveawayConditions = [...giveawayConditions];
    newGiveawayConditions.splice(index, 1, {
      type: value,
      value:
        newGiveawayConditions[index].type === value
          ? newGiveawayConditions[index].value
          : null,
    });
    setGiveawayConditions(newGiveawayConditions);
  };

  const handleConditionValueChange = (index: number, value: Unit | string) => {
    const newGiveawayConditions = [...giveawayConditions];
    newGiveawayConditions.splice(index, 1, {
      type: newGiveawayConditions[index].type,
      value,
    });
    setGiveawayConditions(newGiveawayConditions);
  };

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  return userInfo.role === UserRole.ADMIN ? (
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
      <Box className="form-container">
        <div>
          <Button
            className="back"
            variant="text"
            startIcon={<ChevronLeftIcon />}
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
          <Typography className="new-giveaway-title">New Giveaway</Typography>
        </div>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={5}>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography className="field-label">Name</Typography>
              <TextField
                id="title"
                className="text-input"
                fullWidth
                size="small"
                {...register('title', { required: 'Name is required!' })}
                error={formState.errors.title ? true : false}
              />
              {formState.errors.title && (
                <Typography className="error-description">
                  {formState.errors.title.message}
                </Typography>
              )}
            </Box>
            {imageURL ? (
              <Box
                sx={{
                  borderRadius: '8px',
                  position: 'relative',
                }}
              >
                <Button
                  onClick={(e) => {
                    setImageURL('');
                    setBinImageFile(undefined);
                  }}
                  sx={{
                    color: '#6D6DF0',
                    px: '1rem',
                    position: 'absolute',
                    right: 0,
                  }}
                >
                  <DeleteIcon className="delete-icon" />
                </Button>
                <Box {...getRootProps()}>
                  <img
                    src={imageURL}
                    alt=""
                    className="image-input-filled"
                  />
                  <input {...getInputProps()} />
                </Box>
              </Box>
            ) : (
              <>
                <Box
                  {...getRootProps()}
                  sx={{
                    backgroundColor: 'white',
                    py: '1rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    borderStyle: 'dashed',
                    borderColor: imageError ? '#FF0000' : '#E1E6EF',
                    borderRadius: '8px',
                  }}
                >
                  <img src={uploadIcon} alt="" className="image-input-empty" />
                  <input {...getInputProps()} />
                  <Typography sx={{ mt: '1rem', fontWeight: '800' }}>
                    Drag & drop files or{' '}
                    <span className="input-browse-text">Browse</span>
                  </Typography>
                  <Typography sx={{ color: '#676767', mt: '1rem' }}>
                    Supported formats: JPEG, PNG, GIF
                  </Typography>
                </Box>
                {imageError && (
                  <Typography sx={{ color: '#FF0000' }}>
                    {imageError}
                  </Typography>
                )}
              </>
            )}
            <Box sx={{ my: '1.5rem' }}>
              <Typography className="field-label">Start date</Typography>
              <Controller
                control={control}
                defaultValue={data?.startTime || new Date()}
                name="startTime"
                render={({
                  field: { ref, onBlur, name, ...field },
                  fieldState,
                }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      className="datepicker"
                      {...field}
                      format="dd/MM/yyyy hh:mm a"
                      inputRef={ref}
                      slotProps={{
                        textField: {
                          size: 'small',
                          onBlur,
                          name,
                          error: !!fieldState.error,
                        },
                      }}
                      disabled={!!giveawayId}
                    />
                  </LocalizationProvider>
                )}
              />
              {formState.errors.startTime && (
                <Typography className="error-description">
                  {formState.errors.startTime?.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography className="field-label">End date</Typography>
              <Controller
                control={control}
                name="endTime"
                defaultValue={data?.endTime || new Date()}
                render={({
                  field: { ref, onBlur, name, ...field },
                  fieldState,
                }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      className="datepicker"
                      {...field}
                      format="dd/MM/yyyy hh:mm a"
                      inputRef={ref}
                      slotProps={{
                        textField: {
                          size: 'small',
                          onBlur,
                          name,
                          error: !!fieldState.error,
                        },
                      }}
                      disabled={!!giveawayId}
                    />
                  </LocalizationProvider>
                )}
              />
              {formState.errors.endTime && (
                <Typography className="error-description">
                  {formState.errors.endTime?.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography className="field-label">Prize</Typography>
              <TextField
                id="prize"
                className="text-input"
                variant="outlined"
                fullWidth
                size="small"
                {...register('prize', { required: 'Prize is required!' })}
                error={formState.errors.prize ? true : false}
              />
              {formState.errors.prize && (
                <Typography className="error-description">
                  {formState.errors.prize?.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography className="field-label">Number of winners</Typography>
              <TextField
                id="numberOfWinners"
                className="text-input"
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                {...register('numberOfWinners', {
                  required: 'Number of winners is required!',
                })}
                error={formState.errors.numberOfWinners ? true : false}
                disabled={!!giveawayId}
              />
              {formState.errors.numberOfWinners && (
                <Typography className="error-description">
                  {formState.errors.numberOfWinners?.message}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography className="field-label">Description</Typography>
              <TextField
                id="description"
                className="text-input"
                variant="outlined"
                minRows={4}
                fullWidth
                multiline
                size="small"
                {...register('description', {
                  required: 'Description is required!',
                })}
                error={formState.errors.description ? true : false}
              />
              {formState.errors.description && (
                <Typography className="error-description">
                  {formState.errors.description?.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography className="field-label">Rules</Typography>
              <TextField
                id="rules"
                className="text-input"
                variant="outlined"
                minRows={4}
                fullWidth
                multiline
                size="small"
                {...register('rules')}
                error={formState.errors.rules ? true : false}
              />
              {formState.errors.rules && (
                <Typography className="error-description">
                  {formState.errors.rules?.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography className="field-label conditions-title">
                Who is eligible to participate?
              </Typography>
              {giveawayConditions.map((value, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center', mt: '1rem' }}
                >
                  <Select
                    className="condition-select"
                    value={value.type}
                    onChange={(e) =>
                      handleConditionTypeChange(
                        index,
                        e.target.value as ConditionType
                      )
                    }
                    size="small"
                    disabled={!!giveawayId}
                  >
                    <MenuItem value={'unit'}>Unit</MenuItem>
                    <MenuItem value={'location'}>Location</MenuItem>
                  </Select>

                  {value.type === 'unit' ? (
                    <Select
                      className="condition-select"
                      value={value.value || ''}
                      onChange={(e) =>
                        handleConditionValueChange(index, e.target.value)
                      }
                      size="small"
                      disabled={!!giveawayId}
                    >
                      {Object.values(Unit).map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Select
                      className="condition-select"
                      value={value.value || ''}
                      onChange={(e) =>
                        handleConditionValueChange(index, e.target.value)
                      }
                      size="small"
                      disabled={!!giveawayId}
                    >
                      {locations.data?.map((loc) => (
                        <MenuItem key={loc._id} value={loc._id}>
                          {loc.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  {!giveawayId && (
                    <Button
                      onClick={() => {
                        const newConditions = [...giveawayConditions];
                        newConditions.splice(index, 1);
                        setGiveawayConditions(newConditions);
                      }}
                      sx={{ textTransform: 'capitalize', px: '1rem' }}
                      disabled={!!giveawayId}
                    >
                      <DeleteIcon className="delete-icon" />
                    </Button>
                  )}
                </Box>
              ))}

              {!giveawayId && giveawayConditions.length < 2 && (
                <Button
                  className="add-condition-btn"
                  onClick={handleNewCondition}
                  disabled={!!giveawayId}
                >
                  + Add condition
                </Button>
              )}
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Controller
                    name={'manual'}
                    control={control}
                    defaultValue={true}
                    render={({ field: { ref, ...field } }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        inputRef={ref}
                      />
                    )}
                  />
                }
                label="Manual giveaway"
                disabled={!!giveawayId}
              />
            </Box>
            <Box className="cancel-save-container">
              <Button
                className="cancel-btn"
                variant="outlined"
                onClick={() => navigate(-1)}
                disableElevation
              >
                Cancel
              </Button>
              <Button
                className="save-btn"
                variant="contained"
                onClick={handleSubmit(saveGiveaway)}
                disableElevation
              >
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
