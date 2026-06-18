import { useMemo, useState, useEffect } from 'react'
import {
  Camera, Radio, Cpu, Zap, Wifi, WifiOff, ShieldAlert, Search, Plus,
  Radar, Upload, X, Check, AlertTriangle, KeyRound, Trash2, MoveRight,
  Download, ShieldCheck, ArrowUpDown, Eye, RefreshCw, Settings2, Lock,
} from 'lucide-react'
import { AddDeviceWizard, DiscoverDialog, ImportCsvDialog } from './AdicionarDispositivo'

// ─── Constantes compartilhadas ────────────────────────────────────────────────

export const SECTORS = [
  'Doca Norte', 'Doca Sul', 'Recepção', 'Estacionamento',
  'Central', 'Perímetro Sul', 'Depósito', 'Corredor Leste',
]

export const TYPE_LABEL = {
  camera: 'Câmera', sensor: 'Sensor', controller: 'Controlador', fence: 'Cerca Elétrica',
}

export const TYPE_ICON = { camera: Camera, sensor: Radio, controller: Cpu, fence: Zap }

const DEVICES_MOCK = [
  { id: 'd1', name: 'Câmera 01', type: 'camera', sector: 'Recepção', ip: '10.0.10.11', driver: 'ONVIF Profile S', firmware: 'v2.3.1', firmwareLatest: 'v2.4.0', signal: 87, lastActivity: '12s atrás', defaultCredentials: false, uptime: '14d 3h', status: 'online', hasLens: true, hasMic: false, hasSpeaker: false, hasIO: true },
  { id: 'd2', name: 'Câmera 02', type: 'camera', sector: 'Estacionamento', ip: '10.0.10.12', driver: 'ONVIF Profile T', firmware: 'v2.4.0', firmwareLatest: 'v2.4.0', signal: 92, lastActivity: '5s atrás', defaultCredentials: false, uptime: '14d 3h', status: 'online', hasLens: true, hasMic: true, hasSpeaker: false, hasIO: true },
  { id: 'd3', name: 'Câmera 03', type: 'camera', sector: 'Corredor Leste', ip: '10.0.10.13', driver: 'ONVIF Profile S', firmware: 'v2.1.0', firmwareLatest: 'v2.4.0', signal: 45, lastActivity: '2m atrás', defaultCredentials: true, uptime: '7d 11h', status: 'alert', hasLens: false, hasMic: false, hasSpeaker: false, hasIO: false },
  { id: 'd4', name: 'Sensor PIR 01', type: 'sensor', sector: 'Corredor Leste', ip: '10.0.11.01', driver: 'Z-Wave 800', firmware: 'v1.2.0', firmwareLatest: 'v1.3.1', signal: 78, lastActivity: '1m atrás', defaultCredentials: false, uptime: '30d 0h', status: 'online' },
  { id: 'd5', name: 'Sensor PIR 02', type: 'sensor', sector: 'Depósito', ip: '10.0.11.02', driver: 'Zigbee 3.0', firmware: 'v1.3.1', firmwareLatest: 'v1.3.1', signal: -1, lastActivity: '3h atrás', defaultCredentials: false, uptime: '0', status: 'offline' },
  { id: 'd6', name: 'Controlador Principal', type: 'controller', sector: 'Central', ip: '10.0.10.01', driver: 'Modbus TCP', firmware: 'v3.0.0', firmwareLatest: 'v3.1.0', signal: 100, lastActivity: '1s atrás', defaultCredentials: false, uptime: '60d 2h', status: 'online', hasIO: true },
  { id: 'd7', name: 'Cerca Elétrica Norte', type: 'fence', sector: 'Doca Norte', ip: '10.0.12.01', driver: 'GenericFence v2', firmware: 'v1.0.5', firmwareLatest: 'v1.0.5', signal: 65, lastActivity: '30s atrás', defaultCredentials: false, uptime: '21d 8h', status: 'online' },
  { id: 'd8', name: 'Câmera 06', type: 'camera', sector: 'Perímetro Sul', ip: '10.0.10.16', driver: 'ONVIF Profile S', firmware: 'v2.3.1', firmwareLatest: 'v2.4.0', signal: 30, lastActivity: '10m atrás', defaultCredentials: true, uptime: '3d 5h', status: 'alert', hasLens: false, hasMic: false, hasSpeaker: false, hasIO: false },
]

// ─── Toast simples ────────────────────────────────────────────────────────────

