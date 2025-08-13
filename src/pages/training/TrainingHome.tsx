import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { useTopics } from "../../hooks/useTopics";
import { notify } from "../../lib/notify";
import SkeletonList from "../../components/ui/SkeletonList";
import PageTitle from "../../components/ui/PageTitle";
import { TrainIcon } from "../../components/ui/Icons";

export default function TrainingHome() {
    const navigate = useNavigate();
    const [wsId, setWsId] = useState<string | null>(null);

    const { workspaces, loading: wsLoading } = useWorkspaces();
    const { topics, loading: tLoading } = useTopics(wsId);

    const selectedWs = useMemo(
        () => workspaces.find((w) => w.id === wsId) ?? null,
        [wsId, workspaces]
    );

    return (
        <div className="mx-auto max-w-7xl w-full md:w-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <PageTitle
                title="Training"
                subtitle="Select a workspace and a topic."
                icon={
                    <TrainIcon />
                }
            />

            {/* Workspaces */}
            <section className="mt-4 rounded-xl border border-[#212529]/10 bg-white p-4 shadow-sm">
                <h2 className="mb-2 text-sm font-semibold text-[#111827]">Choose workspace</h2>

                {wsLoading ? (
                    <SkeletonList rows={5} />
                ) : selectedWs ? (
                    <div className="flex items-center justify-between rounded-xl border-2 border-[#4F46E5] shadow bg-white px-3 py-2">
                        <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{selectedWs.name}</div>
                        </div>
                        <button
                            type="button"
                            className="rounded-lg shadow-sm border border-[#212529]/20 cursor-pointer hover:bg-[#212529]/[0.03] bg-white px-3 py-2 text-sm"
                            onClick={() => setWsId(null)}
                        >
                            Change
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {workspaces.map((ws) => (
                            <li key={ws.id}>
                                <button
                                    type="button"
                                    onClick={() => setWsId(ws.id)}
                                    className="cursor-pointer flex w-full items-center justify-between rounded-xl border border-[#212529]/10 bg-white p-4 shadow-sm text-left text-sm transition hover:bg-[#212529]/[0.03]"
                                >
                                    <span className="truncate font-medium">{ws.name}</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-60">
                                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Topics */}
            {wsId && (
                <section className="mt-4 rounded-xl border border-[#212529]/10 bg-white p-4 shadow-sm">
                    <h2 className="mb-2 text-sm font-semibold text-[#111827]">Choose topic</h2>
                    {tLoading ? (
                        <SkeletonList rows={6} />
                    ) : topics.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#212529]/15 p-6 text-center">
                            <p className="text-sm text-[#212529]/70">
                                There are no topics in this workspace yet.
                            </p>
                            <button
                                type="button"
                                className="mt-3 inline-flex items-center justify-center rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                                onClick={() => navigate("/dashboard")}
                            >
                                Create a topic
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {topics.map((t) => {
                                const cc = (t as any).cardsCount ?? 0;
                                const progress = (t as any).progress ?? 0;
                                const disabled = cc === 0;
                                return (
                                    <li
                                        key={t.id}
                                        className="flex items-center justify-between rounded-xl border border-[#212529]/10 bg-white px-3 py-2 shadow-sm"
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">{t.name}</div>
                                            <div className="mt-1 flex items-center gap-2 text-[12px] text-[#212529]/70">
                                                <span className="rounded-md bg-[#212529]/5 px-2 py-0.5">cards: {cc}</span>
                                                <span className="rounded-md bg-[#212529]/5 px-2 py-0.5">progress: {progress}%</span>
                                            </div>
                                        </div>
                                        <button
                                            className={[
                                                "ml-3 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm",
                                                disabled
                                                    ? "border border-[#212529]/15 bg-white text-[#212529]/60 cursor-not-allowed"
                                                    : "bg-[#4F46E5] cursor-pointer text-white hover:opacity-95 active:opacity-90",
                                            ].join(" ")}
                                            onClick={() => {
                                                if (disabled) {
                                                    notify.err("This topic has no cards.");
                                                    return;
                                                }
                                                navigate(`/training/${wsId}/${t.id}`);
                                            }}
                                            title={disabled ? "This topic has no cards" : ""}
                                        >
                                            Train
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                </section>
            )}
        </div>
    );
}
