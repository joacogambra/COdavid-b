const { CLIENT, SECRET, PAYPAL_URL, BACK_URL, KEY_JWT, FRONTEND_URL } = process.env;
const axios = require("axios");


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
};

const cancelPayment = (req, res) => res.redirect("/");

module.exports = {
  createOrder,
  captureOrder,
  cancelPayment,
};
