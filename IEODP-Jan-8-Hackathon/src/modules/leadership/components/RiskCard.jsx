import InsightDetailsModal from "./InsightDetailsModal";
import { useState } from "react";

const RiskCard = ({ insight }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="card bg-base-100 p-4 shadow border-l-4 border-red-500">
            <h2 className="font-bold">{insight.title}</h2>
            <p className="text-sm text-gray-500">{insight.description}</p>
            <p>
                Risk Score:{" "}
                <span className="badge badge-error">{insight.riskScore}</span>
            </p>

            <div className="mt-3 flex gap-2">
                <button className="btn btn-sm btn-outline" onClick={() => setOpen(true)}>
                    View Details
                </button>
            </div>

            {open && (
                <InsightDetailsModal insight={insight} onClose={() => setOpen(false)} />
            )}
        </div>
    );
};

export default RiskCard;
