import { useParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";

function PdcaCaseDetailsPage() {
    const { caseId } = useParams<{ caseId: string }>();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
            <AppHeader title="PDCA Case Details" />
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-6">
                        <h2 className="text-lg font-semibold mb-4">Case {caseId}</h2>
                        <p className="text-slate-400">Details page placeholder</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PdcaCaseDetailsPage;
