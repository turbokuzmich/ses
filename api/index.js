require("@dotenvx/dotenvx").config();

const jwa = require("jwa");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const hmac = jwa("HS256");
const app = express();

const { User, PersonalData } = require("./db");

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

app.post("/account/signin", async (req, res) => {
  const { login: email, password } = req.body;

  const encryptedPassword = hmac.sign(
    `${password}.${process.env.SALT}`,
    process.env.AUTH_SECRET
  );

  const user = await User.findOne({
    where: {
      email,
      password: encryptedPassword,
    },
  });

  if (user) {
    res
      .cookie(process.env.SESSION_COOKIE_NAME, sign({ email }))
      .json({ id: user.id, name: user.name, email: user.email });
  } else {
    res.status(401).json({});
  }
});

app.post("/account/signup", async (req, res) => {
  const { login: email, password, nickname: name } = req.body;

  const existingUserWithEmail = await User.findAll({
    where: {
      email,
    },
  });

  if (existingUserWithEmail.length) {
    return res.status(400).json({});
  }

  const encryptedPassword = hmac.sign(
    `${password}.${process.env.SALT}`,
    process.env.AUTH_SECRET
  );

  const newUser = await User.create({
    name,
    email,
    password: encryptedPassword,
  });

  res
    .cookie(process.env.SESSION_COOKIE_NAME, sign({ email }))
    .json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

app.get("/account/personal", async (req, res) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({});
  }

  const token = authorization.replace(/^Bearer\s/, "");
  const user = extract(token);

  if (!user || !user.email) {
    return res.status(401).json({});
  }

  const personalData = await User.findOne({
    where: {
      email: user.email,
    },
    include: [PersonalData],
  });

  if (personalData && personalData.PersonalDatum) {
    return res.json({
      fio: personalData.PersonalDatum.fio,
      birthdate: personalData.PersonalDatum.birthdate,
      telegram: personalData.PersonalDatum.telegram,
      vk: personalData.PersonalDatum.vk,
    });
  }

  return res.json({});
});

app.listen(process.env.API_PORT);
