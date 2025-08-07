import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function ProtectedRoute({ children }: { children: ReactElement }) {
    const { user, loading } = useUser();

    // Пока мы не знаем, залогинен ли пользователь, можно показать спиннер или загрузку:
    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    // Если пользователь не авторизован — редирект на страницу входа
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // Иначе рендерим переданный компонент
    return children;
}