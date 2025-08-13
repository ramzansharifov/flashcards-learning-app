import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useUser } from "../../hooks/useUser";
import { ExitIcon } from "../ui/Icons";
import ConfirmDialog from "../ui/ConfirmDialog";

export function Header() {
    const [open, setOpen] = useState(false);             // mobile menu
    const [confirmOut, setConfirmOut] = useState(false); // confirm modal
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const requestLogout = () => setConfirmOut(true);

    const closeMenu = () => setOpen(false);

    const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

    const panelVars: Variants = {
        hidden: { opacity: 0, y: -8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: EASING } },
        exit: { opacity: 0, y: -8, transition: { duration: 0.12, ease: EASING } },
    };

    const listVars: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
        exit: {},
    };

    const itemVars: Variants = {
        hidden: { opacity: 0, y: -6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.16, ease: EASING } },
    };

    return (
        <header className="sticky top-0 z-40 border-b border-[#212529]/10 bg-[#F8F9FA]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F8F9FA]/75">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex h-16 items-center justify-between" aria-label="Global">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/book.png" alt="" className="w-8" />
                        <span className="text-2xl font-semibold text-black">FlashCards</span>
                        <span className="sr-only">Go to homepage</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <Link to="/tutorial" className="text-black hover:text-gray-900">Tutorial</Link>
                        <Link to="/demo" className="text-black hover:text-gray-900">Demo</Link>
                        <Link to="/dashboard" className="text-black hover:text-gray-900">Dashboard</Link>
                        <Link to="/training" className="text-black hover:text-gray-900">Training</Link>
                        {!user ? (
                            <Link
                                to="/signin"
                                className="rounded-xl bg-[#4F46E5] px-5 py-2 font-medium text-white shadow-sm hover:opacity-95 active:opacity-90"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="rounded-xl bg-[#4F46E5]/10 px-4 py-2 text-[18px] text-black">
                                    {user.email}
                                </span>
                                <button
                                    type="button"
                                    onClick={requestLogout}
                                    className="cursor-pointer rounded-xl bg-red-200 p-3 text-red-600 hover:bg-red-300/65"
                                >
                                    <ExitIcon />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 md:hidden"
                        aria-controls="mobile-menu"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                    >
                        <span className="sr-only">Open main menu</span>
                        {/* burger / close */}
                        <svg className={`h-6 w-6 ${open ? "hidden" : "block"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                        </svg>
                        <svg className={`h-6 w-6 ${open ? "block" : "hidden"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </nav>
            </div>

            {/* Mobile menu with animations */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* overlay */}
                        <motion.button
                            aria-label="Close menu"
                            className="fixed inset-0 top-16 bg-black/30 md:hidden z-40 h-[100vh]"
                            onClick={closeMenu}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.15 } }}
                            exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        />
                        {/* panel */}
                        <motion.div
                            id="mobile-menu"
                            className="md:hidden relative z-50"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={panelVars}
                        >
                            <motion.div
                                className="relative z-50 border-t border-[#212529]/10 bg-white/95 backdrop-blur"
                                variants={listVars}
                            >
                                <motion.div className="space-y-1 px-4 py-3" variants={listVars}>
                                    <motion.div variants={itemVars}>
                                        <Link
                                            to="/"
                                            onClick={closeMenu}
                                            className="block rounded px-3 py-2 text-base text-black hover:bg-gray-100"
                                        >
                                            Home
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={itemVars}>
                                        <Link
                                            to="/tutorial"
                                            onClick={closeMenu}
                                            className="block rounded px-3 py-2 text-base text-black hover:bg-gray-100"
                                        >
                                            Tutorial
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={itemVars}>
                                        <Link
                                            to="/demo"
                                            onClick={closeMenu}
                                            className="block rounded px-3 py-2 text-base text-black hover:bg-gray-100"
                                        >
                                            Demo
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={itemVars}>
                                        <Link
                                            to="/dashboard"
                                            onClick={closeMenu}
                                            className="block rounded px-3 py-2 text-base text-black hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={itemVars}>
                                        <Link
                                            to="/training"
                                            onClick={closeMenu}
                                            className="block rounded px-3 py-2 text-base text-black hover:bg-gray-100"
                                        >
                                            Training
                                        </Link>
                                    </motion.div>
                                    {!user ? (
                                        <motion.div variants={itemVars}>
                                            <Link
                                                to="/signin"
                                                onClick={closeMenu}
                                                className="block rounded text-center bg-[#4F46E5] px-3 py-2 text-base font-medium text-white hover:opacity-95"
                                            >
                                                Sign in
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <motion.div className="flex gap-x-2" variants={itemVars}>
                                            <span className="rounded-xl bg-[#4F46E5]/10 px-4 py-2 text-[18px] text-black max-w-72 truncate">
                                                {user.email}1233455678987654
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    closeMenu();
                                                    requestLogout();
                                                }}
                                                className="cursor-pointer rounded-xl bg-red-200 p-3 text-red-600"
                                            >
                                                <ExitIcon />
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Confirm sign out */}
            <ConfirmDialog
                open={confirmOut}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                confirmText="Sign Out"
                cancelText="Cancel"
                onCancel={() => setConfirmOut(false)}
                onConfirm={async () => {
                    await logout();
                    setConfirmOut(false);
                    setOpen(false); // close mobile menu if open
                    navigate("/");  // redirect after logout
                }}
            />
        </header>
    );
}
