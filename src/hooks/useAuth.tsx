import { AuthContext } from "@/contexts/JWTContext";
import { useContext } from "react";

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) throw new Error('context must be use inside provider');

    return context;
};

export default useAuth;