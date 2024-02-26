const User = require("../../models/userModel");
const SendMail = require("../../utility/EmailUtility");
const { CreateToken } = require("../../utility/JWTTokenHelpers");
const bcrypt = require("bcrypt");

// ===================== Registration Controller ========================
async function registrationController(req, res) {
  const { userName, email, password, otp } = req.body;

  try {
    if (!userName) {
      return res
        .status(400)
        .json({ status: "error", message: "Username is required!" });
    } else if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required!" });
    } else if (!password) {
      return res
        .status(400)
        .json({ status: "error", message: "Password is required!" });
    } else {
      const isUsernameExist = await User.find({ userName });

      if (isUsernameExist.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Username name already exists! Please enter unique name!",
        });
      }

      bcrypt.hash(password, 10, async function (err, hash) {
        const user = new User({
          userName,
          email,
          password: hash,
          otp: "0",
        });
        await user.save();

        res.status(200).json({
          status: "success",
          message: "Registration completed successfully!",
        });
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request.",
    });
  }
}
// ===================== Registration Controller ========================

// ===================== Sent OTP Controller ========================
async function sentOTPController(req, res) {
  const { userName, password } = req.body;

  if (!userName) {
    return res
      .status(400)
      .json({ status: "error", message: "Username is required!" });
  } else if (!password) {
    return res
      .status(400)
      .json({ status: "error", message: "Password is required!" });
  } else {
    const isUsernameExist = await User.find({ userName });

    if (isUsernameExist.length > 0) {
      bcrypt.compare(
        password,
        isUsernameExist[0].password,
        async function (err, result) {
          if (result) {
            // OTP Create Part
            let code = Math.floor(100000 + Math.random() * 900000);
            let EmailText = `Your OTP Code is : ${code}`;
            let EmailSubject = "Please Verify With OTP";
            await SendMail(isUsernameExist[0].email, EmailText, EmailSubject);

            // Update OTP
            await User.findOneAndUpdate(
              { userName },
              { $set: { otp: code } },
              { new: true }
            );

            return res.status(200).json({
              status: "success",
              message: "OTP send successfully!",
              data: code,
            });
          } else {
            return res
              .status(401)
              .json({ status: "error", message: "Wrong password!" });
          }
        }
      );
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Unauthorized!" });
    }
  }
}
// ===================== Sent OTP Controller ========================

// ===================== Verify OTP Controller ========================
async function verifyOTPController(req, res) {
  try {
    const { otp } = req.body;

    const result = await User.find({});
    const email = result[0].email;
    const user_id = result[0]._id;

    if (result.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Unauthorized!" });
    } else {
      if (result[0].otp === req.body.otp) {
        await User.findOneAndUpdate(
          { otp },
          { $set: { otp: "0" } },
          { new: true }
        );

        // JWT Token
        let token = await CreateToken(email, user_id);
        let expireDuration = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const cookieString = `token=${token};expires=${expireDuration.toUTCString()};path=/`;
        res.cookie(cookieString);

        return res.status(400).json({
          status: "success",
          message: "OTP verified!",
          data: cookieString,
        });
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "OTP verified failed!" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: "error", message: "Unauthorized!" });
  }
}
// ===================== Verify OTP Controller ========================

// ===================== Logout Controller ========================
async function logoutController(req, res) {
  res.clearCookie("token");

  return res.status(200).json({
    status: "success",
    message: "Logout successful!",
  });
}
// ===================== Logout Controller ========================

// ===================== Profile Controller ========================
async function profileController(req, res) {
  const user_email = req.header("email");
  const user_id = req.header("user_id");

  const result = await User.findOne({ _id: user_id });

  return res.status(200).json({
    status: "success",
    message: "User profile!",
    data: result,
  });
}
// ===================== Profile Controller ========================

// ===================== Profile Update Controller ========================
async function profileUpdateController(req, res) {

  const user_email = req.header("email");
  const user_id = req.header("user_id");

  const {userName,email,password} = req.body;

  
  bcrypt.hash(password, 10, async function (err, hash) {

    const update_pass = hash;

    const filter = {_id:user_id};
    const update = {userName:userName, email:email, password:update_pass};

    await User.findOneAndUpdate(filter,update)
    .then(()=>{
      return res.status(200).json({
        status: "success",
        message: "User profile updated!",
      });
      // if(updateUser){
        
      // }else{
      //   return res.status(200).json({
      //     status: "error",
      //     message: "User profile not updated!",
      //   });
      // }
    });

  });
  

  


  

  

}
// ===================== Profile Update Controller ========================

module.exports = {
  registrationController,
  sentOTPController,
  verifyOTPController,
  logoutController,
  profileController,
  profileUpdateController,
};
