import { X } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal({ children, open, onClose }: ModalProps) {
  return (
    open ? (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4">
          <button className="absolute top-0 right-0" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    ) : null
  )
}