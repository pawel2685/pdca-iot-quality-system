import { useEffect, useState } from "react";
import type { Alert } from "../types/Alert";
import { getAlerts } from "../api/Alerts";

function DashboardPage() {

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getAlerts();
        if (isMounted) {
          setAlerts(data);
        }
      } catch (error) {
        console.error("Failed to load alerts:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // Początkowe ładowanie
    load();

    // Polling co 2 sekundy dla live mode
    const interval = setInterval(() => {
      if (isMounted) {
        load();
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div className="text-slate-200">Ładowanie alertów...</div>;
  }


  const now = new Date();

  const todaysAlerts = alerts.filter((alert) => {
    const ts = new Date(alert.timestamp);
    return (
      ts.getFullYear() === now.getFullYear() &&
      ts.getMonth() === now.getMonth() &&
      ts.getDate() === now.getDate()
    );
  });

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const unassignedLast7Days = alerts.filter((alert) => {
    const ts = new Date(alert.timestamp);
    return (
      ts >= sevenDaysAgo &&
      ts <= now
    );
  });

  return (
    <div className="space-y-6">
      <section className="rounded-xl p-4 border shadow-md" style={{ backgroundColor: '#3c3c3c', borderColor: '#2e2e2e' }}>
        <h2 className="text-xl font-semibold mb-3">Dzisiejsze alerty</h2>
        <ul className="space-y-2 text-sm">
          {todaysAlerts.map((alert) => (
            <li
              key={alert.id}
              className="flex items-center gap-8 rounded-lg px-6 py-5" 
              style={{ backgroundColor: alert.status === 'ALERT' ? '#8b3a3a' : '#8b7d3a' }}
            >
              <div className="text-5xl flex-shrink-0 animate-pulse">
                {alert.status === 'ALERT' ? '🔴' : '⚠️'}
              </div>
              <div className="h-12 w-px bg-slate-400/30"></div>
              <div className="font-bold text-xl min-w-[140px]">{alert.status}</div>
              <div className="h-12 w-px bg-slate-400/30"></div>
              <div className="font-semibold text-xl min-w-[200px]">{alert.machine}</div>
              <div className="h-12 w-px bg-slate-400/30"></div>
              <div className="flex items-center gap-12 flex-1 text-lg">
                <div className="font-medium">{alert.parameter}</div>
                <div>value: <span className="font-semibold">{alert.value}</span></div>
                <div>threshold: <span className="font-semibold">{alert.threshold}</span></div>
              </div>
              <div className="text-xl text-slate-200 font-semibold">{alert.state}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl p-4 border shadow-md" style={{ backgroundColor: '#3c3c3c', borderColor: '#2e2e2e' }}>
          <h2 className="text-lg font-semibold mb-2">
            Nieprzypisane alerty z ostatnich 7 dni
          </h2>
          <ul className="space-y-2 text-sm">
            {unassignedLast7Days.map((alert) => (
              <li
                key={alert.id}
                className="flex items-center gap-8 rounded-lg px-6 py-5" 
                style={{ backgroundColor: alert.status === 'ALERT' ? '#8b3a3a' : '#8b7d3a' }}
              >
                <div className="text-5xl flex-shrink-0 animate-pulse">
                  {alert.status === 'ALERT' ? '🔴' : '⚠️'}
                </div>
                <div className="h-12 w-px bg-slate-400/30"></div>
                <div className="font-bold text-xl min-w-[140px]">{alert.status}</div>
                <div className="h-12 w-px bg-slate-400/30"></div>
                <div className="font-semibold text-xl min-w-[200px]">{alert.machine}</div>
                <div className="h-12 w-px bg-slate-400/30"></div>
                <div className="flex items-center gap-12 flex-1 text-lg">
                  <div className="font-medium">{alert.parameter}</div>
                  <div>value: <span className="font-semibold">{alert.value}</span></div>
                  <div>threshold: <span className="font-semibold">{alert.threshold}</span></div>
                </div>
                <div className="text-xl text-slate-200 font-semibold">{alert.state}</div>
              </li>
            ))}
          </ul>
      </section>
    </div>
  );
}

export default DashboardPage;
