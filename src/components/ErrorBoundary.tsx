import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled error in Trường Cẩm UI:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 text-white">
          <div className="w-full max-w-sm liquid-glass rounded-[32px] shadow-2xl border border-white/25 p-6 sm:p-8 text-center flex flex-col items-center gap-4">
            <div className="text-4xl">😵‍💫</div>
            <h1 className="text-base font-bold">Ối, có lỗi xảy ra</h1>
            <p className="text-xs text-white/60 leading-relaxed">
              Trường Cẩm gặp sự cố hiển thị. Thử tải lại trang — nếu vẫn còn lỗi, hãy báo cho quản trị viên.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] font-semibold text-sm shadow-lg"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
