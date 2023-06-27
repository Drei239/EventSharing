const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const sendEmail = require("../utils/sendEmail");
const { sendEmailtoId } = require("../controllers/emailController");
const router = express.Router();

const emailTemplate = fs.readFileSync("./views/index.ejs", "utf-8");
router.get("/", async (req, res) => {
  const renderedTemplate = await ejs.render(emailTemplate, {
    name: "hellosdasds",
  });
  await sendEmail({
    to: "nguyenquochaolop91@gmail.com",
    subject: "asds",
    content: renderedTemplate,
  });
  res.status(200).json("Send email success");
});
router.post("/send", sendEmailtoId);

module.exports = router;
