"use client";

import { useState, useCallback } from 'react';
import { createClientClient, Profile } from '@/lib/supabase';

interface UseTipsReturn {
  userPoints: number;
  showTipModal: boolean;
  tipAmount: number;
  tipRecipient: { id: string; username: string } | null;
  tipMessageId: string | null;
  openTipModal: (recipient: { id: string; username: string }, messageId?: string) => void;
  closeTipModal: () => void;
  setTipAmount: (amount: number) => void;
  sendTip: () => Promise<boolean>;
  refreshPoints: () => Promise<void>;
}

export function useTips(
  user: Profile | null,
  onSuccess?: () => void
): UseTipsReturn {
  const supabase = createClientClient();
  const [userPoints, setUserPoints] = useState(user?.yallpoints || 250);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmountState] = useState(1);
  const [tipRecipient, setTipRecipient] = useState<{ id: string; username: string } | null>(null);
  const [tipMessageId, setTipMessageId] = useState<string | null>(null);

  // Update userPoints when user changes
  useState(() => {
    if (user?.yallpoints !== undefined) {
      setUserPoints(user.yallpoints);
    }
  });

  const openTipModal = useCallback((recipient: { id: string; username: string }, messageId?: string) => {
    setTipRecipient(recipient);
    setTipMessageId(messageId || null);
    setTipAmountState(1);
    setShowTipModal(true);
  }, []);

  const closeTipModal = useCallback(() => {
    setShowTipModal(false);
    setTipRecipient(null);
    setTipMessageId(null);
  }, []);

  const setTipAmount = useCallback((amount: number) => {
    setTipAmountState(Math.max(1, amount));
  }, []);

  const sendTip = useCallback(async (): Promise<boolean> => {
    if (!user?.id || !tipRecipient?.id || userPoints < tipAmount || tipAmount <= 0) {
      return false;
    }

    try {
      // Create tip record
      const { error: tipError } = await supabase.from('tips').insert({
        from_user_id: user.id,
        to_user_id: tipRecipient.id,
        message_id: tipMessageId || null,
        amount: tipAmount,
        reason: null,
        is_profile_tip: !tipMessageId,
      });

      if (tipError) throw tipError;

      // Update sender's balance
      const { error: senderError } = await (supabase
        .from('profiles') as any)
        .update({ yallpoints: userPoints - tipAmount })
        .eq('id', user.id);

      if (senderError) throw senderError;

      // Update receiver's earned points
      await (supabase.rpc as any)('increment_earned_points', {
        user_id: tipRecipient.id,
        amount: tipAmount,
      });

      // Update local state
      setUserPoints(prev => prev - tipAmount);
      
      // Close modal and notify success
      closeTipModal();
      onSuccess?.();
      
      return true;
    } catch (err) {
      console.error('Tip failed:', err);
      return false;
    }
  }, [supabase, user?.id, tipRecipient?.id, tipMessageId, tipAmount, userPoints, closeTipModal, onSuccess]);

  const refreshPoints = useCallback(async () => {
    if (!user?.id) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('yallpoints')
      .eq('id', user.id)
      .single();

    if (profile) {
      setUserPoints((profile as any).yallpoints);
    }
  }, [supabase, user?.id]);

  return {
    userPoints,
    showTipModal,
    tipAmount,
    tipRecipient,
    tipMessageId,
    openTipModal,
    closeTipModal,
    setTipAmount,
    sendTip,
    refreshPoints,
  };
}
