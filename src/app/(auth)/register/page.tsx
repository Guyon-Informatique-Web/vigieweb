// Page d'inscription

import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Creer un compte",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
