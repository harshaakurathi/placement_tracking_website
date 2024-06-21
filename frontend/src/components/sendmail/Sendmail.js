requestAnimationFrame("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:'gmail',
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "21501a0503@pvpsit.ac.in",
    pass: "inip melk qfpg koqe",
  },

});

const mailOptions={
    from:{
        name:"from placements",
        adderss:"21501a0503@pvpsit.ac.in"
    },
    to:"21501a0512@pvpsit.ac.in",
    subject:"Hello",
    text:"H",
    html:"<b>Hellow World ?</b>"
}

const sendmail=async(transporter,mailOptions)=>{
    try{
        await transporter.sendMail(mailOptions)
        console.log("email sent ")
        navigate('/coordinator-profile');
    }catch{
        console.error(error)
    }
}