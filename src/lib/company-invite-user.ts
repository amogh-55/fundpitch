import emailTransport from "./email-transport";
import { db } from "@/server/db";
import { companyInvites } from "@/server/db/schema";
import { and, eq, or } from "drizzle-orm";
import { nanoid } from "nanoid";

const COMMON_HEAD = `<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
    @import url("https://fonts.googleapis.com/css2?family=Mulish&display=swap");
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Mulish", sans-serif;
    }
    body {
        max-width: 300px;
        margin: auto;
    }
    .email__container {
        padding-bottom: 2rem;
        text-align: center;
    }
    .email {
        padding-top: 2rem;
        text-align: center;
    }
    .email-icon {
        width: 2rem;
        height: 2rem;
    }
    .hr-line {
        width: 5rem;
        background-color: #fff;
        border: 1px solid #ffffff;
        border-radius: 5px;
        height: 0.1rem;
        display: inline-block;
        margin-bottom: 0.75rem;
    }
    .right-icon {
        width: 5rem;
    }
    .email-icon {
        height: auto;
        margin: 0 1rem;
    }
    .msg-title,
    .msg-subtitle {
        font-style: normal;
        text-transform: uppercase;
        font-weight: 900;
        font-size: 1.3rem;
        padding-top: 1rem;
        text-align: center;
        letter-spacing: 2px;
        color: #fefefe;
    }
    .right-icon-container {
        text-align: center;
        padding: 0.5rem 0;
    }
    .msg-subtitle {
        font-weight: 500;
        font-size: 1rem;
        text-transform: none;
        letter-spacing: normal;
    }
    .section {
        padding: 1rem 2rem;
        background-color: #fff;
    }
    .section-title,
    .section-msg {
        font-style: normal;
        text-transform: uppercase;
        text-align: center;
        font-weight: 400;
        font-size: 1.8rem;
        letter-spacing: 0.01em;
        color: #122548;
    }
    #version {
        font-size: 1.3rem;
        color: #44beaa;
        text-transform: lowercase;
    }
    .section-msg {
        font-size: 1rem;
        color: #4f4f4f;
        text-transform: none;
        margin: 1rem 0;
    }
    .section-msg-invite {
        font-size: 1rem;
        color: #4f4f4f;
        text-transform: none;
        margin: 1rem 0;
    }
    .section-hello{
     text-align: start;
    }    
    .btn_container {
        text-align: center;
    }
    .verify-btn {
        background: #122548;
        border-radius: 12px;
        justify-content: center;
        display:flex;
        align-items: center;
        width: fit-content;
        border: none;
        color: #fefefe !important;
        padding: 0.7rem 2rem;
        margin: 1rem 0;
        cursor: pointer;
        text-decoration: none;
        margin-top: 1rem;
    }
    .verify-btn > span {
        color: white;
    }
   
    .footer {
        text-align: center;
    }
    .hr-seperator {
        width: 100%;
        border: 1px solid #4f4f4f;
        margin: 1rem 0;
    }
    .social-container {
        text-align: center;
    }
    .social-icon {
        margin: 0 1rem;
        background-color: #ededed;
        display: inline-block;
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
    }
    .icon {
        width: 1.5rem;
        margin-top: 1.5rem;

        transform: translateY(-50%);
    }
    .copyright-msg {
        text-align: center;
        font-style: normal;
        font-weight: 400;
        margin: 1rem 0;
        font-size: 1rem;
        font-feature-settings: "salt" on, "liga" off;
        color: #4f4f4f;
    }
    .com-msg{
    background-color: #B2F7FF;
    color: black;  
    padding: 2px;
    gap: 2rem;   
    width: 100%;     
    }
       .fundpitch {
      color: #003366;
      margin: 0 8rem;
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
    } 
        .invite-icon {
       height: 20rem; 
        width: auto; 
         display: block; 
         margin: 2rem auto;
}
    @media only screen and (max-width: 500px) {
        .hr-line {
            width: 2rem;
        }
        .email-icon {
            width: 1.5rem;
            margin: 0 0.5rem;
        }
        .msg-title {
            font-size: 0.9rem;
            margin-top: 1rem;
        }
        .msg-subtitle {
            font-size: 0.8rem;
        }
        .right-icon {
            width: 3rem;
        }
        .invite-icon {
      height: 12rem; 
      width: auto; 
      display: block; 
      margin: 0 auto;
}
        .com-msg{
    background-color: #B2F7FF;
    color: black;  
    padding: 2px;
    gap: 2rem;   
    width: 100%;     
    }
        .section-title {
            font-size: 1.2rem;
        }
        .section-msg {
            font-size: 0.9rem;
        }
        .social-icon {
            padding: 0.4rem 0.5rem;
            margin: 0 0.7rem;
        }
        .icon {
            width: 1rem;
        }
        .copyright-msg {
            font-size: 0.7rem;
        }
        .fundpitch {
      color: #003366;
      margin: 0 2rem;
      font-size: 1rem;
      font-weight: bold;
      text-align: center;
    } 
    }
    @media only screen and (max-width: 800px) {
        .hr-line {
            width: 4rem;
        }
        .email-icon {
            margin: 0 0.8rem;
        }
   
        .msg-title {
            font-size: 1.2rem;
            margin-top: 1rem;
        }
        .msg-subtitle {
            font-size: 1rem;
        }
        .section-title {
            font-size: 1.4rem;
        }
        .section-msg {
            font-size: 1rem;
        }
        .social-icon {
            padding: 0.6rem 0.7rem;
            margin: 0 1rem;
        }
        .icon {
            width: 1.5rem;
        }
        .invite-icon {
         height: 10rem; 
         width: auto; 
         display: block; 
         margin: 2rem auto;
}
        .copyright-msg {
            font-size: 0.9rem;
        }
    }
</style>
</head>`;

