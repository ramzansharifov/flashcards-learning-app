import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../hooks/useUser";

type LoginForm = {
    email: string;
    password: string;
};

export default function Login() {
    const { user } = useUser();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            alert("Logged in successfully!");
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert("Error: " + error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto mt-10">
            <input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                className="input input-bordered w-full"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            <input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
                className="input input-bordered w-full"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <button type="submit" className="btn btn-primary w-full">Login</button>

            <div>
                <h1 className="text-xl font-bold">Welcome, {user?.email}</h1>
            </div>
        </form>
    );
}
