import Camera from '../componentes/camera'
import CardsStatus from '../componentes/dashboard/CardsStatus'
import RespostaRapida from '../componentes/dashboard/RespostaRapida'
import PainelAlertas from '../componentes/dashboard/PainelAlertas'

// Mapeamento das 6 câmeras do protótipo. O componente Camera é o original
// (não foi alterado) — só passamos as props que ele já aceita: nome e numero.
const CAMERAS = [
  { numero: '01', nome: 'Entrada Principal' },
  { numero: '02', nome: 'Estacionamento' },
  { numero: '03', nome: 'Recepção' },
  { numero: '04', nome: 'Corredor Leste' },
  { numero: '05', nome: 'Depósito' },
  { numero: '06', nome: 'Perímetro Sul' },
]

// Dados mockados — entram aqui até a conexão com o Supabase ser ajustada.
const ALERTAS_MOCK = [
  {
    id: 1,
    titulo: 'Sensor de movimento ativado',
    descricao: 'Estacionamento • Câmera 02',
    tempo: 'há 12s',
    nivel: 'critico',
  },
  {
    id: 2,
    titulo: 'Cerca elétrica — vibração detectada',
    descricao: 'Perímetro Sul • Câmera 06',
    tempo: 'há 1m',
    nivel: 'medio',
  },
  {
    id: 3,
    titulo: 'Porta aberta fora do horário',
    descricao: 'Entrada Principal • Câmera 01',
    tempo: 'há 3m',
    nivel: 'medio',
  },
  {
    id: 4,
    titulo: 'Temperatura acima do limite',
    descricao: 'Depósito • Câmera 05',
    tempo: 'há 7m',
    nivel: 'baixo',
  },
]

function Dashboard() {
  return (
    <div className="flex h-full flex-col gap-4 p-4 lg:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <CardsStatus totalAlertas={ALERTAS_MOCK.length} />

        <RespostaRapida />

        <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
          {CAMERAS.map((camera) => (
            <Camera key={camera.numero} numero={camera.numero} nome={camera.nome} />
          ))}
        </div>
      </div>

      <PainelAlertas alertas={ALERTAS_MOCK} />
    </div>
  )
}

export default Dashboard
