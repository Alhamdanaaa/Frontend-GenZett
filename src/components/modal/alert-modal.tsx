'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  children?: React.ReactNode;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = 'Apakah anda yakin?', // default title
  description = 'Data yang dihapus tidak dapat dipulihkan.', // default description
  confirmText = 'Hapus', // default button text
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      {/* Konten tambahan */}
      {children && <div className="mt-2 text-sm text-gray-700">{children}</div>}

      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
