import React, { useState } from "react";
import UserService from "../../services/user";
import useStore from "../../store/store";
import { Button, Text, Error, Success } from "../../controls";
import { Save } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

function UpdateProfile() {
  const { token, user, setUser, setIsLoading } = useStore((state) => state);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [name, setName] = useState(user?.name);
  const [phone, setPhone] = useState(user?.phone);

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    if (!name || !phone) {
      setErrorMessage(`Please provide all fields.`);
      return;
    }

    setIsLoading(true);
    UserService.update(token, { name, phone }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setUser(result?.data);
      setIsLoading(false);
      setErrorMessage("");
      setSuccessMessage(`Profil schimbat cu succes!`);
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Typography variant="h5" sx={{ float: "left" }}>
          Modifica profil
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Text label="Username" value={name} onChange={setName} />
      </Grid>
      <Grid item xs={12} md={12}>
        <Text label="Telefon" value={phone} onChange={setPhone} />
      </Grid>
      <Grid item xs={12} md={12}>
        <Button
          text="Trimite"
          onClick={handleSubmit}
          sx={{ mt: 2, mb: 2 }}
          icon={<Save />}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Error text={errorMessage} />
        <Success text={successMessage} />
      </Grid>
    </Grid>
  );
}

export default UpdateProfile;
