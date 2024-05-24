import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY as string;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID as string;

interface EmailParams {
    from: string;
    to: string;
    password: string;
    subject: string;
}


// Function to send email
export const sendEmail = ({ from, to, subject, password }: EmailParams) => {
    emailjs
    .send(SERVICE_ID, TEMPLATE_ID, { from, to, subject, password }, {
      publicKey: PUBLIC_KEY,
    })
    .then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (err) => {
        console.log('FAILED...', err);
      },
    );
}




// const makeEmailTemplate = ({ email, password }: EmailTemplateParams) => {
//     const emailContent = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Password Reset</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//                 background-color: #0c0a09;
//                 margin: 0;
//                 padding: 0;
//             }
//             .container {
//                 max-width: 600px;
//                 margin: 20px auto;
//                 background-color: #1c1917;
//                 color: white;
//                 border: 2px solid #27272a;
//                 padding: 20px;
//                 border-radius: 8px;
//                 box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//             }
//             .logo {
//                 text-align: center;
//                 margin-bottom: 20px;
//             }
//             .logo img {
//                 max-width: 150px;
//                 height: auto;
//             }
//             .message {
//                 margin-bottom: 20px;
//             }
//             a {
//                 color: #fff !important;
//                 text-decoration: none !important;
//             }
    
//     .button {
//                 display: inline-block;
//                 padding: 10px 20px;
//                 background-color: #4CAF50; /* Green */
//                 color: white;
//                 text-decoration: none;
//                 border-radius: 5px;
//                 border: none;
//                 cursor: pointer;
//             }
    
//             .button:hover {
//                 background-color: #45a049; /* Darker Green */
//             }
//             .footer {
//                 margin-top: 20px;
//                 font-size: 14px;
//             }
//         </style>
//     </head>
//     <body>
//     <div class="container">
//             <div class="logo">
//                 <img src="https://firebasestorage.googleapis.com/v0/b/exop-d02fc.appspot.com/o/EXOP-Make-crop.png?alt=media&token=bc67b376-4973-47e0-9294-954582bfa62f" alt="Your App Logo" height="150"
//     >
//             </div>
//             <div class="message">
//                 <p>Hello,</p>
//                 <p>Your account has been created. Here are your details:</p>
//                 <p>Email: ${email}</p>
//                 <p>Password: ${password}</p>
//             </div>
//             <!-- Your footer content here -->
//             <div class="footer">
//                 <p>Thanks,</p>
//                 <p>Your EXOP team</p>
//             </div>
//         </div>
//     </body>
//     </html>
//               `;
//     return emailContent;
// };

