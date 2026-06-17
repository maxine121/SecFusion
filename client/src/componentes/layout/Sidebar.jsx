import { NavLink } from 'react-router-dom'
import { LayoutGrid, Settings, History, Users, ShieldCheck } from 'lucide-react'

const ITENS_NAVEGACAO = [
  { to: '/', label: 'Dashboard Principal', icon: LayoutGrid, end: true },
  { to: '/dispositivos', label: 'Configurações de Dispositivos', icon: Settings },
  { to: '/historico', label: 'Histórico de Eventos', icon: History },
  { to: '/usuarios', label: 'Gerenciamento de Usuários', icon: Users },
]

function Sidebar({ collapsed }) {
  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-background transition-[width] duration-200 ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      {/* Marca */}
      <div
        className={`flex items-center gap-3 border-b border-border px-4 py-5 ${
          collapsed ? 'justify-center px-2' : ''
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-foreground">SecFusion</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Control Center
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed && (
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Operações
          </p>
        )}
        <ul className="flex flex-col gap-1">
          {ITENS_NAVEGACAO.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    collapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                  ].join(' ')
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={`flex items-center gap-2 border-t border-border px-4 py-4 ${
          collapsed ? 'justify-center px-2' : ''
        }`}
      >
        <span className="relative inline-flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        {!collapsed && <span className="text-xs text-muted-foreground">Sistema operacional</span>}
      </div>
    </aside>
  )
}

export default Sidebar
