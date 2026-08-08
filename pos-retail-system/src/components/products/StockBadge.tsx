import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StockBadgeProps {
  stock: number;
  minimumStock: number;
}

export function StockBadge({ stock, minimumStock }: StockBadgeProps) {
  const isLowStock = stock <= minimumStock;
  
  if (isLowStock) {
    return (
      <span className="badge-danger gap-1">
        <AlertTriangle className="w-3 h-3" />
        Low: {stock}
      </span>
    );
  }
  
  return (
    <span className="badge-success gap-1">
      <CheckCircle2 className="w-3 h-3" />
      {stock}
    </span>
  );
}
