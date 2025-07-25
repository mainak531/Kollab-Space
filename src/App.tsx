import React from "react";
import Axios from "axios";
import MainPage from "./components/MainPage";

interface UserInfo {
  token: string;
  username: string;
  name: string;
  gender: string;
}

interface Props {}

const App: React.FC<Props> = (props) => {
  const [user, setUser] = React.useState<UserInfo | null>(null);

  React.useEffect(() => {
    const token: string | null = localStorage.getItem("kollabUserToken");
    if (token) {
      Axios.get("/api/login", {
        params: {
          token,
        },
      })
        .then((response) => {
          if (response.data.errors) {
            console.error(response.data.errors);
            return;
          }
          const data = response.data;
          const userInfo: UserInfo = {
            token,
            name: data.name,
            username: data.username,
            gender: data.gender,
          };
          loginUser(userInfo);
        })
        .catch((err) => {
          console.error("Error = ", err);
        });
    }
  }, []);

  function loginUser(userInfo: UserInfo) {
    setUser(userInfo);
    localStorage.setItem("kollabUserToken", userInfo.token);
  }

  function logoutUser() {
    setUser(null);
    localStorage.removeItem("kollabUserToken");
  }

  return <MainPage user={user} loginUser={loginUser} logoutUser={logoutUser} />;
};

export default App;
