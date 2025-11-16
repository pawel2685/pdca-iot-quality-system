import { mockAlerts } from "../data/MockAlerts";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="bg-slate-800/80 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">Dzisiejsze alerty</h2>
        <ul className="space-y-2 text-sm">
          {mockAlerts.map((alert) => (
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
              <div className="text-xs text-slate-400">
                {alert.assignee ?? "Unassigned"}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-slate-800/80 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">
          Nieprzypisane alerty z ostatnich 7 dni
        </h2>
        <p className="text-sm text-slate-300">
          Tu będziemy filtrować nieprzypisane alerty z ostatniego tygodnia.
        </p>
      </section>
    </div>
  );
}

export default DashboardPage;
