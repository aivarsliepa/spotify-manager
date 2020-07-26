import app from "./app";

const server = app.listen(app.get("port"), () => {
  console.log(`  App is running at ${process.env.SERVER_URI} in ${app.get("env")} mode`);
  console.log("  Press CTRL-C to stop\n");
});

export default server;
