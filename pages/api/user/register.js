import { readUsersDB, writeUsersDB } from "../../../backendLibs/dbLib";
import bcrypt from "bcrypt";
import { checkToken } from "../../../backendLibs/checkToken";

export default function userRegisterRoute(req, res) {
  if (req.method === "POST") {
    const { username, password, isAdmin } = req.body;

    //check authentication
    const user = checkToken(req);
    //return res.status(403).json({ok: false,message: "You do not have permission to create account",});
    if (!user || user.isAdmin === false) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to create account",
      });
    }
    //validate body
    if (
      typeof username !== "string" ||
      username.length === 0 ||
      typeof password !== "string" ||
      password.length === 0 ||
      typeof isAdmin !== "boolean"
    )
      return res
        .status(400)
        .json({ ok: false, message: "Invalid request body" });

    //check if username is already in database
    const users = readUsersDB();
    //return res.status(400).json({ ok: false, message: "Username is already taken" });
    const foundUsername = users.find((x) => username === x.username);
    if (foundUsername) {
      return res
        .status(400)
        .json({ ok: false, message: "Username is already taken" });
    }

    //create new user and add in db
    const newUser = {
      username: username,
      password: bcrypt.hashSync(password, 12),
      isAdmin: isAdmin,
      money: isAdmin ? null : 0,
    };

    users.push(newUser);

    writeUsersDB(users);

    //return response
    res.json({ ok: true, username, isAdmin });
  }
}
