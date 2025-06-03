'use client';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Reservation } from '@/constants/data';
import { IconEdit, IconEye } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState, lazy, Suspense } from 'react';

// Lazy load the detail dialog component
const AvailabilityDetailDialog = lazy(() => import('../availabiliy-field-detail-dialog'));

interface CellActionProps {
  data: Reservation;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [showDetail, setShowDetail] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="flex flex-row gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="shadow-md"
                variant="outline"
                size="sm"
                onClick={() => setShowDetail(true)}
              >
                <IconEye className="h-4 w-4 stroke-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detail</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="shadow-md"
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/availability/${data.reservationId}`)
                }
              >
                <IconEdit className="h-4 w-4 stroke-amber-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ubah</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showDetail && (
        <Suspense fallback={<div>Loading...</div>}>
          <AvailabilityDetailDialog
            data={data}
            trigger={<div style={{ display: 'none' }} />}
            open={showDetail}
            onOpenChange={setShowDetail}
          />
        </Suspense>
      )}
    </>
  );
};
