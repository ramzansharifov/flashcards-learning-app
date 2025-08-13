import { Hero } from "../components/main/Hero";
import { HowItWorks } from "../components/main/HowItWorks";
import { Faq } from "../components/main/FAQ";
import { EvidenceBlock } from "../components/main/EvidenceBlock";
import { DemoInvite } from "../components/main/DemoInvite";

export function Main() {
    return (
        <main className="bg-white text-[#212529]">
            <Hero />
            <HowItWorks />
            <EvidenceBlock />
            <DemoInvite />
            <Faq />
        </main>
    );
}
