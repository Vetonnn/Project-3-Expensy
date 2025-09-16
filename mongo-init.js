// Creates the app user in the correct DB on first container start
db = db.getSiblingDB("expensy");
db.createUser({
  user: "expuser",
  pwd:  "exp-pass-123",
  roles: [{ role: "readWrite", db: "expensy" }]
});
