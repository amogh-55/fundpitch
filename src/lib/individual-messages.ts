interface MTalkzResponse {
  status?: string;
  error?: {
    code?: string;
    description?: string;
    metaError?: string;
  };
  metaStatus?: string;
}

interface RoleChangeResponse {
  success: boolean;
  message: string;
  phoneNumber: string;
  mtalkzResponse?: MTalkzResponse;
  error?: string;
}

const roleChange = async ({
  phoneNumber,
  role,
  name,
  companyName,
  updatedAt,
}: {
  phoneNumber: string;
  role: string;
  name: string;
  companyName: string;
  updatedAt: string;
}): Promise<RoleChangeResponse> => {
  try {
    const messagePayload = {
      message: {
        channel: "WABA",
        content: {
          preview_url: false,
          type: "TEMPLATE",
          template: {
            templateId: "service_update2",
            parameterValues: {
              "0": name ?? "",
              "1": companyName ?? "",
              "2": role ?? "",
              "3": updatedAt ?? "",
              "4": companyName ?? "",
            },
          },
          shorten_url: true,
        },
        recipient: {
          to: phoneNumber.startsWith("91") ? phoneNumber : `91${phoneNumber}`,
          recipient_type: "individual",
          reference: {
            cust_ref: "Some Customer Ref",
            messageTag1: "Message Tag Val1",
            conversationId: "Some Optional Conversation ID",
          },
        },
        sender: {
          from: process.env.WAP_SENDER_PHONE,
        },
        preferences: {
          webHookDNId: "1001",
        },
      },
      metaData: {
        version: "v1.0.9",
      },
    };

    console.log("Sending payload:", JSON.stringify(messagePayload, null, 2));
    console.log("Sender phone number:", process.env.WAP_SENDER_PHONE);

    try {
      const response = await fetch(process.env.WAP_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${process.env.WAP_KEY}`,
        },
        body: JSON.stringify(messagePayload),
      });

      const responseText = await response.text();
      console.log("Raw API Response:", responseText);

      let responseData: MTalkzResponse | null = null;
      try {
        responseData = responseText
          ? (JSON.parse(responseText) as MTalkzResponse)
          : null;
        console.log("Parsed API Response:", responseData);

        // Check for both MTalkz and Meta errors
        if (
          !response.ok ||
          responseData?.error ||
          responseData?.metaStatus === "failed"
        ) {
          const errorMessage =
            responseData?.error?.metaError ??
            responseData?.error?.description ??
            `API error (${response.status}): ${responseText}`;

          throw new Error(errorMessage);
        }

        return {
          success: true,
          message: "WhatsApp message sent successfully",
          phoneNumber: phoneNumber ?? "",
          mtalkzResponse: responseData ?? undefined,
        };
      } catch (parseError) {
        console.error("Error parsing API response:", parseError);
        throw new Error(`Invalid API response: ${responseText}`);
      }
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      return {
        success: false,
        message: `Failed to send WhatsApp message: ${error instanceof Error ? error.message : "Unknown error"}`,
        phoneNumber,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  } catch (e) {
    console.error("Full error details:", {
      error: e,
      stack: e instanceof Error ? e.stack : undefined,
      message: e instanceof Error ? e.message : "Unknown error",
    });
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown error",
      phoneNumber,
    };
  }
};

export default roleChange;
