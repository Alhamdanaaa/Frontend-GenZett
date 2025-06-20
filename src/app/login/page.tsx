import { Metadata } from "next";
import LoginPage from "@/app/login/views/page";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page for authentication.",
};

export default async function Page() {
  return <LoginPage />;
}
