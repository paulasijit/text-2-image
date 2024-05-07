import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import { useSnackbar } from "notistack";
import { updateToken } from "./redux/action";
import { useDispatch } from "react-redux";
import { Card, Container, Stack, Typography, styled } from "@mui/material";
import { TextareaAutosize } from '@mui/base';

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
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

const Translate = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [translatedNegativeText, setTranslatedNegativeText] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const baseURL = "http://127.0.0.1:80";

  const translateText = async (text, negativeText) => {
    setIsLoading(true);
    setIsTranslating(true);

    try {
      const response = await fetch(`${baseURL}/translation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ text: `${text}` }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg ? data.msg : "Translation API response not OK",
        );
      }

      if (data.access_token) {
        console.log("token refreshed");
        dispatch(updateToken(data.access_token));
      }

      setTranslatedText(data.translated_text);
      enqueueSnackbar("Translation done successfully!", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });

      if (negativeText) {
        const sec_response = await fetch(`${baseURL}/translation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ text: `${negativeText}` }),
        });

        const sec_data = await sec_response.json();

        if (!sec_response.ok) {
          throw new Error(
            sec_data.msg ? sec_data.msg : "Translation API response not OK",
          );
        }
        if (sec_data.access_token) {
          dispatch(updateToken(sec_data.access_token));
        }
        setTranslatedNegativeText(sec_data.translated_text);
        enqueueSnackbar("Negative translation done successfully!", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } finally {
      setIsTranslating(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Prompt
        onGenerate={translateText}
        isLoading={isLoading}
      />
      {translatedText && (<Container style={{ position: 'relative' }} sx={{ marginBottom: 5, maxWidth: '95% !important' }}>
        <Card sx={{ p: 2, bgcolor: "#57637526", border: "1px solid #30374180" }}>
          <Stack direction="column" sx={{ width: "100%" }} spacing={2}>
            <Typography variant="h3" gutterBottom sx={{ fontSize: "0.975rem", color: "#fff", fontWeight: 700, }}>
              Translated Text
            </Typography>
            <CustomTextBox
              maxRows={3}
              minRows={3}
              id="prompt"
              defaultValue={translatedText}
              disabled
            />
          </Stack>
        </Card>
      </Container>)}
      {translatedNegativeText && (
        <Container style={{ position: 'relative' }} sx={{ marginTop: 3, marginBottom: 5, maxWidth: '95% !important', height: { xs: "13%", md: "calc(95vh - 120px)", } }}>
          <Card sx={{ p: 2, bgcolor: "#57637526", border: "1px solid #30374180" }}>
            <Stack direction="column" sx={{ width: "100%" }} spacing={2}>
              <Typography variant="h3" gutterBottom sx={{ fontSize: "0.975rem", color: "#fff", fontWeight: 700, }}>
                Translated Negative Prompt
              </Typography>
              <CustomTextBox
                maxRows={8}
                minRows={8}
                id="translated-prompt"
                defaultValue={translatedNegativeText}
                disabled
              />
            </Stack>
          </Card>
        </Container>
      )}
    </>
  );
};

export default Translate;
