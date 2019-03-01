function getApi(apiRoute, callback) {
  var request = new XMLHttpRequest();

  request.addEventListener("load", dataHandler);
  request.open("GET", apiRoute);
  request.send();

  function dataHandler() {
    callback(this.responseText);
  }
}

function patchApi(apiRoute, callback) {
  var request = new XMLHttpRequest();

  request.addEventListener("load", dataHandler);
  request.open("PATCH", apiRoute);
  request.send();

  function dataHandler() {
    callback(this.responseText);
  }
}
