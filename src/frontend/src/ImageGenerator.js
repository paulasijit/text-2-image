import React, { useState, useEffect, useRef } from "react";
import Prompt from "./Prompt";
import "./Content.css";
import { useSnackbar } from "notistack";
import { updateToken } from "./redux/action";
import { useDispatch } from "react-redux";
import Modal from "@mui/material/Modal";
import NavigateBeforeTwoToneIcon from "@mui/icons-material/NavigateBeforeTwoTone";
import NavigateNextTwoToneIcon from "@mui/icons-material/NavigateNextTwoTone";
import { Divider, IconButton, Stack, Typography } from "@mui/material";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import FullscreenTwoToneIcon from "@mui/icons-material/FullscreenTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "95%",
  bgcolor: "#1a2028",
  border: "1px solid #618ac480",
  p: 1,
  pt: 4,
  pb: 6,
  borderRadius: 4,
};

const ImageGenerator = ({ user }) => {
  const [selectedImageCount, setSelectedImageCount] = useState(1);
  const [selectedImageSteps, setSelectedImageSteps] = useState(30);
  const [selectedImageCFG, setSelectedImageCFG] = useState(10);
  const [selectedImageFormat, setImageFormat] = useState("png");
  const [selectedArtStyle, setSelectedArtStyle] = useState("");
  const [selectedThemeGenre, setSelectedThemeGenre] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const imageRef = useRef(null);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setImageUrls([]);
  };

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === imageUrls.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const baseURL = "http://127.0.0.1:80";

  const generateImages = async (text) => {
    setIsLoading(true);
    let newImageUrls = [];

    const selections = [
      selectedArtStyle,
      selectedThemeGenre,
      selectedLocation,
      selectedWeather,
      selectedTechnique,
    ]
      .filter(Boolean)
      .join(", ");

    const fullPrompt = selections.length > 0 ? `${text}, ${selections}` : text;
    try {
      for (let i = 0; i < selectedImageCount; i++) {
        const response = await fetch(`${baseURL}/text2image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            format: selectedImageFormat,
            cfg_scale: selectedImageCFG,
            style_preset: selectedArtStyle,
            steps: selectedImageSteps,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ? data.error : "Response not OK");
        }

        if (data.access_token) {
          dispatch(updateToken(data.access_token));
        }

        enqueueSnackbar("Image generated successfully.", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });

        newImageUrls.push(`data:image/png;base64,${data.image}`);
      }
      setImageUrls(newImageUrls);
      handleOpen();
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "warning",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrls[currentIndex];
    link.download = `Image-${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullScreen = () => {
    if (imageRef.current && imageRef.current.requestFullscreen) {
      imageRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
        );
      });
    } else {
      imageRef.current.classList.add("fullscreen-fallback");
    }
  };

  return (
    <>
      <Prompt
        onGenerate={generateImages}
        isLoading={isLoading}
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={style}
        hideBackdrop
      >
        <>
          <IconButton
            onClick={handleClose}
            size="small"
            color="success"
            style={{
              backgroundColor: "transparent",
              color: "red",
              zIndex: 99,
              position: "absolute",
              marginInlineStart: "95%",
              marginTop: "-20px",
            }}
            disableRipple
          >
            <CancelTwoToneIcon fontSize="small" />
          </IconButton>

          <Stack
            direction={"row"}
            spacing={2}
            height={"100%"}
            sx={{ outline: "none" }}
          >
            <IconButton
              onClick={goToPrevious}
              disabled={!currentIndex}
              color="success"
              style={{
                backgroundColor: "transparent",
                color: !currentIndex ? "#ccc" : "#57ca22",
              }}
              disableRipple
            >
              <NavigateBeforeTwoToneIcon fontSize="large" />
            </IconButton>
            <img
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                objectFit: "fill",
                transition: "transform 0.3s ease",
              }}
              ref={imageRef}
              alt={`generated-art-${currentIndex}`}
              src={imageUrls[currentIndex]}
            />
            <IconButton
              disabled={currentIndex === imageUrls.length - 1}
              onClick={goToNext}
              color="success"
              disableRipple
              style={{
                backgroundColor: "transparent",
                color:
                  currentIndex === imageUrls.length - 1 ? "#ccc" : "#57ca22",
              }}
            >
              <NavigateNextTwoToneIcon fontSize="large" />
            </IconButton>
          </Stack>
          <Divider
            sx={{
              background: "#42494d",
              mt: 1,
            }}
          />
          <Stack direction={"row"} spacing={2} sx={{ p: 0, mb: 2 }}>
            <IconButton
              color="success"
              style={{
                color: "#57ca22",
              }}
              onClick={handleDownload}
            >
              <DownloadTwoToneIcon fontSize="medium" />
            </IconButton>
            <IconButton
              color="success"
              style={{
                color: "#57ca22",
              }}
              onClick={handleFullScreen}
            >
              <FullscreenTwoToneIcon fontSize="medium" />
            </IconButton>
          </Stack>
        </>
      </Modal>
    </>
  );
};

export default ImageGenerator;