const verifyFormTemplate = (
  baseUrl: string,
  redirectPath: string,
  role: string,
  founderName: string,
  companyName: string,
  location: string,
  sector: string,
) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
            ${COMMON_HEAD}
            <body>
                  <div>
                      <div class="email__container">
                              <img src="https://images.fundpitch.com/logo-fundpitch.png" alt="logo" class="right-icon" />
                      </div>
                      <div class="fundpitch">
                          You have been invited to join FundPitch to check the pitch of ${companyName} by ${founderName}
                          </div>               
                          <div class="">
                          <img src="https://images.fundpitch.com/invite.png" class="invite-icon" />
                          </div>
                          <div class="section-hello">
                          Hello,
                          </div>
                          <p class="section-msg-invite">
Greetings, ${founderName} (Founder) from ${companyName} has invited you to view a project in FundPitch. Kindly, checkout and express your interest on the FundPitch, The Platform to assist Merchant Banking community in their Investment process. This is the Beta version. The next version of the platform will have additional features with newer look and design. This is an invitation to view and express your interest on an on-going pitch with an attractive Return of Interest. Our Analysts team performed the due diligence and approved the opportunity. Your participation and presence will contribute towards a meaningful outcome. I kindly request to provide your opinion on the platform.</p>
                          <p class="section-msg-invite">
