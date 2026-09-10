const { sendEmail } = require("./sendEmail");

module.exports.receivedMessage=async(fileLink, email, name, res)=>{
  const message = `
  <div style="margin:0; padding:0; background-color:#f4f7fb; font-family:'Segoe UI', Arial, Helvetica, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:24px 12px;">

          <!-- Outer Container -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600"
                 style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px;
                        overflow:hidden; box-shadow:0 6px 20px rgba(20,40,80,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #488ce6, #52bee9); padding:18px 24px; color:#ffffff;">
                <table width="100%">
                  <tr>
                    <td valign="middle" style="font-size:22px; font-weight:700;">StudyAdda</td>
                    <td align="right" style="font-size:13px; color:rgba(255,255,255,0.9);">
                      File Submission Acknowledgement
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 28px; color:#1a1a1a; line-height:1.6;">
                
                <div style="font-size:18px; font-weight:700; margin-bottom:12px;">
                  Hello ${name || "Contributor"},
                </div>

                <div style="font-size:15px; color:#444; margin-bottom:18px;">
                  Thank you for contributing to <strong>StudyAdda</strong>! We’ve successfully received your file and it’s now with our review team.
                </div>

                <div style="font-size:14px; color:#555; margin-bottom:18px;">
                  Our team will evaluate your submission to ensure it meets our content standards. 
                  Once reviewed, you’ll receive an update regarding its approval status.
                </div>

                <div style="text-align:center; margin:28px 0;">
                  <a href="${fileLink}" 
                     style="display:inline-block; padding:12px 28px; background-color:#488ce6; 
                            color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600;
                            transition:background 0.3s ease;">
                    View Your Submission
                  </a>
                </div>

                <div style="font-size:13px; color:#666; text-align:center; margin-bottom:10px;">
                  Have questions? Contact us at 
                  <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:#488ce6; text-decoration:none;">
                    ${process.env.ADMIN_EMAIL}
                  </a>
                </div>

                <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

                <div style="font-size:14px; color:#333; text-align:center;">
                  We appreciate your effort and support in building a stronger learning community.
                </div>

                <div style="font-size:14px; color:#333; text-align:center; margin-top:6px; font-weight:600;">
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
    await sendEmail({ email, subject: "File Received for Review", message });
  } catch (error) {
    console.log(error);
  }
}