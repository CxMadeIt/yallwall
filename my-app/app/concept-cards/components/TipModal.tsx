import { useState } from "react";
import { COLORS } from "../utils";

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (amount: number) => void;
  recipientName: string;
  userPoints: number;
}

export function TipModal({ 
  isOpen, 
  onClose, 
  onSend, 
  recipientName, 
  userPoints 
}: TipModalProps) {
  const [amount, setAmount] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-24 px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-sm p-6 rounded-3xl"
        style={{ backgroundColor: COLORS.navyDark, border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <h3 className="text-white font-semibold text-lg mb-1">Send YallPoints</h3>
        <p className="text-white/50 text-sm mb-4">To @{recipientName}</p>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[1, 3, 5, 10].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`py-3 rounded-xl font-semibold transition-all ${
                amount === val 
                  ? 'text-white' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
              style={{ backgroundColor: amount === val ? COLORS.yellow : undefined }}
            >
              {val}
            </button>
          ))}
        </div>
        
        <input
          type="number"
          placeholder="Custom amount"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center mb-4"
        />
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(amount)}
            disabled={amount > userPoints || amount <= 0}
            className="flex-1 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: COLORS.yellow }}
          >
            Send {amount} 🪙
          </button>
        </div>
        
        <p className="text-center text-white/30 text-xs mt-3">
          You have {userPoints} YallPoints
        </p>
      </div>
    </div>
  );
}
