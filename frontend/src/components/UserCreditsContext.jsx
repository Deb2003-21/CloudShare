import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, {
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";
import toast from "react-hot-toast";
import { ENDPOINTS } from "../endpoints";

/* ✅ Create context FIRST */
export const UserCreditsContext = createContext();

function UserCreditsProvider({ children }) {
    const [credits, setCredits] = useState(5);
    const [loading, setLoading] = useState(false);

    const { getToken, isSignedIn } = useAuth();

    const fetchUserCredits = useCallback(async () => {
        if (!isSignedIn) return;

        setLoading(true);

        try {
            const token = await getToken();

            const res = await axios.get(ENDPOINTS.GET_CREDITS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                setCredits(res.data.credits);
            }
        } catch (error) {
            toast.error("Failed to get the credits", {
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    }, [isSignedIn, getToken]);

    useEffect(() => {
        if (isSignedIn) {
            fetchUserCredits();
        }
    }, [fetchUserCredits, isSignedIn]);

    const updateCredits = useCallback((newCredits) => {
        setCredits(newCredits);
    }, []);

    const contextValue = {
        credits,
        loading,
        fetchUserCredits,
        updateCredits,
    };

    return (
        <UserCreditsContext.Provider value={contextValue}>
            {children}
        </UserCreditsContext.Provider>
    );
}

export default UserCreditsProvider;