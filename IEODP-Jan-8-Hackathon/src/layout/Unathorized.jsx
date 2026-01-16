import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Unauthorized = () => {
    const navigate = useNavigate();
    const { role } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6 text-center">
                <h1 className="text-3xl font-bold text-error mb-2">403</h1>
                <h2 className="text-xl font-semibold mb-2">Access Denied</h2>

                <p className="text-sm text-gray-500 mb-4">
                    You do not have permission to access this page.
                </p>

                {role && (
                    <p className="text-xs text-gray-400 mb-4">
                        Logged in as: <span className="font-semibold">{role}</span>
                    </p>
                )}

                <div className="flex flex-col gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/")}
                    >
                        Go to Dashboard
                    </button>

                    <button
                        className="btn btn-outline"
                        onClick={() => navigate("/login")}
                    >
                        Switch Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
