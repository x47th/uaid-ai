import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI Error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen p-8" style={{ background: 'var(--color-app-bg)', color: 'var(--color-text)' }}>
          <div className="max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button onClick={() => window.location.reload()}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
              style={{ background: 'var(--color-accent)' }}>
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Wrap page component with error boundary */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function Wrapped(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}