import React from "react";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";

const Financial: React.FC = () => {
  return (
    <div className="p-2 md:p-4 space-y-4 w-full overflow-x-hidden">
      <FinancialDashboard />
    </div>
  );
};

export default Financial;
