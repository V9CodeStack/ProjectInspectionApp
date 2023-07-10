import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/navIndex";
import DelayedText from "../DelayedText/DelayedText";
import "./homeIndex.css";

const Home = () => {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowList(true);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const listContent = () => {
    return (
      <div className="ul-container">
        <ul>
          <li className="list">
            With this App, you can receive feedback anonymously from your Team.
          </li>
          <li className="list">
            To manage the app, click on "Manager" and create a group name. A
            unique group ID will be generated. Copy the group ID and send it to
            your team.
          </li>
          <li className="list">
            Your team members can access the "Team" section and activate the
            Group ID to provide their feedback.
          </li>
          <li className="list">
            You do not need to manually refresh the page because it will
            automatically refresh every 5 seconds.
          </li>
          <li className="list">
            Once your team has finished providing feedback, you can download the
            content as a PDF.
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="main-container">
      <NavBar />
      <div className="home-container">
        <div className="content-container">
          <div>
            <h1 className="main-header">Welcome to Project Inspection App</h1>
          </div>
          {showList && listContent()}
        </div>
      </div>
      {/* <div className="footer-container">
        <footer className="footer">Developed by V9</footer>
      </div> */}
    </div>
  );
};

export default Home;
