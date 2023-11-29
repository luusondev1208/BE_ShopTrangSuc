const axios = require('axios')
const qs = require('qs')
const User = require('../models/userGG')
const getGoogleOauthToken = async (code) => {
    const ROOT_URL = "https://oauth2.googleapis.com/token";
  
    const options = {
      code,
      client_id: "824520829396-fe61rmse67sip4h9urvtpgpoopjf0pd5.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "http://localhost:5000/api/google/sign-in",
      grant_type: "authorization_code",
    };
  
    try {
      const { data } = await axios.post(ROOT_URL, qs.stringify(options), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      return data;
    } catch (error) {
        console.error("Error in getGoogleOauthToken:", error.response?.data || error.message);
  
    //   throw new Error(error);
    }
  };

   const getGoogleUser = async (id_token, access_token) => {
    try {
      const ROOT_URL =
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=";
  
      const { data } = await axios.get(`${ROOT_URL}${access_token}`, {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      });
  
      return data;
    } catch (error) {
      console.error(error);
  
      throw Error(error);
    }
  };


 const googleOauth = async (req, res) => {
    const code = req.query.code;
    const pathUrl = req.query.state || "/";
  
    if (!code) {
      return res.redirect(`${process.env.ANGULAR_URL}/oauth-error`);
    }
  
    try {
      const { id_token, access_token } = await getGoogleOauthToken(code);
      const data = await getGoogleUser(
        id_token,
        access_token
      );
      const existingUser = await User.findOne({ googleId: data.id });
      if (!existingUser) {
        const newUser = await User.create({
          googleId: data.id,
          email: data.email,
          displayName: data.name,
          cart: data.cart,
          coupon:data.coupon,
          orders: data.order,
        });
  
     
  
        console.log("New user created:", newUser);
      }

  console.log(data);
      return res.redirect(`${process.env.ANGULAR_URL}${pathUrl}`);
    } catch (error) {
      console.error(error);
  
      return res.redirect(`${process.env.ANGULAR_URL}/oauth-error`);
    }
  };

  module.exports = {
    googleOauth,
  };
