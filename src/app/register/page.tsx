import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center">
        <RegisterForm />
      </div>

      <div className="hidden md:block flex-1 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/login-image.png')" }}/>
    </div>
  );
}
