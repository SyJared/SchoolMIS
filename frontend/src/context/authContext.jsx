import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
            const decoded = jwtDecode(token);

            setUser({
                token,
                id:
                    decoded.sub ??
                    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                role:
                    decoded.role ??
                    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                email:
                    decoded.email ??
                    decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
            });
        } catch {
            localStorage.removeItem("token");
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);

        const decoded = jwtDecode(token);

        setUser({
            token,
            id:
                decoded.sub ??
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            role:
                decoded.role ??
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
            email:
                decoded.email ??
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}