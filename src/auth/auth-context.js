import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import {
    login as loginApi,
    register as registerApi,
    getMe,
    logout as logoutApi,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAuth();
    }, []);

    async function loadAuth() {
        try {
            const savedToken = await SecureStore.getItemAsync("auth_token");

            if (!savedToken) {
                return;
            }

            const data = await getMe(savedToken);

            setToken(savedToken);
            setUser(data.user);
        } catch (error) {
            await SecureStore.deleteItemAsync("auth_token");
        } finally {
            setLoading(false);
        }
    }

    async function login(username, password) {
        const data = await loginApi(username, password);

        await SecureStore.setItemAsync("auth_token", data.token);

        setToken(data.token);
        setUser(data.user);
    }

    async function register(username, email, password) {
        return registerApi(username, email, password);
    }

    async function logout() {
        try {
            if (token) {
                await logoutApi(token);
            }
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            await SecureStore.deleteItemAsync("auth_token");

            setToken(null);
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}