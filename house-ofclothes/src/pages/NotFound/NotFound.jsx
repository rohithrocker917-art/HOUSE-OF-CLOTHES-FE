import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Layout from "../../components/layout/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-zinc-950 px-4">
        <div className="text-center max-w-lg">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <h1 className="text-[10rem] sm:text-[12rem] font-black leading-none text-zinc-100 dark:text-zinc-900 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 mx-auto mb-4 animate-bounce">
                  <span className="text-3xl">👗</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Page Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">
            Oops! The page you&apos;re looking for seems to have wandered off to
            find the perfect outfit. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 hover:shadow-rose-500/30 transition-all"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-200 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
