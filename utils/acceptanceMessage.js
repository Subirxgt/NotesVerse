const { sendEmail } = require("./sendEmail");

module.exports.acceptanceMessage=async(fileLink, email, name, res)=> {
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
              <td style="background:linear-gradient(90deg,#00b09b,#96c93d); padding:18px 24px; color:#ffffff;">
                <table width="100%">
                  <tr>
                    <td valign="middle" style="font-size:22px; font-weight:700;">StudyAdda</td>
                    <td align="right" style="font-size:12px; color:rgba(255,255,255,0.9);">
                      Submission Approved
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

                <div style="font-size:14px; color:#444; line-height:1.6; margin-bottom:20px;">
                  We’re excited to share that your recent submission has been <strong>approved</strong> by our review team at 
                  <strong>StudyAdda</strong>. Your file meets our content standards and is now available for learners to access.
                </div>

                <div style="font-size:14px; color:#444; line-height:1.6; margin-bottom:20px;">
                  Your contribution plays an important role in making quality study materials easily available to students everywhere. 
                  We truly appreciate your effort and dedication toward helping our learning community grow.
                </div>

                <div style="font-size:14px; color:#444; line-height:1.6; margin-bottom:22px;">
                  Thank you for choosing to be part of StudyAdda’s mission to make learning simple, open, and accessible to all.
                </div>

                <div style="text-align:center; margin:26px 0;">
                  <a href="${fileLink}" 
                     style="display:inline-block; padding:12px 26px; background-color:#00b09b; 
                            color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;">
                    View Approved File
                  </a>
                </div>

                <div style="font-size:13px; color:#666;">
                  We’d love to see more of your contributions! If you’d like to upload additional materials or have questions, 
                  feel free to contact us at 
                  <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:#0066ff; text-decoration:none;">${process.env.ADMIN_EMAIL}</a>.
                </div>

                <div style="font-size:14px; color:#333; margin-top:24px; font-weight:600;">
                  Thank you for your continued support and collaboration.
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
    await sendEmail({ email, subject: "Submission Approved — File Accepted", message });
  } catch (error) {
    console.log(error);
  }
}