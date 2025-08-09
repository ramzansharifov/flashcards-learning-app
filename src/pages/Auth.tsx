import { useEffect, useMemo, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { notify } from "../lib/notify";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Mode = "login" | "register";
export default function Auth({ initialTab }: { initialTab?: Mode }) {
    const location = useLocation();
    const navigate = useNavigate();

    const initial: Mode = useMemo(() => {
        if (initialTab) return initialTab;
        return location.pathname.includes("register") ? "register" : "login";
    }, [location.pathname, initialTab]);

    const [mode, setMode] = useState<Mode>(initial);

    // login form
    const [lEmail, setLEmail] = useState("");
    const [lPass, setLPass] = useState("");
    const [lTouched, setLTouched] = useState({ email: false, pass: false });
    const [lSubmitting, setLSubmitting] = useState(false);

    const lEmailErr = lTouched.email && (!lEmail.trim() ? "Email is required" : !emailRe.test(lEmail) ? "Invalid email" : "");
    const lPassErr = lTouched.pass && (!lPass ? "Password is required" : lPass.length < 6 ? "Min 6 characters" : "");
    const lValid = !lEmailErr && !lPassErr && lEmail && lPass;

    // register form
    const [rEmail, setREmail] = useState("");
    const [rPass, setRPass] = useState("");
    const [rConfirm, setRConfirm] = useState("");
    const [rTouched, setRTouched] = useState({ email: false, pass: false, confirm: false });
    const [rSubmitting, setRSubmitting] = useState(false);

    const rEmailErr = rTouched.email && (!rEmail.trim() ? "Email is required" : !emailRe.test(rEmail) ? "Invalid email" : "");
    const rPassErr = rTouched.pass && (!rPass ? "Password is required" : rPass.length < 6 ? "Min 6 characters" : "");
    const rConfirmErr = rTouched.confirm && (rConfirm !== rPass ? "Passwords do not match" : "");
    const rValid = !rEmailErr && !rPassErr && !rConfirmErr && rEmail && rPass && rConfirm;

    useEffect(() => {
        // сбрасываем ошибки при смене таба
        setLTouched({ email: false, pass: false });
        setRTouched({ email: false, pass: false, confirm: false });
    }, [mode]);

    const doLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLTouched({ email: true, pass: true });
        if (!lValid) return;
        try {
            setLSubmitting(true);
            await signInWithEmailAndPassword(auth, lEmail.trim(), lPass);
            notify.ok("Signed in");
            navigate("/");
        } catch (e: any) {
            notify.err(e.message);
        } finally {
            setLSubmitting(false);
        }
    };

    const doRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRTouched({ email: true, pass: true, confirm: true });
        if (!rValid) return;
        try {
            setRSubmitting(true);
            await createUserWithEmailAndPassword(auth, rEmail.trim(), rPass);
            notify.ok("Account created");
            navigate("/");
        } catch (e: any) {
            notify.err(e.message);
        } finally {
            setRSubmitting(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Welcome</h1>

            <div className="mb-4 flex gap-2">
                <button
                    className={`btn btn-sm ${mode === "login" ? "btn-primary" : ""}`}
                    onClick={() => setMode("login")}
                >
                    Login
                </button>
                <button
                    className={`btn btn-sm ${mode === "register" ? "btn-primary" : ""}`}
                    onClick={() => setMode("register")}
                >
                    Register
                </button>
            </div>

            {mode === "login" ? (
                <form onSubmit={doLogin} className="space-y-3">
                    <div>
                        <input
                            type="email"
                            value={lEmail}
                            onChange={(e) => setLEmail(e.target.value)}
                            onBlur={() => setLTouched(s => ({ ...s, email: true }))}
                            placeholder="Email"
                            className={`input input-bordered w-full ${lEmailErr ? "input-error" : ""}`}
                            aria-invalid={!!lEmailErr}
                        />
                        {lEmailErr && <p className="text-sm text-red-600 mt-1">{lEmailErr}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            value={lPass}
                            onChange={(e) => setLPass(e.target.value)}
                            onBlur={() => setLTouched(s => ({ ...s, pass: true }))}
                            placeholder="Password (min 6)"
                            className={`input input-bordered w-full ${lPassErr ? "input-error" : ""}`}
                            aria-invalid={!!lPassErr}
                        />
                        {lPassErr && <p className="text-sm text-red-600 mt-1">{lPassErr}</p>}
                    </div>
                    <button className="btn btn-primary w-full" type="submit" disabled={lSubmitting}>
                        {lSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                    <p className="mt-3 text-sm">
                        No account? <button type="button" className="text-blue-600" onClick={() => setMode("register")}>Register</button>
                    </p>
                </form>
            ) : (
                <form onSubmit={doRegister} className="space-y-3">
                    <div>
                        <input
                            type="email"
                            value={rEmail}
                            onChange={(e) => setREmail(e.target.value)}
                            onBlur={() => setRTouched(s => ({ ...s, email: true }))}
                            placeholder="Email"
                            className={`input input-bordered w-full ${rEmailErr ? "input-error" : ""}`}
                            aria-invalid={!!rEmailErr}
                        />
                        {rEmailErr && <p className="text-sm text-red-600 mt-1">{rEmailErr}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            value={rPass}
                            onChange={(e) => setRPass(e.target.value)}
                            onBlur={() => setRTouched(s => ({ ...s, pass: true }))}
                            placeholder="Password (min 6)"
                            className={`input input-bordered w-full ${rPassErr ? "input-error" : ""}`}
                            aria-invalid={!!rPassErr}
                        />
                        {rPassErr && <p className="text-sm text-red-600 mt-1">{rPassErr}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            value={rConfirm}
                            onChange={(e) => setRConfirm(e.target.value)}
                            onBlur={() => setRTouched(s => ({ ...s, confirm: true }))}
                            placeholder="Confirm password"
                            className={`input input-bordered w-full ${rConfirmErr ? "input-error" : ""}`}
                            aria-invalid={!!rConfirmErr}
                        />
                        {rConfirmErr && <p className="text-sm text-red-600 mt-1">{rConfirmErr}</p>}
                    </div>
                    <button className="btn btn-primary w-full" type="submit" disabled={rSubmitting}>
                        {rSubmitting ? "Creating..." : "Create account"}
                    </button>
                    <p className="mt-3 text-sm">
                        Already have an account? <button type="button" className="text-blue-600" onClick={() => setMode("login")}>Login</button>
                    </p>
                </form>
            )}

            <p className="mt-6 text-xs text-gray-500">
                By continuing you agree to the Terms and Privacy Policy.
            </p>
        </div>
    );
}
