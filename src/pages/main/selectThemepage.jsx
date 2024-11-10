/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography, Stack, Modal } from "@mui/material";
import HeartImg from "../../assets/kkrn_icon_heart_3.png";
import {themesArr} from "./themesArr";


export const SelectTheme = ({ player }) => {
  const themes = themesArr;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [SelectedTopic, setSelectedTopic] = useState(null); //選択したtopic
  const [SelectedId, setSelectedId] = useState(); //選択したid

  const handleOpen = (theme) => {
    setOpen(true);
    setSelectedTopic(theme.topic);
    setSelectedId(theme.id);
  };
  const handleClose = () => setOpen(false);

  const [eventSelect, setEventSelect] = useState([]); //player1
  const [oddSelect, setOddSelect] = useState([]); //player2

  useEffect(() => {
    setEventSelect(themes.filter((theme) => theme.id % 2 == 0));

    setOddSelect(themes.filter((theme) => theme.id % 2 != 0));
  }, []);

  const selectPlayer = player == "Player1" ? eventSelect : oddSelect; //playerが１か２の時でselectPlayerに入れる値を変える

  const playerSelect = player == "Player1" ? 1 : 2; //player1の時は1,player2の時は2が帰ってくる

  const ClickYes = (id) => {
    console.log("theme", themes);
    console.log("theme", typeof themes);
    navigate("/main", { state: themes });

    const data = { player: playerSelect, id: id };

    console.log("ただいま、メールを送信してます", data);
    console.log("id", id);
    const url = "https://hartlink-api.onrender.com/topicId";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("ネットワーク応答が正常ではありません");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Box flexDirection="row" textAlign="center" justifyContent="center">
          <Typography
            variant="h1"
            sx={{
              fontSize: "2rem",
              mt: "15vh",
              mb: "5vh",
            }}
          >
            お題
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: "1rem",
              mt: "5vh",
              mb: "5vh",
            }}
          >
            お題を一つ選択してね♡
          </Typography>
          <Stack
            direction="column"
            spacing={0}
            sx={{
              width: "98vw",
            }}
          >
            {selectPlayer.map((theme, index) => (
              <Box
                key={theme.id}
                display="flex"
                flexDirection="row"
                justifyContent="center"
                onClick={() => handleOpen(theme)}
                sx={{
                  borderTop: "5px solid #FFFFFF",
                  borderBottom:
                    index == selectPlayer.length - 1
                      ? "5px solid #FFFFFF"
                      : "none",
                  py: "4vh",
                  px: "1vw",
                  cursor: "pointer",
                }}
              >
                <img
                  src={HeartImg}
                  style={{
                    objectFit: "contain",
                    width: "2rem",
                  }}
                  alt={`Theme ${index + 1}`}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.5rem",
                    textAlign: "start",
                    pl: "0.5rem",
                    pb: "5px",
                    width: "35rem",
                  }}
                >
                  {theme.topic}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Modal
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "75vw",
            maxWidth: "400px",
            maxHeight: "200px",
            bgcolor: "background.paper",
            border: "3px solid #FF4BB7",
            borderRadius: "30px",
            px: "5vw",
            py: "5vh",
          }}
        >
          <Typography
            variant="p"
            sx={{
              fontSize: "1.2rem",
            }}
          >
            選択したのは
          </Typography>
          <Typography
            sx={{
              mt: "2vw",
              fontSize: { xs: "1.5rem", lg: "2rem", xl: "2rem" },
            }}
          >
            『{SelectedTopic}』
          </Typography>
          <Stack
            direction="row"
            spacing={4}
            sx={{
              mt: "1rem",
              justifyContent: "center",
            }}
          >
            <Typography
              component={motion.div}
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.8,
              }}
              onClick={() => ClickYes(SelectedId)}
              variant="p"
              sx={{
                fontSize: "1.5rem",
                borderBottom: "2px solid #FF6BBE",
                color: "#FF6BBE",
              }}
            >
              Yes
            </Typography>
            <Typography
              component={motion.div}
              whileHover={{
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.8,
              }}
              onClick={handleClose}
              variant="p"
              sx={{
                fontSize: "1.5rem",
                borderBottom: "2px solid #6B75FF",
                color: "#6B75FF",
              }}
            >
              No
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};
