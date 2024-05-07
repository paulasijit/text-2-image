import React, { useState } from "react";
import "./HomePage.css";
import {
  Typography,
  Stack,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  styled,
  Paper,
  Box,
  Chip
} from "@mui/material";
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import { gallery } from "./gallery";
import KeyboardArrowRightTwoToneIcon from '@mui/icons-material/KeyboardArrowRightTwoTone';
const imagePath = process.env.PUBLIC_URL + '/gallery/';

const Home = () => {
  const assets = [
    {
      title: "Intuitive Design",
      description: `Experience an intuitive user interface, allowing you to navigate through the application effortlessly and efficiently.`
    },
    {
      title: "High Flexibility",
      description: `Enjoy unparalleled flexibility as you tailor and customize outputs to perfectly suit your unique creative needs and preferences.`
    },
    {
      title: "Multilingual Support",
      description: `Seamlessly engage with the tool in your native language, breaking down language barriers and ensuring inclusivity.`
    },
    {
      title: "Content Filtering",
      description: `Create and explore with confidence in a protected space, knowing that robust content filtering mechanisms are in place to safeguard your experience.`
    },
    {
      title: "Semantic Understanding",
      description: `Benefit from advanced semantic understanding, enabling nuanced interpretation of your inputs for the creation of precise and accurate visuals.`
    },
    {
      title: "Customizable Filtering",
      description: `Tailor the scene generation process to your unique creative vision, with customizable filtering options that empower you to refine and perfect your creations.`
    },
    {
      title: "Robust Security Measures",
      description: `Rest assured with robust security measures in place, ensuring the protection of your data and privacy throughout your interaction with the application.`
    },
    {
      title: "Advanced Analytics",
      description: `Gain valuable insights into your usage data with advanced analytics tools, empowering you to make data-driven decisions and optimize your workflow.`
    }
  ];

  const userGuide = [
    { title: "Step 1", guide: "Type your scene's description as a prompt." },
    { title: "Step 2", guide: "Use Content Analysis to filter inappropriate content." },
    { title: "Step 3", guide: "Translate your prompt to multiple languages if needed." },
    { title: "Step 4", guide: "Conduct Semantic Analysis for contextual comprehension." },
    { title: "Step 5", guide: "Choose from various filter options to refine your scene." },
    { title: "Step 6", guide: "Hand-pick the type of scene you want to generate." },
    { title: "Step 7", guide: "Press 'Generate' and watch your text come to life!" },
  ];


  const handleImageError = (e, imageIndex) => {
    e.target.src = `${imagePath}${imageIndex + 1}.jpg`;
  };

  const slicedGallery = gallery.sort(() => Math.random() - 0.5).slice(0, 9);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "transparent",
    textAlign: 'left',
    color: theme.palette.text.secondary,
    padding: 30,
    height: "auto",
    marginTop: 50
  }));

  return (
    <><Container style={{ position: 'relative' }} sx={{ marginTop: 1, marginBottom: 5, maxWidth: '100% !important', height: { xs: "13%", md: "calc(95vh - 120px)", } }}>
      <Stack direction="row">
        {" "}
        <Box
          sx={{
            bgcolor: 'transparent',
            p: 2,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
            position: 'absolute',
            width: { xs: "95%", md: "43%" },
          }}
        >
          <Stack direction="column">
            <Typography
              variant="h1"
              gutterBottom
              sx={{ mb: "20px", color: "#fff", fontWeight: 600 }}
              style={{ fontSize: "clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)" }}
            >
              Welcome to{" "}
              <span
                style={{
                  background: "#44a574",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                text2Scene{" "}
              </span>{" "}
              Your Ideas, Our Images!{" "}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mb: "30px", color: "#b6bec9" }}
            >
              text2Scene allows users to generate detailed visual scenes based on
              textual descriptions, making it a powerful tool for designers,
              artists, and educators to bring ideas to life quickly and
              accurately.
            </Typography>
            <Button variant="contained" href='/image-generator' sx={{ maxWidth: "130px", p: 1, borderRadius: "10px", marginTop: 4, textDecoration: "none", textTransform: "none" }} endIcon={<KeyboardArrowRightTwoToneIcon />}>
              Try Now!
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            bgcolor: "#0e1a27",
            color: (theme) => theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            p: 2,
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',
            position: 'absolute',
            overflow: 'hidden',
            top: 0,
            left: '50%',
            width: "70%",
            display: { xs: "none", md: "block" },
            height: "90%",
            zIndex: 'modal',
          }}
        >
          <Container maxWidth="100%">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12} mt={2}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {slicedGallery.map((image) => (
                      <Grid item lg={4} md={4} sm={4} xs={12} key={image.index} sx={{ pl: "0px !important" }}>
                        <CardContent sx={{ p: 0, paddingBottom: "0px !important" }}>
                          <img
                            key={image.index}
                            src={image.png}
                            className="gallery-img"
                            style={{
                              width: "90%",
                              height: "80%",
                              borderRadius: "8px",
                              objectFit: "cover",
                              transition: "transform 0.3s ease"
                            }}
                            alt={`Gallery ${image.index + 1}`}
                            onError={(e) => handleImageError(e, image.index)} />
                        </CardContent>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Stack>
    </Container>
      <Container style={{ position: 'relative' }} sx={{ mb: 10, maxWidth: '100% !important' }}>
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Typography variant="h2" gutterBottom sx={{ mb: "10px", mt: { md: 0, xs: 5 }, color: "#3399ff" }} style={{ fontSize: "0.875rem", fontWeight: 700 }} >
            Why use us?
          </Typography>
          <Typography variant="h2" gutterBottom sx={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.5rem, 0.9643rem + 1.4286vw, 2.25rem)" }} >
            <span style={{ background: "#44a574", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>User-Friendly</span> Features
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {assets.map((data, index) => (
              <Grid item xs={12} md={3} xl={3} key={index} sx={{ display: "flex" }}>
                <Item sx={{ borderRadius: "12px", display: "flex", flexDirection: "column", boxShadow: "0px 0px 2px #757c82", background: "linear-gradient(to bottom right, hsla(210, 100%, 23%, 0.1) 25%, hsla(210, 14%, 9%, 0.2) 100%);" }}>
                  <Typography variant="h3" gutterBottom sx={{ mb: "20px", fontSize: "0.875rem", color: "#fff", fontWeight: 700 }}>
                    {data.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom sx={{ color: "#b6bec9" }}>
                    {data.description}
                  </Typography>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Container style={{ position: 'relative' }} sx={{ maxWidth: '95% !important', height: { xs: "13%", md: "calc(95vh - 120px)", } }}>
        <Typography variant="h2" gutterBottom sx={{ mb: "10px", mt: { md: 0, xs: 5 }, color: "#3399ff" }} style={{ fontSize: "0.875rem", fontWeight: 700 }} >
          How to use?
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.5rem, 0.9643rem + 1.4286vw, 2.25rem)" }} >
          <span style={{ background: "#44a574", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Getting</span> Started
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <CardContent sx={{ padding: 0 }}>
              {userGuide.map((guide, index) => (
                <Card key={index} sx={{ mb: 2, background: "#102036", p: 1, width: "fit-content", borderRadius: "10px", boxShadow: "0px 0px 2px #0061c2cc" }}>
                  <Stack direction="row" spacing={1}>
                    <Chip icon={<CheckCircleTwoToneIcon style={{ color: "#14d25f" }} />} label={guide.title} sx={{ bgcolor: "#213b62", color: "#14d25f" }} size="small" />
                    <Typography sx={{ color: "#ffffff80" }}>
                      {guide.guide}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </CardContent>
          </Grid>
          <Grid item xs={6}>
            <img
              src="/brain.png"
              className="brain-img"
              style={{
                width: "90%",
                height: "70%",
                borderRadius: "8px",
                objectFit: "scale-down",
                transition: "transform 0.3s ease"
              }} />
          </Grid>
        </Grid>
      </Container >
    </>
  );
};

export default Home;