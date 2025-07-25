import React from "react";
import ChatBox from "./ChatBox";
import Layout from "./Layout";
import { Grid } from "@material-ui/core";
import CodeEditor from "./CodeEditor";
import { UserInfo, RoomDetails } from "../utils/types";

interface Props {
  user: UserInfo | null;
  socket: SocketIOClient.Socket | null;
  room: RoomDetails | null;
  chatMessageList: Array<any>;
  logoutUser: () => void;
  leaveChatRoom: (avatarInfo: { id: number; gender: string }) => void;
}

const HomePage: React.FC<Props> = (props) => {
  return (
    <Layout pageTitle="Home" user={props.user} logoutUser={props.logoutUser}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <CodeEditor
            user={props.user}
            socket={props.socket}
            room={props.room}
          />
        </Grid>
        <Grid item xs={3}>
          <ChatBox
            user={props.user}
            socket={props.socket}
            room={props.room}
            chatMessageList={props.chatMessageList}
            leaveChatRoom={props.leaveChatRoom}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;
