import { Column } from '@tanstack/react-table';

interface Props<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({ title }: Props<TData, TValue>) {
  return (
    <div className="font-medium">
      {title}
    </div>
  );
}
