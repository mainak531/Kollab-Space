import React, { useState, useEffect, useRef, useCallback } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import About from "./About";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import socketIOClient from "socket.io-client";
import { UserInfo, RoomDetails } from "../utils/types";

const ENDPOINT = process.env.REACT_APP_WEBSITE_URL || "http://127.0.0.1:7483";

interface RoomJoinNotification {
  notification: string;
  user: UserInfo;
  room: RoomDetails;
  avatarInfo: { id: number; gender: string };
}

interface ChatMessage {
  user: UserInfo;
  message: string;
  avatarInfo: { id: number; gender: string };
}

interface Props {
  user: UserInfo | null;
  loginUser: (userInfo: UserInfo) => void;
  logoutUser: () => void;
}

const MainPage: React.FC<Props> = (props) => {
  const [currentRoom, setCurrentRoom] = useState<RoomDetails | null>(null);
  const [chatMessageList, setChatMessageList] = useState<Array<any>>([]);
  const socketRef = useRef<SocketIOClient.Socket|null>(null);
  const socket = socketRef.current;

  const addFeedEventToChat = useCallback((
    eventMessage: string,
    avatarInfo: { id: number; gender: string }
  ) => {
    const timestamp = new Date();
    const feedEvent = { type: "event", eventMessage, timestamp, avatarInfo };
    setChatMessageList([...chatMessageList, feedEvent]);
  }, [chatMessageList, setChatMessageList]);

  const addMessageToChat = useCallback((
    user: UserInfo,
    message: string,
    avatarInfo: { id: number; gender: string }
  ) => {
    const timestamp = new Date();
    const comment = { type: "comment", user, message, timestamp, avatarInfo };
    setChatMessageList([...chatMessageList, comment]);
  }, [chatMessageList, setChatMessageList]);

  useEffect(() => {
    if (socketRef.current === null) {
      const socket = socketIOClient(ENDPOINT);
      socketRef.current = socket;
    }
  }, []);

  useEffect(() => {
    if (socket === null) return;

    console.log("here")
    socket.on("messageReceived", (data: ChatMessage) => {
      const { user, message, avatarInfo } = data;
      addMessageToChat(user, message, avatarInfo);
      console.log("message=", message);
    });

    socket.on("roomJoinNotification", (data: RoomJoinNotification) => {
      const notification = data.notification;
      console.log(notification);
      if (notification === "New Participant") {
        const newUser: UserInfo = data.user;
        if (props.user?.token === newUser.token) {
          //New user is the current user himself
          setCurrentRoom({
            name: data.room.name,
            password: data.room.password,
            inviteCode: data.room.inviteCode,
          });
        } else {
          const { avatarInfo } = data;
          addFeedEventToChat(
            newUser.name + " has joined the chatroom.",
            avatarInfo
          );
        }
      } else if (notification === "Participant Left") {
        const { avatarInfo, user: oldUser } = data;
        addFeedEventToChat(oldUser.name + " left the chatroom.", avatarInfo);
      }
    });

    socket.on("Room does not exist", () => {
      alert("No room with this ID exists.");
    });

    socket.on("Incorrect room password", () => {
      alert("Incorrect room password");
    });

    return () => {
      socket.off("messageReceived");
      socket.off("roomJoinNotification");
      socket.off("Room does not exist");
      socket.off("Incorrect room password");
    };

  }, [socket, props.user, setCurrentRoom, setChatMessageList, addMessageToChat, addFeedEventToChat]);

  const leaveChatRoom = (avatarInfo: { id: number; gender: string }) => {
    if (socket === null) return;
    socket.emit("leaveChatRoom", {
      user: props.user,
      room: currentRoom,
      avatarInfo,
    });
    setCurrentRoom(null);
  };

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage
              user={props.user}
              socket={socket}
              room={currentRoom}
              chatMessageList={chatMessageList}
              logoutUser={props.logoutUser}
              leaveChatRoom={leaveChatRoom}
            />
          </Route>
          <Route exact path="/about" component={About}>
            <About user={props.user} logoutUser={props.logoutUser} />
          </Route>
          <Route exact path="/login" component={LoginPage}>
            <LoginPage
              loginUser={props.loginUser}
              user={props.user}
              logoutUser={props.logoutUser}
            />
          </Route>
          <Route exact path="/signup" component={SignupPage}>
            <SignupPage
              loginUser={props.loginUser}
              user={props.user}
              logoutUser={props.logoutUser}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default MainPage;
