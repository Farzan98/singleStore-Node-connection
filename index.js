const mysql = require("mysql2/promise");

// TODO: adjust these connection details to match your SingleStore deployment:

// HOST can be found at singleStore portal following the path  -
// 1. Go to cloud on your left on dashboard
// 2. Click Testing apps in sub-menu
// 3. You can view your created workplace here
// 4. Click connect button and select connect directly
// 5. You can view your HOST here

let conn; // global variable holding connection reference, to be used in CRUD
const HOST =
  "svc-2445a0c1-7220-4dbc-a398-a2892efc6393-dml.aws-virginia-2.svc.singlestore.com";
const USER = "admin";
const PASSWORD = "w4McV2amK78PeyH";
const DATABASE = "acme";


// CONNECTION
async function createConnection() {
  conn = await mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  });
  console.log("You have successfully connected to SingleStore.");
}

// CREATE function
async function create({ conn, content }) {
  const [results] = await conn.execute(
    "INSERT INTO messages (content) VALUES (?)",
    [content]
  );
  // console.log(`results check in create ====>  `, results);
  return results.insertId;
}

// READ function
async function readOne({ conn, id }) {
  const [rows, fields] = await conn.execute(
    "SELECT id, content, createdate FROM messages WHERE id = ?",
    [id]
  );
  // console.log(`checking rows and fields ===> `, rows, `and`, fields);
  return rows[0];
}

// UPDATE function
async function update({ conn, id, content }) {
  await conn.execute("UPDATE messages SET content = ? WHERE id = ?", [
    content,
    id,
  ]);
}

// DELETE function
async function delete_({ conn, id }) {
  await conn.execute("DELETE FROM messages WHERE id = ?", [id]);
}

// MAIN is run at the end
async function main() {
  try {
    // CONNECTION
    await createConnection();

    // CREATE
    const id = await create({ conn, content: "Inserting the row" });
    console.log(`Inserted row id ${id}`);

    // READ
    const msg = await readOne({ conn, id });
    console.log("Read one row:");
    if (msg == null) {
      console.log(new Error(`Content not found!`));
    } else {
      console.log(`${msg.id}, ${msg.content}, ${msg.createdate}`);
    }

    // UPDATE
    const updatedRow = await update({ conn, id, content: "Updated row" });
    console.log(`Updated row id ${id}`);

    // DELETE
    await delete_({ conn, id });
    console.log(`deleted entry with id ${id}`);

  } catch (err) {
    // Good programmers always handle their errors :)
    console.error("ERROR", err);
    process.exit(1);
  } finally {
    if (conn) {
      await conn.end();
      console.log(`Connection ended!`);
    }
  }
}

main();
