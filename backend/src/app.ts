import { envs } from "./config/envs.js";
import { Server } from "./presentation/server.js";

(() => {
  main();
})();

async function main() {

  //todo: await base de datos

  //todo: inicio de nuestro servidor
  new Server({
    port: envs.PORT,
  }).start();
}