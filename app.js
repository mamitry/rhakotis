const Express = require("express");
const app = Express();

const { port } = require("./config");
const PORT = process.env.PORT || port;

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
  console.log("Hello World");
  const params = req.query;

  //   console.log(params);
  //   const parJSON = JSON.stringify(params);
  //   console.log(parJSON);

  let checkResult = {};
  let validRequest = true;
  // check URL query parameter
  for (const qParam of ["text", "font", "jimkin"]) {
    console.log(`Checking for URL query param parameter ${qParam}`);
    checkResult = checkForRequiredQueryParam(params, qParam);
    if (!checkResult.ok) {
      res.statusMessage = checkResult.message;
      res.status(checkResult.code).send();
      validRequest = false;
      break;
    }
  }
  // only continue if request valid
  if (validRequest) {
    res.end("parJSON");
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
  console.log("Example app listening at http://%s:%s", host, port);
});
