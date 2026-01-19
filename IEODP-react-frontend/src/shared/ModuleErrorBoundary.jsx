import React from "react";

class ModuleErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="alert alert-error shadow-lg">
                    <div>
                        <span>
                            Failed to load this module. Please refresh or contact support.
                        </span>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ModuleErrorBoundary;
