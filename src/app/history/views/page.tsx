'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import UserLayout from '@/app/user/layout';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, Search, X } from 'lucide-react';
import Image from 'next/image';
import BookingDetailModal from '@/components/modal/BookingDetailModal';
import BookingHistoryGuestPage from '../guest/page';

// Type definitions sesuai dengan API response
interface ReservationDetail {
  locationName: string;
  sportName: string;
  time: string;
  lapangan: string;
  price: number; // Menggunakan 'price' sesuai API response
}

interface Reservation {
  historyId?: number; // Add historyId for cancel API
  bookingName: string;
  cabang: string;
  lapangan: string;
  paymentStatus: string;
  paymentType: string;
  reservationStatus: string;
  totalAmount: number;
  totalPaid: number;
  remainingAmount: number;
  date: string;
  details: ReservationDetail[];
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    UserName: string;
    whatsapp: string;
    email: string;
    count: number;
    reservations: Reservation[];
  };
}

// Type for the transformed booking data
interface BookingData {
  id: string;
  branch: string;
  name: string;
  court: string;
  date: string;
  total: string;
  payment: string;
  status: string;
  originalData: Reservation; // Store original data for modal
}

// Cancel form data interface
interface CancelFormData {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  cancelReason: string;
}

const TableHeader = ({
  label,
  sortable = false,
  onSort,
  sortDirection
}: {
  label: string;
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
}) => (
  <th className='px-4 py-3 text-left font-semibold whitespace-nowrap'>
    <div
      className={cn('flex items-center gap-1', sortable && 'cursor-pointer')}
      onClick={onSort}
    >
      {label}
      {sortable && (
        <div className='ml-1 flex flex-col justify-center'>
          <ChevronUp
            className={cn(
              'h-[10px] w-[10px]',
              sortDirection === 'asc'
                ? 'text-[#C5FC40] opacity-100'
                : 'opacity-40'
            )}
          />
          <ChevronDown
            className={cn(
              '-mt-[2px] h-[10px] w-[10px] text-white',
              sortDirection === 'desc'
                ? 'text-[#C5FC40] opacity-100'
                : 'opacity-40'
            )}
          />
        </div>
      )}
    </div>
  </th>
);

