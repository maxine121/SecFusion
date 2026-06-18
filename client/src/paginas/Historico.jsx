import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Dados mockados — sem conexão com o Supabase, como pedido.
const MOCK_EVENTOS = [
  {
    id: 1,
    dataHora: '2026-06-17T08:42:00',
    usuario: 'Bruno Castro',
    acao: 'Resolveu alerta: sensor de movimento ativado',
    setor: 'Estacionamento',
    status: 'sucesso',
  },
  {
    id: 2,
    dataHora: '2026-06-17T07:15:00',
    usuario: 'Patrícia Gomes',
    acao: 'Acionou alarme manual',
    setor: 'Perímetro Sul',
    status: 'sucesso',
  },
  {
    id: 3,
    dataHora: '2026-06-17T06:58:00',
    usuario: 'Sistema',
    acao: 'Tentativa de reinício do hub — sem resposta',
    setor: 'Central',
    status: 'falha',
  },
  {
    id: 4,
    dataHora: '2026-06-16T22:30:00',
    usuario: 'Felipe Rocha',
    acao: 'Atualizou firmware da Câmera 03',
    setor: 'Recepção',
    status: 'sucesso',
  },
  {
    id: 5,
    dataHora: '2026-06-16T19:05:00',
    usuario: 'Camila Duarte',
    acao: 'Desativou cerca elétrica para manutenção',
    setor: 'Perímetro Sul',
    status: 'pendente',
  },
  {
    id: 6,
    dataHora: '2026-06-16T14:12:00',
    usuario: 'Bruno Castro',
    acao: 'Adicionou dispositivo: Sensor Magnético 01',
    setor: 'Doca Norte',
    status: 'sucesso',
  },
  {
    id: 7,
    dataHora: '2026-06-16T09:47:00',
    usuario: 'Larissa Pinto',
    acao: 'Login no painel de operação',
    setor: 'Central',
    status: 'sucesso',
  },
  {
    id: 8,
    dataHora: '2026-06-15T23:58:00',
    usuario: 'Sistema',
    acao: 'Falha ao notificar operador — sem conexão',
    setor: 'Depósito',
    status: 'falha',
  },
]

const NIVEIS_STATUS = {
  sucesso: { label: 'Sucesso', classe: 'border-success/40 bg-success/10 text-success' },
  pendente: { label: 'Pendente', classe: 'border-warning/40 bg-warning/10 text-warning' },
  falha: { label: 'Falha', classe: 'border-destructive/40 bg-destructive/10 text-destructive' },
}

function formatarDataHora(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SeletorSetor({ valor, aoMudar, opcoes }) {
  return (
    <div className="relative">
      <select
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        className="appearance-none rounded-md border border-border bg-card py-2 pl-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="todos">Todos setores</option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

function Historico() {
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [filtroSetor, setFiltroSetor] = useState('todos')

  const setores = useMemo(() => Array.from(new Set(MOCK_EVENTOS.map((e) => e.setor))).sort(), [])

  const filtrosAtivos = Boolean(dataInicial || dataFinal || filtroSetor !== 'todos')

  function limparFiltros() {
    setDataInicial('')
    setDataFinal('')
    setFiltroSetor('todos')
  }

  const eventosFiltrados = useMemo(() => {
    return MOCK_EVENTOS.filter((evento) => {
      const dataEvento = evento.dataHora.slice(0, 10)
      const combinaInicio = !dataInicial || dataEvento >= dataInicial
      const combinaFim = !dataFinal || dataEvento <= dataFinal
      const combinaSetor = filtroSetor === 'todos' || evento.setor === filtroSetor
      return combinaInicio && combinaFim && combinaSetor
    }).sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))
  }, [dataInicial, dataFinal, filtroSetor])

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="historico-data-inicial" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            De
          </label>
          <input
            id="historico-data-inicial"
            type="date"
            value={dataInicial}
            onChange={(evento) => setDataInicial(evento.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="historico-data-final" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Até
          </label>
          <input
            id="historico-data-final"
            type="date"
            value={dataFinal}
            onChange={(evento) => setDataFinal(evento.target.value)}
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Setor</span>
          <SeletorSetor valor={filtroSetor} aoMudar={setFiltroSetor} opcoes={setores} />
        </div>

        {filtrosAtivos && (
          <button type="button" onClick={limparFiltros} className="pb-2 text-xs font-medium text-primary hover:underline">
            Limpar filtros
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-card">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Data/Hora</th>
              <th className="px-4 py-3 font-semibold">Usuário</th>
              <th className="px-4 py-3 font-semibold">Ação Realizada</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {eventosFiltrados.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Nenhum evento encontrado para os filtros selecionados.
                </td>
              </tr>
            )}

            {eventosFiltrados.map((evento) => {
              const nivel = NIVEIS_STATUS[evento.status] ?? NIVEIS_STATUS.pendente

              return (
                <tr key={evento.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{formatarDataHora(evento.dataHora)}</td>
                  <td className="px-4 py-3 text-foreground">{evento.usuario}</td>
                  <td className="px-4 py-3 text-muted-foreground">{evento.acao}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${nivel.classe}`}>
                      {nivel.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Historico
