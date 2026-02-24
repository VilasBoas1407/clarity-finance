import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  CreditCard,
  BarChart3,
  Check,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Users,
  DollarSign,
  PieChart,
} from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Para começar a organizar suas finanças",
    features: [
      "1 cartão de crédito",
      "Até 50 transações/mês",
      "Gastos recorrentes básicos",
      "Dashboard simplificado",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Premium",
    price: "R$ 9,90",
    period: "/mês",
    description: "Para quem quer controle total",
    features: [
      "Cartões ilimitados",
      "Transações ilimitadas",
      "Relatórios & Insights avançados",
      "Exportação de dados (CSV/PDF)",
      "Alertas inteligentes",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    highlight: true,
  },
  {
    name: "Família - 5 membros (Em breve)",
    price: "R$ 19,90",
    period: "/mês",
    description: "Para gerenciar finanças em grupo",
    features: [
      "Tudo do Pro",
      "Até 5 membros",
      "Visão consolidada familiar",
      "Orçamentos compartilhados",
      "Controle de permissões",
      "Suporte dedicado",
    ],
    cta: "Começar com Família",
    highlight: false,
  },
];

const features = [
  {
    icon: RefreshCw,
    title: "Gastos Recorrentes",
    description:
      "Controle assinaturas e despesas fixas com alertas de vencimento e visão clara do comprometimento mensal.",
  },
  {
    icon: CreditCard,
    title: "Cartão de Crédito",
    description:
      "Gerencie múltiplos cartões, acompanhe limites, faturas e parcelas em um painel unificado.",
  },
  {
    icon: BarChart3,
    title: "Relatórios & Insights",
    description:
      "Análises automáticas e acionáveis que transformam seus dados financeiros em decisões claras.",
  },
];

const stats = [
  { value: "12.000+", label: "Usuários ativos" },
  { value: "R$ 2.4M", label: "Economia identificada" },
  { value: "98%", label: "Satisfação" },
  { value: "4.9★", label: "Avaliação média" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-sidebar text-sidebar-accent-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-sidebar-border bg-sidebar/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-accent-foreground">
              Clarity Finance
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#pricing"
              className="text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
            >
              Preços
            </a>
            <a
              href="#about"
              className="text-sm text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
            >
              Sobre
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-sidebar-foreground hover:text-sidebar-accent-foreground"
              asChild
            >
              <Link to="/login">Entrar</Link>
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link to="/login">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              <Zap className="w-3 h-3 mr-1" /> Novo: Relatórios com IA
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Clareza total sobre o seu{" "}
              <span className="gradient-text">dinheiro</span>
            </h1>
            <p className="text-lg md:text-xl text-sidebar-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Controle gastos, recorrentes, cartões de crédito e relatórios em
              um único lugar. Tome decisões financeiras com confiança.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base"
                asChild
              >
                <Link to="/login">
                  Começar grátis <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl border border-sidebar-border bg-sidebar-accent p-6 shadow-lg">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: "Gasto mensal",
                    value: "R$ 4.280",
                    icon: TrendingUp,
                    change: "-5%",
                  },
                  {
                    label: "Recorrentes",
                    value: "R$ 1.890",
                    icon: RefreshCw,
                    change: "+2%",
                  },
                  {
                    label: "Saldo livre",
                    value: "R$ 3.720",
                    icon: Shield,
                    change: "+12%",
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-lg border border-sidebar-border bg-sidebar p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-sidebar-foreground">
                        {kpi.label}
                      </span>
                      <kpi.icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xl font-bold text-sidebar-accent-foreground">
                      {kpi.value}
                    </p>
                    <span className="text-xs text-primary">{kpi.change}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-sidebar-border bg-sidebar p-4 h-32 flex items-end gap-1">
                  {[40, 65, 55, 80, 70, 90, 60, 75, 85, 50, 95, 70].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-primary/60"
                        style={{ height: `${h}%` }}
                      />
                    ),
                  )}
                </div>
                <div className="rounded-lg border border-sidebar-border bg-sidebar p-4 h-32 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full -rotate-90"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--sidebar-border))"
                        strokeWidth="12"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="75"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="188"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PieChart className="w-5 h-5 text-sidebar-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 border-y border-sidebar-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-sidebar-foreground mb-10">
            Mais de 12.000 pessoas já controlam suas finanças com Clarity
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-sidebar-accent-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-sidebar-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa para{" "}
              <span className="gradient-text">controlar suas finanças</span>
            </h2>
            <p className="text-sidebar-foreground max-w-xl mx-auto">
              Ferramentas poderosas e simples que transformam dados financeiros
              em decisões claras.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="bg-sidebar-accent border-sidebar-border hover:border-primary/30 transition-colors group"
              >
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-sidebar-accent-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-sidebar-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-6 border-t border-sidebar-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Feito para quem quer{" "}
            <span className="gradient-text">simplificar</span>
          </h2>
          <p className="text-sidebar-foreground leading-relaxed mb-6">
            O Clarity Finance nasceu da frustração com planilhas complexas e
            apps confusos. Nosso objetivo é dar clareza financeira real — com
            uma experiência bonita, rápida e que cresce com você.
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
              <Shield className="w-4 h-4 text-primary" /> Dados criptografados
            </div>
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
              <Users className="w-4 h-4 text-primary" /> Multi-usuário
            </div>
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
              <Zap className="w-4 h-4 text-primary" /> Atualizações semanais
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos para cada <span className="gradient-text">momento</span>
            </h2>
            <p className="text-sidebar-foreground">
              Comece grátis e evolua quando precisar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative bg-sidebar-accent border-sidebar-border transition-all ${
                  plan.highlight
                    ? "border-primary ring-1 ring-primary/20 scale-[1.02]"
                    : "hover:border-sidebar-foreground/20"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Mais popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="text-lg font-semibold text-sidebar-accent-foreground mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-sidebar-foreground mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-sidebar-accent-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sidebar-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <Button
                    className={`w-full mb-6 ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-sidebar border border-sidebar-border text-sidebar-accent-foreground hover:bg-sidebar-accent"
                    }`}
                    asChild
                  >
                    <Link to="/login">{plan.cta}</Link>
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-sidebar-foreground"
                      >
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sidebar-border py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-accent-foreground">
              Clarity Finance
            </span>
            <span className="text-xs text-sidebar-foreground ml-2">
              Clareza para suas finanças
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-sidebar-foreground">
            <a
              href="#"
              className="hover:text-sidebar-accent-foreground transition-colors"
            >
              Termos
            </a>
            <a
              href="#"
              className="hover:text-sidebar-accent-foreground transition-colors"
            >
              Privacidade
            </a>
            <a
              href="#"
              className="hover:text-sidebar-accent-foreground transition-colors"
            >
              Contato
            </a>
          </div>
          <p className="text-xs text-sidebar-muted">
            © 2026 Clarity Finance. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
