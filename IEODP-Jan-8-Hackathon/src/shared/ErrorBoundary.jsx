import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);

        // Here you can later integrate with logging services (Sentry, etc.)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-base-200">
                    <div className="card bg-base-100 p-6 shadow-xl w-96 text-center">
                        <h2 className="text-xl font-bold mb-2 text-error">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            An unexpected error occurred. Please try again.
                        </p>

                        <button className="btn btn-primary" onClick={this.handleReset}>
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
