import React from "react";
import { Layout } from "@/components/Layout";
import { FinancialDashboard } from "@/components/financial/FinancialDashboard";

const Financial: React.FC = () => {
  return (
    <Layout activePage="financial" setActivePage={() => {}}>
      <div className="p-2 md:p-4 space-y-4 w-full overflow-x-hidden">
        <FinancialDashboard />
      </div>
    </Layout>
  );
};

export default Financial;