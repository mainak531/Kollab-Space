import React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  makeStyles,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Layout from "./Layout";
import { UserInfo } from "../utils/types";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  loginUser: (userInfo: UserInfo) => void;
  user: UserInfo | null;
  logoutUser: () => void;
}

interface UserIdPass {
  username: string;
  password: string;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Kollab Space
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const LoginPage: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [userIdPass, setUserIdPass] = React.useState<UserIdPass>({
    username: "",
    password: "",
  });
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "username") {
      setUserIdPass({
        ...userIdPass,
        username: value,
      });
    } else {
      setUserIdPass({
        ...userIdPass,
        password: value,
      });
    }
  };

  const handleLogin = () => {
    if (userIdPass.username.length === 0) {
      alert("Username cannot be empty");
      return;
    }
    if (userIdPass.password.length === 0) {
      alert("Password cannot be empty");
      return;
    }
    Axios.post("/api/login", userIdPass)
      .then((res) => res.data)
      .then((res) => {
        if (res.error) {
          const err = res.error;
          console.error("Error = ", err);
          alert(err.msg);
          return;
        }
        const token: string = res.data.token;
        const userInfo = {
          token,
          username: userIdPass.username,
          name: res.data.name,
          gender: res.data.gender,
        };
        props.loginUser(userInfo);
        history.push("/");
      })
      .catch((err) => {
        console.error("Error = ", err);
      });
  };

  return (
    <Layout pageTitle="Login" user={props.user} logoutUser={props.logoutUser}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href="/#/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          {/* </form> */}
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Layout>
  );
};

export default LoginPage;
