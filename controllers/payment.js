const {
  CLIENT,
  SECRET,
  PAYPAL_URL,
  BACK_URL,
  STRIPE_SECRET_KEY,
  FRONTEND_URL,
  STRIPE_SECRET_KEY_HOOK,
} = process.env;
const axios = require("axios");
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const stripeHook = require("stripe")(STRIPE_SECRET_KEY_HOOK);

const createOrder = async (req, res) => {
  const producto = req.body;

  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: producto.id,
        amount: {
          currency_code: producto.currency,
          value: producto.value,
          breakdown: {
            item_total: {
              currency_code: producto.currency,
              value: producto.value,
            },
            items: [
              {
                name: producto.name,
                category: "DIGITAL_GOODS ",

                quantity: "1",
                unit_amount: {
                  currency_code: producto.currency,
                  value: producto.value,
                },
              },
            ],
          },
        },
      },
    ],
    application_context: {
      return_url: "tsl.com",
      landing_page: "BILLING",
      user_action: "PAY_NOW",

      // return_url: `${BACK_URL}/payment/capture-order`,
      return_url: `${FRONTEND_URL}/cursos`,
      cancel_url: `${BACK_URL}/payment/cancel-order`,
    },
  };
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  const {
    data: { access_token },
  } = await axios.post(`${PAYPAL_URL}/v1/oauth2/token`, params, {
    auth: {
      username: CLIENT,
      password: SECRET,
    },
  });

  const response = await axios.post(`${PAYPAL_URL}/v2/checkout/orders`, order, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.json(response.data);
};

const captureOrder = async (req, res) => {
  const { token } = req.body;

  try {
    const response = await axios.post(
      `${PAYPAL_URL}/v2/checkout/orders/${token}/capture`,
      null,
      {
        auth: {
          username: CLIENT,
          password: SECRET,
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return res.json(response.data);
  } catch (error) {
    console.log("error", error.response.data.details);
    const errorDetails = error.response.data.details;
    const orderAlreadyCapturedError = errorDetails.find(
      (detail) => detail.issue === "ORDER_ALREADY_CAPTURED",
    );

    if (orderAlreadyCapturedError) {
      return res.status(400).json({ message: "La orden ya ha sido capturada." });
    } else {
      return res
        .status(500)
        .json({ message: "Ocurrió un error al capturar la orden." });
    }
  }
};
const createSession = async (req, res) => {
  const producto = req.body;
  console.log(producto);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: {
            name: producto.name,
          },
          currency: "usd",
          unit_amount: producto.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${FRONTEND_URL}/success`,
    cancel_url: `${FRONTEND_URL}/cancel`,
  });

  return res.json(session);
};

const webhookController = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  console.log('webHookController')
  try {
    event = stripeHook.webhooks.constructEvent(request.body, sig, endpointSecret);

  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};


const cancelPayment = (req, res) => res.redirect("/");

module.exports = {
  createOrder,
  captureOrder,
  cancelPayment,
  createSession,
  webhookController,
};
