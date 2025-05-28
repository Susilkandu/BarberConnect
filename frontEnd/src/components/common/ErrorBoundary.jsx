// src/components/ErrorBoundary.jsx
import React from "react";
import { MdErrorOutline } from "react-icons/md";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Optional: send to logging service here
  }

  render() {
    if (this.state.hasError) {
      return (
<div className="min-h-screen  flex items-center justify-center p-6 ">
  <div className="text-center max-w-md">
    <MdErrorOutline className="text-[100px] text-red-500 mx-auto mb-6 animate-pulse" />
    <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h1>
    <p className="mb-4 ">
      We’re working to fix the issue. Please try again or contact support.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 px-6 py-2 bg-gradient-to-r from-[#00beff] to-[#074ff8] rounded-lg text-white font-semibold shadow-lg hover:scale-105 transition"
    >
      Reload Page
    </button>
  </div>
</div>

      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
