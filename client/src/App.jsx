import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Camera from "./componentes/camera";
import "./App.css";

function App() {
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar dispositivos do banco
    async function buscarDispositivos() {
      try {
        const { data, error } = await supabase
          .from("dispositivos")
          .select("*")
          .eq("tipo", "camera"); // Buscando apenas as câmeras por enquanto

        if (error) throw error;
        setDispositivos(data);
      } catch (error) {
        console.error("Erro ao carregar dispositivos:", error.message);
      } finally {
        setLoading(false);
      }
    }

    buscarDispositivos();
  }, []);

  return (
    <div className="min-h-screen p-6 text-white flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">SecFusion</h1>
        <p className="text-gray-400 mt-2">
          Painel de Monitoramento Baseado em Supabase
        </p>
      </header>

      <main className="w-full max-w-6xl">
        {loading ? (
          <div className="text-center text-gray-400">
            Carregando sistemas...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {dispositivos.map((disp) => (
              <div key={disp.id} className="flex flex-col items-center gap-2">
                <Camera />
                <span className="font-semibold text-sm">{disp.nome}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${disp.status === "ativo" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
                >
                  {disp.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
