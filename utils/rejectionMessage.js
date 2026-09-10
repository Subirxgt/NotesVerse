const { sendEmail } = require("./sendEmail");

module.exports.rejectionMessage=async(fileLink, email, name, res)=>{
  const message = `
  <div style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:24px 12px;">

          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
                 style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px;
                        overflow:hidden; box-shadow:0 6px 20px rgba(20,40,80,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#ff6a6a,#ff9f43); padding:18px 24px; color:#ffffff;">
                <table width="100%">
                  <tr>
                    <td valign="middle" style="font-size:22px; font-weight:700;">StudyAdda</td>
                    <td align="right" style="font-size:12px; color:rgba(255,255,255,0.9);">
                      Submission Review Update
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px; color:#1a1a1a;">
                <div style="font-size:18px; font-weight:700; margin-bottom:12px;">
                  Hello ${name || "Contributor"},
                </div>

                <div style="font-size:14px; color:#555; line-height:1.6; margin-bottom:20px;">
                  We truly appreciate your effort in submitting study material to <strong>StudyAdda</strong>. 
                  After careful evaluation by our admin team, we regret to inform you that your file could not be accepted at this time.
                </div>

                <div style="font-size:14px; color:#555; line-height:1.6; margin-bottom:20px;">
                  The submission may include <strong>content that doesn’t fully comply with our quality or appropriateness guidelines</strong>. 
                  Please review your file, make the necessary corrections, and feel free to resubmit it for review.
                </div>

                <div style="font-size:14px; color:#555; line-height:1.6; margin-bottom:22px;">
                  We genuinely value your support and contribution. Every effort like yours helps make StudyAdda 
                  a stronger and more reliable learning platform for students everywhere.
                </div>

                <div style="text-align:center; margin:26px 0;">
                  <a href="${fileLink}" 
                     style="display:inline-block; padding:12px 26px; background-color:#ff6a6a; 
                            color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">
                    Review Your File
                  </a>
                </div>

                <div style="font-size:13px; color:#666;">
                  Need guidance on what’s acceptable? Reach us anytime at 
                  <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:#0066ff; text-decoration:none;">${process.env.ADMIN_EMAIL}</a>.
                </div>

                <div style="font-size:14px; color:#333; margin-top:24px; font-weight:600;">
                  Thank you once again for your understanding and contribution.
                </div>

                <div style="margin-top:6px; font-size:14px; color:#333;">
                  — The StudyAdda Review Team
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:14px 18px; background-color:#f9fbff; text-align:center; font-size:12px; color:#7d869b;">
                © ${new Date().getFullYear()} StudyAdda — All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
  try {
    await sendEmail({ email, subject: "Submission Review Result — File Not Accepted", message });
  } catch (error) {
    console.log(error);
  }
}