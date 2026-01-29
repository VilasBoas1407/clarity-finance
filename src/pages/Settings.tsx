import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bell, CreditCard, Shield, Palette, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const settingsSections = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "notifications", label: "Notificações", icon: Bell },
  { id: "billing", label: "Planos", icon: CreditCard },
  { id: "security", label: "Segurança", icon: Shield },
  { id: "appearance", label: "Aparência", icon: Palette },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua conta e preferências
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
              <Separator className="my-4" />
              <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive-soft transition-colors">
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            </nav>
          </div>

          {/* Content area */}
          <div className="lg:col-span-3">
            <div className="p-6 rounded-xl bg-card border border-border shadow-card">
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
                    <p className="text-sm text-muted-foreground">
                      Suas informações pessoais
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Alterar foto</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" defaultValue="João Demo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="joao@demo.com" />
                    </div>
                  </div>

                  <Button>Salvar alterações</Button>
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure como você recebe alertas
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Vencimentos próximos", description: "Alertas de contas a vencer" },
                      { label: "Limite do cartão", description: "Quando atingir 80% do limite" },
                      { label: "Resumo semanal", description: "Receber resumo por email" },
                      { label: "Insights", description: "Dicas e análises personalizadas" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <Switch defaultChecked={index < 2} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "billing" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Planos & Assinatura</h2>
                    <p className="text-sm text-muted-foreground">
                      Gerencie seu plano
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">Plano Free</h3>
                          <Badge variant="secondary">Atual</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Funcionalidades básicas de controle financeiro
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-primary bg-primary-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">Plano Pro</h3>
                          <Badge className="bg-primary text-primary-foreground">Recomendado</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Relatórios avançados, múltiplos cartões e exportação de dados
                        </p>
                        <p className="text-lg font-semibold text-foreground mt-2">R$ 19,90/mês</p>
                      </div>
                      <Button>Fazer Upgrade</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "security" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Segurança</h2>
                    <p className="text-sm text-muted-foreground">
                      Proteja sua conta
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Alterar senha</Button>
                  </div>
                </div>
              )}

              {activeSection === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Aparência</h2>
                    <p className="text-sm text-muted-foreground">
                      Personalize a interface
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Modo Escuro</p>
                      <p className="text-xs text-muted-foreground">Em breve disponível</p>
                    </div>
                    <Switch disabled />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
