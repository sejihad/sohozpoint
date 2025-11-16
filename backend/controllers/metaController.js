// controllers/metaController.js
const crypto = require("crypto");
const fetch = require("node-fetch");

const access_token = process.env.META_ACCESS_TOKEN;
const pixel_id = process.env.META_PIXEL_ID;

/* ------------------------------------------
      🔵 SEND PURCHASE EVENT (Already working)
--------------------------------------------- */
const purchase = async (req, res) => {
  try {
    const {
      email = "user@example.com",
      phone = "",
      value = 0,
      currency = "BDT",
      eventID = "default-event",
      contents = [],
      content_type = "product",
      content_name = "",
      order_id = "",
    } = req.body;

    // Transform contents - keep only official CAPI parameters
    const transformedContents = contents.map((item) => {
      // Only include official parameters from Meta documentation
      return {
        id: item.id, // required
        quantity: item.quantity, // required
        item_price: item.price, // required for Purchase event
        // Remove: name, color, size - these are custom fields
      };
    });

    const hashedEmail = crypto
      .createHash("sha256")
      .update(email.trim().toLowerCase())
      .digest("hex");

    const hashedPhone = phone
      ? crypto
          .createHash("sha256")
          .update(phone.replace(/\D/g, ""))
          .digest("hex")
      : undefined;

    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventID,
          user_data: {
            em: [hashedEmail], // Array format as per documentation
            ph: hashedPhone ? [hashedPhone] : undefined,
            client_ip_address: req.ip,
            client_user_agent: req.headers["user-agent"],
          },
          custom_data: {
            currency: currency.toLowerCase(), // usd, bdt etc
            value: Number(value),
            order_id,
            contents: transformedContents,
            // Remove content_type and content_name if they cause issues
            // content_type,
            // content_name,
          },
          action_source: "website",
          event_source_url: req.headers.referer || "https://yourwebsite.com", // Add from headers
        },
      ],
    };

    // Clean up undefined fields
    if (!payload.data[0].user_data.ph) {
      delete payload.data[0].user_data.ph;
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixel_id}/events?access_token=${access_token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("❌ Error sending Purchase event:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ------------------------------------------
      🔵 SEND PAGEVIEW EVENT (NEW)
--------------------------------------------- */
const pageView = async (req, res) => {
  try {
    const {
      email = "",
      phone = "",
      eventID = "", // frontend থেকে আসবে
      url = "", // যেখানে user গেছে
    } = req.body;

    const hashedEmail = email
      ? crypto
          .createHash("sha256")
          .update(email.trim().toLowerCase())
          .digest("hex")
      : null;

    const hashedPhone = phone
      ? crypto
          .createHash("sha256")
          .update(phone.replace(/\D/g, ""))
          .digest("hex")
      : null;

    const payload = {
      data: [
        {
          event_name: "PageView",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventID,
          event_source_url: url,
          action_source: "website",
          user_data: {
            em: hashedEmail ? [hashedEmail] : [],
            ph: hashedPhone ? [hashedPhone] : [],
            client_ip_address: req.ip,
            client_user_agent: req.headers["user-agent"],
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixel_id}/events?access_token=${access_token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("❌ Error sending PageView event:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { purchase, pageView };
