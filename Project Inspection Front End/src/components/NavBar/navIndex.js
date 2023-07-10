import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import DelayedText from "../DelayedText/DelayedText";
import "./navIndex.css";

const NavBar = (props) => {
  const { groupName } = props;
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const location = useLocation();
  const [activeLink, setActiveLink] = React.useState(location.pathname);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl" className="mui-container">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem key="Home" onClick={handleCloseNavMenu}>
                <Link exact to="/ProjectInspectionApp/" className="links-top">
                  <Typography textAlign="center">Home</Typography>
                </Link>
              </MenuItem>
              <MenuItem key="Manager" onClick={handleCloseNavMenu}>
                <Link to="/ProjectInspectionApp/manager" className="links-top">
                  <Typography textAlign="center">Manager</Typography>
                </Link>
              </MenuItem>
              <MenuItem key="Team" onClick={handleCloseNavMenu}>
                <Link to="/ProjectInspectionApp/team" className="links-top">
                  <Typography textAlign="center">Team</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Link
              exact
              to="/ProjectInspectionApp/"
              className="links"
              onClick={() => handleLinkClick("/ProjectInspectionApp/")}
            >
              <Button
                className={`link-btn ${
                  activeLink === "/ProjectInspectionApp/" ? "active-link" : ""
                }`}
                key="Home"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Home
              </Button>
            </Link>
            <Link
              to="/ProjectInspectionApp/manager"
              className="links"
              onClick={() => handleLinkClick("/ProjectInspectionApp/manager")}
            >
              <Button
                className={`link-btn ${
                  activeLink === "/ProjectInspectionApp/manager"
                    ? "active-link"
                    : ""
                }`}
                key="Manager"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Manager
              </Button>
            </Link>
            <Link
              to="/ProjectInspectionApp/team"
              className="links"
              onClick={() => handleLinkClick("/ProjectInspectionApp/team")}
            >
              <Button
                className={`link-btn ${
                  activeLink === "/ProjectInspectionApp/team"
                    ? "active-link"
                    : ""
                }`}
                key="Team"
                sx={{ my: 2, color: "white", display: "block" }}
              >
                Team
              </Button>
            </Link>
          </Box>
          <div className="groupname-container">
            <h1 className="group-name">
              <DelayedText text={groupName} delay={30} />
            </h1>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
