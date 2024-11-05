const nodeMailer = require("../config/nodemailer.js")
require('dotenv').config();
const Stripe = require('stripe');


module.exports.handleCheckoutCompleted   = async(event)=>{
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key

    const session = event.data.object;
    const userEmail = session.metadata.userEmail;
    const userName = session.metadata.userName;
    let productName ;
    let quantity;

    try {
        // Retrieve the line items for the session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        productName = lineItems.data[0].description;
        quantity = lineItems.data[0].quantity;
    } catch (error) {
        console.error('Error fetching line items:', error);
    }          

    let htmlString = nodeMailer.renderTemplate({detail:session,
        name : userName,
        date : new Date(session.created * 1000).toLocaleString(),
        productName: productName,
        quantity : quantity,
    }, 'paymentSuccessfull.ejs');

    nodeMailer.transporter.sendMail({
        from : 'anujkushwaha664@gmail.com',
        to : userEmail,
        subject : "Payment successfully completed",
        html : htmlString,
    }, (err, info)=>{
        if(err){
            console.log("error in sending mail", err);
            return;
        }

        console.log("message sent", info);
    })
  }