let _tid = 0

function useToast() {
  const [toasts, setToasts] = useState([])
  const toast = (msg, desc) => {
    const id = ++_tid
    setToasts(p => [...p, { id, msg, desc }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }
  return { toasts, toast }
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="rounded-lg border border-border bg-card px-4 py-2.5 shadow-lg">
          <p className="text-sm font-medium text-foreground">{t.msg}</p>
          {t.desc && <p className="text-xs text-muted-foreground">{t.desc}</p>}
        </div>
      ))}
    </div>
  )
}

// ─── Componentes auxiliares compartilhados ────────────────────────────────────

export function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-foreground ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}

export function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2 text-sm">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}
      >
        <span className={`absolute inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
      </button>
    </div>
  )
}

export function Stepper({ step, steps }) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-background/40 p-2">
      {steps.map((label, i) => {
        const idx = i + 1
        const done = idx < step
        const active = idx === step
        return (
          <div key={label} className="flex flex-1 items-center gap-1">
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
              done ? 'bg-success/20 text-success ring-1 ring-success/40' :
              active ? 'bg-primary text-primary-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {done ? <Check className="h-3.5 w-3.5" /> : idx}
            </div>
            <span className={`hidden text-xs sm:block ${active ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{label}</span>
            {i < steps.length - 1 && <div className={`h-px flex-1 ${done ? 'bg-success/40' : 'bg-border'}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ─── Componentes internos da tabela ───────────────────────────────────────────

function StatusDot({ status }) {
  const color = status === 'online' ? 'bg-success' : status === 'alert' ? 'bg-warning' : 'bg-destructive'
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-70 ${color} ${status !== 'offline' ? 'animate-ping' : ''}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  )
}

function SignalCell({ d }) {
  if (d.signal < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
        <WifiOff className="h-3.5 w-3.5" /> Sinal perdido
      </span>
    )
  }
  const tone = d.signal >= 75 ? 'bg-success' : d.signal >= 50 ? 'bg-warning' : 'bg-destructive'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${d.signal}%` }} />
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">{d.signal}%</span>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, hint, tone }) {
  const cls = {
    primary: 'text-primary bg-primary/10 ring-1 ring-primary/20',
    success: 'text-success bg-success/10 ring-1 ring-success/20',
    destructive: 'text-destructive bg-destructive/10 ring-1 ring-destructive/20',
    warning: 'text-warning bg-warning/10 ring-1 ring-warning/20',
    muted: 'text-muted-foreground bg-muted ring-1 ring-border',
  }[tone]
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${cls}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-base font-semibold text-foreground">{value}</p>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

function SortableTh({ label, active, dir, onClick, className }) {
  return (
    <th className={`border-b border-border px-3 py-2 font-medium ${className || ''}`}>
      <button onClick={onClick} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${active ? 'text-primary' : 'opacity-50'}`} />
        {active && <span className="text-[9px]">{dir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </th>
  )
}

function EmptyState({ filtered, onReset, onAdd, onImport }) {
  if (filtered) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
        <Search className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="font-medium">Nenhum dispositivo corresponde aos filtros</p>
          <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros ou limpe-os para ver todo o inventário.</p>
        </div>
        <button className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent" onClick={onReset}>Limpar filtros</button>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
        <Settings2 className="h-7 w-7 text-primary" />
      </div>
      <div>
        <p className="font-medium">Nenhum dispositivo cadastrado</p>
        <p className="mt-1 text-sm text-muted-foreground">Provisione o primeiro equipamento para começar a monitorar.</p>
      </div>
      <div className="flex gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={onAdd}>
          <Plus className="h-4 w-4" /> Adicionar Dispositivo
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent" onClick={onImport}>
          <Upload className="h-4 w-4" /> Importar CSV
        </button>
      </div>
    </div>
  )
}

function StreamProfile({ name, defaultRes, defaultFps }) {
  const [res, setRes] = useState(defaultRes)
  const [fps, setFps] = useState(String(defaultFps))
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <p className="text-sm font-medium">{name}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Resolução</label>
          <select value={res} onChange={e => setRes(e.target.value)} className="mt-1 h-8 w-full rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none">
            {['720p', '1080p', '1440p', '2160p'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-muted-foreground">FPS</label>
          <select value={fps} onChange={e => setFps(e.target.value)} className="mt-1 h-8 w-full rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none">
            {['15', '20', '25', '30', '60'].map(f => <option key={f} value={f}>{f} fps</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}

function RowActionsMenu({ onDetails, onRestart, onRemove }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        className="h-7 rounded px-2 text-xs hover:bg-accent"
        onClick={e => { e.stopPropagation(); setOpen(o => !o) }}
      >
        Ações
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 min-w-[140px] rounded-md border border-border bg-popover py-1 shadow-lg">
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent" onClick={() => { setOpen(false); onDetails() }}>
              <Eye className="h-3.5 w-3.5" /> Detalhes
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent" onClick={() => { setOpen(false); onRestart() }}>
              <RefreshCw className="h-3.5 w-3.5" /> Reiniciar
            </button>
            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10" onClick={() => { setOpen(false); onRemove() }}>
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Tela principal ───────────────────────────────────────────────────────────

function Dispositivos() {
  const [devices, setDevices] = useState(DEVICES_MOCK)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [outdatedOnly, setOutdatedOnly] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [selected, setSelected] = useState(new Set())
  const [drawerId, setDrawerId] = useState(null)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [discoverOpen, setDiscoverOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const { toasts, toast } = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = devices.filter(d => {
      if (typeFilter !== 'all' && d.type !== typeFilter) return false
      if (statusFilter !== 'all' && d.status !== statusFilter) return false
      if (sectorFilter !== 'all' && d.sector !== sectorFilter) return false
      if (outdatedOnly && d.firmware === d.firmwareLatest) return false
      if (q && !`${d.name} ${d.sector} ${d.ip} ${d.driver}`.toLowerCase().includes(q)) return false
      return true
    })
    return [...list].sort((a, b) => {
      const va = String(a[sortKey] ?? '')
      const vb = String(b[sortKey] ?? '')
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }, [devices, query, typeFilter, statusFilter, sectorFilter, outdatedOnly, sortKey, sortDir])

  const filtersActive = typeFilter !== 'all' || statusFilter !== 'all' || sectorFilter !== 'all' || outdatedOnly || query.trim() !== ''
  const total = devices.length
  const online = devices.filter(d => d.status === 'online').length
  const offline = devices.filter(d => d.status === 'offline').length
  const fwPending = devices.filter(d => d.firmware !== d.firmwareLatest).length
  const secAlerts = devices.filter(d => d.defaultCredentials).length
  const drawerDevice = drawerId ? devices.find(d => d.id === drawerId) ?? null : null

  const toggleAll = v => setSelected(v ? new Set(filtered.map(d => d.id)) : new Set())
  const toggleOne = (id, v) => {
    const next = new Set(selected); v ? next.add(id) : next.delete(id); setSelected(next)
  }
  const clearSelection = () => setSelected(new Set())
  const sortBy = k => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
  }
  const resetFilters = () => {
    setQuery(''); setTypeFilter('all'); setStatusFilter('all'); setSectorFilter('all'); setOutdatedOnly(false)
  }
  const addDevice = d => setDevices(prev => [d, ...prev])
  const bulkRemove = () => {
    setDevices(prev => prev.filter(d => !selected.has(d.id)))
    toast(`${selected.size} dispositivo(s) removido(s)`)
    clearSelection()
  }
  const bulkScheduleFw = () => {
    toast(`Atualização agendada para ${selected.size} dispositivo(s)`, 'Janela: 03:00 – 04:30')
    clearSelection()
  }

  const selectCls = 'h-9 rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="flex h-[calc(100svh-3rem)] flex-col gap-4 p-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard icon={Settings2} label="Total" value={String(total)} hint="dispositivos" tone="primary" />
        <KpiCard icon={Wifi} label="Online" value={String(online)} hint="conectados" tone="success" />
        <KpiCard icon={WifiOff} label="Offline" value={String(offline)} hint="sem comunicação" tone={offline ? 'destructive' : 'muted'} />
        <KpiCard icon={Download} label="Firmware" value={String(fwPending)} hint="atualizações pendentes" tone={fwPending ? 'warning' : 'muted'} />
        <KpiCard icon={ShieldAlert} label="Alertas" value={String(secAlerts)} hint="credencial padrão ativa" tone={secAlerts ? 'destructive' : 'muted'} />
      </div>

      {/* Barra de ações */}
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-2 lg:flex-row lg:items-center lg:gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4" /> Adicionar Dispositivo
          </button>
          <button className="inline-flex h-9 items-center gap-2 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80" onClick={() => setDiscoverOpen(true)}>
            <Radar className="h-4 w-4" /> Descobrir na Rede
          </button>
          <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background/40 px-3 text-sm font-medium hover:bg-accent" onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4" /> Importar CSV
          </button>
        </div>
        <div className="h-px w-full bg-border lg:h-7 lg:w-px" />
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-9 w-full rounded-md border border-border bg-input pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Buscar por nome, setor, IP, driver..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={`${selectCls} w-[140px]`}>
            <option value="all">Todos tipos</option>
            <option value="camera">Câmera</option>
            <option value="sensor">Sensor</option>
            <option value="controller">Controlador</option>
            <option value="fence">Cerca Elétrica</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${selectCls} w-[140px]`}>
            <option value="all">Todos status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="alert">Alerta</option>
          </select>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className={`${selectCls} w-[160px]`}>
            <option value="all">Todos setores</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-background/40 px-2.5 text-xs">
            <input type="checkbox" checked={outdatedOnly} onChange={e => setOutdatedOnly(e.target.checked)} className="accent-primary" />
            Firmware desatualizado
          </label>
        </div>
      </div>

      {filtersActive && filtered.length !== total && (
        <div className="flex items-center justify-between rounded-md border border-warning/40 bg-warning/5 px-3 py-1.5 text-xs">
          <span className="text-warning">Exibindo {filtered.length} de {total} — filtros ativos suprimindo registros.</span>
          <button className="rounded px-2 py-0.5 text-xs text-warning hover:bg-warning/10" onClick={resetFilters}>Limpar filtros</button>
        </div>
      )}

      {/* Tabela */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState filtered={filtersActive} onReset={resetFilters} onAdd={() => setWizardOpen(true)} onImport={() => setImportOpen(true)} />
        ) : (
          <div className="h-full overflow-auto">
            <div className="min-w-[1100px]">
              <table className="w-full border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 z-20 bg-card">
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="sticky left-0 z-30 w-10 border-b border-border bg-card px-3 py-2">
                      <input type="checkbox" className="accent-primary" checked={selected.size > 0 && selected.size === filtered.length} onChange={e => toggleAll(e.target.checked)} />
                    </th>
                    <SortableTh className="sticky left-10 z-30 w-[220px] bg-card" label="Nome" active={sortKey === 'name'} dir={sortDir} onClick={() => sortBy('name')} />
                    <SortableTh label="Tipo" active={sortKey === 'type'} dir={sortDir} onClick={() => sortBy('type')} />
                    <SortableTh label="Setor" active={sortKey === 'sector'} dir={sortDir} onClick={() => sortBy('sector')} />
                    <th className="border-b border-border px-3 py-2 font-medium">IP / Hostname</th>
                    <th className="border-b border-border px-3 py-2 font-medium">Driver</th>
                    <SortableTh label="Firmware" active={sortKey === 'firmware'} dir={sortDir} onClick={() => sortBy('firmware')} />
                    <th className="border-b border-border px-3 py-2 font-medium">Saúde / Sinal</th>
                    <SortableTh label="Última atividade" active={sortKey === 'lastActivity'} dir={sortDir} onClick={() => sortBy('lastActivity')} />
                    <th className="border-b border-border px-3 py-2 pr-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => {
                    const Icon = TYPE_ICON[d.type]
                    const fwOutdated = d.firmware !== d.firmwareLatest
                    const isSel = selected.has(d.id)
                    return (
                      <tr
                        key={d.id}
                        onClick={() => setDrawerId(d.id)}
                        className={`group cursor-pointer text-foreground/90 transition-colors hover:bg-accent/30 ${isSel ? 'bg-primary/5' : ''}`}
                      >
                        <td className="sticky left-0 z-10 border-b border-border bg-card px-3 py-2 group-hover:bg-card" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" className="accent-primary" checked={isSel} onChange={e => toggleOne(d.id, e.target.checked)} />
                        </td>
                        <td className="sticky left-10 z-10 border-b border-border bg-card px-3 py-2 group-hover:bg-card">
                          <div className="flex items-center gap-2.5">
                            <StatusDot status={d.status} />
                            <span className="font-medium">{d.name}</span>
                            {d.defaultCredentials && (
                              <span className="inline-flex items-center gap-1 rounded border border-destructive/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-destructive">
                                <Lock className="h-3 w-3" /> Cred. padrão
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border-b border-border px-3 py-2">
                          <span className="inline-flex items-center gap-1.5 text-xs">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            {TYPE_LABEL[d.type]}
                          </span>
                        </td>
                        <td className="border-b border-border px-3 py-2 text-xs">{d.sector}</td>
                        <td className="border-b border-border px-3 py-2 font-mono text-xs text-muted-foreground">{d.ip}</td>
                        <td className="border-b border-border px-3 py-2 text-xs text-muted-foreground">{d.driver}</td>
                        <td className="border-b border-border px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{d.firmware}</span>
                            {fwOutdated && (
                              <span className="inline-flex items-center rounded border border-warning/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-warning">
                                Atualização disponível
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border-b border-border px-3 py-2"><SignalCell d={d} /></td>
                        <td className="border-b border-border px-3 py-2 font-mono text-[11px] text-muted-foreground">{d.lastActivity}</td>
                        <td className="border-b border-border px-3 py-2 text-right" onClick={e => e.stopPropagation()}>
                          <RowActionsMenu
                            onDetails={() => setDrawerId(d.id)}
                            onRestart={() => toast('Reiniciando dispositivo', d.name)}
                            onRemove={() => { setDevices(p => p.filter(x => x.id !== d.id)); toast(`${d.name} removido`) }}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Ações em lote */}
      {selected.size > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur">
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{selected.size} selecionado(s)</span>
            <div className="h-5 w-px bg-border" />
            <button className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs hover:bg-accent" onClick={() => toast('Perfil aplicado')}>
              <ShieldCheck className="h-4 w-4" /> Aplicar perfil
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs hover:bg-accent" onClick={bulkScheduleFw}>
              <Download className="h-4 w-4" /> Agendar firmware
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs hover:bg-accent" onClick={() => toast('Movidos de setor')}>
              <MoveRight className="h-4 w-4" /> Mover setor
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs hover:bg-accent" onClick={() => toast('Política aplicada')}>
              <KeyRound className="h-4 w-4" /> Política
            </button>
            <div className="h-5 w-px bg-border" />
            <button className="inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs text-destructive hover:bg-destructive/10" onClick={bulkRemove}>
              <Trash2 className="h-4 w-4" /> Remover
            </button>
            <button className="inline-flex h-7 w-7 items-center justify-center rounded p-0 hover:bg-accent" onClick={clearSelection}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <DeviceDrawer
        device={drawerDevice}
        onClose={() => setDrawerId(null)}
        onUpdate={d => setDevices(p => p.map(x => x.id === d.id ? d : x))}
        toast={toast}
      />
      <AddDeviceWizard open={wizardOpen} onOpenChange={setWizardOpen} onConfirm={d => { addDevice(d); toast('Dispositivo adicionado', d.name) }} />
      <DiscoverDialog open={discoverOpen} onOpenChange={setDiscoverOpen} onAdd={d => { addDevice(d); toast('Dispositivo importado da varredura', d.name) }} />
      <ImportCsvDialog open={importOpen} onOpenChange={setImportOpen} onImport={items => { items.forEach(addDevice); toast(`${items.length} dispositivo(s) importado(s)`) }} />
      <ToastContainer toasts={toasts} />
    </div>
  )
}

// ─── Drawer de detalhe ────────────────────────────────────────────────────────

function DeviceDrawer({ device, onClose, onUpdate, toast }) {
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (device) setTab('overview')
  }, [device?.id])

  if (!device) return null

  const Icon = TYPE_ICON[device.type]
  const fwOutdated = device.firmware !== device.firmwareLatest
  const TABS = [
    { key: 'overview', label: 'Visão' },
    { key: 'components', label: 'Componentes' },
    { key: 'streams', label: 'Transmissão' },
    { key: 'security', label: 'Segurança' },
    { key: 'firmware', label: 'Firmware' },
  ]

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-border bg-card shadow-xl sm:max-w-[520px]">
        <div className="flex shrink-0 items-center gap-2.5 border-b border-border p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-base font-semibold">
              {device.name} <StatusDot status={device.status} />
            </div>
            <p className="text-xs text-muted-foreground">{TYPE_LABEL[device.type]} • {device.sector}</p>
          </div>
          <button className="rounded p-1 hover:bg-accent" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>

        <div className="flex shrink-0 border-b border-border">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === t.key ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {tab === 'overview' && (
            <>
              <InfoRow label="IP / Hostname" value={device.ip} mono />
              <InfoRow label="Driver" value={device.driver} />
              <InfoRow label="Setor" value={device.sector} />
              <InfoRow label="Uptime" value={device.uptime} mono />
              <InfoRow label="Última atividade" value={device.lastActivity} mono />
              <div className="rounded-md border border-border bg-background/40 p-3">
                <p className="mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">Saúde / Sinal</p>
                <SignalCell d={device} />
              </div>
            </>
          )}

          {tab === 'components' && (
            <>
              {device.type === 'camera' && (
                <>
                  <ToggleRow label="Lente direcional (PTZ)" checked={!!device.hasLens} onChange={v => onUpdate({ ...device, hasLens: v })} />
                  <ToggleRow label="Microfone embarcado" checked={!!device.hasMic} onChange={v => onUpdate({ ...device, hasMic: v })} />
                  <ToggleRow label="Alto-falante" checked={!!device.hasSpeaker} onChange={v => onUpdate({ ...device, hasSpeaker: v })} />
                  <ToggleRow label="Entradas/Saídas I/O" checked={!!device.hasIO} onChange={v => onUpdate({ ...device, hasIO: v })} />
                </>
              )}
              {device.type === 'controller' && (
                <ToggleRow label="Entradas/Saídas I/O" checked={!!device.hasIO} onChange={v => onUpdate({ ...device, hasIO: v })} />
              )}
              {(device.type === 'sensor' || device.type === 'fence') && (
                <p className="text-sm text-muted-foreground">Este tipo de hardware não expõe subsistemas configuráveis.</p>
              )}
            </>
          )}

          {tab === 'streams' && (
            device.type !== 'camera'
              ? <p className="text-sm text-muted-foreground">Perfis de transmissão aplicam-se apenas a câmeras.</p>
              : <>
                  <StreamProfile name="Stream contínuo" defaultRes="1080p" defaultFps="25" />
                  <StreamProfile name="Gravação reativa (movimento)" defaultRes="2160p" defaultFps="30" />
                </>
          )}

          {tab === 'security' && (
            <>
              <div className={`rounded-md border p-3 text-sm ${device.defaultCredentials ? 'border-destructive/60 bg-destructive/5' : 'border-success/40 bg-success/5'}`}>
                <div className="flex items-start gap-2">
                  {device.defaultCredentials
                    ? <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                    : <ShieldCheck className="mt-0.5 h-4 w-4 text-success" />
                  }
                  <div className="flex-1">
                    <p className="font-medium">{device.defaultCredentials ? 'Credencial padrão de fábrica ativa' : 'Credencial forte aplicada'}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{device.defaultCredentials ? 'Risco crítico: substitua antes de colocar em produção.' : 'Conforme política CIS/NIST.'}</p>
                  </div>
                  {device.defaultCredentials && (
                    <button
                      className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      onClick={() => { onUpdate({ ...device, defaultCredentials: false, status: device.status === 'alert' ? 'online' : device.status }); toast('Credencial substituída') }}
                    >
                      Corrigir
                    </button>
                  )}
                </div>
              </div>
              <InfoRow label="Certificado SSH" value="ed25519 — válido" />
              <InfoRow label="Certificado SSL" value="LetsEncrypt — exp. 84d" />
              <InfoRow label="Portas abertas" value="443, 8000" mono />
              <InfoRow label="Portas fechadas" value="22, 23, 21" mono />
            </>
          )}

          {tab === 'firmware' && (
            <>
              <InfoRow label="Versão atual" value={device.firmware} mono />
              <InfoRow label="Versão disponível" value={device.firmwareLatest} mono />
              {fwOutdated ? (
                <div className="rounded-md border border-warning/40 bg-warning/5 p-3">
                  <p className="text-sm font-medium text-warning">Atualização disponível</p>
                  <p className="mt-1 text-xs text-muted-foreground">Selecione uma janela fora do horário crítico (06:00 – 22:00).</p>
                  <div className="mt-3 flex items-center gap-2">
                    <select defaultValue="03:00" className="h-8 w-[140px] rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none">
                      <option value="01:00">01:00 – 02:00</option>
                      <option value="03:00">03:00 – 04:00</option>
                      <option value="04:00">04:00 – 05:00</option>
                    </select>
                    <button
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      onClick={() => { onUpdate({ ...device, firmware: device.firmwareLatest }); toast('Atualização agendada') }}
                    >
                      Agendar atualização
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-success/40 bg-success/5 p-3 text-sm text-success">Firmware atualizado.</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Dispositivos