Here's the snapshot of the proposal,
                          </p>
                          <div class="com-msg">
                          <div>Company Name: ${companyName}</div>
                            <div>Sector: ${sector}</div>
                          <div>Location: ${location}</div>
                          </div>
                          <p class="section-msg">
                            Fund Pitch Invitation
                          </p>
                          <p class="section-msg">
                          You are invited to join Fund Pitch as ${role}.
                          </p>
                          <div class="btn_container" style="text-align: center;">
                              <a href="${baseUrl}${redirectPath}" class="verify-btn" style="display: inline-block;">View Invite</a>
                          </div>
                          <p class="section-msg">
                          Regards,
                          </p>
                          <p class="section-msg">
                          Fund Pitch Team
                          </p>
                      </div>

                       <div class="footer">
                           <div class="hr-seperator"></div>
                           <h6 class="copyright-msg">&#169; 2022 . All rights reserved</h6>
                       </div>
                   </div>
              </body>
        </html>
  `;
};

const inviteEmail = async ({
  email,
  role,
  companyUserId,
  baseUrl,
  inviterId,
  isDirectCompanyInvite,
  inviteLevel,
  founderName,
  sector,
  location,
  companyName,
}: {
  email: string;
  role: string;
  companyUserId: string;
  baseUrl: string;
  inviterId: string;
  isDirectCompanyInvite: boolean;
  inviteLevel: number;
  founderName: string;
  location: string;
  sector: string;
  companyName: string;
}) => {
  const inviteId = nanoid();
  const redirectPath = `/accept-invite/${inviteId}`;

  try {
    const mailOptions = {
      from: "info@fundpitch.com",
      bcc: ["santhakrishna@threepointolabs.com"],
      to: email,
      subject: "FUND PITCH INVITATION",
      html: verifyFormTemplate(
        baseUrl,
        redirectPath,
        location,
        sector,
        role,
        founderName,
        companyName,
      ),
    };

    await emailTransport.sendMail(mailOptions);

    await createOrUpdateInvite({
      email,
      role,
      inviteId,
      companyUserId,
      inviterId,
      isDirectCompanyInvite,
      inviteLevel,
    });

    return {
      success: true,
      message: "Email sent successfully",
      inviteId,
    };
  } catch (e) {
    console.error("Error details:", e);
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to send email",
      inviteId: null,
    };
  }
};

interface MTalkzResponse {
  status?: string;
  error?: {
    code?: string;
    description?: string;
    metaError?: string;
  };
  metaStatus?: string;
}

interface InviteResponse {
  success: boolean;
  message: string;
  phoneNumber: string;
  inviteId: string | null;
  mtalkzResponse?: MTalkzResponse;
  error?: string;
}
const createPhoneInvite = async ({
  phoneNumber,
  role,
  baseUrl,
  inviterId,
  companyName,
  founderName,

  companyUserId,
  isDirectCompanyInvite,
  inviteLevel,
}: {
  phoneNumber: string;
  role: string;
  baseUrl: string;
  companyName: string;
  founderName: string;
  companyUserId: string;
  inviterId: string;
  isDirectCompanyInvite: boolean;
  inviteLevel: number;
}): Promise<InviteResponse> => {
  const inviteId = nanoid();
  const inviteLink = `${inviteId}`;
  const redirectPath = `${baseUrl}/accept-invite/${inviteId}`;

  console.log("Redirect path:", redirectPath);

  try {
    await createOrUpdateInvite({
      phoneNumber,
      role,
      inviteId,
      companyUserId,
      inviterId,
      isDirectCompanyInvite: true,
      inviteLevel: 0,
    });

    const bodyParams = {
      sender_name: founderName,
      designation: "Founder",
      company_name: companyName,
      role: role,
    };

    console.log("Parameters being sent:", bodyParams);

    const messagePayload = {
      message: {
        channel: "WABA",
        content: {
          type: "MEDIA_TEMPLATE",
          mediaTemplate: {
            templateId: "share",
            bodyParameterValues: {
              "0": founderName ?? "",
              "1": companyName,
            },
            buttons: {
              actions: [
                {
                  index: "0",
                  payload: `/accept-invite/${inviteId}`,
                  type: "url",
                },
              ],
            },
          },
          shorten_url: true,
        },
        recipient: {
          to: phoneNumber.startsWith("91") ? phoneNumber : `91${phoneNumber}`,
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
      // Send WhatsApp message through mTalkz
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

          // Update invite with error status
          await db
            .update(companyInvites)
            .set({
              whatsappStatus: "failed",
              whatsappError: errorMessage,
              metaStatus: responseData?.metaStatus,
            })
            .where(eq(companyInvites.inviteId, inviteId));

          throw new Error(errorMessage);
        }

        return {
          success: true,
          message: "WhatsApp message sent successfully",
          phoneNumber: phoneNumber ?? "",
          inviteId,
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
        inviteId,
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
      inviteId: null,
    };
  }
};

const createOrUpdateInvite = async ({
  email,
  phoneNumber,
  role,
  inviteId,
  companyUserId,
  inviterId,
  isDirectCompanyInvite,
  inviteLevel,
}: {
  email?: string;
  phoneNumber?: string;
  role: string;
  inviteId: string;
  companyUserId: string;
  inviterId: string;
  isDirectCompanyInvite: boolean;
  inviteLevel: number;
}) => {
  const existingInvite = await db.query.companyInvites.findFirst({
    where: and(
      or(
        email ? eq(companyInvites.email, email) : undefined,
        phoneNumber ? eq(companyInvites.phoneNumber, phoneNumber) : undefined,
      ),
      eq(companyInvites.companyUserId, companyUserId),
    ),
  });

  if (existingInvite) {
    await db
      .update(companyInvites)
      .set({
        status: "sent",
        updatedAt: new Date(),
        isUserApproved: true,
        inviteId,
        inviterId: inviterId,
      })
      .where(
        and(
          or(
            email ? eq(companyInvites.email, email) : undefined,
            phoneNumber
              ? eq(companyInvites.phoneNumber, phoneNumber)
              : undefined,
          ),
          eq(companyInvites.companyUserId, companyUserId),
        ),
      )
      .execute();
  } else {
    await db
      .insert(companyInvites)
      .values({
        email,
        phoneNumber,
        role,
        inviteId,
        status: "sent",
        isUserApproved: true,
        companyUserId,
        inviterId,
        isDirectCompanyInvite,
        inviteLevel,
      })
      .execute();
  }
};

export { inviteEmail, createPhoneInvite };
