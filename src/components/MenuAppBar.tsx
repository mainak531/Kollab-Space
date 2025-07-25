import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Link, HashRouter as Router } from "react-router-dom";
import { Button, Dropdown } from "semantic-ui-react";
import KollabSpaceLogo from "../assets/kollab_space_logo.png";
import { UserInfo } from "../utils/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

interface Props {
  pageTitle: string;
  user: UserInfo | null;
  logoutUser: () => void;
}

const MenuAppBar: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Router>
          <Toolbar>
            <Dropdown icon="list" floating className="list icon" labeled inline>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Link to="/" style={{ color: "black" }}>
                    Home
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/about" style={{ color: "black" }}>
                    About
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Typography variant="h6" className={classes.title}>
              {props.pageTitle}
            </Typography>
            <img src={KollabSpaceLogo} alt="Logo" height="50" />
            <h1
              style={{
                paddingRight: "1%",
                textDecoration: "none",
              }}
            >
              <a href="/" style={{ color: "white" }}>
                Kollab Space
              </a>
            </h1>
            {!props.user && (
              <div>
                <Link to="/login">
                  <Button size="large" inverted color="blue">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="large" inverted color="violet">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            {props.user && (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <Link to="/profile">
                    <MenuItem
                      onClick={handleClose}
                      style={{
                        color: "black",
                      }}
                    >
                      Profile
                    </MenuItem>
                  </Link>
                  <MenuItem
                    onClick={() => {
                      props.logoutUser();
                      handleClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </Router>
      </AppBar>
    </div>
  );
};

export default MenuAppBar;
