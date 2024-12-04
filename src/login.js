import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

/**
 * Function to exchange the code recevied from GitHub Oauth for a token
 * @param {String} code - The code received from GitHub Oauth 
 * @returns {String} - The token received from from callback
 */

async function exchangeCodeForToken(code) {
    const data = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      };

    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(data)
      });
    const userInfo = await response.json();
    return userInfo.access_token;
}
/**
 * Function fetches the user infomartion from GitHub Oauth 
 * @param {String} token - The token received from from callback
 * @returns {Object} - The user information received from GitHub Oauth
 */
async function getUserInfo(token) {
    const response = await fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const userInfo = await response.json();
    console.log(userInfo);
    return userInfo;
}

export { exchangeCodeForToken, getUserInfo };
