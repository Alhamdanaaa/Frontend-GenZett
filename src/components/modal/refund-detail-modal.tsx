'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  IconCalendar, 
  IconMail, 
  IconCurrencyDollar, 
  IconBuildingBank, 
  IconClock, 
  IconMapPin, 
  IconUser, 
  IconFileText,
  IconCopy,
  IconCheck,
  IconLoader2
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
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
  paymentStatus?: string; // untuk mengecek status refund
  details: {
    time: string;
    sportName: string;
    locationName: string;
  }[];
};

interface RefundDetailModalProps {
  refundItem: RefundItem;
  children: React.ReactNode;
  onRefundProcessed?: () => void; // Callback untuk refresh data
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} berhasil disalin`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(`Gagal menyalin ${label.toLowerCase()}`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-8 w-8 p-0"
    >
      {copied ? (
        <IconCheck className="w-4 h-4 text-green-600" />
      ) : (
        <IconCopy className="w-4 h-4" />
      )}
    </Button>
  );
}

function ProcessRefundModal({ refundItem, onRefundProcessed }: { refundItem: RefundItem; onRefundProcessed?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [adminNote, setAdminNote] = React.useState('');
  const [refundAmount, setRefundAmount] = React.useState(refundItem.refundAmount.toString());

  const handleSubmit = async () => {
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error('Jumlah refund harus lebih dari 0');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/user/refunds/${refundItem.historyId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminNote: adminNote.trim(),
          refundAmount: refundAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memproses refund');
      }

      toast.success('Refund berhasil diproses');
      setOpen(false);
      onRefundProcessed?.();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal memproses refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          Proses Refund
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Proses Refund</AlertDialogTitle>
          <AlertDialogDescription>
            Masukkan detail untuk memproses refund ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="refundAmount">Jumlah Refund</Label>
            <Input
              id="refundAmount"
              type="string"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Masukkan jumlah refund"
              min="0"
              step="1000"
            />
            <p className="text-sm text-muted-foreground">
              Jumlah asli: {formatCurrency(refundItem.refundAmount)}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="adminNote">Catatan Admin (Opsional)</Label>
            <Textarea
              id="adminNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Masukkan catatan untuk refund ini..."
              rows={3}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              'Proses Refund'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RejectRefundModal({ refundItem, onRefundProcessed }: { refundItem: RefundItem; onRefundProcessed?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');

  const handleSubmit = async () => {
    if (!rejectReason.trim()) {
      toast.error('Alasan penolakan harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations/user/refunds/${refundItem.historyId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectReason: rejectReason.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menolak refund');
      }

      toast.success('Refund berhasil ditolak');
      setOpen(false);
      onRefundProcessed?.();
    } catch (error) {
      console.error('Error rejecting refund:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menolak refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          Tolak Refund
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Tolak Refund</AlertDialogTitle>
          <AlertDialogDescription>
            Masukkan alasan penolakan untuk refund ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rejectReason">Alasan Penolakan</Label>
            <Textarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan mengapa refund ini ditolak..."
              rows={4}
              required
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Menolak...
              </>
            ) : (
              'Tolak Refund'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RefundDetailModal({ refundItem, children, onRefundProcessed }: RefundDetailModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <IconFileText className="w-6 h-6 text-primary" />
            Detail Permintaan Refund
          </DialogTitle>
          <DialogDescription>
            ID Histori: #{refundItem.historyId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconUser className="w-5 h-5 text-primary" />
                Informasi Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Nama Lengkap
                  </label>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">{refundItem.bookingName}</span>
                    <CopyButton text={refundItem.bookingName} label="Nama" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-mono text-sm">{refundItem.userEmail}</span>
                    <CopyButton text={refundItem.userEmail} label="Email" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Refund Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconCurrencyDollar className="w-5 h-5 text-green-600" />
                Informasi Refund
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Jumlah Refund
                  </label>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="font-bold text-green-700 dark:text-green-300 text-lg">
                      {formatCurrency(refundItem.refundAmount)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal Reservasi
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <IconCalendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{formatDate(refundItem.reservationDate)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal Request
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <IconClock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">{formatDateTime(refundItem.requestDate)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancel Reason */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconFileText className="w-5 h-5 text-orange-500" />
                Alasan Pembatalan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-orange-900 dark:text-orange-100 leading-relaxed">
                  {refundItem.cancelReason}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details - Only show if bank info exists */}
          {(refundItem.bankName || refundItem.accountName || refundItem.accountNumber) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconBuildingBank className="w-5 h-5 text-blue-600" />
                  Informasi Bank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {refundItem.bankName && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Nama Bank
                      </label>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {refundItem.bankName}
                        </span>
                        <CopyButton text={refundItem.bankName} label="Nama Bank" />
                      </div>
                    </div>
                  )}
                  {refundItem.accountName && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Nama Akun
                      </label>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {refundItem.accountName}
                        </span>
                        <CopyButton text={refundItem.accountName} label="Nama Akun" />
                      </div>
                    </div>
                  )}
                  {refundItem.accountNumber && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Nomor Rekening
                      </label>
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <span className="font-mono font-medium text-blue-900 dark:text-blue-100">
                          {refundItem.accountNumber}
                        </span>
                        <CopyButton text={refundItem.accountNumber} label="Nomor Rekening" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Show message if no bank info available */}
                {!refundItem.bankName && !refundItem.accountName && !refundItem.accountNumber && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
                      <IconBuildingBank className="w-4 h-4" />
                      Informasi bank belum tersedia
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconMapPin className="w-5 h-5 text-green-600" />
                Detail Reservasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {refundItem.details.map((detail, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-green-900 dark:text-green-100">
                          {detail.sportName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-green-700 dark:text-green-300">
                          <span className="flex items-center gap-1">
                            <IconMapPin className="w-4 h-4" />
                            {detail.locationName}
                          </span>
                          <span className="flex items-center gap-1">
                            <IconClock className="w-4 h-4" />
                            {detail.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons - Only show if status is waiting */}
          {refundItem.paymentStatus?.toLowerCase() === 'waiting' && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <RejectRefundModal refundItem={refundItem} onRefundProcessed={onRefundProcessed} />
              <ProcessRefundModal refundItem={refundItem} onRefundProcessed={onRefundProcessed} />
            </div>
          )}

          {/* Status Badge for non-waiting status */}
          {refundItem.paymentStatus && refundItem.paymentStatus.toLowerCase() !== 'waiting' && (
            <div className="flex justify-center pt-4 border-t">
              <Badge 
                variant={
                  refundItem.paymentStatus.toLowerCase() === 'approved' ? 'default' :
                  refundItem.paymentStatus.toLowerCase() === 'rejected' ? 'destructive' :
                  refundItem.paymentStatus.toLowerCase() === 'processed' ? 'secondary' : 'outline'
                }
                className="px-4 py-2 text-sm"
              >
                Status: {refundItem.paymentStatus.charAt(0).toUpperCase() + refundItem.paymentStatus.slice(1)}
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}