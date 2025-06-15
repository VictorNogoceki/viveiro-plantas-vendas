
import React from 'react';
import { User } from 'lucide-react';

const HeaderVendas: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ponto de Venda (PDV)</h1>
        <p className="text-gray-600">Home / PDV</p>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <User className="h-5 w-5" />
        <span>Usuário</span>
      </div>
    </div>
  );
};

export default HeaderVendas;
