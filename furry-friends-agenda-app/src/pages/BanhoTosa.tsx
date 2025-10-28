import React from "react";
import { GroomingBoard } from "@/components/groomingboard/GroomingBoard";

const BanhoTosa: React.FC = () => {
  return (
    <div className="p-2 md:p-4 space-y-4 w-full overflow-x-hidden">
      <h1 className="text-xl md:text-2xl font-bold">Banho e Tosa</h1>
      <GroomingBoard />
    </div>
  );
};

export default BanhoTosa;