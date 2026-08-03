'use client';

import { useEffect } from 'react';
import { useMetaPixel } from '@/hooks/use-meta-pixel';

/** Fires client-side Purchase pixel event on the order success page.
 *  The event_id matches the server-side CAPI event so Meta deduplicates them.
 */
export function OrderSuccessPixel({ orderNumber, orderId }: { orderNumber: string; orderId?: string }) {
  const { trackPurchase } = useMetaPixel();

  useEffect(() => {
    if (!orderNumber) return;
    // Minimal client-side Purchase event — server already sent the rich one.
    // We need this for browser-side deduplication only.
    trackPurchase({
      orderId: orderId ?? orderNumber,
      value: 0, // value already reported server-side; set 0 to avoid double-counting
      numItems: 1,
      contents: [],
    });
    // Only fire once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  return null; // renders nothing
}
