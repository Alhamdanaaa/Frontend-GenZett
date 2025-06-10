'use client';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { cn } from '@/lib/utils';
import { 
  IconPlus, 
  IconCalendar, 
  IconMail, 
  IconCurrencyDollar, 
  IconBuildingBank, 
  IconClock, 
  IconMapPin, 
  IconUser, 
  IconFileText, 
  IconEye, 
  IconChevronRight, 
  IconRefresh,
  IconFilter,
  IconSearch
} from '@tabler/icons-react';
import { SearchParams } from 'nuqs/server';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefundDetailModal } from '@/components/modal/refund-detail-modal';
import { toast } from 'sonner';

type RefundItem = {
  historyId: number;
  bookingName: string;
  userEmail: string;
  reservationDate: string;
  cancelReason: string;
  requestDate: string;
  refundAmount: number;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  paymentStatus?: string;
  details: {
    time: string;
    sportName: string;
    locationName: string;
  }[];
};

// Move API call to separate service
const refundService = {
  async getRefunds(): Promise<RefundItem[]> {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reservations/user/refunds', {
        cache: 'no-store',
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      return json.data?.data || [];
    } catch (error) {
      console.error('Gagal fetch refund:', error);
      throw error;
    }
  }
};

// Utility functions
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Status configuration
const STATUS_CONFIG = {
  waiting: { 
    variant: "secondary" as const, 
    color: "text-yellow-600", 
    text: "Menunggu",
    bgColor: "bg-yellow-50 border-yellow-200"
  },
  approved: { 
    variant: "default" as const, 
    color: "text-green-600", 
    text: "Disetujui",
    bgColor: "bg-green-50 border-green-200"
  },
  rejected: { 
    variant: "destructive" as const, 
    color: "text-red-600", 
    text: "Ditolak",
    bgColor: "bg-red-50 border-red-200"
  },
  processed: { 
    variant: "outline" as const, 
    color: "text-blue-600", 
    text: "Diproses",
    bgColor: "bg-blue-50 border-blue-200"
  }
};

