import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Button,
  Card,
  Grid,
  Header,
  Input,
  Label,
  Modal,
  TextArea,
  Accordion,
  Form,
  Comment,
  Segment
} from "semantic-ui-react";
import CSS from "csstype";
import { UserInfo, RoomDetails } from "../utils/types";
import Message from "./Message";

const ICON_NUMBER = Math.ceil(Math.random() * 10);

const roomButtonStyle: CSS.Properties = {
  margin: "2%",
  marginRight: "3%",
};

const ChatBoxStyle: CSS.Properties = {
  border: "2px",
  marginRight: "10%",
};

interface Props {
  user: UserInfo | null;
  socket: SocketIOClient.Socket | null;
  room: RoomDetails | null;
  chatMessageList: Array<any>;
  leaveChatRoom: (avatarInfo: { id: number; gender: string }) => void;
}

const ChatBox: React.FC<Props> = (props) => {
  const [accordionActive, setAccordionActive] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [inviteCodeCopied, setInviteCodeCopied] = useState<boolean>(false);
  const [invitationTextCopied, setInvitationTextCopied] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { socket } = props;
  const currentRoom = props.room;
  const chatMessageList = props.chatMessageList;
  const gender = props?.user?.gender || "";

  const avatarInfo: { gender: string; id: number } = useMemo(() => {
    return {
      gender,
      id: ICON_NUMBER || -1,
    };
  }, [gender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessageList]);

  const handleCreateRoom = () => {
    if (!socket) return;

    socket.emit("createNewRoom", {
      user: props.user,
    });

    socket.on("createdNewRoom", (data: any) => {
      socket.emit("joinChatRoom", {
        user: props.user,
        room: data,
        avatarInfo,
      });
    });
  };

  const handleJoinRoom = (e: any) => {
    if (!socket) return;

    const roomName: string = e.target.idInputField.value;
    const roomPassword: string = e.target.passwordInputField.value;
    const room = { roomName, roomPassword };

    socket.emit("joinChatRoom", {
      user: props.user,
      room,
      avatarInfo,
    });
  };

  const sendChatMessage = (event: any) => {
    event.preventDefault();
    if (!socket) return;

    const message = event.target.chatInputBox.value;
    if (!message.trim()) return;

    socket.emit("newMessage", {
      user: props.user,
      message,
      room: currentRoom,
      avatarInfo,
    });

    event.target.chatInputBox.value = "";
    setIsTyping(false);
  };

  const handleLeaveChatRoom = () => {
    props.leaveChatRoom(avatarInfo);
  };

  const handleJoinViaCode = (event: React.FormEvent<HTMLFormElement> | any) => {
    if (!socket) return;

    const inviteCode = event.target.inviteCodeInputField.value;
    socket.emit("joinRoomViaInviteCode", {
      inviteCode,
      user: props.user,
      avatarInfo,
    });

    socket.on("Invalid room invite code", () => {
      alert("Invalid room invite code");
    });
  };

  const invitationMessage = () => {
    return `Come join me on Kollab Space at ${window.location.href}.\nJoin my chatroom using these credentials :-\nID : ${currentRoom?.name} \nPassword: ${currentRoom?.password}`;
  };

  return (
    <div style={ChatBoxStyle}>
      <Modal
        dimmer="blurring"
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      >
        <Modal.Header>Invite your friends</Modal.Header>
        <Modal.Content>
          <Header as="h4">Invite via credentials</Header>
          <label>Share this message with your friends</label>
          <br />
          <Grid>
            <Grid.Column width={10}>
              <Form>
                <TextArea
                  defaultValue={invitationMessage()}
                  readOnly
                  rows={3}
                />
              </Form>
            </Grid.Column>
            <Grid.Column>
              <Button
                color="teal"
                icon="copy"
                onClick={() => {
                  setInvitationTextCopied(true);
                  setInviteCodeCopied(false);
                  navigator.clipboard.writeText(invitationMessage());
                }}
              />
              {invitationTextCopied && (
                <Label basic color="green" pointing="above">
                  Copied
                </Label>
              )}
            </Grid.Column>
          </Grid>

          <Header as="h4">Invite via Code</Header>
          <label>Share this invitation code with your friends:</label>
          <Input action defaultValue={currentRoom?.inviteCode} readOnly>
            <input readOnly />
            <Button
              color="teal"
              icon="copy"
              onClick={() => {
                setInviteCodeCopied(true);
                setInvitationTextCopied(false);
                navigator.clipboard.writeText(currentRoom?.inviteCode || "");
              }}
            />
          </Input>
          {inviteCodeCopied && (
            <Label basic color="green" pointing="left">
              Copied
            </Label>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setModalIsOpen(false)}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>

      {!currentRoom && props.user && (
        <div style={{ marginRight: "2%" }}>
          <Accordion>
            <Accordion.Title>
              <Button.Group widths={2}>
                <Button
                  fluid
                  color="teal"
                  style={roomButtonStyle}
                  onClick={() => setAccordionActive(!accordionActive)}
                >
                  Join Room
                </Button>
                <Button
                  fluid
                  color="blue"
                  onClick={handleCreateRoom}
                  style={roomButtonStyle}
                >
                  Create Room
                </Button>
              </Button.Group>
            </Accordion.Title>
            <Accordion.Content active={accordionActive}>
              <Form onSubmit={handleJoinRoom}>
                Enter Room Details
                <Form.Field>
                  <label>ID</label>
                  <input name="idInputField" placeholder="Room ID" type="text" />
                </Form.Field>
                <Form.Field>
                  <label>Password</label>
                  <input
                    name="passwordInputField"
                    placeholder="Password"
                    type="password"
                  />
                </Form.Field>
                <Button type="submit">Submit</Button>
              </Form>
              <br />
              <div style={{ textAlign: "center" }}>
                <b>OR</b>
              </div>
              <br />
              <Form onSubmit={handleJoinViaCode}>
                <Form.Field>
                  <label>Enter Invite Code:</label>
                  <input
                    placeholder="Invitation Code"
                    type="text"
                    name="inviteCodeInputField"
                  />
                </Form.Field>
                <Button type="submit">Join via Code</Button>
              </Form>
            </Accordion.Content>
          </Accordion>
        </div>
      )}

      {props.user && currentRoom && (
        <div>
          <Card style={{ margin: "5%", marginRight: 0, padding: "5%" }}>
            <Card.Content>
              <Card.Header>Chat Room</Card.Header>
              <Card.Description>
                ID : {currentRoom.name}
                <br />
                Password : {currentRoom.password}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button basic color="green" onClick={() => setModalIsOpen(true)}>
                  Invite
                </Button>
                <Button basic color="red" onClick={handleLeaveChatRoom}>
                  Leave
                </Button>
              </div>
            </Card.Content>
          </Card>

          <Segment raised style={{ overflow: "auto", maxHeight: window.innerHeight / 2 }}>
            <Comment.Group>
              {chatMessageList.map((item) => {
                const { eventMessage, timestamp, message } = item;
                return (
                  <Message
                    {...item}
                    key={`${eventMessage || message}_${props.user?.username}_${timestamp.toString()}`}
                  />
                );
              })}
              {isTyping && (
                <div style={{ padding: "0.5rem", fontStyle: "italic", color: "gray" }}>
                  You are typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </Comment.Group>

            <Form reply onSubmit={sendChatMessage} autoComplete="off">
              <Form.Input
                placeholder="Type your message here"
                name="chatInputBox"
                autoComplete="off"
                onChange={() => {
                  setIsTyping(true);
                  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                  typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
                }}
              />
              <Button content="Send" labelPosition="left" icon="edit" primary type="submit" />
            </Form>
          </Segment>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

