import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

type FormData = {
    email: string;
    password: string;
};

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            alert("User registered successfully!");
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
                {...register("password", { required: "Password is required", minLength: 6 })}
                placeholder="Password"
                className="input input-bordered w-full"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <button type="submit" className="btn btn-primary w-full">Register</button>
        </form>
    );
}
