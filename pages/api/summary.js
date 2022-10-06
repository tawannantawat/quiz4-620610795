import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    //return res.status(403).json({ ok: false, message: "Permission denied" });
    const user = checkToken(req);
    if (!user || user.isAdmin === false) {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }


    //compute DB summary
    const users = readUsersDB();
    const customer = users.filter((x) => x.isAdmin === false);
    const admins = users.filter((x) => x.isAdmin);
    let total = 0
    for (let i = 0; i < customer.length; i++) {
      total += customer[i].money;
    }
    //return response
    res.json({
      ok: true,
      userCount: customer.length,
      adminCount: admins.length,
      totalMoney:total,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
