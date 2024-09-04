import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorFallback from "./components/common/error-fallback.tsx";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      window.location.reload();
    }}
    onError={(error, componentStack) => {
      console.log(
        "The is the cause of the error, please screenshot your console and add it to the issue"
      );
      console.error(error, componentStack);
    }}
  >
    <App />
  </ReactErrorBoundary>
);
