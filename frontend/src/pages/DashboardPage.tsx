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
      <section className="bg-slate-800/80 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">Dzisiejsze alerty</h2>
        <ul className="space-y-2 text-sm">
          {todaysAlerts.map((alert) => (
            <li
              key={alert.id}
              className="flex justify-between items-center rounded-lg bg-slate-900/70 px-3 py-2"
            >
              <div>
                <div className="font-medium">
                  {alert.machine} – {alert.parameter}
                </div>
                <div className="text-slate-300">
                  status: {alert.status} • value: {alert.value} (threshold:{" "}
                  {alert.threshold})
                </div>
              </div>
              <div className="text-xs text-slate-400">{alert.state}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-800/80 rounded-xl p-4">
        <section className="bg-slate-800/80 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-2">
            Nieprzypisane alerty z ostatnich 7 dni
          </h2>
          <ul className="space-y-2 text-sm">
            {unassignedLast7Days.map((alert) => (
              <li
                key={alert.id}
                className="flex justify-between items-center rounded-lg bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <div className="font-medium">
                    {alert.machine} – {alert.parameter}
                  </div>
                  <div className="text-slate-300">
                    status: {alert.status} • value: {alert.value} (threshold:{" "}
                    {alert.threshold})
                  </div>
                </div>
                <div className="text-xs text-slate-400">{alert.state}</div>
              </li>
            ))}
          </ul>
        </section>

      </section>
    </div>
  );
}

export default DashboardPage;
