import React, { createRef } from "react";
import useStore from "../../store/store";
import { Grid, Stack, Avatar, Box } from "@mui/material";
import moment from "moment";
import { Button } from "../../controls";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/user";

function Profile(props) {
  const navigate = useNavigate();
  const {
    user,
    token,
    setErrorMessage,
    setUser,
    setSuccessMessage,
    setIsLoading,
  } = useStore((state) => state);
  const fileRef = createRef();

  const onFileInputChange = async (e) => {
    if (!e.target?.files?.[0]) return;
    const base64 = await convertToBase64(e.target?.files?.[0]);
    if (!base64) return;
    setIsLoading(true);
    let result = await UserService.updatePicture(token, { imageUrl: base64 });
    if (result.error) {
      setErrorMessage(result?.error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setUser(result?.data);
    setSuccessMessage("Poza de profil schimbata cu succes!");
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2, pt: 2, mt: 6 }}>
      <Grid item xs={3} md={3}></Grid>
      <Grid item xs={6} md={6}>
        <Grid container spacing={2} sx={{ p: 2, pt: 2 }}>
          <Grid item xs={12} md={6}>
            <Avatar
              src={user?.imageUrl}
              alt={user?.name}
              sx={{ width: 200, height: 200, cursor: "pointer" }}
              onClick={() => fileRef.current?.click()}
            />
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileRef}
              onChange={onFileInputChange}
              accept="image/png,image/jpeg,image/jpg"
              multiple={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack className="info">
              <div>Buna, Ma numesc</div>
              <div className="big">{user?.name}</div>
              <Box className="small" sx={{ mt: 1 }}>
                {user?.phone}
              </Box>
              <Box className="small" sx={{ mt: 1 }}>
                {user?.email}
              </Box>
              <Box className="too-small grey" sx={{ mt: 1 }}>
                Cont creat: {moment(user?.createdAt).format("DD MMMM YYYY")}
              </Box>
              <Button
                text="Editeaza"
                variant="outlined"
                width={100}
                sx={{ mt: 3, borderRadius: 50 }}
                onClick={() => navigate("/settings")}
              />
            </Stack>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3} md={3}></Grid>
    </Grid>
  );
}

export default Profile;
