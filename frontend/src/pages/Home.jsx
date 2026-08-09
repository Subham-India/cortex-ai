import { useSelector } from "react-redux";

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold">
              C
            </div>

            <span className="text-xl font-bold">
              Cortex AI
            </span>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full border border-slate-700"
              />
            )}

            <div className="hidden sm:block">
              <p className="text-sm font-medium">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>
          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Welcome */}
        <div className="mb-10">
          <p className="text-purple-400 text-sm font-medium mb-2">
            AI WORKSPACE
          </p>

          <h1 className="text-4xl font-bold">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>

          <p className="text-slate-400 mt-3">
            Build powerful AI agents and intelligent workflows.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Agents */}
          <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mb-5">
              🤖
            </div>

            <h2 className="text-xl font-semibold">
              AI Agents
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Create and manage intelligent AI agents.
            </p>

            <button className="mt-6 text-sm text-purple-400 hover:text-purple-300">
              Explore agents →
            </button>
          </div>

          {/* Knowledge */}
          <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl mb-5">
              🧠
            </div>

            <h2 className="text-xl font-semibold">
              Knowledge Base
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Upload documents and build your RAG knowledge base.
            </p>

            <button className="mt-6 text-sm text-blue-400 hover:text-blue-300">
              Manage knowledge →
            </button>
          </div>

          {/* Projects */}
          <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl mb-5">
              ⚡
            </div>

            <h2 className="text-xl font-semibold">
              Projects
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Organize your AI applications and workflows.
            </p>

            <button className="mt-6 text-sm text-green-400 hover:text-green-300">
              View projects →
            </button>
          </div>

        </div>

        {/* Getting Started */}
        <div className="mt-10 bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-semibold">
            Get started with Cortex AI
          </h2>

          <p className="text-slate-400 mt-2">
            Create your first AI agent and connect it to your knowledge base.
          </p>

          <button className="mt-6 px-5 py-3 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-200 transition">
            Create your first agent
          </button>

        </div>

      </main>
    </div>
  );
}

export default Home;