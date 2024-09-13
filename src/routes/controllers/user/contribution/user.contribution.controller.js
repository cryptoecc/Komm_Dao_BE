const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const axios = require("axios");

// X API의 클라이언트 ID와 클라이언트 시크릿
const clientId = "eUdUaUYtc2ZOMmZiaDJZWDg0am46MTpjaQ";
const clientSecret = "DVrZj9JU0DCCDa4IkG9A8ktzRcdVGoLezYromd-q7sH9hXX3-t";
const redirectUri = "http://localhost:3000"; // 설정된 리다이렉트 URI

// Authorization URL로 리다이렉트하기 위한 핸들러
exports.twitterOAuth = async (req, res) => {
  try {
    // 사용자 인증을 위해 트위터 인증 URL을 생성합니다
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain`;

    res.json({
      authenticateUrl: authUrl, // 프론트엔드에서 이 URL로 리다이렉트
    });
  } catch (error) {
    console.error("Error initiating OAuth:", error);
    res.status(500).send("Failed to initiate OAuth");
  }
};

// Access Token을 요청하는 핸들러
exports.getAccessToken = async (req, res) => {
  const { code } = req.query; // Authorization Code

  try {
    const tokenUrl = "https://api.twitter.com/2/oauth2/token";

    // Access Token 요청
    const response = await axios.post(tokenUrl, {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    });

    const { access_token } = response.data;
    console.log("Access Token:", access_token);

    res.json({ accessToken: access_token });
  } catch (error) {
    console.error("Error getting access token:", error);
    res.status(500).send("Failed to get access token");
  }
};

// Access Token을 사용한 API 호출
exports.makeAuthenticatedRequest = async (req, res) => {
  const { accessToken } = req.query;

  try {
    const response = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error making authenticated request:", error);
    res.status(500).send("Failed to fetch user data");
  }
};

// // Request Token 요청 URL
// const requestTokenURL = "https://api.twitter.com/oauth/request_token";
// const authenticateURL = "https://api.twitter.com/oauth/authenticate";

// exports.twitterOAuth = async (req, res) => {
//   const requestData = {
//     url: requestTokenURL,
//     method: "POST",
//   };

//   try {
//     const response = await axios({
//       method: "POST",
//       url: requestTokenURL,
//       headers: oauth.toHeader(oauth.authorize(requestData)),
//     });

//     const params = new URLSearchParams(response.data);
//     const oauthToken = params.get("oauth_token");

//     // 프론트엔드로 인증 URL 전달
//     res.json({
//       authenticateUrl: `${authenticateURL}?oauth_token=${oauthToken}`,
//     });
//   } catch (error) {
//     console.error("Error getting request token:", error);
//     res.status(500).send("Failed to initiate OAuth");
//   }
// };
