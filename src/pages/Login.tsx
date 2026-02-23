import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/auth-context";
import { GoogleButton } from "@/components/ui/google-button";

interface GoogleTokenPayload {
  email: string;
  name: string;
  picture?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail inválido";
    if (!password) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-sidebar">
      {/* Branding Panel */}
      <div className="hidden lg:flex w-[40%] relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-sidebar to-sidebar-accent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-20">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-accent-foreground">
              Clarity Finance
            </span>
          </Link>
        </div>

        <div className="relative z-10 mb-20">
          <h2 className="text-3xl font-bold text-sidebar-accent-foreground leading-tight mb-4">
            Tome o controle das suas finanças com{" "}
            <span className="gradient-text">clareza</span>
          </h2>
          <p className="text-sidebar-foreground leading-relaxed max-w-sm">
            Acompanhe gastos, recorrentes e cartões em um único painel. Simples,
            bonito e poderoso.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          {[
            { value: "12k+", label: "Usuários" },
            { value: "98%", label: "Satisfação" },
            { value: "4.9★", label: "Avaliação" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-lg font-bold text-sidebar-accent-foreground">
                {s.value}
              </p>
              <p className="text-xs text-sidebar-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-accent-foreground">
              Clarity Finance
            </span>
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-sidebar-accent-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-sidebar-foreground">
              Entre na sua conta para continuar
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sidebar-accent-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                className={`bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground placeholder:text-sidebar-muted h-11 ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sidebar-accent-foreground"
              >
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className={`bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground placeholder:text-sidebar-muted h-11 pr-10 ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  className="border-sidebar-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-sidebar-foreground cursor-pointer"
                >
                  Lembrar de mim
                </Label>
              </div>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Entrar <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sidebar-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-sidebar text-sidebar-foreground">
                ou continue com
              </span>
            </div>
          </div>

          <GoogleButton />

          <p className="text-center text-sm text-sidebar-foreground mt-6">
            Não tem conta?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Criar conta grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
