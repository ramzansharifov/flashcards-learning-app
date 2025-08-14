type LinkItem = { label: string; href: string };
type Section = { title: string; links: LinkItem[] };

const SECTIONS: Section[] = [
    {
        title: "Home Navigation",
        links: [
            { label: "How It Works", href: "#how-it-works" },
            { label: "Scientific Basis", href: "#evidence" },
            { label: "Start Demo", href: "#demo" },
            { label: "FAQ", href: "#faq" },
        ],
    },
    {
        title: "Pages",
        links: [
            { label: "Tutorial", href: "/tutorial" },
            { label: "Demo Training", href: "/demo" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Training", href: "/training" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "My GitHub", href: "https://github.com/ramzansharifov" },
            { label: "Resume (PDF)", href: "" },
            { label: "My Contacts", href: "https://ramzan.sharifov2021@gmail.com" },
        ],
    },
];

const SOCIAL: LinkItem[] = [
    { label: "GitHub", href: "https://github.com/ramzansharifov" },
    { label: "Telegram", href: "https://t.me/Confus_8" },
    { label: "Gmail", href: "https://ramzan.sharifov2021@gmail.com" },
];

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[#212529]/10 bg-[#F8F9FA] text-[#212529]" aria-labelledby="site-footer">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* Верх: логотип + краткий текст + соцсети */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/book.png" alt="" className="w-8" />
                        <span className="text-2xl font-semibold">FlashCards</span>
                    </div>

                    <div className="flex items-center gap-3" aria-label="Social Media">
                        {SOCIAL.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg ring ring-[#4F46E5] text-[#4f46e5] transition-all hover:bg-[#4f46e5] hover:text-white hover:ring-white bg-white"
                                aria-label={s.label}
                            >
                                {s.label === "GitHub" && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.86-.01-1.68-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.12-1.49-1.12-1.49-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07 .9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.07c.85 0 1.7.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05 .55 1.4.21 2.44.1 2.7 .64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
                                    </svg>
                                )}
                                {s.label === "Telegram" && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9.999 15.172l-.396 5.584c.568 0 .815-.243 1.109-.534l2.664-2.548 5.518 4.04c1.011.555 1.732.264 1.997-.936l3.62-16.93c.369-1.6-.574-2.22-1.629-1.832L1.47 9.24C-.077 9.828-.052 10.742 1.21 11.184l5.448 1.7 12.63-7.96c.593-.36 1.134-.16.69.2" />
                                    </svg>
                                )}
                                {s.label === "Gmail" && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 6.9L12 12.627L22 6.9L22 7L12 12.727L2 7Z" fill="currentColor" />
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M22 7L13.009 12.727a2 2 0 0 1-2.009 0L2 7" />
                                    </svg>
                                )}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Секции ссылок */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {SECTIONS.map((sec) => (
                        <div key={sec.title}>
                            <h4 className="text-sm font-semibold mb-3">{sec.title}</h4>
                            <ul className="space-y-2">
                                {sec.links.map((l) => (
                                    <li key={l.label}>
                                        <a
                                            href={l.href}
                                            className="text-sm text-[#212529]/80 hover:text-[#212529] hover:underline focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                                        >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Нижняя полоса */}
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#212529]/10 pt-6">
                    <div className="text-xs opacity-70">
                        © {year} FlashCards. Created as a pet project.
                    </div>

                    <div className="text-xs">
                        <span className="opacity-70">Made By /</span>  Ramzan Sh.
                    </div>
                </div>
            </div>
        </footer>
    );
}
