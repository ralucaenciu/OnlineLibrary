import React, { useState } from "react";
import UserService from "../../services/user";
import utils from "../../utils/utils";
import useStore from "../../store/store";
import {
  Button,
  Text,
  Error,
  Success,
  Heading,
  LinkButton,
} from "../../controls";
import { LockOpenOutlined } from "@mui/icons-material";
import { Container } from "@mui/material";

function ForgetPassword() {
  const { setIsLoading } = useStore((state) => state);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || email.length === 0) {
      setErrorMessage(`E-mailul este obligatoriu.`);
      return;
    } else {
      if (!utils.isValidEmail(email)) {
        setErrorMessage(`Vă rugăm să furnizați o adresă de e-mail validă.`);
        return;
      }
    }

    setIsLoading(true);
    UserService.forgotPassword(email).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setErrorMessage("");
      setSuccessMessage(
        `E-mailul trimis conține informații despre resetarea parolei.`
      );
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Heading text="Ai uitat parola?" sx={{ mt: 10, mb: 3 }} />
      <Text label="Adresă de email" value={email} onChange={setEmail} />
      <Button
        text="Trimite email"
        onClick={handleSubmit}
        sx={{ mt: 2, mb: 2 }}
        icon={<LockOpenOutlined />}
      />
      <Error text={errorMessage} />
      <Success text={successMessage} />
      <LinkButton label="Vrei să te autentifici?" text="Conectare" to="/login" />
      <LinkButton label="Creează cont" text="Înregistrare" to="/signup" />
    </Container>
  );
}

export default ForgetPassword;
