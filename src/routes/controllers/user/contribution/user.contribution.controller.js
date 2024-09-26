// const OAuth = require("oauth-1.0a");
// const crypto = require("crypto");
// const axios = require("axios");

// // X API의 클라이언트 ID와 클라이언트 시크릿
// const clientId = "eUdUaUYtc2ZOMmZiaDJZWDg0am46MTpjaQ";
// const clientSecret = "DVrZj9JU0DCCDa4IkG9A8ktzRcdVGoLezYromd-q7sH9hXX3-t";
// const redirectUri = "http://localhost:3000"; // 설정된 리다이렉트 URI

// // Authorization URL로 리다이렉트하기 위한 핸들러
// exports.twitterOAuth = async (req, res) => {
//   try {
//     // 사용자 인증을 위해 트위터 인증 URL을 생성합니다
//     const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain`;

//     res.json({
//       authenticateUrl: authUrl, // 프론트엔드에서 이 URL로 리다이렉트
//     });
//   } catch (error) {
//     console.error("Error initiating OAuth:", error);
//     res.status(500).send("Failed to initiate OAuth");
//   }
// };

// // Access Token을 요청하는 핸들러
// exports.getAccessToken = async (req, res) => {
//   const { code } = req.query; // Authorization Code

//   try {
//     const tokenUrl = "https://api.twitter.com/2/oauth2/token";

//     // Access Token 요청
//     const response = await axios.post(tokenUrl, {
//       client_id: clientId,
//       client_secret: clientSecret,
//       grant_type: "authorization_code",
//       redirect_uri: redirectUri,
//       code,
//     });

//     const { access_token } = response.data;
//     console.log("Access Token:", access_token);

//     res.json({ accessToken: access_token });
//   } catch (error) {
//     console.error("Error getting access token:", error);
//     res.status(500).send("Failed to get access token");
//   }
// };

// // Access Token을 사용한 API 호출
// exports.makeAuthenticatedRequest = async (req, res) => {
//   const { accessToken } = req.query;

//   try {
//     const response = await axios.get("https://api.twitter.com/2/users/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error making authenticated request:", error);
//     res.status(500).send("Failed to fetch user data");
//   }
// };
const crypto = require("crypto");
const axios = require("axios");
const querystring = require("querystring");

const clientId = "eUdUaUYtc2ZOMmZiaDJZWDg0am46MTpjaQ";
const clientSecret = "DVrZj9JU0DCCDa4IkG9A8ktzRcdVGoLezYromd-q7sH9hXX3-t";
const redirectUri = "http://localhost:4000/api/user/twitter/callback"; // 백엔드 리다이렉트 URI

// Code Verifier를 생성하는 함수
const generateCodeVerifier = () => {
  const codeVerifier = crypto.randomBytes(32).toString("hex");
  console.log("닌 뭔데", codeVerifier);
  return codeVerifier;
};

// Code Challenge를 생성하는 함수 (PKCE)
const generateCodeChallenge = (codeVerifier) => {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url"); // Base64 URL-safe encoding
};

// OAuth 2.0 Authorization URL로 리다이렉트하기 위한 핸들러
exports.twitterOAuth = async (req, res) => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    console.log("12312312", codeChallenge);

    // 세션에 codeVerifier 저장
    req.session.codeVerifier = codeVerifier;

    // 세션에 codeVerifier가 저장되었는지 확인
    console.log("Stored codeVerifier in session:", req.session.codeVerifier);

    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    res.json({
      authenticateUrl: authUrl,
    });
  } catch (error) {
    console.error("Error initiating OAuth:", error);
    res.status(500).send("Failed to initiate OAuth");
  }
};

exports.getAccessToken = async (req, res) => {
  console.log("여긴 옴?");
  const { code } = req.query;

  try {
    const tokenUrl = "https://api.twitter.com/2/oauth2/token";
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const codeVerifier = req.session.codeVerifier; // 세션에서 code_verifier 가져옴
    console.log("이게되는거", codeVerifier);
    const response = await axios.post(
      tokenUrl,
      querystring.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
        code_verifier: codeVerifier, // code_verifier 전송
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authString}`, // Basic 인증 추가
        },
      }
    );

    const { access_token } = response.data;
    console.log("Access Token:", access_token);

    // res.json({ accessToken: access_token });
    res.redirect(
      `http://localhost:3000/mainboard/contribution/contribution-detail/1?accessToken=${access_token}`
    );
  } catch (error) {
    console.error("Error getting access token:", error);
    res.status(500).send("Failed to get access token");
  }
};

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
