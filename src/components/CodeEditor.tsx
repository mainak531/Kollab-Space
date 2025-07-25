import React, { useState, useEffect, useRef } from "react";
import AceEditor from "react-ace";
import {
  Grid,
  Segment,
  Select,
  DropdownProps,
  Radio,
  Dropdown,
} from "semantic-ui-react";

import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-handlebars";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";

import { UserInfo, RoomDetails } from "../utils/types";

interface Props {
  user: UserInfo | null;
  socket: SocketIOClient.Socket | null;
  room: RoomDetails | null;
}

const CodeEditor: React.FC<Props> = (props) => {
  const [code, setCode] = useState<string>("");
  const [editorLanguage, setEditorLanguage] = useState<string>("javascript");
  const [editorTheme, setEditorTheme] = useState<string>("monokai");
  const [editorFontSize, setEditorFontSize] = useState<number>(18);
  const [enableAutocomplete, setEnableAutocomplete] = useState<boolean>(true);
  const [lastCursorUpdate, setLastCursorUpdate] = useState({ r: -1, c: -1 });
  const [recentlyUpdatedCode, setRecentlyUpdatedCode] = useState(false);
  const editorRef: any = useRef();
  const currentRoom = props.room;

  const socket: SocketIOClient.Socket|null = props.socket;

  useEffect(() => {
    if (!socket) return;

    socket.on("codeUpdate", (data: any) => {
      const newCode = data.code;
      if (newCode === code) return;
      if (data.user?.username === props.user?.username) return;
      setCode(newCode);
      setRecentlyUpdatedCode(true);
      if (data.cursorPosition && editorRef && editorRef.current) {
        const editor = editorRef.current.editor;
        editor.moveCursorToPosition(data.cursorPosition);
      }
    });

    socket.on("cursorPositionUpdate", (data: any) => {
      if (editorRef && editorRef.current) {
        const editor = editorRef.current.editor;
        const currentPosition = editor?.getCursorPosition();
        if (
          data.row === currentPosition.row &&
          data.column === currentPosition.column
        ) {
          return;
        }
        setLastCursorUpdate({ r: data.row, c: data.column });
        editor?.moveCursorToPosition(data);
      }
    });

    socket.on("languageTagUpdate", (data: { lang: string }) => {
      const newLanguage = data.lang;
      if (editorLanguage === newLanguage) return;
      setEditorLanguage(newLanguage);
    });

    return () => {
      socket.off("codeUpdate");
      socket.off("cursorPositionUpdate");
      socket.off("languageTagUpdate");
    }
  });

  const onChange = (codeValue: string, event: any) => {
    console.log({ codeValue, event, recentlyUpdatedCode, code, socket })
    if (codeValue === code) return;
    // if (recentlyUpdatedCode) return;
    setRecentlyUpdatedCode(false);
    const cursorPosition = event.end;
    setCode(codeValue);

    if (socket) {
      socket.emit("codeChange", {
        code: codeValue,
        user: props.user,
        room: currentRoom,
        cursorPosition,
      });
    }
  };

  const handleLanguageTagChange = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    if (typeof data.value === "string" && socket) {
      setEditorLanguage(data.value);
      socket.emit("languageChange", {
        lang: data.value,
        room: currentRoom,
      });
    }
  };

  const handleCursorChange = (value: any, event?: any) => {
    const { row, column } = value.cursor;
   if (lastCursorUpdate.r === row && lastCursorUpdate.c === column) {
      return;
    }
    if (socket)
      socket.emit("cursorChange", {
        row,
        column,
        room: currentRoom,
      });
  };

  return (
    <Grid divided="vertically">
      <Grid.Row columns={2}>
        <Grid.Column>
          <AceEditor
            placeholder={editorLanguage}
            mode={editorLanguage}
            theme={editorTheme}
            name="codeEditor"
            onChange={onChange}
            onCursorChange={handleCursorChange}
            fontSize={editorFontSize}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={code}
            enableBasicAutocompletion={enableAutocomplete}
            enableLiveAutocompletion={enableAutocomplete}
            enableSnippets={enableAutocomplete}
            ref={editorRef}
            setOptions={{
              tabSize: 2,
            }}
            width="130%"
            height={window.innerHeight * (9 / 10) + "px"}
          />
        </Grid.Column>

        <Grid.Column>
          <Segment
            raised
            style={{
              margin: "1%",
              padding: "2%",
              marginLeft: "30%",
            }}
          >
            <h3
              style={{
                alignContent: "center",
              }}
            >
              Editor Options
            </h3>
            <div style={{ margin: "0.7%" }}>
              Language : {` `}
              <Dropdown
                selection
                placeholder="Language"
                onChange={handleLanguageTagChange}
                value={editorLanguage}
                options={[
                  {
                    key: "javascript",
                    value: "javascript",
                    text: "Javascript",
                  },
                  { key: "java", value: "java", text: "Java" },
                  { key: "python", value: "python", text: "Python" },
                  { key: "markdown", value: "markdown", text: "Markdown" },
                  { key: "mysql", value: "mysql", text: "Mysql" },
                  { key: "json", value: "json", text: "Json" },
                  { key: "html", value: "html", text: "Html" },
                  {
                    key: "handlebars",
                    value: "handlebars",
                    text: "Handlebars",
                  },
                  { key: "css", value: "css", text: "Css" },
                ]}
              />
            </div>
            <div style={{ margin: "0.7%" }}>
              Theme :{" "}
              <Select
                placeholder="Theme"
                defaultValue={editorTheme}
                onChange={(
                  event: React.SyntheticEvent<HTMLElement, Event>,
                  data: DropdownProps
                ) => {
                  if (typeof data.value === "string")
                    setEditorTheme(data.value);
                }}
                options={[
                  { key: "monokai", value: "monokai", text: "Monokai" },
                  { key: "github", value: "github", text: "Github" },
                  { key: "tomorrow", value: "tomorrow", text: "Tomorrow" },
                  { key: "kuroir", value: "kuroir", text: "Kuroir" },
                  { key: "twilight", value: "twilight", text: "Twilight" },
                  { key: "xcode", value: "xcode", text: "Xcode" },
                  { key: "textmate", value: "textmate", text: "Textmate" },
                  {
                    key: "solarized light",
                    value: "solarized_light",
                    text: "Solarized Light",
                  },
                  {
                    key: "solarized dark",
                    value: "solarized_dark",
                    text: "Solarized Dark",
                  },
                  { key: "terminal", value: "terminal", text: "Terminal" },
                ]}
              />
            </div>
            <div style={{ margin: "0.7%" }}>
              Font Size : {` `}
              <Select
                placeholder="Font Size"
                defaultValue={editorFontSize}
                onChange={(
                  event: React.SyntheticEvent<HTMLElement, Event>,
                  data: DropdownProps
                ) => {
                  if (typeof data.value === "number") {
                    setEditorFontSize(data.value);
                  }
                }}
                options={[
                  { key: "14", value: 14, text: "14" },
                  { key: "16", value: 16, text: "16" },
                  { key: "18", value: 18, text: "18" },
                  { key: "20", value: 20, text: "20" },
                  { key: "24", value: 24, text: "24" },
                  { key: "28", value: 28, text: "28" },
                  { key: "32", value: 32, text: "32" },
                  { key: "40", value: 40, text: "40" },
                ]}
              />
            </div>
            <div
              style={{
                verticalAlign: "middle",
                paddingTop: "2%",
                marginTop: "2%",
              }}
            >
              <div
                className="radio-block"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {" "}
                <label
                  className="radio-label"
                  style={{
                    marginRight: "2%",
                  }}
                >
                  Autocomplete : &nbsp;
                </label>
                <Radio
                  toggle
                  checked={enableAutocomplete}
                  onChange={(e, d) => {
                    if (typeof d.checked == "boolean")
                      setEnableAutocomplete(d.checked);
                  }}
                />
              </div>
            </div>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default CodeEditor; 

