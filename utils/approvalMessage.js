module.exports.approvalMessage=(contributor, approveLink, rejectLink)=>{
  return `
  <div style="margin:0; padding:0; background-color:#f4f6fb; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:24px 12px;">
          
          <!-- Outer wrapper -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" 
                 style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; 
                        overflow:hidden; box-shadow:0 6px 20px rgba(20,40,80,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#6c63ff,#00c6ff); padding:16px 24px; color:#ffffff;">
                <table width="100%">
                  <tr>
                    <td valign="middle" style="font-size:22px; font-weight:700;">📄 StudyAdda Admin Approval</td>
                    <td align="right" style="font-size:12px; color:rgba(255,255,255,0.85);">New Submission</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px; color:#1a1a1a;">

                <div style="font-size:18px; font-weight:700; margin-bottom:12px;">
                  A new file has been submitted for review.
                </div>

                <div style="font-size:14px; color:#555; margin-bottom:22px;">
                  Please review the following submission and decide whether to <strong>approve</strong> or <strong>reject</strong> it.
                </div>

                <!-- Contributor Info Card -->
                <table border="0" cellpadding="8" cellspacing="0" width="100%" 
                       style="background-color:#f9faff; border:1px solid #e2e6f3; border-radius:8px; margin-bottom:20px;">
                  <tr><td><strong>👤 Name:</strong></td><td>${contributor.username}</td></tr>
                  <tr><td><strong>📧 Email:</strong></td><td>${contributor.email}</td></tr>
                  <tr><td><strong>📚 Type:</strong></td><td>${contributor.type}</td></tr>
                  <tr><td><strong>📘 Subject:</strong></td><td>${contributor.subject || "N/A"}</td></tr>
                  <tr><td><strong>🎓 Semester:</strong></td><td>${contributor.semester}</td></tr>
                  <tr><td><strong>📝 Title:</strong></td><td>${contributor.title}</td></tr>
                  <tr><td><strong>📎 File Link:</strong></td>
                      <td><a href="${contributor.file}" 
                             style="color:#0066ff; text-decoration:none; font-weight:500;">View File</a></td>
                  </tr>
                </table>

                <!-- Action Buttons -->
                <div style="text-align:center; margin-top:25px;">
                  <a href="${approveLink}" 
                     style="display:inline-block; padding:12px 28px; background-color:#28a745; color:#ffffff;
                            text-decoration:none; border-radius:8px; font-weight:600; font-size:14px;">
                    ✅ Approve
                  </a>
                  &nbsp;&nbsp;&nbsp;
                  <a href="${rejectLink}" 
                     style="display:inline-block; padding:12px 28px; background-color:#dc3545; color:#ffffff;
                            text-decoration:none; border-radius:8px; font-weight:600; font-size:14px;">
                    ❌ Reject
                  </a>
                </div>

                <div style="font-size:12px; color:#888; text-align:center; margin-top:28px;">
                  Once you approve, the file will automatically be added to the StudyAdda database and the contributor will be notified.
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:14px 18px; background-color:#f9fbff; text-align:center; font-size:12px; color:#7d869b;">
                © ${new Date().getFullYear()} StudyAdda — Admin Notification
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}