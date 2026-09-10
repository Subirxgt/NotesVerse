const { approvalMessage } = require("./approvalMessage");
const { sendEmail } = require("./sendEmail");

module.exports.sendApproval=async(contributor,approveLink,rejectLink,email,res)=>{
    const message=await approvalMessage(contributor,approveLink,rejectLink);
    try{
        await sendEmail({email,subject:"File Approval Application",message});
    }
    catch(error){
        console.log(error);
    }
};