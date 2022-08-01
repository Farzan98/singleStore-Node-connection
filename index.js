const { createConnection } = require("mysql2/promise");

// TODO: adjust these connection details to match your SingleStore deployment:

const HOST =
  "svc-2445a0c1-7220-4dbc-a398-a2892efc6393-dml.aws-virginia-2.svc.singlestore.com";
  
    // HOST can be found at singleStore portal following the path  -
    // 1. Go to cloud on your left on dashboard
    // 2. Click Testing apps in sub-menu
    // 3. You can view your created workplace here
    // 4. Click connect button and select connect directly
    // 5. You can view your HOST here

const USER = "admin";
const PASSWORD = "w4McV2amK78PeyH";
const DATABASE = "acme";

// main is run at the end
async function main() {
  let singleStoreConnection;
  try {
    singleStoreConnection = await createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABASE,
    });

    console.log("You have successfully connected to SingleStore.");
  } catch (err) {
    // Good programmers always handle their errors :)
    console.error("ERROR", err);
    process.exit(1);
  } finally {
    if (singleStoreConnection) {
      await singleStoreConnection.end();
    }
  }
}

main();
