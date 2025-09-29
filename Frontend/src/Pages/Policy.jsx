import { useState } from "react";
import PolicySidebar from "@/components/policy-sidebar";
import PolicyContent from "@/components/policy-content";

export default function PolicyPage() {
  const [activePolicy, setActivePolicy] = useState("terms");

  const policies = [
    { id: "terms", title: "Terms of Service" },
    { id: "shipping", title: "Shipping and Delivery" },
    { id: "returns", title: "Return & Refund Policy" },
    { id: "privacy", title: "Privacy Policy" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <div className="w-full rounded-lg  overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <PolicySidebar
            policies={policies}
            activePolicy={activePolicy}
            setActivePolicy={setActivePolicy}
          />
          <PolicyContent activePolicy={activePolicy} />
        </div>
      </div>
    </div>
  );
}
