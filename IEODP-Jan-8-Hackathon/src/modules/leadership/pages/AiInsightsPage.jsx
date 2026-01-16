import { useGetAiInsightsQuery } from "../leadershipApi";
import RiskCard from "../components/RiskCard";

const AiInsightsPage = () => {
    const { data: insights = [], isLoading } = useGetAiInsightsQuery();

    if (isLoading) return <div className="loading loading-spinner" />;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">AI Insights & Risks</h1>

            <div className="grid grid-cols-2 gap-4">
                {insights.map((insight) => (
                    <RiskCard key={insight.id} insight={insight} />
                ))}
            </div>
        </div>
    );
};

export default AiInsightsPage;
