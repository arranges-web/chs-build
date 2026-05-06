import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("[CHS] Unhandled render error:", error, info);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#fafafa",
          color: "#222",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#555", marginBottom: 20, lineHeight: 1.5 }}>
            CHS Roofing — please try refreshing. If this keeps happening, call{" "}
            <a href="tel:+12390000000" style={{ color: "#a4133c" }}>
              (239) XXX-XXXX
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              background: "#a4133c",
              color: "#fff",
              border: 0,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload page
          </button>
          <button
            type="button"
            onClick={this.reset}
            style={{
              marginLeft: 8,
              padding: "10px 20px",
              borderRadius: 999,
              background: "transparent",
              color: "#a4133c",
              border: "1px solid #a4133c",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
