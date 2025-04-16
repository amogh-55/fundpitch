import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { companyInvites } from "@/server/db/schema";
import { eq } from "drizzle-orm";

interface MTalkzWebhookPayload {
  messageId?: string;
  status?: string;
  statusTime?: string;
  recipient?: string;
  metaStatus?: string;
  error?: {
    code?: string;
    description?: string;
    metaError?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as MTalkzWebhookPayload;
    console.log("Webhook received:", payload);

    // Find the invite by recipient (phone number)
    if (payload.recipient) {
      const formattedPhone = payload.recipient.replace(/^91/, ""); // Remove '91' prefix if present

      await db
        .update(companyInvites)
        .set({
          whatsappStatus: payload.status,
          whatsappError: payload.error?.description ?? payload.error?.metaError,
          metaStatus: payload.metaStatus,
          updatedAt: new Date(),
        })
        .where(eq(companyInvites.phoneNumber, formattedPhone));

      // Log status updates
      console.log("Updated invite status:", {
        phone: formattedPhone,
        status: payload.status,
        metaStatus: payload.metaStatus,
        error: payload.error,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Optional: Add GET method for webhook verification
export async function GET(req: NextRequest) {
  return NextResponse.json({ status: "healthy" });
}
