// pages/Tutorial.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PageTitle from "../components/ui/PageTitle";
import { TrainIcon, RenameIcon, DeleteIcon } from "../components/ui/Icons";

/* ────────────────────────────────────────────────────────────────────────── */
/* ДАННЫЕ ШАГОВ                                                              */
/* ────────────────────────────────────────────────────────────────────────── */
type StepItem = {
    id: string;
    title: string;
    desc: string;
    type: "image" | "video" | "code";
    src?: string;
    poster?: string;
    code?: string;
    note?: string;
};

const STEPS: StepItem[] = [
    {
        id: "signup",
        title: "Sign Up or Sign In",
        desc:
            "Create an account with your email to save your progress, workspaces, topics, and flashcards. You can try a demo training without logging in, but the results won’t be saved there.",
        type: "image",
        src: "/signup.png",
        note: "The login button is in the top right corner. After signing up, you will be taken to the Dashboard.",
    },
    {
        id: "workspace",
        title: "Create a workspace",
        desc:
            "A workspace is a top-level “folder” (for example, “Biology”, “English B2”, “Frontend”). Inside are topics and flashcards.",
        type: "image",
        src: "/workspace.png",
        note: "Give clear names — it will be easier to navigate the list. To open a workspace folder, click on it in the sidebar.",
    },
    {
        id: "topic",
        title: "Add a topic",
        desc:
            "A topic is a section within a workspace (for example, “Genetics” in “Biology”). Training is launched for a specific topic.",
        type: "image",
        src: "/topic.png",
        note: "To go to the flashcards section, click on the topic.",
    },
    {
        id: "cards",
        title: "Create flashcards",
        desc:
            "A flashcard consists of two sides: “Question” and “Answer”. Add them manually or import multiple cards at once from JSON.",
        type: "image",
        src: "/card.png",
        note:
            "Flashcards support very long “questions”/“answers” — during training, left alignment and internal scrolling are enabled.",
    },
    {
        id: "training",
        title: "Start a training session",
        desc:
            "Select a topic and start: flip the card by clicking, mark “Know/Don’t know”. The topic progress will update upon completion. You can start training from the Dashboard (Train icon) or directly on the Training page.",
        type: "video",
        src: "/training.mp4",
        poster: "/poster.png",
        note:
            "If a topic has no flashcards, the button in the Dashboard will be visible and active, but starting will end with a hint: add flashcards first.",
    },
];

