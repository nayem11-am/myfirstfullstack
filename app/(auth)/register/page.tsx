import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | SaaS Platform",
  description: "Create a new account to get started.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
