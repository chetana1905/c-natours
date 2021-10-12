const nodemailer = require("nodemailer");
const AppError = require("./AppError");
const pug = require("pug");
const path = require("path");
class Email{
    constructor(message , mailTo){
        this.message= message;
        this.mailTo = mailTo;
        this.mailFrom = process.env.MAIL_FROM;
        
    }

    createTransporter(){
        /* Sending mails using mailtrap */

        // const transporter = nodemailer.createTransport({
        //     host: process.env.EMAIL_HOST,
        //     port:process.env.EMAIL_PORT,
        //     auth:{
        //         user:process.env.EMAIL_UNAME,
        //         pass:process.env.EMAIL_PASS 
        //     }
        // });

        // sending real email with sendgrid
        const transporter = nodemailer.createTransport({
            service : 'SendGrid',
            auth:{
                user:process.env.SENDGRID_UNAME,
                pass:process.env.SENDGRID_PASSWORD
            }
        })

        return transporter;
    }

    async sendMail(template , subject){
        try{
            // render email template
            const html_template = pug.renderFile(path.join(__dirname,`../views/email_templates/${template}.pug`), {
                user : this.mailTo,
                url : this.message
            })

            // create transporter
            const transporter = this.createTransporter();
           
            //set email options 
            const options = {
                to:this.mailTo,
                from:this.mailFrom,
                subject,
                // text:this.message
                html:html_template
            }
            
             await transporter.sendMail(options);
           
        }catch(err){
            console.log(err);
        }
    }

     async sendResetTokenMail(){
      await this.sendMail("forgot_password" , "Reset Password");
    }

    async welcomeMail(){
        await this.sendMail('welcome',"Welcome Mail");
    }
}

module.exports = Email;