const { replicate, clean } = require("./session/manage");

try {
  clean();
  replicate();
  setTimeout(() => {
    require("./main");
  }, 2000);
} catch (error) {
  console.error(error?.message);
}
