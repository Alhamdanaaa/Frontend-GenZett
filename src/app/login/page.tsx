import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>

      <div className="hidden md:block flex-1 bg-cover bg-center" style={{ backgroundImage: "url('/login-image.png')" }} />
    </div>
  );
}
