const KPIWidget = ({ title, value }) => {
    return (
        <div className="card bg-base-200 p-4 shadow">
            <div className="text-sm text-base-content/70 ">{title}</div>
            <div className="text-2xl font-bold mt-1 ">{value}</div>
        </div>
    );
};

export default KPIWidget;
