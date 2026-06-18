import { useState } from 'react'
import {
  Check, ChevronLeft, ChevronRight, Loader2, Radar,
  AlertTriangle, FileSpreadsheet,
} from 'lucide-react'
import { SECTORS, TYPE_LABEL, InfoRow, ToggleRow, Stepper } from './Dispositivos'

// ─── Wizard: Adicionar Dispositivo ────────────────────────────────────────────

function passwordStrength(p) {
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^\w\s]/.test(p)) score++
  const labels = ['Muito fraca', 'Fraca', 'Aceitável', 'Boa', 'Forte', 'Excelente']
  const tone = score <= 1 ? 'bg-destructive' : score <= 2 ? 'bg-warning' : 'bg-success'
  return { score: (score / 5) * 100, label: labels[score], tone }
}

const WIZARD_INIT = {
  step: 1, ip: '', detectedProtocol: null, scanning: false,
  type: 'camera', driver: 'ONVIF Profile S', name: '', sector: 'Doca Norte',
  username: '', password: '', closeUnusedPorts: true, removeFactoryCreds: true, keyLength: '2048',
  hasLens: true, hasMic: false, hasSpeaker: false, hasIO: true,
  streamMode: 'reactive', resolution: '1080p', fps: '25', firmwareWindow: '03:00',
}

