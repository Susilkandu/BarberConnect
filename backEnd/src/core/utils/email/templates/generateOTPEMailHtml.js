function generateOtpEmailHtml(otp) {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Celestia | Verify Your Email</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(to right top, #121241, #1c1c6e);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        overflow: hidden;
      }
  
      .container {
        background: rgba(255, 255, 255, 0.05);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 0 20px rgba(0, 191, 255, 0.3), 0 0 40px rgba(7, 79, 248, 0.3);
        text-align: center;
        width: 90%;
        max-width: 420px;
      }
  
      h1 {
        font-size: 28px;
        margin-bottom: 10px;
        color: #00beff;
      }
  
      p {
        font-size: 14px;
        margin-bottom: 25px;
        color: #e0e0e0;
      }
  
      .otp-box {
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 5px;
        background: rgba(0, 190, 255, 0.1);
        color: #00beff;
        padding: 12px;
        border-radius: 10px;
        margin: 20px auto;
        width: max-content;
      }
  
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #bbb;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Celestia Verification</h1>
      <p>Your One-Time Password (OTP) is:</p>
      <div class="otp-box">${otp}</div>
      <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
      <div class="footer">
        © 2025 Celestia. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
  }
  
  module.exports = generateOtpEmailHtml;
  