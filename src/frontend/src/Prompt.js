import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import {
  Button,
  Card,
  CardMedia,
  Container,
  Typography,
  styled,
  Divider,
} from "@mui/material";
import PlayCircleFilledTwoToneIcon from "@mui/icons-material/PlayCircleFilledTwoTone";
import IconButton from "@mui/material/IconButton";
import MicNoneTwoToneIcon from "@mui/icons-material/MicNoneTwoTone";
import MicOffTwoToneIcon from "@mui/icons-material/MicOffTwoTone";
import CircularProgress from "@mui/material/CircularProgress";
import { TextareaAutosize } from "@mui/base";
import { useLocation } from "react-router-dom";
import TuneTwoToneIcon from "@mui/icons-material/TuneTwoTone";
import FilterPanel from "./FilterPanel";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const CustomTextBox = styled(TextareaAutosize)(
  () => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${grey[300]};
  background: ${grey[900]};
  border: 1px solid ${grey[700]};
  box-shadow: 0px 2px 2px ${grey[900]};
  resize: none;
  
  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${blue[600]};
  }

  &:focus-visible {
    outline: 0;
  }
`,
);

const Prompt = ({
  onGenerate,
  isLoading,
  setSelectedImageCount,
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
  selectedTechnique,
}) => {
  const [prompt, setPrompt] = useState(localStorage.getItem("prompt") ? localStorage.getItem("prompt") : "");
  const [isListening, setIsListening] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const location = useLocation();
  const currentRoute = location.pathname;
  const [chipData, setChipData] = useState([
    { key: 0, label: `Art Style: ${selectedArtStyle}` },
    { key: 1, label: `Image CFG: ${selectedImageCFG}` },
    { key: 2, label: `Image Format: ${selectedImageFormat}` },
    { key: 3, label: `Image Steps: ${selectedImageSteps}` },
    { key: 4, label: `Location: ${selectedLocation}` },
    { key: 5, label: `Technique: ${selectedTechnique}` },
    { key: 6, label: `Theme/Genre: ${selectedThemeGenre}` },
    { key: 7, label: `Weather: ${selectedWeather}` },
  ]);

  useEffect(() => {
    setChipData([
      { key: 0, label: `Art Style: ${selectedArtStyle}` },
      { key: 1, label: `Image CFG: ${selectedImageCFG}` },
      { key: 2, label: `Image Format: ${selectedImageFormat}` },
      { key: 3, label: `Image Steps: ${selectedImageSteps}` },
      { key: 4, label: `Location: ${selectedLocation}` },
      { key: 5, label: `Technique: ${selectedTechnique}` },
      { key: 6, label: `Theme/Genre: ${selectedThemeGenre}` },
      { key: 7, label: `Weather: ${selectedWeather}` },
    ]);
  }, [
    selectedArtStyle,
    selectedImageCFG,
    selectedImageFormat,
    selectedImageSteps,
    selectedLocation,
    selectedTechnique,
    selectedThemeGenre,
    selectedWeather,
  ]);

  useEffect(() => {
    localStorage.setItem("prompt", prompt);
  }, [prompt]);

  const handleGenerateClick = () => {
    setIsSettingOpen(false);
    if (isLoading) return;
    if (typeof onGenerate === "function") {
      onGenerate(prompt);
    }
  };

  const startListening = (inputName) => {
    setActiveInput(inputName);
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function (event) {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        if (activeInput === "prompt") {
          setPrompt(transcript);
        }

        recognition.stop();
      };

      recognition.onerror = function (event) {
        console.error("Speech recognition error", event.error);
        recognition.stop();
      };

      setIsListening(true);
      recognition.onend = () => setIsListening(false);
    } else {
      console.error("Speech recognition is not supported in this browser.");
    }
  };

  return (
    <>
      <Container
        style={{ position: "relative" }}
        sx={{ marginTop: 2, marginBottom: 2, maxWidth: "95% !important" }}
      >
        <Card
          sx={{
            p: currentRoute === "/image-generator" ? 2 : 0,
            bgcolor: "#57637526",
            border: "1px solid #30374180",
          }}
        >
          {currentRoute === "/image-generator" && (
            <CardMedia
              sx={{ borderRadius: 2 }}
              component="img"
              alt="Yosemite National Park"
              height="140"
              image="/yosemite.jpeg"
            />
          )}
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            sx={{ width: "100%" }}
            marginTop={currentRoute === "/image-generator" ? 2 : 0}
            useFlexGap
          >
            <Stack direction="column" sx={{ width: "100%" }} spacing={2}>
              {currentRoute === "/image-generator" ? (
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ fontSize: "0.975rem", color: "#fff", fontWeight: 700 }}
                >
                  Promt
                </Typography>
              ) : (
                <>
                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                      pl: 2,
                      pt: 2,
                      fontSize: "0.975rem",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    Promt
                  </Typography>
                  <Divider
                    sx={{
                      background: "#42494d",
                    }}
                  />
                </>
              )}
              <Stack
                direction="column"
                spacing={2}
                useFlexGap
                sx={{
                  pl: currentRoute === "/image-generator" ? 0 : 2,
                  pb: currentRoute === "/image-generator" ? 0 : 2,
                  mt: 20,
                  width: "100%",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CustomTextBox
                    maxRows={3}
                    minRows={3}
                    id="prompt"
                    value={prompt}
                    placeholder="Enter a description of what you want the AI to create"
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <IconButton
                    color="success"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "#57ca22",
                      marginRight: "10px",
                    }}
                    onClick={() => startListening("prompt")}
                    disabled={isListening}
                  >
                    {isListening && activeInput === "prompt" ? (
                      <MicOffTwoToneIcon />
                    ) : (
                      <MicNoneTwoToneIcon />
                    )}
                  </IconButton>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    sx={{
                      width: "130px",
                      p: 1,
                      borderRadius: "10px",
                      textDecoration: "none",
                      textTransform: "none",
                      "&:disabled": {
                        bgcolor: "#0073e6",
                        color: "white",
                      },
                      bgcolor: "#0073e6",
                      color: "white",
                      boxShadow:
                        "hsl(210, 100%, 60%) 0 2px 0 inset,hsl(210, 100%, 38%) 0 -2px 0 inset,hsla(200, 10%, 4%, 0.1) 0 2px 4px 0",
                    }}
                    endIcon={isLoading ? null : <PlayCircleFilledTwoToneIcon />}
                  >
                    {isLoading ? (
                      <CircularProgress
                        size={20}
                        thickness={5}
                        sx={{ color: "white" }}
                      />
                    ) : (
                      "Generate"
                    )}
                  </Button>
                  {currentRoute === "/image-generator" && (
                    <IconButton
                      color="success"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        color: "#57ca22",
                        marginRight: "10px",
                      }}
                      onClick={() => setIsSettingOpen(!isSettingOpen)}
                    >
                      <TuneTwoToneIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Container>
      {currentRoute === "/image-generator" && (
        <Container
          style={{ position: "relative" }}
          sx={{ maxWidth: "95% !important" }}
        >
          <Paper
            sx={{
              display: "flex",
              justifyContent: "left",
              flexWrap: "wrap",
              listStyle: "none",
              background: "#57637526",
              p: 0.5,
              m: 0,
            }}
            component="ul"
          >
            {chipData.map((data) => {
              if (
                !data.label ||
                data.label.trim().split(":")[1] === "" ||
                data.label.trim().split(":")[1] === " null"
              ) {
                return;
              }

              return (
                <ListItem key={data.key}>
                  <Chip
                    label={data.label}
                    color="success"
                    sx={{ color: "#58ca23" }}
                    variant="outlined"
                    size="small"
                  />
                </ListItem>
              );
            })}
          </Paper>
        </Container>
      )}
      <Container
        style={{ position: "relative" }}
        sx={{ marginTop: 2, marginBottom: 5, maxWidth: "95% !important" }}
      >
        {isSettingOpen && (
          <FilterPanel
            setImageFormat={setImageFormat}
            selectedImageFormat={selectedImageFormat}
            setSelectedImageCount={setSelectedImageCount}
            selectedImageCount={selectedImageCount}
            setSelectedImageSteps={setSelectedImageSteps}
            selectedImageSteps={selectedImageSteps}
            setSelectedArtStyle={setSelectedArtStyle}
            selectedArtStyle={selectedArtStyle}
            setSelectedThemeGenre={setSelectedThemeGenre}
            selectedThemeGenre={selectedThemeGenre}
            setSelectedLocation={setSelectedLocation}
            selectedLocation={selectedLocation}
            setSelectedWeather={setSelectedWeather}
            selectedWeather={selectedWeather}
            setSelectedTechnique={setSelectedTechnique}
            selectedTechnique={selectedTechnique}
            setSelectedImageCFG={setSelectedImageCFG}
            selectedImageCFG={selectedImageCFG}
          />
        )}
      </Container>
    </>
  );
};

export default Prompt;