function RefundCard({ item, onRefundProcessed }: { item: RefundItem; onRefundProcessed: () => void }) {
  const getStatusBadge = () => {
    if (!item.paymentStatus) return null;
    
    const status = item.paymentStatus.toLowerCase();
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || 
                   { variant: "outline" as const, color: "text-gray-600", text: item.paymentStatus, bgColor: "bg-gray-50 border-gray-200" };
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.text}
      </Badge>
    );
  };

  const getCardBorderClass = () => {
    if (!item.paymentStatus) return "";
    const status = item.paymentStatus.toLowerCase();
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    return config ? `border-l-4 ${config.bgColor.replace('bg-', 'border-l-').replace('-50', '-400')}` : "";
  };

  return (
    <Card className={cn('hover:shadow-md transition-all duration-200', getCardBorderClass())}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between gap-4'>
          {/* Left Section - Main Info */}
          <div className='flex-1 space-y-3'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='font-semibold text-lg flex items-center gap-2'>
                  <IconUser className='w-5 h-5 text-primary' />
                  {item.bookingName}
                </h3>
                <p className='text-sm text-muted-foreground flex items-center gap-1 mt-1'>
                  <IconMail className='w-4 h-4' />
                  {item.userEmail}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="destructive" className='flex items-center gap-1'>
                  <IconCurrencyDollar className='w-3 h-3' />
                  {formatCurrency(item.refundAmount)}
                </Badge>
                {getStatusBadge()}
              </div>
            </div>

            {/* Quick Info */}
            <div className='flex flex-wrap gap-4 text-sm'>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <IconCalendar className='w-4 h-4' />
                <span>Reservasi: {formatDateShort(item.reservationDate)}</span>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <IconClock className='w-4 h-4' />
                <span>Request: {formatDateShort(item.requestDate)}</span>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <IconMapPin className='w-4 h-4' />
                <span>{item.details.length} lokasi</span>
              </div>
              {(item.bankName || item.accountName || item.accountNumber) && (
                <div className='flex items-center gap-2 text-green-600'>
                  <IconBuildingBank className='w-4 h-4' />
                  <span>Bank tersedia</span>
                </div>
              )}
            </div>

            {/* Cancel Reason Preview */}
            <div className='bg-muted/50 p-3 rounded-lg'>
              <p className='text-sm text-muted-foreground'>
                <span className='font-medium'>Alasan: </span>
                {item.cancelReason.length > 100 
                  ? `${item.cancelReason.substring(0, 100)}...` 
                  : item.cancelReason
                }
              </p>
            </div>
          </div>

          {/* Right Section - Action */}
          <div className='flex flex-col items-end gap-2'>
            <RefundDetailModal 
              refundItem={item}
              onRefundProcessed={onRefundProcessed}
            >
              <Button variant="outline" size="sm" className='flex items-center gap-2'>
                <IconEye className='w-4 h-4' />
                Detail
                <IconChevronRight className='w-4 h-4' />
              </Button>
            </RefundDetailModal>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Filter and Search Component
function RefundFilters({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  sortBy,
  setSortBy 
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative flex-1 min-w-[200px]">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, email, atau alasan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="waiting">Menunggu</SelectItem>
          <SelectItem value="approved">Disetujui</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
          <SelectItem value="processed">Diproses</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Terbaru</SelectItem>
          <SelectItem value="oldest">Terlama</SelectItem>
          <SelectItem value="amount-high">Jumlah Tertinggi</SelectItem>
          <SelectItem value="amount-low">Jumlah Terendah</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

interface RefundPageProps {
  searchParams: Promise<SearchParams>;
}

export default function RefundPage({ searchParams }: RefundPageProps) {
  const [data, setData] = useState<RefundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchRefundData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const refundData = await refundService.getRefunds();
      setData(refundData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat data refund';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRefundData();
  }, []);

  const handleRefundProcessed = () => {
    fetchRefundData();
    toast.success('Data refund berhasil diperbarui');
  };

  // Filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.bookingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cancelReason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        item.paymentStatus?.toLowerCase() === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
        case 'amount-high':
          return b.refundAmount - a.refundAmount;
        case 'amount-low':
          return a.refundAmount - b.refundAmount;
        case 'newest':
        default:
          return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const totalAmount = filteredAndSortedData.reduce((sum, item) => sum + item.refundAmount, 0);
    const statusCounts = filteredAndSortedData.reduce((acc, item) => {
      const status = item.paymentStatus?.toLowerCase() || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalAmount, statusCounts };
  }, [filteredAndSortedData]);

  if (isLoading) {
    return (
      <PageContainer scrollable={false}>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading
              title='Cancel Reservasi Lapangan'
              description='Kelola data refund reservasi lapangan'
            />
          </div>
          <Separator />
          <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer scrollable={false}>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading
              title='Cancel Reservasi Lapangan'
              description='Kelola data refund reservasi lapangan'
            />
            <Button 
              variant="outline" 
              onClick={fetchRefundData}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <IconRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Retry
            </Button>
          </div>
          <Separator />
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center'>
                <IconFileText className='w-8 h-8 text-destructive' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold text-destructive'>
                  Error Memuat Data
                </h3>
                <p className='text-sm text-muted-foreground max-w-md'>
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  if (data.length === 0) {
    return (
      <PageContainer scrollable={false}>
        <div className='flex flex-1 flex-col space-y-4'>
          <div className='flex items-start justify-between'>
            <Heading
              title='Cancel Reservasi Lapangan'
              description='Kelola data refund reservasi lapangan'
            />
            <Button 
              variant="outline" 
              onClick={fetchRefundData}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <IconRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <Separator />
          <div className='flex flex-1 items-center justify-center'>
            <div className='text-center space-y-4'>
              <div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                <IconFileText className='w-8 h-8 text-muted-foreground' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold text-muted-foreground'>
                  Tidak ada data refund
                </h3>
                <p className='text-sm text-muted-foreground max-w-md'>
                  Belum ada permintaan refund yang masuk saat ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header Section */}
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <Heading
              title='Cancel Reservasi Lapangan'
              description='Kelola data refund reservasi lapangan'
            />
            <div className='flex items-center gap-4 flex-wrap'>
              <Badge variant="secondary" className='px-3 py-1'>
                {filteredAndSortedData.length} dari {data.length} Permintaan
              </Badge>
              <Badge variant="outline" className='px-3 py-1 flex items-center gap-1'>
                <IconCurrencyDollar className='w-3 h-3' />
                Total: {formatCurrency(stats.totalAmount)}
              </Badge>
              {stats.statusCounts.waiting && (
                <Badge variant="default" className='px-3 py-1'>
                  {stats.statusCounts.waiting} Menunggu
                </Badge>
              )}
              {stats.statusCounts.approved && (
                <Badge variant="outline" className='px-3 py-1 text-green-600 border-green-600'>
                  {stats.statusCounts.approved} Disetujui
                </Badge>
              )}
              {stats.statusCounts.rejected && (
                <Badge variant="destructive" className='px-3 py-1'>
                  {stats.statusCounts.rejected} Ditolak
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchRefundData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <IconRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <Separator />

        {/* Filters Section */}
        <RefundFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        
        {/* Content Section */}
        {filteredAndSortedData.length === 0 ? (
          <div className='flex flex-1 items-center justify-center py-12'>
            <div className='text-center space-y-4'>
              <div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center'>
                <IconFilter className='w-8 h-8 text-muted-foreground' />
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold text-muted-foreground'>
                  Tidak ada hasil ditemukan
                </h3>
                <p className='text-sm text-muted-foreground max-w-md'>
                  Coba ubah filter atau kata kunci pencarian Anda.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className='grid gap-4'>
            {filteredAndSortedData.map((item) => (
              <RefundCard 
                key={item.historyId} 
                item={item} 
                onRefundProcessed={handleRefundProcessed}
              />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}