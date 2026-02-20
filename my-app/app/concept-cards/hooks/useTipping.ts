import { useState } from "react";
import { createClientClient, Profile } from "@/lib/supabase";

export function useTipping(user: Profile | null, setUser: (user: Profile) => void) {
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipRecipient, setTipRecipient] = useState<{id: string, username: string} | null>(null);
  const [tipMessageId, setTipMessageId] = useState<string | null>(null);
  const supabase = createClientClient();

  const handleTip = async (amount: number, onSuccess: (msg: string) => void) => {
    if (!user?.id || !tipRecipient) return;
    
    if ((user.yallpoints || 0) < amount) {
      onSuccess('Not enough YallPoints!');
      return;
    }
    
    try {
      await supabase.from('tips').insert({
        from_user_id: user.id,
        to_user_id: tipRecipient.id,
        message_id: tipMessageId || null,
        amount: amount,
        reason: null,
        is_profile_tip: !tipMessageId,
      } as any);
      
      const newPoints = (user.yallpoints || 0) - amount;
      
      await (supabase
        .from('profiles') as any)
        .update({ yallpoints: newPoints })
        .eq('id', user.id);
      
      await (supabase.rpc as any)('increment_earned_points', { 
        user_id: tipRecipient.id, 
        amount: amount 
      });
      
      setUser({ ...user, yallpoints: newPoints });
      onSuccess(`Tipped ${amount} YallPoints! 💰`);
      
      setShowTipModal(false);
      setTipRecipient(null);
      setTipMessageId(null);
    } catch (err) {
      console.error('Tip failed:', err);
      onSuccess('Failed to send tip');
    }
  };

  const openTipModal = (recipient: {id: string, username: string}, messageId?: string) => {
    setTipRecipient(recipient);
    setTipMessageId(messageId || null);
    setShowTipModal(true);
  };

  return { 
    showTipModal, 
    setShowTipModal,
    tipRecipient, 
    handleTip, 
    openTipModal 
  };
}
