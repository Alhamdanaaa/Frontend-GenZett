import RegisterPageClient from "@/features/auth/components/register-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register page for authentication.",
};
export default function Page() {
  return <RegisterPageClient />;
}
