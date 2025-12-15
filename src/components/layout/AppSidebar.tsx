import { 
  LayoutDashboard, 
  PieChart, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  BarChart3,
  PlayCircle,
  Store,
  Eye
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Variáveis', path: '/variaveis', icon: LayoutDashboard },
  { title: 'Distribuição', path: '/distribuicao', icon: PieChart },
  { title: 'Produtos', path: '/produtos', icon: Package },
  { title: 'Custos', path: '/custos', icon: DollarSign },
  { title: 'Compras', path: '/compras', icon: ShoppingCart },
  { title: 'Fluxo Caixa', path: '/fluxo', icon: TrendingUp },
  { title: 'Resultados', path: '/resultados', icon: BarChart3 },
  { title: 'Simulação', path: '/simulacao', icon: PlayCircle },
  { title: 'Canais', path: '/canais', icon: Store },
  { title: 'Visão Geral', path: '/visao', icon: Eye },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">M</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-sidebar-foreground text-lg tracking-tight">
                MIMAGI
              </h1>
              <p className="text-xs text-sidebar-foreground/60 uppercase tracking-wider">
                Profit Planner
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.path} 
                      className="flex items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {!isCollapsed && (
          <p className="text-xs text-sidebar-foreground/40 text-center">
            © {new Date().getFullYear()} Mimagi
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
