/**
 * POST /api/meta-capi
 *
 * Client-side events (ViewContent, AddToCart, InitiateCheckout) are sent
 * here so the Access Token stays server-only and we can enrich with real IP.
 *
 * Body: { event_name, event_id, event_source_url, custom_data, user_data }
 * user_data from client: fbp, fbc (cookies) — IP & UA added server-side.
 */
import { type NextRequest, NextResponse } from 'next/server';
import { sendMetaEvents, buildUserData, nowSeconds } from '@/lib/meta-capi';

const ALLOWED_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'AddToCart',
  'InitiateCheckout',
  'Search',
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_name, event_id, event_source_url, custom_data, user_data: clientUserData } = body;

    if (!ALLOWED_EVENTS.has(event_name)) {
      return NextResponse.json({ error: 'Event not allowed via this route' }, { status: 400 });
    }

    // Get real IP from Vercel/Railway headers, fall back to forwarded header
    const ip =
      req.headers.get('x-real-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      undefined;

    const ua = req.headers.get('user-agent') ?? undefined;

    const userData = buildUserData({
      email:     clientUserData?.email,
      phone:     clientUserData?.phone,
      firstName: clientUserData?.firstName,
      lastName:  clientUserData?.lastName,
      city:      clientUserData?.city,
      state:     clientUserData?.state,
      postalCode:clientUserData?.postalCode,
      country:   'pk',
      userId:    clientUserData?.userId,
      fbp:       clientUserData?.fbp,
      fbc:       clientUserData?.fbc,
      ip,
      ua,
    });

    await sendMetaEvents([{
      event_name,
      event_time: nowSeconds(),
      event_id:   event_id ?? `${event_name}-${Date.now()}`,
      event_source_url: event_source_url ?? 'https://executivemochi.pk',
      action_source: 'website',
      user_data: userData,
      custom_data: custom_data ?? undefined,
    }]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Meta CAPI Route] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
