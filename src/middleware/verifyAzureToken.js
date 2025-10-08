const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { response } = require("../utils");
const { httpResponses, httpsStatusCodes, serverResponseMessage } = require('../constants');

const TENANT_ID = process.env.TENANTID;
const AUDIENCE = `api://${process.env.CLIENTID}`;
const ISSUER = `https://sts.windows.net/${TENANT_ID}/`;

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`
});

function getKey(header, callback) {
  try {
    client.getSigningKey(header.kid, function (err, key) {
      if (err) {
        console.error("JWKS getSigningKey error:", err);
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  } catch (error) {
    console.error("getKey error:", error);
    callback(error);
  }
}

const verifyAzureToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.failure(res, httpsStatusCodes.UNAUTHORIZED, httpResponses.UNAUTHORIZED, serverResponseMessage.INVALID_TOKEN);
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(
      token,
      getKey,
      {
        audience: AUDIENCE,
        issuer: ISSUER,
      },
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            
            return response.failure(res, httpsStatusCodes.UNAUTHORIZED, httpResponses.UNAUTHORIZED, serverResponseMessage.TOKEN_EXPIRED );
          }
          return response.failure(res, httpsStatusCodes.UNAUTHORIZED, httpResponses.UNAUTHORIZED, serverResponseMessage.INVALID_TOKEN);
        }
        req.userId = decoded.oid || decoded.sub;
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.error("verifyAzureToken error:", error);
    return response.failure(res, httpsStatusCodes.UNAUTHORIZED, httpResponses.UNAUTHORIZED, serverResponseMessage.INVALID_TOKEN);
  }
};

module.exports = verifyAzureToken;