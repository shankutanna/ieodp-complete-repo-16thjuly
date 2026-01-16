import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "./authSlice";
import { ROLES } from "../utils/roles";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (role) => {
        const mockResponse = {
            user: {
                id: 1,
                name: "Enterprise User",
                email: "user@corp.com",
                role: role,
            },
            token: "fake-jwt-token",
        };

        dispatch(setCredentials(mockResponse));

        if (role === ROLES.OPERATIONS) navigate("/operations/dashboard");
        if (role === ROLES.MANAGEMENT) navigate("/management/dashboard");
        if (role === ROLES.LEADERSHIP) navigate("/leadership/dashboard");
        if (role === ROLES.AUDITORS) navigate("/auditors/dashboard"); // ✅ FIXED
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">IEODP Login</h2>

                <div className="space-y-2">
                    <button
                        className="btn btn-primary w-full"
                        onClick={() => handleLogin(ROLES.OPERATIONS)}
                    >
                        Login as Operations
                    </button>

                    <button
                        className="btn btn-secondary w-full"
                        onClick={() => handleLogin(ROLES.MANAGEMENT)}
                    >
                        Login as Management
                    </button>

                    <button
                        className="btn btn-accent w-full"
                        onClick={() => handleLogin(ROLES.LEADERSHIP)}
                    >
                        Login as Leadership
                    </button>

                    <button
                        className="btn btn-neutral w-full"
                        onClick={() => handleLogin(ROLES.AUDITORS)}
                    >
                        Login as Auditor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
