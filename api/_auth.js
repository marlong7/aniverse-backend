function getJwt() {
  return require('jsonwebtoken');
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev_secret_change_me';
}

function signToken(user) {
  const jwt = getJwt();
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
    },
    getJwtSecret(),
    { expiresIn: '30d' }
  );
}

function readAuth(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7).trim();
}

function verifyTokenFromReq(req) {
  try {
    const jwt = getJwt();
    const token = readAuth(req);
    if (!token) return null;
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

function json(res, status, data) {
  res.status(status).json(data);
}

function allowCors(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

function requireAuth(req, res) {
  const payload = verifyTokenFromReq(req);
  if (!payload) {
    json(res, 401, { error: 'Unauthorized' });
    return null;
  }
  return payload;
}

module.exports = {
  signToken,
  verifyTokenFromReq,
  json,
  allowCors,
  requireAuth,
};