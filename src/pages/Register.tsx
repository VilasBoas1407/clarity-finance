import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { FirebaseError } from "firebase/app";

const getFirebaseRegisterMessage = (error: unknown) => {
  if (error instanceof Error && error.message === "GOOGLE_ACCOUNT_ONLY") {
    return 'Este e-mail ja foi cadastrado via Google. Use "Login com Google".';
  }

  if (error instanceof Error && error.message === "EMAIL_ALREADY_REGISTERED") {
    return "Este e-mail ja possui conta. Faca login para continuar.";
  }

  if (!(error instanceof FirebaseError)) {
    return "Nao foi possivel criar a conta. Tente novamente.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "Este e-mail ja esta em uso.";
    case "auth/invalid-email":
      return "E-mail invalido.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 6 caracteres.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Aguarde e tente novamente.";
    default:
      return "Nao foi possivel criar a conta. Tente novamente.";
  }
};

export default function Register() {
  const { registerWithEmailPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    if (!email) newErrors.email = "E-mail é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail inválido";
    if (!password) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres";
    if (!confirmPassword) newErrors.confirmPassword = "Confirme sua senha";
    else if (confirmPassword !== password) {
      newErrors.confirmPassword = "As senhas não conferem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await registerWithEmailPassword(name, email, password);
    } catch (error) {
      setFormError(getFirebaseRegisterMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-sidebar">
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
            Crie sua conta e comece a organizar suas financas
          </h2>
          <p className="text-sidebar-foreground leading-relaxed max-w-sm">
            Tudo em um unico lugar: transações, recorrentes e cartoes.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          {[
            { value: "Sem custo", label: "Plano inicial" },
            { value: "Rapido", label: "Cadastro simples" },
            { value: "Seguro", label: "Firebase Auth" },
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

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
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
              Criar conta
            </h1>
            <p className="text-sidebar-foreground">
              Preencha os dados para criar seu acesso
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sidebar-accent-foreground">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => ({ ...p, name: undefined }));
                  setFormError(null);
                }}
                className={`bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground placeholder:text-sidebar-muted h-11 ${
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

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
                  setFormError(null);
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
                  placeholder="********"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: undefined }));
                    setFormError(null);
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

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sidebar-accent-foreground"
              >
                Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((p) => ({ ...p, confirmPassword: undefined }));
                    setFormError(null);
                  }}
                  className={`bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground placeholder:text-sidebar-muted h-11 pr-10 ${
                    errors.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Criar conta <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-sidebar-foreground mt-6">
            Ja tem conta?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
