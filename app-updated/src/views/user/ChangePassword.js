import React, { useState } from "react";
import UserService from "../../services/user";
import useStore from "../../store/store";
import { Button, Password, Error, Success } from "../../controls";
import { Key } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

function ChangePassword() {
  const { token, setIsLoading } = useStore((state) => state);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword || !repeatPassword || !currentPassword) {
      setErrorMessage(`Te rugam completeaza toate campurile.`);
      return;
    }

    if (newPassword !== repeatPassword) {
      setErrorMessage(`Noua parola nu se potriveste.`);
      return;
    }

    setIsLoading(true);
    UserService.updatePassword(token, { currentPassword, newPassword }).then(
      (result) => {
        if (result.error) {
          setErrorMessage(result.error);
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
        setErrorMessage("");
        setSuccessMessage(`Parola schimbata cu succes!`);
      }
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant="h5" sx={{ float: "left" }}>
          Schimba parola
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Password
          label="Parola curenta"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Password
          label="Noua parola"
          value={newPassword}
          onChange={setNewPassword}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Password
          label="Repeta parola"
          value={repeatPassword}
          onChange={setRepeatPassword}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Button
          text="Parola schimbata"
          onClick={handleSubmit}
          sx={{ mt: 2, mb: 2 }}
          icon={<Key />}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Error text={errorMessage} />
        <Success text={successMessage} />
      </Grid>
    </Grid>
  );
}

export default ChangePassword;
