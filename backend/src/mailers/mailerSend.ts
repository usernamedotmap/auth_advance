// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailersend.net',
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'MS_gAHFIV@test-p7kx4xwd5r7g9yjr.mlsender.net',
//     pass: 'mssp.YSUoSkJ.3yxj6ljy5w0ldo2r.prbvKCx'
//   },
//   tls: {
//     ciphers: 'TLSv1.2'
//   }
// });

// type Params = {
//   to: string;
//   subject: string;
//   text: string;
//   html: string;
//   from?: string;
// };

// export const sendingEmail = async ({
//   to,
//   subject,
//   text,
//   html,
//   from =  'test-p7kx4xwd5r7g9yjr.mlsender.net'
// }: Params): Promise<void> => {
//   const mailOptions = {
//     from,
//     to,
//     subject,
//     text,
//     html
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Email sent to ${to}:`, info.response);
//   } catch (error) {
//     console.error(`❌ Error sending email to ${to}:`, error);
//   }
// };
