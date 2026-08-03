'use client';

/**
 * useMetaPixel — client-side hook for firing Meta Pixel + CAPI events.
 *
 * Each call fires:
 * 1. fbq() — browser pixel (for real-time reporting)
 * 2. POST /api/meta-capi — server-side mirror (for match quality + ad blocker bypass)
 *
 * Meta deduplicates events using event_id, so double-counting is prevented.
 */

import { useCallback } from 'react';

/** Read a cookie by name */
function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match?.[2] ?? '';
}

/** Generate a stable event ID for deduplication */
function genEventId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type FireEventOpts = {
  eventName: string;
  eventId?: string;
  customData?: Record<string, unknown>;
  /** User info to pass server-side (never hashed here — done server-side) */
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    userId?: string;
  };
};

async function fireCapiEvent(opts: FireEventOpts) {
  const { eventName, eventId, customData, userData } = opts;
  const fbp = getCookie('_fbp');
  const fbc = getCookie('_fbc');
  const eid = eventId ?? genEventId(eventName);

  // 1. Browser pixel
  if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
    (window as any).fbq('track', eventName, customData ?? {}, { eventID: eid });
  }

  // 2. Server-side CAPI (fire-and-forget)
  try {
    await fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eid,
        event_source_url: window.location.href,
        custom_data: customData,
        user_data: { ...userData, fbp, fbc },
      }),
    });
  } catch {
    // Silent — never block the user flow
  }
}

// ── Public hook ─────────────────────────────────────────────────────────────

export function useMetaPixel() {
  const trackViewContent = useCallback(
    (opts: {
      contentId: string;
      contentName: string;
      contentCategory: string;
      value: number;
      currency?: string;
    }) => {
      const eventId = genEventId('ViewContent');
      const customData = {
        content_ids: [opts.contentId],
        content_name: opts.contentName,
        content_category: opts.contentCategory,
        content_type: 'product',
        value: opts.value,
        currency: opts.currency ?? 'PKR',
      };
      fireCapiEvent({ eventName: 'ViewContent', eventId, customData });
    },
    []
  );

  const trackAddToCart = useCallback(
    (opts: {
      contentId: string;
      contentName: string;
      value: number;
      quantity: number;
      currency?: string;
    }) => {
      const customData = {
        content_ids: [opts.contentId],
        content_name: opts.contentName,
        content_type: 'product',
        value: opts.value,
        num_items: opts.quantity,
        currency: opts.currency ?? 'PKR',
      };
      fireCapiEvent({ eventName: 'AddToCart', customData });
    },
    []
  );

  const trackInitiateCheckout = useCallback(
    (opts: {
      value: number;
      numItems: number;
      contentIds: string[];
      currency?: string;
      userData?: FireEventOpts['userData'];
    }) => {
      const customData = {
        value: opts.value,
        num_items: opts.numItems,
        content_ids: opts.contentIds,
        content_type: 'product',
        currency: opts.currency ?? 'PKR',
      };
      fireCapiEvent({ eventName: 'InitiateCheckout', customData, userData: opts.userData });
    },
    []
  );

  const trackPurchase = useCallback(
    (opts: {
      orderId: string;
      value: number;
      numItems: number;
      contents: { id: string; quantity: number; item_price: number }[];
      currency?: string;
      userData?: FireEventOpts['userData'];
    }) => {
      // Use orderId as event_id for deduplication with the server-side Purchase event
      const customData = {
        order_id: opts.orderId,
        value: opts.value,
        num_items: opts.numItems,
        contents: opts.contents,
        content_type: 'product',
        currency: opts.currency ?? 'PKR',
      };
      fireCapiEvent({
        eventName: 'Purchase',
        eventId: `purchase-${opts.orderId}`,
        customData,
        userData: opts.userData,
      });
    },
    []
  );

  return { trackViewContent, trackAddToCart, trackInitiateCheckout, trackPurchase };
}
