import React from "react";
import { Feed, Comment } from "semantic-ui-react";

interface Props {
  type: string;
  timestamp: Date;
  eventMessage: string;
  user: any;
  message: string;
  avatarInfo: {
    id: number;
    gender: string;
  }
}

const Message: React.FC<Props> = ({
  type, timestamp, eventMessage, user, message, avatarInfo
}) => {
  if (type === "event") {
    let avatar: any;
    const { gender, id } = avatarInfo;
    if (gender[0] === "M") {
      avatar = require("../assets/male_avatars/" + id + ".svg");
    } else {
      avatar = require("../assets/female_avatars/" + id + ".svg");
    }

    return (
      <Feed>
        <Feed.Event>
          <Feed.Label image={avatar} alt={"img"} />
          <Feed.Content
            date={
              (timestamp.getHours() % 12) +
              ":" +
              (timestamp.getMinutes() <= 9 ? "0" : "") +
              timestamp.getMinutes() +
              ` ` +
              (timestamp.getHours() >= 12 ? "PM" : "AM")
            }
            summary={eventMessage}
          />
        </Feed.Event>
      </Feed>
    );
  } else {
    const { gender, id } = avatarInfo;
    let avatar: any;
    if (gender[0] === "M") {
      avatar = require("../assets/male_avatars/" + id + ".svg");
    } else {
      avatar = require("../assets/female_avatars/" + id + ".svg");
    }
    return (
      <Comment>
        <Comment.Avatar as="a" src={avatar} alt={"img"} />
        <Comment.Content>
          <Comment.Author>{user.name}</Comment.Author>
          <Comment.Metadata>
            <div>
              {timestamp.getHours() % 12}:
              {timestamp.getMinutes() <= 9 ? "0" : ""}
              {timestamp.getMinutes() + ` `}{" "}
              {timestamp.getHours() >= 12 ? "PM" : "AM"}
            </div>
          </Comment.Metadata>
          <Comment.Text>{message}</Comment.Text>
        </Comment.Content>
      </Comment>
    );
  }
}

export default Message;
