import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Menu,
  Tooltip,
  Avatar,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon, LocalLibraryTwoTone } from "@mui/icons-material";
import Session from "../store/session";
import useStore from "../store/store";
import Confirm from "./Confirm";
import { USER_TYPE } from "../utils/enums";

const LinkBehavior = React.forwardRef((props, ref) => (
  <Link ref={ref} to={props.href} {...props} />
));

const Logo = ({ display }) => (
  <>
    <LocalLibraryTwoTone fontSize="large" sx={{ display: display, mr: 1 }} />
    <Typography
      variant="h6"
      noWrap
      component={LinkBehavior}
      href="/"
      sx={{
        mr: 2,
        display: display,
        fontFamily: "monospace",
        fontWeight: 700,
        letterSpacing: ".2rem",
        color: "inherit",
        textDecoration: "none",
        "&:hover": { color: "#fff" },
      }}
    >
      {process.env.REACT_APP_NAME}
    </Typography>
  </>
);

function Header() {
  const navigate = useNavigate();
  const { token, user } = useStore((state) => state);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleLogout = () => {
    Session.logout();
    window.location.href = "/login";
  };

  return (
    <>
      <Confirm
        open={openConfirmDialog}
        onNo={() => setOpenConfirmDialog(false)}
        onYes={() => {
          setOpenConfirmDialog(false);
          handleLogout();
        }}
        title="Vrei să părăsești aplicația?"
        body="Vei fi deconectat din aplicație."
      />
      {!token && !user ? (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Logo display={{ xs: "none", md: "flex" }} />
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="contul userului curent"
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
                  <MenuItem
                    key={"home"}
                    onClick={() => {
                      navigate("/");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">
                      Pagina principala
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    key={"login"}
                    onClick={() => {
                      navigate("/login");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">Conectare</Typography>
                  </MenuItem>
                  <MenuItem
                    key={"signup"}
                    onClick={() => {
                      navigate("/signup");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">Inscrie-te</Typography>
                  </MenuItem>
                </Menu>
              </Box>
              <Logo display={{ xs: "flex", md: "none" }} />
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                <Button
                  key="home"
                  onClick={() => {
                    navigate("/");
                    handleCloseNavMenu();
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Pagina principala
                </Button>
                <Button
                  key="login"
                  onClick={() => {
                    navigate("/login");
                    handleCloseNavMenu();
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Conectare
                </Button>
                <Button
                  key="signup"
                  onClick={() => {
                    navigate("/signup");
                    handleCloseNavMenu();
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Inscrie-te
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      ) : (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Logo display={{ xs: "none", md: "flex" }} />
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                }}
              >
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
                  {user?.type === USER_TYPE.USER ? (
                    <MenuItem
                      key={"home"}
                      onClick={() => {
                        navigate("/");
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography textAlign="center">
                        Pagina principala
                      </Typography>
                    </MenuItem>
                  ) : (
                    <>
                      <MenuItem
                        key={"home"}
                        onClick={() => {
                          navigate("/");
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">Dashboard</Typography>
                      </MenuItem>
                      <MenuItem
                        key={"library"}
                        onClick={() => {
                          navigate("/library");
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">Biblioteca</Typography>
                      </MenuItem>
                    </>
                  )}
                  <MenuItem
                    key={"profile"}
                    onClick={() => {
                      navigate("/profile");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">Profil</Typography>
                  </MenuItem>

                  {user?.type === USER_TYPE.USER && (
                    <>
                      <MenuItem
                        key={"mine"}
                        onClick={() => {
                          navigate("/mine");
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">Cartile mele</Typography>
                      </MenuItem>
                      <MenuItem
                        key={"saved"}
                        onClick={() => {
                          navigate("/saved");
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">Salvate</Typography>
                      </MenuItem>
                      <MenuItem
                        key={"contact"}
                        onClick={() => {
                          navigate("/contact");
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">Contact</Typography>
                      </MenuItem>
                    </>
                  )}
                  {user?.type === USER_TYPE.ADMIN && (
                    <>
                      <MenuItem
                        key={"managebooks"}
                        onClick={() => {
                          navigate("/manage-books");
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">
                          Gestionare carti
                        </Typography>
                      </MenuItem>
                      <MenuItem
                        key={"messages"}
                        onClick={() => {
                          navigate("/messages");
                          handleCloseNavMenu();
                        }}
                      >
                        <Typography textAlign="center">Mesaje</Typography>
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Box>
              <Logo display={{ xs: "flex", md: "none" }} />
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                {user?.type === USER_TYPE.USER ? (
                  <Button
                    key="home"
                    onClick={() => {
                      navigate("/");
                      handleCloseNavMenu();
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Pagina principala
                  </Button>
                ) : (
                  <>
                    <Button
                      key="home"
                      onClick={() => {
                        navigate("/");
                        handleCloseNavMenu();
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Dashboard
                    </Button>
                  </>
                )}
                <Button
                  key="profile"
                  onClick={() => {
                    navigate("/profile");
                    handleCloseNavMenu();
                  }}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Profil
                </Button>
                {user?.type === USER_TYPE.USER && (
                  <>
                    <Button
                      key="mine"
                      onClick={() => {
                        navigate("/mine");
                        handleCloseNavMenu();
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Cartile mele
                    </Button>
                    <Button
                      key="saved"
                      onClick={() => {
                        navigate("/saved");
                        handleCloseNavMenu();
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Salvate
                    </Button>
                    <Button
                      key="contact"
                      onClick={() => {
                        navigate("/contact");
                        handleCloseNavMenu();
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Contact
                    </Button>
                  </>
                )}
                {user?.type === USER_TYPE.ADMIN && (
                  <>
                    <Button
                      key="managebooks"
                      onClick={() => {
                        navigate("/manage-books");
                        handleCloseNavMenu();
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Gestionare carti
                    </Button>
                    <Button
                      key="messages"
                      onClick={() => {
                        navigate("/messages");
                        handleCloseNavMenu();
                      }}
                      sx={{ my: 2, color: "white", display: "block" }}
                    >
                      Mesaje
                    </Button>
                  </>
                )}
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Profile">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src={user?.imageUrl} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    key="settings"
                    onClick={() => {
                      navigate("/settings");
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">Setari</Typography>
                  </MenuItem>
                  <MenuItem
                    key="logout"
                    onClick={() => {
                      setOpenConfirmDialog(true);
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">Deconectare</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </>
  );
}

export default Header;
