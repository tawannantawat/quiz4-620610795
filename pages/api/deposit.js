import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";
export default function depositRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    // return res.status(403).json({ ok: false, message: "You do not have permission to deposit" });
    if (!user || user.isAdmin === true) {
      return res
        .status(403)
        .json({ ok: false, message: "You do not have permission to deposit" });
    }


    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });
    if (amount < 1) {
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });
    }
    //find and update money in DB
    const users = readUsersDB();
    const userIdx = users.findIndex((x) => user.username === x.username);
    users[userIdx].money += amount;
    writeUsersDB(users);
    //return response
    res.json({ ok: true, money: users[userIdx].money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
