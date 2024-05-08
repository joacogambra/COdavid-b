const {
  CLIENT,
  SECRET,
  PAYPAL_URL,
  BACK_URL,
  STRIPE_SECRET_KEY,
  FRONTEND_URL,
  STRIPE_SECRET_KEY_HOOK,
  STRIPE_ENDPOINT_SECRET,
  SECRET_KEY,
} = process.env;
const axios = require("axios");
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const stripeHook = require("stripe")(STRIPE_SECRET_KEY_HOOK);
const CryptoJS = require("crypto-js");
const  insertarCompra  = require("./purchase");
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
  const user = req.user;

  console.log("user", user);
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
    metadata: {
      id_producto: CryptoJS.AES.encrypt(producto.id.toString(), SECRET_KEY).toString(),
      id_user: CryptoJS.AES.encrypt(user.id.toString(), SECRET_KEY).toString(),
    },
  });

  return res.json(session);
};

const webhookController = async (request, response) => {
  console.log("webhookController");
  let amountPaid = 0;
  const endpointSecret = STRIPE_ENDPOINT_SECRET;

  let event = request.body;
  if (endpointSecret) {
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(`Checkout session ${session.id} was completed!`);

      // Retrieve the session from the Stripe API
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });

      // Now you can access the line_items
      const lineItems = sessionWithLineItems.line_items.data;
      lineItems.forEach((item) => {
        console.log("Product", item);
        amountPaid = item.amount_total/100;
      });

      const bytesProducto = CryptoJS.AES.decrypt(
        sessionWithLineItems.metadata.id_producto,
        SECRET_KEY,
      );
      const id_producto = bytesProducto.toString(CryptoJS.enc.Utf8);

      const bytesUser = CryptoJS.AES.decrypt(
        sessionWithLineItems.metadata.id_user,
        SECRET_KEY,
      );
      const id_user = bytesUser.toString(CryptoJS.enc.Utf8);
      console.log(`Product ID: ${id_producto}, User ID: ${id_user}`);
      try {
        await insertarCompra(id_user, id_producto, amountPaid);
        response.status(201).json({ message: "Compra realizada exitosamente." });
      } catch (error) {
        console.error("Error al realizar la compra:", error);
        response.status(500).json({ error: "Error al realizar la compra." });
      }
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
};
const cancelPayment = (req, res) => res.redirect("/");

module.exports = {
  createOrder,
  captureOrder,
  cancelPayment,
  createSession,
  webhookController,
};
