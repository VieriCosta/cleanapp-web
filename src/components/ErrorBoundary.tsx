// src/components/ErrorBoundary.tsx
import React from "react";

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Log opcional
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center p-6">
          <div className="max-w-lg w-full rounded-xl border border-red-500/30 bg-red-50 dark:bg-red-900/10 p-6">
            <h1 className="text-xl font-semibold text-red-600 dark:text-red-400">Algo deu errado</h1>
            <p className="mt-2 text-sm opacity-80">
              {String(this.state.error?.message || this.state.error || "Erro desconhecido")}
            </p>
            <button className="mt-4 rounded-lg border px-4 py-2" onClick={() => location.reload()}>
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
