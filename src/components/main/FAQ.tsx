// components/main/FAQ.tsx
import { useId, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { PlusIcon } from "../ui/Icons";

type FaqItem = { q: string; a: string };

const DEFAULT_FAQ: FaqItem[] = [
    {
        q: "How do I get started?",
        a: `1) Sign up with your email and create an account.
2) Take the short tutorial to learn the basics — or jump straight to the Dashboard.
3) On the Dashboard, create a Workspace → add a Topic → add Cards, then start Training.
Tip: If you just want a quick taste, run the Demo training first.`,
    },
    {
        q: "What are flashcards?",
        a: `Flashcards are a simple, proven learning method: a prompt on the front, an answer on the back.
They encourage active recall (you try to remember before you see the answer) and work great with spaced repetition for long-term retention.`,
    },
    {
        q: "Can I start without an account?",
        a: `Yes — you can run a short Demo training without signing in. Progress from the demo is not saved.
To access full features (creating workspaces, topics and cards, saving progress, filtering “only unknown”, and more) please sign up.`,
    },
    {
        q: "How does nesting in the Dashboard work?",
        a: `The structure is hierarchical:
• Workspaces — top-level buckets (e.g., “Biology”)
• Topics — sub-areas inside a workspace (e.g., “Genetics”)
• Cards — the actual Q/A items you study
You train by Topic, and each topic shows progress so you can see what to review next.`,
    },
    {
        q: "What’s the fastest way to add cards?",
        a: `Use the JSON import on the Dashboard to paste multiple cards at once.
Format: an array of objects with "front" and "back" fields, for example:
[
  { "front": "What is OOP?", "back": "Objects, encapsulation, inheritance, polymorphism" },
  { "front": "TypeScript", "back": "Typed superset of JavaScript" }
]
Validation will highlight any issues. You can also add cards one by one if you prefer. See the Tutorial for details.`,
    },
];


interface FaqProps {
    items?: FaqItem[];
    defaultOpenIndex?: number | null;
    className?: string;
}

export function Faq({
    items = DEFAULT_FAQ,
    defaultOpenIndex = 0,
    className = "",
}: FaqProps) {
    const [open, setOpen] = useState<number | null>(defaultOpenIndex);
    const groupId = useId();

    const handleToggle = (i: number) => {
        setOpen((prev) => (prev === i ? null : i));
    };

    const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

    const panelVariants: Variants = {
        initial: { height: 0, opacity: 0 },
        animate: { height: "auto", opacity: 1, transition: { duration: 0.2, ease: EASING } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.15, ease: EASING } },
    };
    return (
        <section id="faq" className={`bg-white scroll-mt-[10vh] ${className}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" >
                <h2 className="text-2xl sm:text-3xl font-bold text-[#212529]">FAQ</h2>

                <div className="mt-6 overflow-hidden rounded-xl border border-[#212529]/10 bg-[#F8F9FA]">
                    {items.map((item, i) => {
                        const isOpen = open === i;
                        const panelId = `${groupId}-panel-${i}`;
                        const btnId = `${groupId}-button-${i}`;

                        return (
                            <motion.div
                                key={i}
                                className="group border-b last:border-b-0 border-[#212529]/10"
                                initial={{ backgroundColor: "rgba(248,249,250,1)" }}
                                whileHover={{ backgroundColor: "rgba(248,249,250,0.9)" }}
                                transition={{ duration: 0.15 }}
                            >
                                <button
                                    id={btnId}
                                    className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[#212529] font-semibold outline-none
                              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4F46E5] rounded-none`}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => handleToggle(i)}
                                >
                                    <span className="flex-1 pr-2">{item.q}</span>

                                    {/* иконка: плюс/минус с анимацией поворота */}
                                    <motion.span
                                        aria-hidden="true"
                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-1 text-[#4F46E5] border-[#4F46E5]"
                                        initial={false}
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* плюс (поворачиваем на 45°, чтобы стать "минусом" визуально) */}
                                        <PlusIcon />
                                    </motion.span>
                                </button>

                                {/* подсветка при ховере у всей строки */}
                                <motion.div
                                    className="h-px bg-gradient-to-r from-transparent via-[#4F46E5]/20 to-transparent"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={btnId}
                                            key="content"
                                            variants={panelVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="px-5"
                                        >
                                            <div className="pb-4 text-sm text-[#212529]/80 whitespace-pre-wrap break-words">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div >
        </section >
    );
}
