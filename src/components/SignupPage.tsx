import React, { useState } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {
  Select,
  MenuItem,
  Box,
  makeStyles,
  Container,
  Grid,
  Link,
  TextField,
  CssBaseline,
  Button,
  Avatar,
  Typography,
} from "@material-ui/core";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Layout from "./Layout";
import { UserInfo } from "../utils/types";

const Copyright = () => {
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
};

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
    marginTop: theme.spacing(3),
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

const SignupPage: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [genderSelectIsOpen, setGenderSelectIsOpen] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    gender: "M",
    username: "",
    password: "",
  });

  const history = useHistory();

  const handleChange = (event: any) => {
    const { target } = event;
    setUserInfo({
      ...userInfo,
      [target.name]: target.value,
    });
  };

  const handleSignUpSubmit = () => {
    const userObject = {
      name: userInfo.firstName + " " + userInfo.lastName,
      password: userInfo.password,
      gender: userInfo.gender[0],
      username: userInfo.username,
    };
    if (userObject.name.length === 1) {
      alert("Name cannot be empty");
      return;
    }
    if (userObject.password.length === 0) {
      alert("Password cannot be empty");
      return;
    }
    if (userObject.username.length === 0) {
      alert("Username cannot be empty");
      return;
    }
    Axios.post("api/signup", userObject)
      .then((res) => res.data)
      .then((res) => {
        if (res.error) {
          const err = res.error;
          console.error("Error = ", err);
          alert(err);
          return;
        } else {
          const token: string = res.data.token;
          const userInfo = {
            token,
            username: userObject.username,
            name: userObject.name,
            gender: userObject.gender,
          };
          props.loginUser(userInfo);
          history.push("/");
        }
      })
      .catch((err) => {
        console.error("signup error=", err);
      });
  };

  return (
    <Layout pageTitle="Sign up" user={props.user} logoutUser={props.logoutUser}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={userInfo.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={userInfo.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={userInfo.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={userInfo.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              Gender :{" "}
              <Select
                open={genderSelectIsOpen}
                onClose={() => setGenderSelectIsOpen(false)}
                onOpen={() => setGenderSelectIsOpen(true)}
                value={userInfo.gender}
                onChange={handleChange}
                name="gender"
              >
                <MenuItem value={"M"}>Male</MenuItem>
                <MenuItem value={"F"}>Female</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignUpSubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/#/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </Layout>
  );
};

export default SignupPage;
