interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCodeDataUrl: string;
}

export function QRCodeModal({ isOpen, onClose, qrCodeDataUrl }: QRCodeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative text-center">
        <h3 className="text-white font-bold text-xl mb-4">My YallWall QR</h3>
        {qrCodeDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={qrCodeDataUrl} 
            alt="QR Code" 
            className="w-64 h-64 rounded-2xl mx-auto"
          />
        )}
        <p className="text-white/50 text-sm mt-4">Scan to view profile</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-full bg-white/10 text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
