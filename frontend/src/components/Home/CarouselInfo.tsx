// useState y useEffect: manejan estado y efectos como llamadas a APIs
import { useEffect, useState } from "react";
import "./CarouselInfo.css";

// Interfaz que define qué datos devuelve la API de estadísticas
interface Stats {
  ciudadanos: number;
  alertasTotales: number;
  alertasAtendidas: number;
  alertasPendientes: number;
}

const CarouselInfo = () => {
  // Estado donde guardamos las estadísticas. Comienza en null mientras carga.
  const [stats, setStats] = useState<Stats | null>(null);

  // Función para traer estadísticas desde el backend
  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
      const res = await fetch(`${apiUrl}/stats`); // 🟩 Llama a tu API
      const data = await res.json();                              // 🟩 Convierte a JSON
      setStats(data);                                             // 🟩 Guarda datos en el estado
    } catch (error) {
      console.error("Error cargando estadísticas", error);
    }
  };

  // Carga las estadísticas al montar el componente + refresca cada 30s
  useEffect(() => {
    fetchStats();                               // Primera carga
    const interval = setInterval(fetchStats, 30000); // Auto-actualización cada 30s

    return () => clearInterval(interval);       // Limpia el intervalo si se desmonta
  }, []);

  // Mientras no lleguen los datos, muestra texto de carga
  if (!stats) return <p className="text-center text-light">Cargando...</p>;

  // Arreglo con lo que se va a mostrar en el carrusel
  const items = [
    { label: "Ciudadanos registrados", value: stats.ciudadanos },
    { label: "Alertas totales", value: stats.alertasTotales },
    { label: "Alertas atendidas", value: stats.alertasAtendidas },
    { label: "Alertas por atender", value: stats.alertasPendientes },
  ];

  return (
    <div className="stats-strip">
      {/* Track que se desplaza horizontalmente estilo carrusel infinito */}
      <div className="stats-track">

        {/* Se duplican los items para lograr el loop sin saltos */}
        {[...items, ...items].map((item, i) => (
          <div className="stats-item" key={i}>
            <span className="stats-label">{item.label}</span>
            <span className="stats-value">{item.value}</span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CarouselInfo;
