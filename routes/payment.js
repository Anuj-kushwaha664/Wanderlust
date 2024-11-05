const express = require("express");
const router = express.Router({mergeParams : true});
const {handleCheckoutCompleted} = require("../controllers/payment.js");
const Stripe = require('stripe');
require('dotenv').config();


const endpointSecret = process.env.WEBHOOK_SECRET_KEY;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Your Stripe secret key

router.post('/webhook', express.raw({type: 'application/json'}), async(request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
  
    try{
        switch (event.type) {
            
            case 'checkout.session.completed':
              handleCheckoutCompleted(event);
              req.flash("success", "Payment is Successfull !");
              break;
             
            default:
              // Unexpected event type
              console.log(`Unhandled event type ${event.type}.`);
          }
    }catch(err){
        console.log(err);
    }
    // Handle the event
    
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

  router.use(express.json());

router.post('/create-checkout-session', async (req, res) => {
    console.log(req.body);
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'INR',
              product_data: {
                name: req.body.name,
              },
              unit_amount: req.body.amount*100, // Amount in cents, $50.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment', // Can also be 'subscription' or 'setup'
        success_url: 'https://wanderlust-bb60.onrender.com/payments/success', // Redirect URL after payment success
        cancel_url: 'https://wanderlust-bb60.onrender.com/payments/cancel', // Redirect URL after payment cancellation
        metadata: {
            userEmail: req.user.email, // Add user email to metadata
            userName: req.user.username
        },
      });
  
      req.flash("success", "Payment is Successfull !");
      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).send({ error: error.message });
    }
  });

  router.get('/success', (req, res) => {
    req.flash("success", "Payment is succesfull !");
    res.redirect("/listings");
  });
  
  router.get('/cancel', (req, res) => {
    req.flash("error", "Payment is Failed !");
    res.redirect("/listings");
  });

module.exports = router;