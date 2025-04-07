import nodemailer from "nodemailer";
const mailSender= async(email,title,body)=>{
    const transporter=nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS,
        }
    })

    const info= await transporter.sendMail({
        from:"monuda2004@gmail.com  prescripto",
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`
    })
    return info;
}

export default mailSender;