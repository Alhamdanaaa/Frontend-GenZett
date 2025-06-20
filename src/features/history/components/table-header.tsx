import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableHeaderProps {
  label: string;
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: "asc" | "desc" | null;
}

const TableHeader = ({ label, sortable = false, onSort, sortDirection }: TableHeaderProps) => (
  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
    <div className={cn("flex items-center gap-1", sortable && "cursor-pointer")} onClick={onSort}>
      {label}
      {sortable && (
        <div className="ml-1 flex flex-col justify-center">
          <ChevronUp
            className={cn(
              "h-[10px] w-[10px]",
              sortDirection === "asc" ? "text-[#C5FC40] opacity-100" : "opacity-40"
            )}
          />
          <ChevronDown
            className={cn(
              "-mt-[2px] h-[10px] w-[10px] text-white",
              sortDirection === "desc" ? "text-[#C5FC40] opacity-100" : "opacity-40"
            )}
          />
        </div>
      )}
    </div>
  </th>
);

export default TableHeader;