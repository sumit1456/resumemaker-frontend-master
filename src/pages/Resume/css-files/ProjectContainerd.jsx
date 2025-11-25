import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null,
      retryCount: prevState.retryCount + 1 
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-2xl p-8 md:p-12 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-red-500/10 p-4 rounded-full">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-zinc-400 text-center mb-6 text-lg">
                We encountered an unexpected error while processing your request.
                Don't worry, your data is safe.
              </p>

              {/* Error Details */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 mb-8">
                <p className="text-sm font-mono text-red-400 break-words">
                  {this.state.error?.message || "An unknown error occurred"}
                </p>
              </div>

              {/* Retry Count */}
              {this.state.retryCount > 0 && (
                <p className="text-zinc-500 text-sm text-center mb-6">
                  Retry attempts: {this.state.retryCount}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-zinc-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 bg-zinc-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-zinc-700 transition-all duration-200 border border-zinc-700"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </button>
              </div>

              {/* Help Text */}
              <p className="text-zinc-500 text-sm text-center mt-8">
                If the problem persists, please contact our support team.
              </p>
            </div>

            {/* Badge */}
            <div className="text-center mt-8">
              <span className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-sm font-medium">
                ⚡ AI-POWERED RESUME BUILDER
              </span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Demo component to test the error boundary
function DemoApp() {
  const [shouldError, setShouldError] = React.useState(false);

  if (shouldError) {
    throw new Error("This is a simulated error for testing purposes!");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          ✨ Error Boundary Demo
        </h1>
        <button
          onClick={() => setShouldError(true)}
          className="bg-red-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-600 transition-all duration-200"
        >
          Trigger Error
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DemoApp />
    </ErrorBoundary>
  );
}