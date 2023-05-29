import 'leaflet/dist/leaflet.css';

import { useMemo, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';

import { Box, Button, Grid, Slider, Snackbar, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SubHeader from '../components/SubHeader';
import { Location } from '../lib/types';
import { Controller, useForm } from 'react-hook-form';
import FrontendApiClient from '../services/backend';
import MuiAlert from '@mui/material/Alert';

const textInputStyle = {
  '& .MuiInputBase-root': {
    backgroundColor: 'white',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#E1E6EF',
    }
  },
};
const fieldErrorDescriptionStyle = {
  color: '#FF0000',
};

const defaultPin = {
  lat: 38.7531,
  lng: -9.1452,
}
const defaultRadius = 200

const LocationEdit = () => {
  const navigate = useNavigate();

  const { handleSubmit, register, formState, setValue, control } = useForm<Location>({});

  const [position, setPosition] = useState(defaultPin);
  const [mapRadius, setRadius] = useState(defaultRadius);

  function DraggableMarker() {
    const markerRef = useRef<any>(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )

    return (
      <>
        <Circle
          color='transparent'
          center={position}
          eventHandlers={eventHandlers}
          pathOptions={{ fillColor: '#12BB6A' }}
          radius={mapRadius}>
        </Circle>
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}>
        </Marker>
      </>
    )
  }

  const onSave = (data: Location) => {
    FrontendApiClient.postLocation(data)
      .then(() => {
        navigate(-1);
      })
      .catch(e => {
        setErrorMessage(e.message);
      });
  }

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  return (
    <Box>
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
      <SubHeader />
      <Typography
        sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#303136',
          marginTop: '13px',
          marginLeft: { xs: '10px', md: '0px' },
          px: '5rem',
        }}
      >
        New location
      </Typography>
      <Box sx={{ px: '5rem', pt: '1rem' }}>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height: '100%', minHeight: 500 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <DraggableMarker />
            </MapContainer>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography>
                Name
              </Typography>
              <TextField
                id="name"
                variant="outlined"
                fullWidth
                size="small"
                sx={textInputStyle}
                {...register('name', { required: 'Required' })}
                error={formState.errors.name ? true : false}
              />
              {formState.errors.name &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.name.message}
                </Typography>
              }
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography>
                Latitude
              </Typography>
              <TextField
                id="latitude"
                variant="outlined"
                fullWidth
                size="small"
                type='number'
                sx={textInputStyle}
                value={position.lat}
                {...register('latitude', { required: 'Required' })}
                error={formState.errors.latitude ? true : false}
                onChange={e => {
                  setValue('latitude', parseFloat(e.target.value))
                  setPosition({ ...position, lat: parseFloat(e.target.value) });
                }}
              />
              {formState.errors.latitude &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.latitude.message}
                </Typography>
              }
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography>
                Longitude
              </Typography>
              <TextField
                id="longitude"
                variant="outlined"
                fullWidth
                size="small"
                type='number'
                sx={textInputStyle}
                value={position.lng}
                error={formState.errors.longitude ? true : false}
                {...register('longitude', { required: 'Required' })}
                onChange={e => {
                  setPosition({ ...position, lng: parseFloat(e.target.value) });
                }}
              />
              {formState.errors.longitude &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.longitude.message}
                </Typography>
              }
            </Box>
            <Box sx={{ mb: '1.5rem' }}>
              <Typography>
                Radius
              </Typography>
              <Controller
                control={control}
                name="radius"
                defaultValue={mapRadius}
                render={({ field }) => (
                  <Slider
                    {...field}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    min={10}
                    max={1000}
                    onChange={e => {
                      const value = parseInt(e.target.value);
                      setRadius(value);
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {formState.errors.radius &&
                <Typography sx={fieldErrorDescriptionStyle}>
                  {formState.errors.radius.message}
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
                onClick={handleSubmit(onSave)}>
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box >
  )
};

export default LocationEdit;
