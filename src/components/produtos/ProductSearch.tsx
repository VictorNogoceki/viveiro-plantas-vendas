
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProductSearch = ({ searchTerm, onSearchChange }: ProductSearchProps) => {
  return (
    <div className="mb-6">
      <div className="relative w-80">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar produto"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default ProductSearch;
