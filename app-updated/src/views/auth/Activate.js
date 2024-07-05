import React, { useState, useEffect } from "react";
import UserService from "../../services/user";
import utils from "../../utils/utils";
import { Error, Success, Heading, LinkButton } from "../../controls";
import { Container } from "@mui/material";

function Activate(props) {
  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = utils.getUrlParam(window.location.href, "token", "");
    if (!token || token.length !== 24) {
      setErrorMessage(`Invalid token furnizat.`);
      return;
    }

    UserService.activateAccount(token).then((result) => {
      if (result.error) {
        setErrorMessage(result.error);
        return;
      }

      setErrorMessage("");
      setIsActive(true);
    });
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Heading text="Activează-ți contul" sx={{ mt: 10, mb: 3 }} />
      <Error text={errorMessage} />
      {isActive && (
        <Success
          text={
            "Contul este activat cu succes! Vă rugăm să vă autentificați și să începeți să utilizați aplicația."
          }
        />
      )}
      <LinkButton
        label="Doriți să vă autentificați?"
        text="Conectare"
        to="/login"
      />
    </Container>
  );
}

export default Activate;
