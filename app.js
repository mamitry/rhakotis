import {
  convertCopticText,
  fontSupported,
  jimkinMethodValid,
} from "@stmarkus/coptic-font-unicode-converter";
import express from "express";

// constants
const app = express();
const PORT = process.env.PORT || 3000;
const rhakotis =
  "Rhacotis (romanized as Rhakotis) was the name for a city on the northern coast of Egypt at the site of Alexandria. Classical sources suggest Rhacotis as an older name for Alexandria before the arrival of Alexander the Great.";

app.get("/", (request, response) => {
  response.send("");
});

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
    Rhakotis: rhakotis,
  };
  response.send(status);
});

app.get("/convert2Unicode/", function (req, res) {
  const params = req.query;
  let checkResult = {};
  let syntaxValidRequest = true;
  // check URL query parameter
  for (const qParam of ["text", "font", "jimkin"]) {
    console.log(`Checking for URL query param parameter ${qParam}`);
    checkResult = checkForRequiredQueryParam(params, qParam);
    if (!checkResult.ok) {
      res.statusMessage = checkResult.message;
      res.status(checkResult.code).send();
      syntaxValidRequest = false;
      break;
    }
  }

  // URL query parameters
  const font = params.font;
  const jimkin = params.jimkin;
  const text = params.text;
  // only continue if request syntax is valid
  if (syntaxValidRequest) {
    // check font
    console.log(`Checking provided font ${font}`);
    fontSupported(font).then((checked) => {
      let passed = true;
      if (!checked) {
        passed = false;
        res.statusMessage = "Provided font is NOT supported. Supported list";
        res.status(400).send();
      }

      // check jimkin method
      console.log(`Checking provided jimkin method ${jimkin}`);
      const jMethod = jimkinMethodValid(jimkin);
      if (!jMethod) {
        passed = false;
        res.statusMessage = "Provided Jimkin Combining Method is NOT valid";
        res.status(400).send();
      }

      // convertCopticText
      if (passed) {
        const convertedText = convertCopticText(font, text, jimkin).then(
          (text) => {
            res.send({ text: text });
          }
        );
      } else {
        res.end();
      }
    });
  }
});

function checkForRequiredQueryParam(receivedParams, expectedParam) {
  if (receivedParams.hasOwnProperty(expectedParam)) {
    return { ok: true, code: 200 };
  } else {
    return {
      ok: false,
      code: 400,
      message: `Missing expected URL query Parameter ${expectedParam}`,
    };
  }
}

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("App listening at http://%s:%s", host, port);
});
