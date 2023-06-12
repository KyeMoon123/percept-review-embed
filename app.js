const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = require("pg");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// The secret connection string you copied earlier
const connectionString ="postgresql://postgres:MzWpOPbuFMLOaULPaved@containers-us-west-57.railway.app:7919/railway"

const pool = new Pool({connectionString});
// design file
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/embed", async (req, res) => {
  const slug = req.query.slug;
  const backgroundColor = req.query.background;
  const textColor = req.query.text;
  const cardColor = req.query.card;
  const style = req.query.style;
  const Query = `
    SELECT * FROM "Campaign" cm
     LEFT JOIN "Review" r ON r."campaignId"=cm.id
     LEFT JOIN "CampaignLandingPage" clp ON clp."campaignId"=cm.id
        WHERE clp."slug"='${slug}'
        AND r."status"='ACTIVE'
        ORDER BY r."createAt" DESC
 `;
  const campaignReviews = await pool.query(Query);
    switch (style) {
        case "TiledCarousel":
            res.render("TiledCarousel", {
                reviews: campaignReviews.rows,
                backgroundColor: backgroundColor,
                textColor: textColor,
                cardColor: cardColor
            });
            break;
        case "MasonryScroll":
            res.render("MasonryScroll", {
                reviews: campaignReviews.rows,
                backgroundColor: backgroundColor,
                textColor: textColor,
                cardColor: cardColor
            });
            break;
    }
})

// server listening
app.listen(PORT, () => {
  console.log(`The app start on http://localhost:${PORT}`);
});