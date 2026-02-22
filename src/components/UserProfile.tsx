import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";

/**
 * Exemplo de componente que mostra como usar o contexto de autenticação
 * Este componente pode ser integrado no Topbar ou no menu de navegação
 */
export function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  // Gera iniciais do nome para o avatar
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium text-sidebar-accent-foreground">
          {user.name}
        </p>
        <p className="text-xs text-sidebar-foreground">{user.email}</p>
      </div>

      <Avatar className="h-9 w-9">
        <AvatarImage src={user.picture} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <Button
        size="sm"
        variant="ghost"
        onClick={logout}
        className="ml-2"
        title="Desconectar"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
