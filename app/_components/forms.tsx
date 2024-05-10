"use client";

import { useCallback, useState } from "react";
import SiginForm from "./signin-form";
import SignupForm from "./signup-form";
import Container from "@mui/material/Container";

type ActiveForm = "signin" | "signup";

export default function Forms() {
  const [activeForm, setActiveForm] = useState<ActiveForm>("signin");

  const onSignup = useCallback(() => {
    setActiveForm("signup");
  }, [setActiveForm]);

  const onSignin = useCallback(() => {
    setActiveForm("signin");
  }, [setActiveForm]);

  return (
    <Container maxWidth="xs">
      {activeForm === "signin" ? <SiginForm onSignup={onSignup} /> : null}
      {activeForm === "signup" ? <SignupForm onSignin={onSignin} /> : null}
    </Container>
  );
}
