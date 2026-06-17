import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

function Header({ collapsed, onToggleSidebar, operador = 'Admin' }) {
  const dataAtual = new Date().toLocaleDateString('pt-BR')
  const IconeToggle = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <IconeToggle className="h-[18px] w-[18px]" />
        </button>
        <span className="text-sm font-bold text-foreground">SecFusion</span>
        <span className="rounded-full border border-primary/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Live
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Operador: <span className="font-semibold text-foreground">{operador}</span>
        </span>
        <span className="text-border">•</span>
        <span>{dataAtual}</span>
      </div>
    </header>
  )
}

export default Header
