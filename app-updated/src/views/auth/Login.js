import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/user";
import utils from "../../utils/utils";
import useStore from "../../store/store";
import {
  Button,
  Text,
  Password,
  Error,
  Success,
  Heading,
  LinkButton,
} from "../../controls";
import { Login as LoginIcon } from "@mui/icons-material";
import { Container } from "@mui/material";

function Login() {
  const { setIsLoading, setUser, setToken } = useStore((state) => state);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email || email.length === 0) {
      setErrorMessage(`Adresa de email este obligatorie`);
      return;
    } else {
      if (!utils.isValidEmail(email)) {
        setErrorMessage(`Te rog furnizeaza o adresa de email valida.`);
        return;
      }
    }
    if (!password || password.length === 0) {
      setErrorMessage(`Parola este necesara.`);
      return;
    }

    setIsLoading(true);
    UserService.login({ email, password }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      const data = result.data;
      setErrorMessage("");
      setSuccessMessage(`Conectare cu succes!`);

      setIsLoading(false);
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Heading text="Conectare" sx={{ mt: 10, mb: 3 }} />
      <Text label="Email " value={email} onChange={setEmail} />
      <Password label="Parolă" value={password} onChange={setPassword} />
      <Button
        text="Conectare"
        onClick={handleSubmit}
        sx={{ mt: 2, mb: 2 }}
        icon={<LoginIcon />}
      />
      <Error text={errorMessage} />
      <Success text={successMessage} />
      <LinkButton
        label="Nu ai incă un cont?"
        text="Înregistrează-te"
        to="/signup"
      />
      <LinkButton label="Ți-ai uitat parola?" text="Reset" to="/fp" />
    </Container>
  );
}

export default Login;