// Cancel Modal Component
const CancelBookingModal = ({
  booking,
  onClose,
  onConfirm
}: {
  booking: BookingData;
  onClose: () => void;
  onConfirm: (formData: CancelFormData) => void;
}) => {
  const [formData, setFormData] = useState<CancelFormData>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    cancelReason: ''
  });
  const [loading, setLoading] = useState(false);

  const isLunas = booking.originalData.paymentStatus === 'Lunas';
  const isDP = booking.originalData.paymentStatus.includes('DP');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onConfirm(formData);
    } catch (error) {
      console.error('Error canceling booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center pointer-events-none'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-2xl border pointer-events-auto'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-black'>Batalkan Pemesanan</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='mb-4 text-sm text-gray-600'>
          <p><strong>Cabang:</strong> {booking.branch}</p>
          <p><strong>Lapangan:</strong> {booking.court}</p>
          <p><strong>Tanggal:</strong> {booking.date}</p>
          <p><strong>Status Pembayaran:</strong> {booking.payment}</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {isLunas && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nama Bank *
                </label>
                <select
                  name='bankName'
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none'
                  required
                >
                  <option value=''>Pilih Bank</option>
                  <option value='BCA'>BCA</option>
                  <option value='Mandiri'>Bank Mandiri</option>
                  <option value='BNI'>Bank BNI</option>
                  <option value='BRI'>Bank BRI</option>
                  <option value='CIMB Niaga'>CIMB Niaga</option>
                  <option value='Danamon'>Bank Danamon</option>
                  <option value='Permata'>Bank Permata</option>
                  <option value='OCBC NISP'>OCBC NISP</option>
                  <option value='Maybank'>Maybank Indonesia</option>
                  <option value='BSI'>Bank Syariah Indonesia (BSI)</option>
                  <option value='BTN'>Bank BTN</option>
                  <option value='Panin'>Bank Panin</option>
                  <option value='Lainnya'>Lainnya</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nama Akun *
                </label>
                <input
                  type='text'
                  name='accountName'
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none'
                  placeholder='Nama pemilik rekening'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nomor Rekening *
                </label>
                <input
                  type='text'
                  name='accountNumber'
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none'
                  placeholder='Nomor rekening bank'
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Alasan Pembatalan *
            </label>
            <select
              name='cancelReason'
              value={formData.cancelReason}
              onChange={handleInputChange}
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none mb-2'
              required
            >
              <option value=''>Pilih alasan pembatalan</option>
              <option value='Berhalangan hadir'>Berhalangan hadir</option>
              <option value='Kondisi cuaca buruk'>Kondisi cuaca buruk</option>
              <option value='Sakit/kondisi kesehatan'>Sakit/kondisi kesehatan</option>
              <option value='Konflik jadwal'>Konflik jadwal</option>
              <option value='Keadaan darurat'>Keadaan darurat</option>
              <option value='Perubahan rencana'>Perubahan rencana</option>
              <option value='Masalah transportasi'>Masalah transportasi</option>
              <option value='Alasan keluarga'>Alasan keluarga</option>
              <option value='Lainnya'>Lainnya (tulis di bawah)</option>
            </select>
            {formData.cancelReason === 'Lainnya' && (
              <textarea
                name='cancelReasonCustom'
                placeholder='Jelaskan alasan pembatalan Anda...'
                rows={3}
                className='w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#C5FC40] focus:outline-none resize-none'
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  cancelReason: e.target.value || 'Lainnya'
                }))}
              />
            )}
          </div>

          {isLunas && (
            <div className='text-xs text-gray-500 bg-yellow-50 p-3 rounded'>
              <p><strong>Catatan:</strong> Refund akan diproses dalam 1-3 hari kerja setelah permintaan pembatalan disetujui.</p>
            </div>
          )}

          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              onClick={onClose}
              variant='outline'
              className='flex-1'
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type='submit'
              className='flex-1 bg-red-600 text-white hover:bg-red-700'
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Batalkan Pemesanan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function HistoryPage() {
  const [data, setData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingData | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  function getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null; // Check if running on client-side
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
    return null;
  }

  // Function to transform API data to component format
  const transformApiData = (reservations: Reservation[]): BookingData[] => {
    return reservations.map((reservation, index) => {
      // Menggunakan totalAmount dari API response langsung
      const totalAmount = reservation.totalAmount;

      // Format payment status
      let paymentDisplay = reservation.paymentStatus;
      if (paymentDisplay === 'Lunas') {
        paymentDisplay = 'Lunas';
      } else if (paymentDisplay.includes('DP')) {
        paymentDisplay = paymentDisplay; // Keep as is, e.g., "DP (75000)"
      } else if (paymentDisplay === 'refund') {
        paymentDisplay = 'Refund';
      } else if (paymentDisplay === 'canceled') {
        paymentDisplay = 'Cancel';
      } else if (paymentDisplay === 'waiting') {
        paymentDisplay = 'Waiting';
      } else {
        paymentDisplay = 'Belum Lunas';
      }

      return {
        id: `#${index + 1}`, // Generate ID based on index since API doesn't provide unique ID
        branch: reservation.cabang,
        name: reservation.bookingName,
        court: reservation.lapangan,
        date: new Date(reservation.date).toLocaleDateString('id-ID'),
        total: `Rp. ${totalAmount.toLocaleString('id-ID')}`,
        payment: paymentDisplay,
        status: reservation.reservationStatus,
        originalData: reservation // Store original data for modal
      };
    });
  };

  // Fetch booking data from API
  useEffect(() => {
    if (!isClient) return; // Wait until client-side

    const fetchBookingData = async () => {
      try {
        const token = getCookie('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reservations/user`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data && result.data.reservations) {
          const transformedData = transformApiData(result.data.reservations);
          setData(transformedData);
        } else {
          throw new Error(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [isClient]);

  // Check if user is authenticated - only on client side
  if (!isClient) {
    return (
      <UserLayout>
        <div className='mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10'>
          <div className='py-8 text-center'>
            <p>Loading...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  const token = getCookie('token');
  if (!token) {
    return <BookingHistoryGuestPage />;
  }

  // Show loading state
  if (loading) {
    return (
      <UserLayout>
        <div className='mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10'>
          <div className='py-8 text-center'>
            <p>Loading...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <UserLayout>
        <div className='mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10'>
          <div className='py-8 text-center text-red-600'>
            <p>Error: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className='mt-4 bg-[#C5FC40] text-black hover:bg-lime-300'
            >
              Retry
            </Button>
          </div>
        </div>
      </UserLayout>
    );
  }

  const handleSort = (key: keyof BookingData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key].toString().toLowerCase();
      const bValue = b[key].toString().toLowerCase();
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const handleOpenModal = (booking: BookingData) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  const handleCancelBooking = (booking: BookingData) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setBookingToCancel(null);
    setShowCancelModal(false);
  };

  const handleConfirmCancel = async (formData: CancelFormData) => {
    if (!bookingToCancel) return;

    try {
      const token = getCookie('token');
      if (!token) {
        throw new Error('Token tidak ditemukan');
      }

      const historyId = bookingToCancel.originalData.historyId;
      if (!historyId) {
        throw new Error('History ID tidak ditemukan');
      }

      const requestBody: any = {
        cancelReason: formData.cancelReason
      };

      // Add bank details only if payment status is 'Lunas'
      if (bookingToCancel.originalData.paymentStatus === 'Lunas') {
        requestBody.bankName = formData.bankName;
        requestBody.accountName = formData.accountName;
        requestBody.accountNumber = formData.accountNumber;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reservations/user/${historyId}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Show success message
        alert(result.message || 'Permintaan pembatalan berhasil dikirim');
        
        // Close modal
        handleCloseCancelModal();
        
        // Refresh data
        window.location.reload();
      } else {
        throw new Error(result.message || 'Gagal membatalkan pemesanan');
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat membatalkan pemesanan');
    }
  };

  const filteredData = data.filter((booking) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      booking.id.toLowerCase().includes(searchStr) ||
      booking.name.toLowerCase().includes(searchStr) ||
      booking.branch.toLowerCase().includes(searchStr) ||
      booking.court.toLowerCase().includes(searchStr) ||
      booking.date.toLowerCase().includes(searchStr) ||
      booking.total.toLowerCase().includes(searchStr) ||
      booking.payment.toLowerCase().includes(searchStr) ||
      booking.status.toLowerCase().includes(searchStr)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handleChangeEntries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Function to highlight the search term in a text
  const highlightText = (text: string) => text;

  return (
    <UserLayout>
      <div className='mx-auto flex max-w-6xl flex-col px-4 py-5 md:py-10'>
        {/* Judul dengan segitiga */}
        <div className='mb-4 flex items-center gap-2'>
          <Image src='/icons/arrow.svg' alt='-' width={26} height={26} />
          <p className='text-2xl font-semibold text-black'>Riwayat Pemesanan</p>
        </div>

        {/* Search & Show Entries */}
        <div className='mb-4 flex flex-col md:flex-row'>
          <div className='flex items-center gap-2'>
            <label className='text-sm'>Show</label>
            <select
              className='rounded border px-2 py-1 text-sm'
              value={entriesPerPage}
              onChange={handleChangeEntries}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className='text-sm'>entries</span>
          </div>

          <div className='mt-2 ml-auto flex-1 md:mt-0 md:ml-4'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search...'
                className='w-full rounded border px-3 py-1 pl-8 text-sm'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className='absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
            </div>
          </div>
        </div>

        {/* Tabel */}
        <div className='overflow-auto rounded-md border'>
          <table className='min-w-full text-sm'>
            <thead className='bg-[#2C473A] text-white'>
              <tr>
                <TableHeader
                  label='Cabang'
                  sortable
                  onSort={() => handleSort('branch')}
                  sortDirection={
                    sortConfig?.key === 'branch' ? sortConfig.direction : null
                  }
                />
                <TableHeader
                  label='Lapangan'
                  sortable
                  onSort={() => handleSort('court')}
                  sortDirection={
                    sortConfig?.key === 'court' ? sortConfig.direction : null
                  }
                />
                <TableHeader
                  label='Tanggal'
                  sortable
                  onSort={() => handleSort('date')}
                  sortDirection={
                    sortConfig?.key === 'date' ? sortConfig.direction : null
                  }
                />
                <TableHeader
                  label='Total'
                  sortable
                  onSort={() => handleSort('total')}
                  sortDirection={
                    sortConfig?.key === 'total' ? sortConfig.direction : null
                  }
                />
                <TableHeader
                  label='Pembayaran'
                  sortable
                  onSort={() => handleSort('payment')}
                  sortDirection={
                    sortConfig?.key === 'payment' ? sortConfig.direction : null
                  }
                />
                <TableHeader
                  label='Status'
                  sortable
                  onSort={() => handleSort('status')}
                  sortDirection={
                    sortConfig?.key === 'status' ? sortConfig.direction : null
                  }
                />
                <TableHeader label='Aksi' />
              </tr>
            </thead>
            <tbody>
              {currentEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-8 text-center'>
                    {data.length === 0
                      ? 'Tidak ada data pemesanan'
                      : 'Data tidak ditemukan'}
                  </td>
                </tr>
              ) : (
                currentEntries.map((booking, index) => (
                  <tr
                    key={index}
                    className={cn(
                      index % 2 === 0 ? 'bg-[#E5FFA8]' : 'bg-white',
                      'border-b'
                    )}
                  >
                    <td className='px-4 py-2'>
                      {highlightText(booking.branch)}
                    </td>
                    <td className='px-4 py-2'>
                      {highlightText(booking.court)}
                    </td>
                    <td className='px-4 py-2'>{highlightText(booking.date)}</td>
                    <td className='px-4 py-2'>
                      {highlightText(booking.total)}
                    </td>
                    <td className='px-4 py-2'>
                      {highlightText(booking.payment)}
                    </td>
                    <td className='px-4 py-2'>
                      <span
                        className={cn(
                          'rounded-full px-3 py-2 font-medium',
                          booking.status === 'Upcoming' &&
                            'bg-orange-100 text-orange-600',
                          booking.status === 'Completed' &&
                            'bg-green-100 text-green-600',
                          booking.status === 'Ongoing' &&
                            'bg-blue-100 text-blue-600',
                          booking.status === 'canceled' &&
                            'bg-red-100 text-red-600',
                          booking.status === 'waiting' &&
                            'bg-yellow-100 text-yellow-600',
                          booking.status.includes('Refund') &&
                            'bg-yellow-100 text-yellow-600'
                        )}
                      >
                        {highlightText(booking.status)}
                      </span>
                    </td>
                    <td className='px-3 py-2'>
                      <Button
                        className='rounded-full bg-[#C5FC40] text-black hover:bg-lime-300'
                        size='sm'
                        onClick={() => handleOpenModal(booking)}
                      >
                        Detail
                      </Button>
                      {booking.status === 'Upcoming' && (
                        <Button
                          className='ml-2 rounded-full bg-[#ff0303] hover:bg-[#ba1004] hover:text-white'
                          size='sm'
                          onClick={() => handleCancelBooking(booking)}
                        >
                          {highlightText('Cancel')}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='mt-4 flex items-center justify-center gap-4'>
            {/* Tombol Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={cn(
                'text-sm font-semibold text-black',
                currentPage === 1
                  ? 'cursor-not-allowed text-gray-400'
                  : 'hover:text-[#2C473A]'
              )}
            >
              Previous
            </button>

            {/* Tombol Halaman */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-medium',
                  currentPage === i + 1
                    ? 'bg-[#C5FC40] text-black'
                    : 'bg-transparent text-black hover:bg-[#C5FC40] hover:text-black'
                )}
              >
                {i + 1}
              </button>
            ))}

            {/* Tombol Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={cn(
                'text-sm font-semibold text-black',
                currentPage === totalPages
                  ? 'cursor-not-allowed text-gray-400'
                  : 'hover:text-[#2C473A]'
              )}
            >
              Next
            </button>
          </div>
        )}

        {/* Detail Modal */}
        {showModal && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={handleCloseModal}
          />
        )}

        {/* Cancel Modal */}
        {showCancelModal && bookingToCancel && (
          <CancelBookingModal
            booking={bookingToCancel}
            onClose={handleCloseCancelModal}
            onConfirm={handleConfirmCancel}
          />
        )}

        <style jsx>{`
          tbody {
            color: black;
          }
        `}</style>
      </div>
    </UserLayout>
  );
}