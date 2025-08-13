"use client";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const DATA = [
    { id: "5min", time: "5 mins", Restudy: 81, Test: 75 },
    { id: "2days", time: "2 days", Restudy: 54, Test: 68 },
    { id: "1week", time: "1 week", Restudy: 42, Test: 56 },
];

export function EvidenceBlock() {
    return (
        <section id="evidence" className="bg-white scroll-mt-[10vh]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <h2 className="text-2xl sm:text-3xl font-bold">Scientific Basis</h2>
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Left column — text */}
                    <div>
                        <p className="mt-3 text-[#212529]/80 text-sm sm:text-[17px]">
                            Flashcards work through <strong>retrieval practice</strong> (active recall)
                            and <strong>spaced repetition</strong>. In the study by Roediger &amp; Karpicke (2006),
                            students who practiced through testing demonstrated significantly better
                            long-term retention compared to those who simply reread the material.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-[#212529]/80">
                            <li>• After 2 days: testing ≈ <strong>68%</strong> vs. <strong>54%</strong> for rereading.</li>
                            <li>• After 1 week: testing ≈ <strong>56%</strong> vs. <strong>42%</strong>.</li>
                        </ul>

                        <div className="mt-12 flex flex-wrap items-center gap-3">
                            <a
                                href="https://pubmed.ncbi.nlm.nih.gov/16507066/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 text-sm sm:text-base font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90"
                            >
                                PubMed Article
                            </a>
                            <a
                                href="https://apps.weber.edu/wsuimages/psychology/Testing%20Improves%20Memory.pdf"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-xl border border-[#212529]/15 bg-white px-5 py-3 text-sm sm:text-base font-semibold hover:bg-white/70"
                            >
                                PDF Data
                            </a>
                        </div>

                        <p className="mt-3 text-xs text-[#212529]/60">
                            Data for the chart are taken from the figures and text of the article (Experiment 1).
                            Values are rounded to whole numbers for clarity.
                        </p>
                    </div>

                    {/* Right column — chart */}
                    <div className="rounded-xl border border-[#212529]/10 bg-white p-4 sm:p-6 shadow-sm">
                        <h3 className="text-[17px] font-semibold mb-3">Testing vs. Rereading</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={DATA}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                                    <XAxis dataKey="time" tickMargin={8} />
                                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                    <Tooltip formatter={(v: number) => `${v}%`} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="Test"
                                        stroke="#4F46E5"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        isAnimationActive
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Restudy"
                                        stroke="#94A3B8"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        isAnimationActive
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 text-xs text-[#212529]/60">
                            Average percentage of recall on the final test after 5 minutes, 2 days, and 1 week.
                            Source: Roediger &amp; Karpicke (2006).
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
}
