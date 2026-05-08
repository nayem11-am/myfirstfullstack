import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SaaS Platform",
  description: "Login to your account to access your dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}
