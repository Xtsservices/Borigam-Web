import ErrorBoundary from "./services/errorBoundary";
import Settings from "./settings";

const ErrorHandling = () => {
    return(
        <div>
            <ErrorBoundary>
                <Settings />
            </ErrorBoundary>
        </div>
    )
}

export default ErrorHandling;