/* ────────────────────────────────────────────────────────────────────────── */
/* SCROLL-SPY C ХЕШ-НАВИГАЦИЕЙ                                                */
/* ────────────────────────────────────────────────────────────────────────── */
function useScrollSpy(ids: string[], offsetPx = 96) {
    const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

    useEffect(() => {
        const getActive = () => {
            const scrollY = window.pageYOffset + offsetPx + 1;
            let current: string | null = null;
            for (const id of ids) {
                const el = document.getElementById(id);
                if (!el) continue;
                const top = el.offsetTop;
                if (top <= scrollY) current = id;
            }
            setActiveId(current ?? ids[0] ?? null);
        };

        getActive();
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    getActive();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [ids, offsetPx]);

    const scrollToId = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.pageYOffset - offsetPx;
        window.scrollTo({ top: y, behavior: "smooth" });
        setActiveId(id);
    };

    return { activeId, scrollToId };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* ИКОНКА ДЛЯ ЗАГОЛОВКА                                                       */
/* ────────────────────────────────────────────────────────────────────────── */
function GuideIcon() {
    return (
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[#4F46E5]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6h4" />
                <path d="M2 10h4" />
                <path d="M2 14h4" />
                <path d="M2 18h4" />
                <rect width="16" height="20" x="4" y="2" rx="2" />
                <path d="M9.5 8h5" />
                <path d="M9.5 12H16" />
                <path d="M9.5 16H14" />
            </svg>
        </span>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* СТРАНИЦА TUTORIAL                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
export default function Tutorial() {
    // порядок в оглавлении: шаги → JSON → значки → вложенность
    const navOrder = useMemo(
        () => [
            ...STEPS.map((s) => s.id),
            "json",
            "legend",
            "nesting",
        ],
        []
    );
    const { activeId, scrollToId } = useScrollSpy(navOrder);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <PageTitle
                title="How to use FlashCards"
                subtitle="Quick start: registration, structure (workspaces → topics → flashcards), import, and training."
                icon={<GuideIcon />}
            />


            <div className="mt-6 grid grid-cols-12 gap-6">
                {/* Контент */}
                <main className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-6">
                    {/* Шаги */}
                    {STEPS.map((step, i) => (
                        <StepBlock key={step.id} step={step} index={i + 1} />
                    ))}

                    {/* Шпаргалка по JSON + промпт для GPT */}
                    <JsonCheatsheet />

                    {/* Значки (после основных блоков) */}
                    <IconLegend />

                    {/* Вложенность (после основных блоков) */}
                    <NestingTips />

                    <Farewell />
                </main>

                {/* Оглавление (sticky) */}
                <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
                    <nav aria-label="Table of contents" className="lg:sticky lg:top-20">
                        <div className="rounded-xl border border-[#212529]/10 bg-white p-4 shadow-sm">
                            <h4 className="text-sm font-semibold">On this page</h4>
                            <ul className="mt-3 space-y-2">
                                {STEPS.map((s) => {
                                    const active = activeId === s.id;
                                    return (
                                        <li key={s.id}>
                                            <a
                                                href={`#${s.id}`}
                                                onClick={(e) => { e.preventDefault(); scrollToId(s.id); }}
                                                className={`block rounded-lg px-3 py-2 text-sm transition ${active ? "bg-[#4F46E5]/10 text-[#4F46E5] font-semibold" : "hover:bg-[#212529]/5 text-[#212529]/80"
                                                    }`}
                                            >
                                                {s.title}
                                            </a>
                                        </li>
                                    );
                                })}
                                <li>
                                    <a
                                        href="#json"
                                        onClick={(e) => { e.preventDefault(); scrollToId("json"); }}
                                        className={`block rounded-lg px-3 py-2 text-sm transition ${activeId === "json" ? "bg-[#4F46E5]/10 text-[#4F46E5] font-semibold" : "hover:bg-[#212529]/5 text-[#212529]/80"
                                            }`}
                                    >
                                        Import from JSON + AI
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#legend"
                                        onClick={(e) => { e.preventDefault(); scrollToId("legend"); }}
                                        className={`block rounded-lg px-3 py-2 text-sm transition ${activeId === "legend" ? "bg-[#4F46E5]/10 text-[#4F46E5] font-semibold" : "hover:bg-[#212529]/5 text-[#212529]/80"
                                            }`}
                                    >
                                        Badges in the Dashboard
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#nesting"
                                        onClick={(e) => { e.preventDefault(); scrollToId("nesting"); }}
                                        className={`block rounded-lg px-3 py-2 text-sm transition ${activeId === "nesting" ? "bg-[#4F46E5]/10 text-[#4F46E5] font-semibold" : "hover:bg-[#212529]/5 text-[#212529]/80"
                                            }`}
                                    >
                                        How the hierarchy works
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </aside>
            </div>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* БЛОК: ЗНАЧКИ В DASHBOARD                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
function IconLegend() {
    return (
        <motion.section
            id="legend"
            className="scroll-mt-24 rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-base font-semibold">Badges in the Dashboard</h3>
            <p className="mt-1 text-sm text-[#212529]/80">
                On <b>topic</b> and <b>flashcard</b> cards, three functional buttons are displayed. On
                <b> workspaces</b>, these same actions are available through the “three dots” menu.
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <LegendItem
                    icon={<TrainIcon />}
                    title="Train"
                    text="Starts training for the topic. If the topic has no flashcards, the button is visible and active, but starting will end with a hint: add flashcards first."
                />
                <LegendItem
                    icon={<RenameIcon />}
                    title="Rename"
                    text="Rename a workspace/topic/flashcard. Does not affect progress."
                />
                <LegendItem
                    icon={<DeleteIcon />}
                    title="Delete"
                    text="Delete a workspace/topic/flashcard. This action cannot be undone."
                />
            </div>
        </motion.section>
    );
}

function LegendItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
    return (
        <div className="rounded-xl border border-[#212529]/10 bg-white p-4">
            <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]/10 text-[#4F46E5]">
                    {icon}
                </span>
                <div className="text-sm font-semibold">{title}</div>
            </div>
            <p className="mt-2 text-[13px] text-[#212529]/75">{text}</p>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* БЛОК: ВЛОЖЕННОСТЬ                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function NestingTips() {
    return (
        <motion.section
            id="nesting"
            className="scroll-mt-24 rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-base font-semibold">How the hierarchy works</h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
                <HierarchyCard
                    title="Workspaces"
                    desc="Large sections (for example, “Biology”, “English B2”, “Frontend”). Topics are created inside them."
                />
                <HierarchyCard
                    title="Topics"
                    desc="Subsections within a workspace (for example, “Genetics”). Inside are flashcards. Training is launched for a specific topic."
                />
                <HierarchyCard
                    title="Flashcards"
                    desc="Pairs of “question/answer”. Very long texts are also supported — training has scrolling and an adapted layout."
                />
            </div>

            <ul className="mt-3 list-disc pl-5 text-sm text-[#212529]/80 space-y-1">
                <li>Create topics with clear boundaries — this makes it easier to review exactly the material you need.</li>
                <li>Check the counters on topic cards: the number of flashcards and the current progress.</li>
                <li>Training can be started from both the Dashboard and the Training page.</li>
            </ul>

        </motion.section>
    );
}

function Farewell() {
    return (
        <motion.section
            className="mt-6 rounded-xl border border-[#212529]/10 bg-white p-6 text-center shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.3 }}
        >
            <p className="text-lg font-semibold text-[#4F46E5]">Enjoy using it!</p>
            <p className="mt-1 text-sm text-[#212529]/75">
                Experiment, import your own sets, and level up every day 🚀
            </p>
        </motion.section>

    );
}

function HierarchyCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-xl border border-[#212529]/10 bg-white p-4">
            <div className="text-sm font-semibold">{title}</div>
            <p className="mt-1 text-[13px] text-[#212529]/75">{desc}</p>
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* БЛОК: ШАГ                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
function StepBlock({ step, index }: { step: StepItem; index: number }) {
    return (
        <motion.section
            id={step.id}
            className="scroll-mt-24 rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-3 flex items-center gap-3">
                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#4F46E5]/10 text-sm font-semibold text-[#4F46E5]">
                    {index}
                </span>
                <h3 className="text-base font-semibold">{step.title}</h3>
            </div>

            <p className="text-sm text-[#212529]/80 whitespace-pre-line">{step.desc}</p>

            <div className="mt-4">
                {step.type === "image" && <MediaFrame type="image" src={step.src!} caption={step.note} />}
                {step.type === "video" && <MediaFrame type="video" src={step.src!} poster={step.poster} caption={step.note} />}
                {step.type === "code" && <CodeBlock code={step.code!} caption={step.note} />}
            </div>
        </motion.section>
    );
}

function MediaFrame({
    type,
    src,
    poster,
    caption,
}: {
    type: "image" | "video";
    src: string;
    poster?: string;
    caption?: string;
}) {
    const [finalSrc, setFinalSrc] = useState(src);
    const [finalPoster, setFinalPoster] = useState(poster);

    useEffect(() => {
        const isMobile = window.matchMedia("(max-width: 640px)").matches;

        const appendMobileSuffix = (path?: string) => {
            if (!path) return path;
            const dotIndex = path.lastIndexOf(".");
            if (dotIndex === -1) return path;
            return path.slice(0, dotIndex) + "-m" + path.slice(dotIndex);
        };

        if (isMobile) {
            setFinalSrc(appendMobileSuffix(src)!);
            if (poster) setFinalPoster(appendMobileSuffix(poster));
        } else {
            setFinalSrc(src);
            setFinalPoster(poster);
        }
    }, [src, poster]);

    return (
        <figure>
            <div className="overflow-hidden rounded-xl border border-[#212529]/10 bg-white">
                {type === "image" ? (
                    <img src={finalSrc} alt="" className="w-full" />
                ) : (
                    <video
                        className="w-full"
                        controls
                        playsInline
                        preload="metadata"
                        poster={finalPoster}
                        src={finalSrc}
                    />
                )}
            </div>
            {caption && (
                <figcaption className="mt-2 text-xs text-[#212529]/60">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* БЛОК: JSON + GPT                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function JsonCheatsheet() {
    const jsonExample = `[
  { "front": "What is OOP?", "back": "Objects, encapsulation, inheritance, polymorphism" },
  { "front": "TypeScript", "back": "A strictly typed superset of JavaScript" }
]`;

    const gptPrompt = `Generate study flashcards in JSON array format.
Each element should be an object with exactly two string fields: "front" and "back".
Do not add any other keys.

Topic: “Basics of Biology (level: intermediate)”.
Create 15–20 cards, answers should be short and precise (1–2 sentences or bullet points).
Output ONLY valid JSON without comments or explanations.`;

    return (
        <motion.section
            id="json"
            className="scroll-mt-24 rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.3 }}
        >
            <h3 className="text-base font-semibold">Importing flashcards from JSON</h3>
            <p className="mt-1 text-sm text-[#212529]/80">
                On the flashcards page, click <b>Import JSON</b> and paste an array of objects with the fields <b>front</b> and <b>back</b>.
                Validation will point out errors. Long answers are allowed — training is adapted for them.
            </p>

            <div className="mt-3">
                <CodeBlock code={jsonExample} caption="Minimal valid example" />
            </div>

            <h4 className="mt-4 mb-2 text-sm font-semibold">Ready-to-use prompt for a neural network (e.g., GPT). Don’t forget to adapt the text for yourself!</h4>
            <PromptCard prompt={gptPrompt} />

            <Callout className="mt-3">
                It is recommended to review the generated flashcards (remove duplicates/overly complex wording),
                but this is <b>optional</b> — the interface works fine even with long texts.
            </Callout>
        </motion.section>
    );
}


/* ────────────────────────────────────────────────────────────────────────── */
/* ВСПОМОГАТЕЛЬНЫЕ UI                                                         */
/* ────────────────────────────────────────────────────────────────────────── */
function CodeBlock({ code, caption }: { code: string; caption?: string }) {
    return (
        <figure>
            <pre className="overflow-x-auto rounded-xl border border-[#212529]/10 bg-[#0B1020] p-4 text-[12.5px] leading-relaxed text-[#E6EDF3]">
                <code className="whitespace-pre">{code}</code>
            </pre>
            {caption && <figcaption className="mt-2 text-xs text-[#212529]/60">{caption}</figcaption>}
        </figure>
    );
}

function PromptCard({ prompt }: { prompt: string }) {
    return (
        <div className="relative">
            {/* декоративная рамка-градиент */}
            <div className="rounded-xl border-2 border-[#4F46E5]/50  p-[1.5px]">
                <div className="rounded-[14px] bg-white">
                    {/* тулбар */}
                    <div className="flex items-center justify-between border-b border-[#212529]/10 px-3 py-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#4F46E5]">
                            GPT Prompt
                        </span>
                        <CopyButton getText={() => prompt} />
                    </div>
                    {/* сам промпт — без лишних пояснений */}
                    <pre className="max-h-[340px] overflow-auto p-4 font-mono text-[13px] leading-relaxed text-[#111827] whitespace-pre-wrap">
                        {prompt}
                    </pre>
                </div>
            </div>
        </div>
    );
}

function CopyButton({ getText }: { getText: () => string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        const text = getText();
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // фолбэк
                const ta = document.createElement("textarea");
                ta.value = text;
                ta.style.position = "fixed";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            // оставим тихо; можно добавить notify при желании
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="inline-flex text-[#4F46E5] cursor-pointer items-center gap-2 rounded-lg border border-[#212529]/15 bg-white px-3 py-1.5 text-[12px] font-semibold hover:bg-white/80"
            aria-live="polite"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

function Callout({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-xl border border-[#4F46E5]/20 bg-[#4F46E5]/5 px-4 py-3 text-[13px] text-[#212529]/85 ${className}`}>
            {children}
        </div>
    );
}
