import React from "react";
import { CashRegister } from "@/components/financial/CashRegister";

const CashRegisterPage: React.FC = () => {
  return (
    <div className="p-2 md:p-4 space-y-4 w-full overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Controle de Caixa</h1>
          <p className="text-gray-600">Gerencie o caixa diário do pet shop</p>
        </div>
      </div>
      <CashRegister />
    </div>
  );
};

export default CashRegisterPage;
