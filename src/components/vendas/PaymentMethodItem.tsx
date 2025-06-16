
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface FormaPagamento {
  id: string;
  nome: string;
  selecionada: boolean;
  valor: number;
  valorTexto: string;
  editando: boolean;
}

interface PaymentMethodItemProps {
  forma: FormaPagamento;
  onCheckboxChange: (id: string, checked: boolean) => void;
  onValorChange: (id: string, textoValor: string) => void;
  onValorFocus: (id: string) => void;
  onValorBlur: (id: string) => void;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  forma,
  onCheckboxChange,
  onValorChange,
  onValorFocus,
  onValorBlur
}) => {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={forma.id}
        checked={forma.selecionada}
        onCheckedChange={(checked) => 
          onCheckboxChange(forma.id, checked as boolean)
        }
      />
      <label htmlFor={forma.id} className="flex-1 text-sm">
        {forma.nome}
      </label>
      <Input
        type="text"
        value={forma.selecionada ? forma.valorTexto : '0.00'}
        onChange={(e) => onValorChange(forma.id, e.target.value)}
        onFocus={(e) => {
          onValorFocus(forma.id);
          e.target.select();
        }}
        onBlur={() => onValorBlur(forma.id)}
        disabled={!forma.selecionada}
        className="w-24 text-right"
      />
    </div>
  );
};

export default PaymentMethodItem;
