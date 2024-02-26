const { VerifyToken } = require("../utility/JWTTokenHelpers");

async function authMiddleware(req, res, next) {
  try {

    const token = req.cookies.token;
    const payload = await VerifyToken(token);
    let email = payload.email;
    let user_id = payload.id;

    if(payload === null){
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }else{
      req.headers.email = email;
      req.headers.user_id = user_id;
      next();
    }
    
  } catch (error) {
    return res
      .status(404)
      .json({ status: "error", message: "Unauthorized user dsfsdf!" });
  }

}

module.exports = authMiddleware;
