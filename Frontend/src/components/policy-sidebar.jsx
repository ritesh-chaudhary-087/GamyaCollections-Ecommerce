import { cn } from "@/lib/utils";

export default function PolicySidebar({
  policies,
  activePolicy,
  setActivePolicy,
}) {
  return (
    <div className="w-full md:w-72 bg-[#f9e7d6] border-r border-gray-200 rounded-lg shadow-md">
      <nav className="p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Policies</h2>
        <ul className="space-y-2">
          {policies.map((policy, index) => (
            <li key={policy.id}>
              <button
                onClick={() => setActivePolicy(policy.id)}
                className={cn(
                  "flex items-center w-full p-3 rounded-md text-left transition-colors duration-200 ease-in-out",
                  activePolicy === policy.id
                    ? "bg-[#A63C15] text-white font-medium"
                    : "text-black hover:text-[#A63C15] hover:bg-gray-100"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full mr-3 flex-shrink-0",
                    activePolicy === policy.id ? "text-white" : "text-[#A63C15]"
                  )}
                >
                  <span>{index + 1}</span>
                </div>
                <span className="text-sm">{policy.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
