import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({
    username: null,
    setUsername: () => {},
    id: null,
    setId: () => {},
});

export function UserContextProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/profile");
                setId(response.data.userId);
                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}>
            {children}
        </UserContext.Provider>
    );
}
