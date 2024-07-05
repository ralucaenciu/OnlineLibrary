import React, { useState } from "react";
import UserService from "../../services/user";
import utils from "../../utils/utils";
import useStore from "../../store/store";
import moment from "moment";
import {
  Button,
  Text,
  Password,
  Error,
  Success,
  Heading,
  LinkButton,
} from "../../controls";
import { PersonAdd } from "@mui/icons-material";
import { Container } from "@mui/material";

function Signup(props) {
  const { setIsLoading } = useStore((state) => state);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password || !name) {
      setErrorMessage(`Toate campurile sunt obligatorii.`);
      return;
    }
    if (!utils.isValidEmail(email)) {
      setErrorMessage(`Te rugam furnizeaza o adresa de email corecta.`);
      return;
    }

    setIsLoading(true);
    UserService.signup({
      name,
      email,
      password,
      type: "user",
      joined: moment().format(),
    }).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      setErrorMessage("");
      setSuccessMessage(
        `Înregistrare reușită! Vă rugăm să va verificati adresa de email pentru a vă activa contul.`
      );
      setIsLoading(false);
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Heading text="Inregistrare" sx={{ mt: 10, mb: 3 }} />
      <Text label="User" value={name} onChange={setName} />
      <Text label="Adresa de email" value={email} onChange={setEmail} />
      <Password label="Parola" value={password} onChange={setPassword} />
      <Button
        text="Creare cont"
        onClick={handleSubmit}
        sx={{ mt: 2, mb: 2 }}
        icon={<PersonAdd />}
      />
      <Error text={errorMessage} />
      <Success text={successMessage} />
      <LinkButton label="Ai deja un cont?" text="Conecteaza-te!" to="/login" />
    </Container>
  );
}

export default Signup;
