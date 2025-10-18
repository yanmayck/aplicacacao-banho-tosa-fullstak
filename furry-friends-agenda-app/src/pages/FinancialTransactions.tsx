import React from "react";
import { Layout } from "@/components/Layout";
import { TransactionList } from "@/components/financial/TransactionList";

const FinancialTransactions: React.FC = () => {
  return (
    <Layout activePage="financial-transactions" setActivePage={() => {}}>
      <div className="p-2 md:p-4 space-y-4 w-full overflow-x-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Transações Financeiras</h1>
            <p className="text-gray-600">Gerencie todas as receitas e despesas</p>
          </div>
        </div>
        <TransactionList showFilters={true} showActions={true} />
      </div>
    </Layout>
  );
};

export default FinancialTransactions;