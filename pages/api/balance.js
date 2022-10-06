import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function balanceRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    // return res.status(403).json({ok: false,message: "You do not have permission to check balance",});
    
    if (!user || user.isAdmin === true) {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to check balance",
      });
    }


    const users = readUsersDB();

    //find user in DB and get their money value
    const foundUser = users.find((x) => user.username === x.username);
    const money = foundUser.money;


    //return response
    res.json({ ok: true, money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
