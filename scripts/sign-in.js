// const { default: axios } = require("axios");

axios
  .get("http://localhost:5000/enwords?limit=10")
  .then((res) => console.log(res))
  .catch(function (error) {
    // handle error
    console.log(error);
  });
