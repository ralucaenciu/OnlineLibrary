import React, { useState } from "react";
import UserService from "../../services/user";
import utils from "../../utils/utils";
import useStore from "../../store/store";
import {
  Button,
  Password,
  Error,
  Success,
  Heading,
  LinkButton,
} from "../../controls";
import { KeyOff } from "@mui/icons-material";
import { Container } from "@mui/material";

function ResetPassword() {
  const { setIsLoading } = useStore((state) => state);
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword || !repeatPassword) {
      setErrorMessage(`Te rugam completeaza toate campurile.`);
      return;
    }

    if (newPassword !== repeatPassword) {
      setErrorMessage(`Cele doua nu se potrivesc.`);
      return;
    }

    const token = utils.getUrlParam(window.location.href, "token", "");
    if (!token || token.length !== 36) {
      setErrorMessage(`Invalid token furnizat.`);
      return;
    }

    setIsLoading(true);
    UserService.resetPassword(token, newPassword).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setErrorMessage("");
      setSuccessMessage(`Parola actualizata cu succes!`);
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Heading text="Reseteaza-ti parola" sx={{ mt: 10, mb: 3 }} />
      <Password
        label="Parola noua"
        value={newPassword}
        onChange={setNewPassword}
      />
      <Password
        label="Repeta parola"
        value={repeatPassword}
        onChange={setRepeatPassword}
      />
      <Button
        text="Resetare parola"
        onClick={handleSubmit}
        sx={{ mt: 2, mb: 2 }}
        icon={<KeyOff />}
      />
      <Error text={errorMessage} />
      <Success text={successMessage} />
      <LinkButton label="Vrei sa te conectezi?" text="Conectare" to="/login" />
      <LinkButton
        label="Nu ai un cont?"
        text="Inregistreaza-te!"
        to="/signup"
      />
    </Container>
  );
}

export default ResetPassword;
