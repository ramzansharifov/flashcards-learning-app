import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import ProgressBar from "../../components/ui/ProgressBar";
import { TrainIcon } from "../../components/ui/Icons";

export default function TrainingResults() {
    const navigate = useNavigate();
    const { wsId, topicId } = useParams<{ wsId: string; topicId: string }>();
    const state = useLocation().state as { known?: number; total?: number; percent?: number } | null;

    const known = state?.known ?? 0;
    const total = state?.total ?? 0;
    const percent = state?.percent ?? 0;
    const pct = Math.max(0, Math.min(100, Math.round(percent)));

    return (
        <div className="mx-auto max-w-7xl w-full md:w-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <PageTitle
                title="Results"
                subtitle={`Accuracy: ${pct}%`}
                icon={
                    <TrainIcon />
                }
            />

            <div className="mt-4 max-w-2xl rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm">
                <ProgressBar value={pct} />

                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl border border-[#212529]/10 bg-white p-3">
                        <div className="text-xs text-[#212529]/60">Known</div>
                        <div className="text-lg font-bold">{known}</div>
                    </div>
                    <div className="rounded-xl border border-[#212529]/10 bg-white p-3">
                        <div className="text-xs text-[#212529]/60">Total</div>
                        <div className="text-lg font-bold">{total}</div>
                    </div>
                    <div className="rounded-xl border border-[#212529]/10 bg-white p-3">
                        <div className="text-xs text-[#212529]/60">Accuracy</div>
                        <div className="text-lg font-bold">{pct}%</div>
                    </div>
                </div>

                <p className="mt-3 text-sm">
                    You knew <b>{known}</b> of <b>{total}</b> cards (<b>{pct}%</b>).
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                        onClick={() => navigate(`/training/${wsId}/${topicId}`)}
                    >
                        Train again
                    </button>
                    <button
                        className="rounded-lg border border-[#212529]/15 bg-white px-4 py-2 text-sm hover:bg-white/80"
                        onClick={() => navigate("/training")}
                    >
                        Back to Training
                    </button>
                    <button
                        className="rounded-lg border border-[#212529]/15 bg-white px-4 py-2 text-sm hover:bg-white/80"
                        onClick={() => navigate("/")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