export function AddDeviceWizard({ open, onOpenChange, onConfirm }) {
  const [s, setS] = useState(WIZARD_INIT)
  const set = patch => setS(prev => ({ ...prev, ...patch }))
  const close = () => { onOpenChange(false); setTimeout(() => setS(WIZARD_INIT), 300) }

  const runScan = () => {
    set({ scanning: true, detectedProtocol: null })
    setTimeout(() => {
      set({ scanning: false, ip: s.ip || '10.0.12.27', detectedProtocol: 'ONVIF Profile S', driver: 'ONVIF Profile S', type: 'camera', name: s.name || 'Câmera 07' })
    }, 1400)
  }

  const strength = passwordStrength(s.password)
  const canNext1 = !!s.ip && (!!s.detectedProtocol || !!s.driver)
  const canNext2 = s.removeFactoryCreds && s.password.length >= 8 && !!s.username
  const summary = `Você está adicionando a ${TYPE_LABEL[s.type]} "${s.name || 'novo dispositivo'}" ao setor ${s.sector}, com ${s.streamMode === 'reactive' ? 'gravação reativa por movimento' : 'stream contínuo'} em ${s.resolution} @ ${s.fps}fps. Atualização de firmware agendada para ${s.firmwareWindow}.`

  const handleConfirm = () => {
    onConfirm({
      id: `new-${Date.now()}`, name: s.name || 'Novo dispositivo', type: s.type, sector: s.sector,
      ip: s.ip, driver: s.driver, firmware: 'v1.0.0', firmwareLatest: 'v1.0.0',
      signal: 90, lastActivity: 'agora', defaultCredentials: false, uptime: '0', status: 'online',
      hasLens: s.hasLens, hasMic: s.hasMic, hasSpeaker: s.hasSpeaker, hasIO: s.hasIO,
    })
    close()
  }

  const inputCls = 'mt-1 h-9 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
  const selectCls = 'mt-1 h-9 w-full rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Adicionar Dispositivo</h2>
          <p className="text-sm text-muted-foreground">Provisionamento guiado em 5 etapas.</p>
          <div className="mt-4">
            <Stepper step={s.step} steps={['Descoberta', 'Segurança', 'Componentes', 'Firmware', 'Revisão']} />
          </div>

          <div className="min-h-[280px] py-4">
            {/* Etapa 1 — Descoberta */}
            {s.step === 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">IP estático ou Hostname</label>
                    <input className={inputCls} value={s.ip} onChange={e => set({ ip: e.target.value })} placeholder="10.0.12.27 ou cam-doca-01.local" />
                  </div>
                  <div className="self-end">
                    <button
                      className="inline-flex h-9 items-center gap-2 rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
                      onClick={runScan} disabled={s.scanning}
                    >
                      {s.scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
                      {s.scanning ? 'Varrendo...' : 'Varrer rede'}
                    </button>
                  </div>
                </div>
                {s.scanning && (
                  <div className="rounded-md border border-border bg-background/40 p-3 text-xs text-muted-foreground">
                    <p>Buscando dispositivos em 10.0.0.0/16...</p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-3/5 rounded-full bg-primary" />
                    </div>
                  </div>
                )}
                {s.detectedProtocol && (
                  <div className="rounded-md border border-success/40 bg-success/5 p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-success" />
                      Protocolo detectado: <span className="font-mono">{s.detectedProtocol}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Campos pré-preenchidos automaticamente.</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Tipo</label>
                    <select value={s.type} onChange={e => set({ type: e.target.value })} className={selectCls}>
                      <option value="camera">Câmera</option>
                      <option value="sensor">Sensor</option>
                      <option value="controller">Controlador</option>
                      <option value="fence">Cerca Elétrica</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Pacote de driver</label>
                    <select value={s.driver} onChange={e => set({ driver: e.target.value })} className={selectCls}>
                      <option value="ONVIF Profile S">ONVIF Profile S</option>
                      <option value="ONVIF Profile T">ONVIF Profile T</option>
                      <option value="Z-Wave 800">Z-Wave 800</option>
                      <option value="Zigbee 3.0">Zigbee 3.0</option>
                      <option value="Modbus TCP">Modbus TCP</option>
                      <option value="GenericFence v2">GenericFence v2</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Nome</label>
                    <input className={inputCls} value={s.name} onChange={e => set({ name: e.target.value })} placeholder="Câmera 07" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Setor</label>
                    <select value={s.sector} onChange={e => set({ sector: e.target.value })} className={selectCls}>
                      {SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 2 — Segurança */}
            {s.step === 2 && (
              <div className="space-y-3">
                <div className="rounded-md border border-warning/40 bg-warning/5 p-3 text-xs text-warning">
                  Subfluxo obrigatório baseado em NIST/CIS. Credenciais de fábrica não podem permanecer ativas.
                </div>
                <ToggleRow label="Desabilitar credenciais de fábrica (Factory Defaults)" checked={s.removeFactoryCreds} onChange={v => set({ removeFactoryCreds: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Usuário administrativo</label>
                    <input className={inputCls} value={s.username} onChange={e => set({ username: e.target.value })} placeholder="admin_secfusion" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Tamanho da chave</label>
                    <select value={s.keyLength} onChange={e => set({ keyLength: e.target.value })} className={selectCls}>
                      <option value="2048">RSA 2048</option>
                      <option value="3072">RSA 3072</option>
                      <option value="4096">RSA 4096</option>
                      <option value="ed25519">ed25519</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Senha forte</label>
                  <input type="password" className={inputCls} value={s.password} onChange={e => set({ password: e.target.value })} placeholder="••••••••••" />
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full transition-all ${strength.tone}`} style={{ width: `${strength.score}%` }} />
                    </div>
                    <span className="w-24 text-right text-[11px] text-muted-foreground">{strength.label}</span>
                  </div>
                </div>
                <ToggleRow label="Fechar portas de serviço não essenciais (22, 23, 21)" checked={s.closeUnusedPorts} onChange={v => set({ closeUnusedPorts: v })} />
              </div>
            )}

            {/* Etapa 3 — Componentes */}
            {s.step === 3 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Subsistemas detectados para este hardware:</p>
                {s.type === 'camera' ? (
                  <>
                    <ToggleRow label="Lente direcional (PTZ)" checked={s.hasLens} onChange={v => set({ hasLens: v })} />
                    <ToggleRow label="Microfone embarcado" checked={s.hasMic} onChange={v => set({ hasMic: v })} />
                    <ToggleRow label="Alto-falante" checked={s.hasSpeaker} onChange={v => set({ hasSpeaker: v })} />
                    <ToggleRow label="Entradas/Saídas I/O" checked={s.hasIO} onChange={v => set({ hasIO: v })} />
                    <div className="my-3 h-px bg-border" />
                    <p className="text-xs text-muted-foreground">Perfil de transmissão</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'continuous', title: 'Stream contínuo', desc: 'Gravação 24/7, alto consumo.' },
                        { key: 'reactive', title: 'Reativa por movimento', desc: 'Gravação acionada por evento.' },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => set({ streamMode: opt.key })}
                          className={`rounded-md border p-3 text-left text-sm transition ${s.streamMode === opt.key ? 'border-primary bg-primary/5' : 'border-border'}`}
                        >
                          <p className="font-medium">{opt.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <select value={s.resolution} onChange={e => set({ resolution: e.target.value })} className="h-9 rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none">
                        {['720p', '1080p', '1440p', '2160p'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <select value={s.fps} onChange={e => set({ fps: e.target.value })} className="h-9 rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none">
                        {['15', '20', '25', '30', '60'].map(f => <option key={f} value={f}>{f} fps</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <p className="rounded-md border border-border bg-background/40 p-3 text-sm text-muted-foreground">
                    Este tipo de hardware não expõe subsistemas configuráveis nem perfis de transmissão.
                  </p>
                )}
              </div>
            )}

            {/* Etapa 4 — Firmware */}
            {s.step === 4 && (
              <div className="space-y-3">
                <InfoRow label="Versão atual" value="v1.0.0" mono />
                <InfoRow label="Atualização disponível" value="v1.0.0 (sem updates)" mono />
                <div>
                  <label className="text-xs text-muted-foreground">Janela de manutenção</label>
                  <select value={s.firmwareWindow} onChange={e => set({ firmwareWindow: e.target.value })} className="mt-1 h-9 w-full rounded-md border border-border bg-input px-2 text-sm text-foreground focus:outline-none">
                    <option value="01:00">01:00 – 02:00</option>
                    <option value="03:00">03:00 – 04:00</option>
                    <option value="04:00">04:00 – 05:00</option>
                  </select>
                  <p className="mt-1 text-xs text-muted-foreground">Evite horários críticos (06:00 – 22:00).</p>
                </div>
              </div>
            )}

            {/* Etapa 5 — Revisão */}
            {s.step === 5 && (
              <div className="space-y-3">
                <div className="rounded-md border border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm leading-relaxed">{summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <InfoRow label="IP" value={s.ip || '—'} mono />
                  <InfoRow label="Driver" value={s.driver} />
                  <InfoRow label="Credencial padrão" value={s.removeFactoryCreds ? 'Removida' : 'Mantida'} />
                  <InfoRow label="Portas" value={s.closeUnusedPorts ? 'Endurecidas' : 'Padrão'} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
            <button className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent" onClick={close}>Cancelar</button>
            <div className="flex gap-2">
              {s.step > 1 && (
                <button className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm hover:bg-accent" onClick={() => set({ step: s.step - 1 })}>
                  <ChevronLeft className="h-4 w-4" /> Voltar
                </button>
              )}
              {s.step < 5 && (
                <button
                  className="inline-flex h-9 items-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  onClick={() => set({ step: s.step + 1 })}
                  disabled={(s.step === 1 && !canNext1) || (s.step === 2 && !canNext2)}
                >
                  Avançar <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {s.step === 5 && (
                <button className="inline-flex h-9 items-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={handleConfirm}>
                  <Check className="h-4 w-4" /> Confirmar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Descobrir na Rede ────────────────────────────────────────────────────────

export function DiscoverDialog({ open, onOpenChange, onAdd }) {
  const [scanning, setScanning] = useState(false)
  const [found, setFound] = useState([])

  const start = () => {
    setScanning(true); setFound([])
    setTimeout(() => {
      setFound([
        { ip: '10.0.12.27', vendor: 'AxisVision', protocol: 'ONVIF Profile S' },
        { ip: '10.0.12.28', vendor: 'HikSecure', protocol: 'ONVIF Profile T' },
        { ip: '10.0.13.44', vendor: 'Aeotec', protocol: 'Z-Wave 800' },
      ])
      setScanning(false)
    }, 1600)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Descobrir dispositivos na rede</h2>
          <p className="mt-1 text-sm text-muted-foreground">Varredura ativa em 10.0.0.0/16 via ONVIF, mDNS, Z-Wave e Zigbee.</p>
          <div className="mt-4 space-y-3">
            <button
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              onClick={start} disabled={scanning}
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              {scanning ? 'Varrendo rede...' : 'Iniciar varredura'}
            </button>
            {scanning && (
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[70%] rounded-full bg-primary" />
              </div>
            )}
            <div className="space-y-2">
              {!scanning && found.length === 0 && (
                <p className="rounded-md border border-dashed border-border p-6 text-center text-xs text-muted-foreground">Nenhum dispositivo descoberto ainda.</p>
              )}
              {found.map(f => (
                <div key={f.ip} className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3">
                  <div>
                    <p className="text-sm font-medium">{f.vendor} <span className="font-mono text-xs text-muted-foreground">({f.ip})</span></p>
                    <p className="text-xs text-muted-foreground">{f.protocol}</p>
                  </div>
                  <button
                    className="rounded-md bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
                    onClick={() => {
                      onAdd({
                        id: `disc-${Date.now()}`, name: `${f.vendor} ${f.ip.split('.').pop()}`,
                        type: f.protocol.includes('Z-Wave') ? 'sensor' : 'camera',
                        sector: 'Doca Norte', ip: f.ip, driver: f.protocol,
                        firmware: 'v1.0.0', firmwareLatest: 'v1.0.0',
                        signal: 80, lastActivity: 'agora', defaultCredentials: false, uptime: '0', status: 'online',
                      })
                      setFound(prev => prev.filter(x => x.ip !== f.ip))
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end border-t border-border pt-4">
            <button className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent" onClick={() => onOpenChange(false)}>Fechar</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Importar CSV ─────────────────────────────────────────────────────────────

export function ImportCsvDialog({ open, onOpenChange, onImport }) {
  const [step, setStep] = useState('upload')
  const [cloneMacro, setCloneMacro] = useState(true)
  const [rows, setRows] = useState([])

  const close = () => { onOpenChange(false); setTimeout(() => { setStep('upload'); setRows([]) }, 300) }

  const handleFile = () => {
    setRows([
      { name: 'Câmera 08', type: 'camera', sector: 'Doca Norte', ip: '10.0.12.30', ok: true },
      { name: 'Câmera 09', type: 'camera', sector: 'Doca Norte', ip: '10.0.12.31', ok: true },
      { name: 'Sensor PIR 04', type: 'sensor', sector: 'Recepção', ip: '10.0.13.45', ok: true },
      { name: 'Sensor ??', type: 'sensor', sector: '—', ip: 'INVALID', ok: false, error: 'IP inválido' },
      { name: 'Controlador C1', type: 'controller', sector: 'Central', ip: '10.0.10.13', ok: false, error: 'IP já cadastrado' },
    ])
    setStep('map')
  }

  const confirm = () => {
    onImport(rows.filter(r => r.ok).map((r, i) => ({
      id: `imp-${Date.now()}-${i}`, name: r.name, type: r.type, sector: r.sector, ip: r.ip,
      driver: r.type === 'camera' ? 'ONVIF Profile S' : r.type === 'sensor' ? 'Z-Wave 800' : 'Modbus TCP',
      firmware: 'v1.0.0', firmwareLatest: 'v1.0.0', signal: 85, lastActivity: 'agora',
      defaultCredentials: false, uptime: '0', status: 'online',
    })))
    close()
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={close} />
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Importar CSV</h2>
          <p className="mt-1 text-sm text-muted-foreground">Provisione múltiplos dispositivos a partir de uma planilha.</p>
          <div className="mt-4">
            <Stepper step={step === 'upload' ? 1 : step === 'map' ? 2 : 3} steps={['Upload', 'Mapeamento', 'Pré-visualização']} />
          </div>

          <div className="py-4">
            {step === 'upload' && (
              <button
                onClick={handleFile}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-background/40 p-10 hover:border-primary"
              >
                <FileSpreadsheet className="h-10 w-10 text-primary" />
                <p className="text-sm font-medium">Clique para selecionar o arquivo CSV</p>
                <p className="text-xs text-muted-foreground">Ou arraste para esta área. UTF-8, vírgula como separador.</p>
              </button>
            )}

            {step === 'map' && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Mapeie as colunas do CSV para os campos do sistema.</p>
                <div className="grid grid-cols-2 gap-2">
                  {['name → Nome', 'type → Tipo', 'sector → Setor', 'ip → IP/Hostname'].map(m => (
                    <div key={m} className="flex items-center gap-2 rounded-md border border-border bg-background/40 p-2 font-mono text-xs">
                      <Check className="h-3.5 w-3.5 text-success" /> {m}
                    </div>
                  ))}
                </div>
                <ToggleRow label="Clonar configuração-base (macro) para todas as linhas" checked={cloneMacro} onChange={setCloneMacro} />
                <div className="flex justify-between border-t border-border pt-4">
                  <button className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent" onClick={() => setStep('upload')}>Voltar</button>
                  <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={() => setStep('preview')}>Pré-visualizar</button>
                </div>
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-3">
                <div className="max-h-[320px] overflow-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-2 py-1.5 text-left">Status</th>
                        <th className="px-2 py-1.5 text-left">Nome</th>
                        <th className="px-2 py-1.5 text-left">Tipo</th>
                        <th className="px-2 py-1.5 text-left">Setor</th>
                        <th className="px-2 py-1.5 text-left">IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i} className={`border-t border-border ${!r.ok ? 'bg-destructive/5' : ''}`}>
                          <td className="px-2 py-1.5">
                            {r.ok
                              ? <Check className="h-4 w-4 text-success" />
                              : <span className="inline-flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="h-3.5 w-3.5" /> {r.error}</span>
                            }
                          </td>
                          <td className="px-2 py-1.5">{r.name}</td>
                          <td className="px-2 py-1.5 text-xs">{TYPE_LABEL[r.type]}</td>
                          <td className="px-2 py-1.5 text-xs">{r.sector}</td>
                          <td className="px-2 py-1.5 font-mono text-xs">{r.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">
                  {rows.filter(r => r.ok).length} válido(s), {rows.filter(r => !r.ok).length} com erro de vinculação.
                </p>
                <div className="flex justify-between border-t border-border pt-4">
                  <button className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent" onClick={() => setStep('map')}>Voltar</button>
                  <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={confirm}>
                    Importar {rows.filter(r => r.ok).length} dispositivos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
