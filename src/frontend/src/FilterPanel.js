import React, { useState } from 'react';
import './FilterPanel.css';
import { Card, Divider, Grid, Paper, Stack, Typography, styled } from '@mui/material';
import UnstyledSelectForm from './SelectedFilter';

const FilterPanel = ({ setSelectedImageCount,
  selectedImageCount,
  setSelectedImageSteps,
  selectedImageSteps,
  setSelectedImageCFG,
  selectedImageCFG,
  setImageFormat,
  selectedImageFormat,
  setSelectedArtStyle,
  selectedArtStyle,
  setSelectedThemeGenre,
  selectedThemeGenre,
  setSelectedLocation,
  selectedLocation,
  setSelectedWeather,
  selectedWeather,
  setSelectedTechnique,
  selectedTechnique }) => {
  const artStyles = ["3d-model",
    "analog-film",
    "anime",
    "cinematic",
    "comic-book",
    "digital-art",
    "enhance",
    "fantasy-art",
    "isometric",
    "line-art",
    "low-poly",
    "modeling-compound",
    "neon-punk",
    "origami",
    "photographic",
    "pixel-art",
    "tile-texture",];
  const imageFormat = ["png", "jpg", "webp"]
  const themeGenre = ['Romantic', 'Adventure', 'Thriller', 'Comedy', 'Fantasy', 'Sci-Fi', 'Horror', 'Drama', 'Detective/Mystery'];
  const imageQualities = [5, 10, 15, 20, 25, 30, 35];
  const steps = [10, 20, 30, 40, 50]
  const samples = [1, 2, 3, 4, 5]
  const location = ['Urban/Cityscape', 'Rural Countryside', 'Mountainous', 'Forests', 'Desert', 'Tropical Beach', 'Oceanic/Aquatic'];
  const weather = ['Sunny', 'Overcast', 'Rain', 'Snow'];
  const technique = ['DSLR', 'Cinematic', 'HDR Imaging', 'Long Exposure', 'Pano', 'Portrait'];

  return (
    <>
      <Card sx={{ pb: 2, bgcolor: "#57637526", border: "1px solid #30374180" }}>
        <Stack direction="column" sx={{ width: "100%" }} spacing={2}>
          <Typography variant="h3" gutterBottom sx={{ pl: 2, pt: 2, fontSize: "0.975rem", color: "#fff", fontWeight: 700, }}>
            Filter
          </Typography>
          <Divider
            sx={{
              background: "#42494d",
            }}
          />
          <Grid
            container
            spacing={2}
          >
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Image Format"} data={imageFormat} func={setImageFormat} selected={selectedImageFormat} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Art style"} data={artStyles} func={setSelectedArtStyle} selected={selectedArtStyle} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Theme / Genre"} data={themeGenre} func={setSelectedThemeGenre} selected={selectedThemeGenre} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Location / Setting"} data={location} func={setSelectedLocation} selected={selectedLocation} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Weather conditionsg"} data={weather} func={setSelectedWeather} selected={selectedWeather} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Photography technique"} data={technique} func={setSelectedTechnique} selected={selectedTechnique} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"CFG scal"} data={imageQualities} func={setSelectedImageCFG} selected={selectedImageCFG} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Steps"} data={steps} func={setSelectedImageSteps} selected={selectedImageSteps} />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <UnstyledSelectForm title={"Samples"} data={samples} func={setSelectedImageCount} selected={selectedImageCount} />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </>
  );
};

export default FilterPanel;
