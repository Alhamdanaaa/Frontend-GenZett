import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useSidebar } from '@/components/ui/sidebar';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
}

export function DataTableSchedule<TData>({
  table,
  children
}: DataTableProps<TData>) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className='flex flex-1 flex-col'>
      <div className='w-full'>
        {children}
      </div>
      <div className='relative flex flex-1'>
        <div 
          className='flex overflow-hidden rounded-lg border'
          style={{
            width: isCollapsed ? 'calc(100vw - 100px)' : 'calc(100vw - 300px)',
            maxWidth: 'none'
          }}
        >
          <ScrollArea className='max-h-[500px] w-full'>
            <div className='min-h-0 max-h-[calc(100vh-250px)] overflow-x-auto'>
              <Table className="min-w-[1200px]">
                <TableHeader className='bg-muted sticky top-0 z-10'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            width: '200px',
                            maxWidth: '150px',
                            minWidth: '120px',
                            ...getCommonPinningStyles({ column: header.column })
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              width: '200px',
                              maxWidth: '200px',
                              minWidth: '120px',
                              ...getCommonPinningStyles({ column: cell.column })
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={table.getAllColumns().length}
                        className='h-24 text-center'
                      >
                        Tidak ada hasil.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}