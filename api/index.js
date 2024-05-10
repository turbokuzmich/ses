require("@dotenvx/dotenvx").config();

const fs = require("fs");
const path = require("path");
const jwa = require("jwa");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const hmac = jwa("HS256");
const app = express();
const usersPath = path.resolve("./db.json");

function sign(data) {
  const base64 = Buffer.from(JSON.stringify(data)).toString("base64");
  const signature = hmac.sign(base64, process.env.AUTH_SECRET);

  return `${base64}.${signature}`;
}

function extract(input) {
  const [base64, signature] = input.split(".");

  if (!(base64 && signature)) {
    return null;
  }

  if (!hmac.verify(base64, signature, process.env.AUTH_SECRET)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(base64, "base64"));
  } catch (_) {
    return null;
  }
}

// const a = sign({ id: 1, name: "Dmitry" });
// const b = extract(a);
// console.log(b)

app.use(bodyParser.json());
app.use(cookieParser());

app.post("/account/signin", (req, res) => {
  const { Email = "", Pass = "" } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
  const user = users.find(
    (user) => user.email === Email && user.password === Pass
  );

  if (user) {
    res.cookie(process.env.SESSION_COOKIE_NAME, sign(user)).json(user);
  } else {
    res.status(401).json({});
  }
});

app.post("/account/signup", (req, res) => {
  const { Email = "", Pass = "", Nick = "" } = req.body;
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

  if (users.some((user) => user.email === Email)) {
    return res.status(400).json({});
  }

  const user = {
    id: Math.max(...users.map(({ id }) => id)) + 1,
    name: Nick,
    email: Email,
    password: Pass,
  };

  users.push(user);

  fs.writeFileSync(usersPath, JSON.stringify(users));

  res.cookie(process.env.SESSION_COOKIE_NAME, sign(user)).json(user);
});

app.get("/account/me", (req, res) => {
  const user = extract(req.cookies[process.env.SESSION_COOKIE_NAME] ?? "");

  if (!user) {
    return res.status(401).json({});
  }

  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
  const updated = users.find((dbUser) => user.id === dbUser.id);

  if (updated) {
    res.cookie(process.env.SESSION_COOKIE_NAME, sign(updated)).json(updated);
  } else {
    return res.status(401).json({});
  }
});

app.listen(process.env.API_PORT);
