/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import talkThemeBox from "../../assets/talkThemeBox.png";
import "./mainpage.scss";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import destr from "destr";
import { themesArr } from "./themesArr";

import HeartAnimation from "./HeartAnimation";
import HeartBeat from "./heart-beat/HeartBeat";

export const Main = ({ player }) => {
  const themes = themesArr; //locateで値を受け取る
  const [topicId, setTopicId] = useState([]);
  const socketRef = useRef();
  const [player1Name, setPlayr1Name] = useState();
  const [player2Name, setPlayr2Name] = useState();
  const [heartBeatP2, setHeartBeatP2] = useState();
  const [arrThemes, setarrThemes] = useState();
  const [index, setIndex] = useState(0); //初期値を１にすることで、mainpageに遷移した直後のお題を写らないようにする
  const [heartBeatP1, setHeartBeatP1] = useState([]);
  const [player1arrHeartBeat, setplayer1arrHeartBeat] = useState({
    theme0: [],
    theme1: [],
    theme2: [],
    theme3: [],
  });
  const [player2arrHeartBeat, setplayer2arrHeartBeat] = useState({
    theme0: [],
    theme1: [],
    theme2: [],
    theme3: [],
  });

  const heartBeatSet = ["123", "113", "99", "123", "89"];
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);
  const [proIndex, setProIndex] = useState();
  const [player1Done, setPlayer1Done] = useState(false);
  const [player2Done, setPlayer2Done] = useState(false);

  console.log("themes", themes);

  player = "1"; /////////////////////////////////////////////////////戻って選択するのめんどくさいから固定値
  console.log("player", player);
  console.log(`typeofPlayer: ${typeof player}`);

  console.log("heartBeatP1", heartBeatP1);

  

  // #0.WebSocket関連の処理は副作用なので、useEffect内で実装
  useEffect(() => {
    // #1.WebSocketオブジェクトを生成しサーバとの接続を開始
    const websocket = new ReconnectingWebSocket(
      "wss://hartlink-api.onrender.com/ws"
    );
    socketRef.current = websocket;

    websocket.onopen = () => {
      //そのページを開いた瞬間に心拍取得するようにした
      // WebSocket接続が確立されたらメッセージを送信
      socketRef.current?.send("0.0");
    };

    // #2.メッセージ受信時のイベントハンドラを設定
    const onMessage = (event) => {
      // JSON文字列をJavaScriptオブジェクトに変換
      const data = destr(event.data);

      console.log("event.data:", event.data);
      console.log("heartRate2", data.heartRate1);
      console.log("topicId", data.topicId);

      console.log("🚀 ~ onMessage ~ player1Name:", typeof data.player1);

      setPlayr1Name(data.player1);
      setPlayr2Name(data.player2);
      setProIndex(data.index + 1); //data.indexだったら、前の段階の値が帰ってくるから(proindexの値が0から始まる)から無理やり+1にした

      console.log("player1arrHeartBeat", player1arrHeartBeat);

      setHeartBeatP1(data.heartRate1);

      setHeartBeatP2(data.heartRate2);
      console.log("🚀 ~ onMessage ~ heartBeatP2:", player1arrHeartBeat.theme2);

      console.log("🚀 ~ onMessage ~ player2Name:", player2Name);

      console.log("data.topicId", data.topicId[2]);

      setTopicId(data.topicId); //setTopicIdに入れることでws以外の処理で使えるようにした

      setarrThemes(themes[data.topicId[0]].topic); //mainpageに遷移した直後にお題を写るように
    };

    websocket.addEventListener("message", onMessage);

    // #3.useEffectのクリーンアップの中で、WebSocketのクローズ処理を実行
    return () => {
      websocket.close();
      websocket.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(
    () => {
      // heartBeatP1が変更されたときにplayer1arrHeartBeatを更新

      if (heartBeatP1 > 0) {
        setplayer1arrHeartBeat((prev) => ({
          ...prev,
          [`theme${index}`]: [...prev[`theme${index}`], heartBeatP1], // 最新のheartBeatP1でtheme1を更新
        }));
        setplayer2arrHeartBeat((prev) => ({
          ...prev,
          [`theme${index}`]: [...prev[`theme${index}`], heartBeatP2],
        }));
      }
    },
    [heartBeatP1] || [heartBeatP2]
  ); // heartBeatP1を監視

  console.log("1回目");

  console.log("hearBeatP1", player1arrHeartBeat.theme0);
  console.log("hearBeatP1", player1arrHeartBeat.theme1);
  console.log("hearBeatP1", player1arrHeartBeat.theme2);
  console.log("hearBeatP1", player1arrHeartBeat.theme3);

  console.log("hearBeatP2", player2arrHeartBeat.theme0);
  console.log("hearBeatP2", player2arrHeartBeat.theme1);
  console.log("hearBeatP2", player2arrHeartBeat.theme2);
  console.log("hearBeatP2", player2arrHeartBeat.theme3);

  console.log("🚀 ~ topicId.map ~ topicId:", topicId);

  const FinishTheme = () => {
    if (index == topicId.length - 1) {
      setIsDone(true);
      setIndex(index);
    } else {
      console.log("index", index);

      topicId.map((id) => {
        console.log("themes[index].id", themes[id]);
        if (topicId[index + 1] === themes[id].id) {
          console.log("setarrThemes(themes.topicId)", themes[id].topic);
          setarrThemes(themes[id].topic);
        }
      });

      setIndex(index + 1);
    }

    console.log("proIndex", proIndex);

    const data = {
      index: index,
      player: player,
    };
    console.log(`player: ${player}, index: ${index}`);
    console.log(`data : ${typeof index}`);
    fetch("https://hartlink-api.onrender.com/indexTopicId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json()) //json方式でデータを受け取る
      .then((data) => {
        console.log("data:", data);

        console.log("(data.index)", data.index);
      })

      .catch((err) => console.error("Error fetching data:", err));

    console.log("array", player1arrHeartBeat.theme0);
    console.log("index", index);
    console.log("player", player);
    const dataTopicArray = {
      player: player,
      index: index,
      array: player1arrHeartBeat.theme0,
    };

    fetch("https://hartlink-api.onrender.com/topicArray", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataTopicArray),
    })
      .then((res) => res.json()) //json方式でデータを受け取る
      .then((dataTopicArray) => {
        console.log("data:", dataTopicArray);
      })

      .catch((err) => console.error("Error fetching dataTopicArray:", err));

    console.log("array", player1arrHeartBeat.theme0);

    // }); //indexが配列の現在地点を指してる
  };

  const FinishMeasuring = () => {
    //5秒後にリザルト画面に飛ばす
    useEffect(() => {
      fetch("https://hartlink-api.onrender.com/indexTopicId", { method: "GET" })
        .then((res) => res.json()) //json方式でデータを受け取る
        .then((data) => {
          console.log("data:", data);
        })

        .catch((err) => console.error("Error fetching data:", err));

      console.log("useEffect called");
      const timer = setTimeout(() => {
        navigate("/result", { player1: player1Name, player2: player2Name });
      }, 5 * 1000);
      return () => {
        console.log("cleanUp");
        clearTimeout(timer);
      };
    }, [isDone]);

    return (
      <>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <HeartAnimation />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "-1",
              width: "100vw",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "2rem",
              }}
            >
              おわり！
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
              }}
            >
              あなたたちの相性は...
            </Typography>
          </Box>
        </Box>
      </>
    );
  };

  const Measuring = () => {
    return (
      <>
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: "8vw",
              mt: "20%",
            }}
          >
            計測中
          </Typography>
          <Box
            sx={{
              mt: "10%",
              overflow: "hidden",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="mySwiper"
            >
              <SwiperSlide>
                <HeartBeat speed={1} />

                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: "7vw",
                    }}
                  >
                    {player1Name}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      mt: "0vh",
                      fontSize: "3rem",
                    }}
                  >
                    {heartBeatP1}
                  </Typography>
                </Box>
              </SwiperSlide>
              <SwiperSlide>
                <HeartBeat speed={1} />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: "7vw",
                    }}
                  >
                    {player2Name}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      mt: "0vh",
                      fontSize: "3rem",
                    }}
                  >
                    {heartBeatP2}
                  </Typography>
                </Box>
              </SwiperSlide>
            </Swiper>
          </Box>
          <Box
            sx={{
              minWidth: 0,
              overflow: "hidden",
              m: "0 auto 0 5vw",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={talkThemeBox}
              style={{
                width: "100%",
                height: "auto",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              {/* {arrThemes.map((topic) => ( */}
              <Typography
                variant="body1"
                sx={{
                  fontSize: "7vw",
                  width: "70vw",
                }}
              >
                {arrThemes}
              </Typography>
              {/* ))} */}
            </Box>
          </Box>
          <Typography
            variant="body1"
            component={motion.div}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            transition={{}}
            onClick={() => FinishTheme()}
            sx={{
              fontSize: "5vw",
              pt: "2vh",
            }}
          >
            完了
          </Typography>
        </Box>
      </>
    );
  };

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }} //初期
        animate={{ opacity: 1 }} //表示される時
        exit={{ opacity: 1 }} //ページを離れる時の動き
        transition={{ duration: 1 }}
        sx={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {isDone ? <FinishMeasuring /> : <Measuring />}
      </Box>
    </>
  );
};
