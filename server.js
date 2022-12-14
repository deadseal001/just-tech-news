const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const path = require("path");
const exphbs = require("express-handlebars"); //handlebars

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helpers = require("./utils/helpers");
const hbs = exphbs.create({ helpers }); //handlebars

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); //set path so the files in public folder can be used.
app.use(session(sess));

//turn on routes
app.use(routes);
app.engine("handlebars", hbs.engine); //handlebars
app.set("view engine", "handlebars"); //handlebars

//turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening on " + PORT));
});
