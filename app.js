// 1.
const express = require("express");
const fs = require("fs");
const app = express();
const multer = require("multer");
const path = require("path");

const countryData = JSON.parse(fs.readFileSync("./country.json", "utf8"));

// multer handling

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },

  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    const name = file.originalname.split(".")[0];
    cb(null, `${name}.${extension}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("file type is not image", false);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/api/v1/countries", (req, res, next) => {
  fs.readFile("./country.json", "utf8", (err, data) => {
    const parsedData = JSON.parse(data).map((el) => {
      return { id: el.id, name: el.name };
    });
    res.status(200).json({
      status: "sucess",
      data: parsedData,
    });
  });
});

app.get("/api/v1/countries/:id", (req, res, next) => {
  const { id } = req.params;
  fs.readFile("./country.json", "utf8", (err, data) => {
    const parsedData = JSON.parse(data).find((el) => el.id === id * 1);
    res.status(200).json({
      status: "sucess",
      data: parsedData,
    });
  });
});

app.post("/api/v1/countries/", upload.single("photo"), (req, res) => {
  console.log(req.file);
  const { name, rank, continent } = req.body;
  let obj = {
    name,
    continent,
    flag: `images/${name.toLowerCase()}.png`,
    rank,
    id: countryData.length + 1,
  };

  countryData.push(obj);

  fs.writeFile("./country.json", JSON.stringify(countryData), "utf8", (err) => {
    if (!err) {
      res.status(201).json({ status: "success", data: countryData });
    } else {
      res.status(400).json({ status: "error", message: "err.message" });
    }
  });
});
app.listen(8080, () => {
  console.log("app is listening on port 8080");
});
