
import React from 'react';

interface PaymentSummaryProps {
  subtotal: number;
  totalInformado: number;
  faltam: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  totalInformado,
  faltam
}) => {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Total da Venda:</span>
        <span>R$ {subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Total Informado:</span>
        <span>R$ {totalInformado.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Faltam:</span>
        <span>R$ {faltam.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
