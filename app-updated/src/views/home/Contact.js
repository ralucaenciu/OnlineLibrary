import React, { useState } from "react";
import useStore from "../../store/store";
import { Grid, Typography } from "@mui/material";
import ContactService from "../../services/contact";
import { Text, Button } from "../../controls";
import { Cancel, Save } from "@mui/icons-material";

function Contact() {
  let [message, setMessage] = useState("");
  const { token, setErrorMessage, setIsLoading, setSuccessMessage } = useStore(
    (state) => state
  );

  const handleSubmit = async () => {
    if (!message) return;
    setIsLoading(true);
    await ContactService.create(token, { feedback: message }).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Mesajul tau a fost trimis cu succes!");
      setMessage("");
      setIsLoading(false);
    });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h3">
          Contact
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Text
          placeholder="Mesaj pentru admin"
          label="Mesaj"
          value={message}
          onChange={setMessage}
          rows={5}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          text="Anuleaza"
          icon={<Cancel />}
          onClick={() => setMessage("")}
          color="info"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Button text="Trimite" icon={<Save />} onClick={handleSubmit} />
      </Grid>
    </Grid>
  );
}

export default Contact;
