import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { notify } from "../lib/notify";
import { InputField } from "../components/ui/InputField";

type Mode = "signin" | "signup";

// ─── схемы валидации ────────────────────────────────────────────────────────────
const signinSchema = z.object({
    email: z.string().trim().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
});
type SigninValues = z.infer<typeof signinSchema>;

const registerSchema = z
    .object({
        email: z.string().trim().email("Invalid email"),
        password: z.string().min(6, "Min 6 characters"),
        confirm: z.string().min(6, "Min 6 characters"),
    })
    .refine((v) => v.password === v.confirm, {
        message: "Passwords do not match",
        path: ["confirm"],
    });
type RegisterValues = z.infer<typeof registerSchema>;

// ─── сам компонент ──────────────────────────────────────────────────────────────
export default function Auth({ initialTab }: { initialTab?: Mode }) {
    const location = useLocation();
    const navigate = useNavigate();

    const initial: Mode = useMemo(
        () => (initialTab ? initialTab : location.pathname.includes("signup") ? "signup" : "signin"),
        [location.pathname, initialTab]
    );
    const [mode, setMode] = useState<Mode>(initial);

    // ── формы как внутренние функции ──────────────────────────────────────────────
    function SigninForm() {
        const { register, handleSubmit, formState: { errors, isSubmitting } } =
            useForm<SigninValues>({ resolver: zodResolver(signinSchema), defaultValues: { email: "", password: "" } });

        const onSubmit = async (data: SigninValues) => {
            try {
                await signInWithEmailAndPassword(auth, data.email, data.password);
                notify.ok("Signed in");
                navigate("/dashboard");
            } catch (e: any) {
                notify.err(e.message);
            }
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    id="signin-email"
                    label="Email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                    type="email"
                />
                <InputField
                    id="signin-pass"
                    label="Password"
                    placeholder="Minimum 6 characters"
                    autoComplete="current-password"
                    {...register("password")}
                    error={errors.password?.message}
                    type="password"
                />
                <button
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90 disabled:opacity-60"
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
                <p className="text-center text-sm">
                    Don’t have an account?
                    <button type="button" className="font-semibold text-[#4F46E5] hover:opacity-90" onClick={() => setMode("register")}>
                        Sign up
                    </button>
                </p>
            </form>
        );
    }

    function RegisterForm() {
        const { register, handleSubmit, formState: { errors, isSubmitting } } =
            useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { email: "", password: "", confirm: "" } });

        const onSubmit = async (data: RegisterValues) => {
            try {
                await createUserWithEmailAndPassword(auth, data.email, data.password);
                notify.ok("Account created");
                navigate("/dashboard");
            } catch (e: any) {
                notify.err(e.message);
            }
        };

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputField
                    id="reg-email"
                    label="Email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                    error={errors.email?.message}
                    type="email"
                />
                <InputField
                    id="reg-pass"
                    label="Password"
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    {...register("password")}
                    error={errors.password?.message}
                    type="password"
                />
                <InputField
                    id="reg-confirm"
                    label="Confirm Password"
                    placeholder="Repeat the password"
                    autoComplete="new-password"
                    {...register("confirm")}
                    error={errors.confirm?.message}
                    type="password"
                />
                <button
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90 disabled:opacity-60"
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create account"}
                </button>
                <p className="text-center text-sm">
                    Already have an account?
                    <button type="button" className="font-semibold text-[#4F46E5] hover:opacity-90" onClick={() => setMode("signin")}>
                        Sign In
                    </button>
                </p>
            </form>
        );
    }

    // ─── оболочка (дизайн как раньше) ─────────────────────────────────────────────
    return (
        <div className="px-4 py-10 sm:py-14">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold">Welcome!</h1>
                    <p className="mt-2 text-sm sm:text-base text-[#212529]/70">
                        Create flashcards, practice, and track your progress.
                    </p>
                </div>

                <div className="rounded-xl border border-[#212529]/10 bg-white p-4 sm:p-6 shadow-sm">
                    <div role="tablist" aria-label="Auth tabs" className="mb-5 grid grid-cols-2 rounded-xl border border-[#212529]/10 bg-[#F8F9FA] p-1">
                        <button
                            role="tab"
                            aria-selected={mode === "signin"}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition
                ${mode === "signin" ? "bg-[#4F46E5] shadow-sm text-white" : "text-[#212529]/70 hover:text-[#212529]"}`}
                            onClick={() => setMode("signin")}
                        >
                            Sign In
                        </button>
                        <button
                            role="tab"
                            aria-selected={mode === "signup"}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition
                ${mode === "signup" ? "bg-[#4F46E5] shadow-sm text-white" : "text-[#212529]/70 hover:text-[#212529]"}`}
                            onClick={() => setMode("signup")}
                        >
                            Sign Up
                        </button>
                    </div>

                    {mode === "signin" ? <SigninForm /> : <RegisterForm />}
                </div>
            </div>
        </div>
    );
}
