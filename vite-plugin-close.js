export default function ClosePlugin() {
  return {
    name: "ClosePlugin",

    buildEnd(error) {
      if (error) {
        console.error("Error bundling");
        console.error(error);
        process.exit(1);
      } else {
        console.log("Build ended");
      }
    },

    closeBundle(id) {
      console.log("Bundle closed");
      process.exit(0);
    },
  };
}
