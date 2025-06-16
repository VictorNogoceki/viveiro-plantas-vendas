
import React from 'react';
import PaymentMethodItem from './PaymentMethodItem';

interface FormaPagamento {
  id: string;
  nome: string;
  selecionada: boolean;
  valor: number;
  valorTexto: string;
  editando: boolean;
}

interface PaymentMethodSelectorProps {
  formasPagamento: FormaPagamento[];
  onCheckboxChange: (id: string, checked: boolean) => void;
  onValorChange: (id: string, textoValor: string) => void;
  onValorFocus: (id: string) => void;
  onValorBlur: (id: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  formasPagamento,
  onCheckboxChange,
  onValorChange,
  onValorFocus,
  onValorBlur
}) => {
  return (
    <div className="bg-yellow-50 p-3 rounded">
      <p className="text-sm text-gray-700 mb-3">
        Selecione as formas de pagamento e os valores correspondentes:
      </p>
      
      <div className="space-y-3">
        {formasPagamento.map((forma) => (
          <PaymentMethodItem
            key={forma.id}
            forma={forma}
            onCheckboxChange={onCheckboxChange}
            onValorChange={onValorChange}
            onValorFocus={onValorFocus}
            onValorBlur={onValorBlur}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
