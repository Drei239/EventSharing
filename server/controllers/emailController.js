const sendEmail = require("../utils/sendEmail");
const asyncHandler = require("express-async-handler");
const sendEmailtoId = asyncHandler(async (req, res, next) => {
  const { content, subject, data } = req.body;
  try {
    const content = `
    <div style="padding: 10px; background-color: #003375">
        <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
            <span style="color: black">Đây là mail test</span>
        </div>
    </div>
    `;
    await sendEmail({
      to: "6251071028@st.utc2.edu.vn",
      content: content,
      subject: "dads",
    });
    res.status(200).json({ status: 200, message: "Gửi mail thành công" });
  } catch (err) {
    next(err);
  }
});
module.exports = { sendEmailtoId };
