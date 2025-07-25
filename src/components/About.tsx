import React from "react";
import Layout from "./Layout";
import MailIcon from "../assets/mail_icon.png";
import GithubIcon from "../assets/github_icon.png";
import LinkedInIcon from "../assets/linkedin_logo.png";
import { Button, Header } from "semantic-ui-react";
import { UserInfo } from "../utils/types";

interface Props {
  user: UserInfo | null;
  logoutUser: () => void;
}

const About: React.FC<Props> = (props) => {
  return (
    <Layout pageTitle="About" user={props.user} logoutUser={props.logoutUser}>
      <div
        style={{
          fontSize: "20px",
          margin: "2%",
          padding: "4%",
          textAlign: "center",
        }}
      >
        <Header
          as="h1"
          style={{ fontSize: "40px", textDecoration: "underline" }}
        >
          Kollab Space
        </Header>
        <p>
          <strong style={{ fontSize: "24px" }}>About the project</strong>
          <br />
          Kollab Space is a non-profit project created by an individual
          developer solely for educational purposes. This website/project is in
          no way affiliated with any organisation whatsoever. The entire purpose
          of building this project is for the developer to practice and showcase
          his skills. <br />
          The entire project code is open source. You can view it here - <br />
          <a
            href={"https://github.com/tarunluthra123/Kollab-Space"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            <Button color="olive">Project repository</Button>
          </a>
        </p>
        <br />
        <p>
          <strong style={{ fontSize: "24px" }}>Info</strong>
          <br />
          Kollab Space is a tool for students / teachers / developers /
          colleagues to connect and work together. The project aims to increase
          work productivity by providing essential tools with a sophisticated
          UI.
          <br />
        </p>
        <br />
        <p>
          <strong style={{ fontSize: "24px" }}>Contact the Developer</strong>
          <br />
          Feel free to drop any suggestions or queries.
          <br />
          <img src={MailIcon} alt={"Mail"} width={30} />
          {"  "}
          <a
            href={"mailto:tarunluthra987@gmail.com"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            tarunluthra987@gmail.com
          </a>
          <br />
          {/*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
          <img src={GithubIcon} alt={"Github"} width={30} />
          {"  "}
          <a
            href={"https://github.com/tarunluthra123"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            tarunluthra123
          </a>
          <br />
          <img src={LinkedInIcon} alt={"LinkedIn"} width={28} />
          {"  "}
          <a
            href={"https://www.linkedin.com/in/tarunluthra123/"}
            target={"_blank"}
            rel="noopener noreferrer"
          >
            tarunluthra123
          </a>
          <br />
          <br />
          Or checkout my{" "}
          <a href="http://tarunluthra123.github.io/">
            <Button color="teal">Portfolio</Button>
          </a>
        </p>
      </div>
    </Layout>
  );
};

export default About;
