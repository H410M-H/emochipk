import type {
  CourierTrackingResult,
  CourierTrackingEvent,
  TcsBookingRequest,
  TcsBookingResponse,
  TcsTrackResponse,
} from "./types";
import type { OrderStatus } from "@prisma/client";

// ─────────────────────────────────────────────
// TCS Courier API Client
// Portal: https://developer.tcscourier.com / https://sandbox.tcscourier.com
// Auth: x-api-key / x-client-id / Authorization headers
// ─────────────────────────────────────────────

const TCS_BASE_URL =
  process.env.TCS_BASE_URL || "https://developer.tcscourier.com/api/v1";

/**
 * Maps TCS consignment / tracking statuses to internal OrderStatus enum values.
 */
const STATUS_MAP: Record<string, OrderStatus> = {
  "BOOKED":                 "PACKED",
  "PENDING":                "PACKED",
  "DATA RECEIVED":          "PACKED",
  "MANIFESTED":             "PACKED",
  "PICKED UP":              "SHIPPED",
  "IN TRANSIT":             "SHIPPED",
  "ARRIVED AT STATION":     "SHIPPED",
  "DEPARTED FROM STATION":  "SHIPPED",
  "OUT FOR DELIVERY":       "OUT_FOR_DELIVERY",
  "WITH COURIER":           "OUT_FOR_DELIVERY",
  "DELIVERED":              "DELIVERED",
  "RETURN TO ORIGIN":       "RTO",
  "RTO":                    "RTO",
  "RETURNED":               "RTO",
  "CANCELLED":              "CANCELLED",
  "FAILED DELIVERY ATTEMPT":"OUT_FOR_DELIVERY",
  "DELIVERY ATTEMPTED":     "OUT_FOR_DELIVERY",
};

/**
 * Helper to get configured TCS credentials from environment variables.
 */
function getTcsConfig() {
  const apiKey = process.env.TCS_API_KEY;
  if (!apiKey) {
    throw new Error("TCS_API_KEY environment variable is not set");
  }

  const costCenterCode = process.env.TCS_COST_CENTER_CODE || "";
  const originCity = process.env.TCS_ORIGIN_CITY || "SIALKOT";

  return {
    apiKey,
    clientId: process.env.TCS_CLIENT_ID || "",
    costCenterCode,
    originCity,
    baseUrl: TCS_BASE_URL,
  };
}

/**
 * Book a new shipment with TCS and generate a Consignment Note (CN / AWB).
 *
 * @param params - Shipment booking details
 * @returns Consignment number (AWB) and reference ID
 */
export async function bookShipment(params: TcsBookingRequest): Promise<{
  consignmentNumber: string;
  referenceNo: string;
}> {
  const config = getTcsConfig();

  const payload = {
    costCenterCode: params.costCenterCode || config.costCenterCode,
    consigneeName: params.consigneeName,
    consigneeAddress: params.consigneeAddress,
    consigneeMobNo: params.consigneeMobNo,
    consigneeEmail: params.consigneeEmail || "",
    originCity: params.originCity || config.originCity,
    destinationCity: params.destinationCity,
    weight: params.weight,
    pieces: params.pieces || 1,
    codAmount: params.codAmount,
    services: params.services || (params.codAmount > 0 ? "COD" : "OVN"),
    productDetails: params.productDetails || "Footwear - Executive Mochi",
    remarks: params.remarks || "",
    fragile: params.fragile ?? false,
    referenceNo: params.referenceNo,
  };

  const response = await fetch(`${config.baseUrl}/cod/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      ...(config.clientId ? { "x-client-id": config.clientId } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `TCS Booking API HTTP error (${response.status}): ${errorText || response.statusText}`
    );
  }

  const data = (await response.json()) as TcsBookingResponse;

  const returnCode = String(data.returnStatus?.code ?? "");
  const isSuccess = returnCode === "200" || returnCode === "0" || data.returnStatus?.status === "SUCCESS";

  if (!isSuccess || !data.bookingReply?.consignmentNumber) {
    throw new Error(
      `TCS Booking error: ${data.returnStatus?.message || "Failed to generate consignment number"}`
    );
  }

  return {
    consignmentNumber: data.bookingReply.consignmentNumber,
    referenceNo: data.bookingReply.referenceNo || params.referenceNo,
  };
}

/**
 * Track a shipment by its TCS Consignment Number (AWB).
 *
 * @param trackingNumber - The TCS Consignment Number
 * @returns Normalized tracking result with events
 */
export async function trackOrder(
  trackingNumber: string
): Promise<CourierTrackingResult> {
  const config = getTcsConfig();

  const response = await fetch(
    `${config.baseUrl}/track/consignment?consignmentNo=${encodeURIComponent(trackingNumber)}`,
    {
      method: "GET",
      headers: {
        "x-api-key": config.apiKey,
        ...(config.clientId ? { "x-client-id": config.clientId } : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `TCS Tracking API HTTP error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as TcsTrackResponse;

  const events: CourierTrackingEvent[] = [];

  // Parse checkpoints if available
  if (Array.isArray(data.checkpoints) && data.checkpoints.length > 0) {
    for (const cp of data.checkpoints) {
      events.push({
        status: cp.status,
        statusMessage: cp.statusMessage || `Shipment ${cp.status}`,
        location: cp.station || undefined,
        timestamp: cp.dateTime ? new Date(cp.dateTime) : new Date(),
      });
    }
  }

  // If tracking info has a current status, add it if no checkpoints
  if (events.length === 0 && data.trackingInfo?.status) {
    events.push({
      status: data.trackingInfo.status,
      statusMessage: `Status: ${data.trackingInfo.status}`,
      location: data.trackingInfo.destination || undefined,
      timestamp: data.trackingInfo.bookingDate
        ? new Date(data.trackingInfo.bookingDate)
        : new Date(),
    });
  }

  // Sort events chronologically (oldest first)
  events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const latestStatus =
    data.trackingInfo?.status ||
    (events.length > 0 ? events[events.length - 1].status : "BOOKED");

  const normalizedStatusKey = latestStatus.trim().toUpperCase();
  const mappedStatus: OrderStatus =
    STATUS_MAP[normalizedStatusKey] || "SHIPPED";

  return {
    trackingNumber,
    currentStatus: latestStatus,
    mappedStatus,
    estimatedDelivery: data.trackingInfo?.deliveryDate || undefined,
    courierName: "TCS Courier",
    events:
      events.length > 0
        ? events
        : [
            {
              status: latestStatus,
              statusMessage: "Consignment registered with TCS",
              timestamp: new Date(),
            },
          ],
  };
}

/**
 * Estimate standard TCS shipping cost based on weight (in kg) and destination city.
 * Used for dynamic rate calculation in checkout and order management.
 */
export function calculateEstimatedTcsRate(
  destinationCity: string,
  weightKg: number = 1.0,
  originCity: string = "SIALKOT"
): number {
  const normDest = destinationCity.trim().toUpperCase();
  const normOrig = originCity.trim().toUpperCase();

  const isSameCity = normDest === normOrig || normDest === "PASRUR" || normDest === "DASKA";

  // Base rate up to 1kg
  let baseRate = isSameCity ? 180 : 280;

  // Additional rate per additional kg (or fraction thereof)
  if (weightKg > 1) {
    const extraKg = Math.ceil(weightKg - 1);
    baseRate += extraKg * (isSameCity ? 80 : 150);
  }

  return baseRate;
}
