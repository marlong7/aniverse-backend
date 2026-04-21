const { users } = require('./_db');
const { signToken, json, allowCors } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const { username = '', password = '' } = req.body || {};
  const cleanUsername = String(username).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  const user = users.find(
    (u) => u.username === cleanUsername && u.password === cleanPassword
  );

  if (!user) {
    return json(res, 401, { error: 'Invalid credentials' });
  }

  const token = signToken(user);

  return json(res, 200, {
    token,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatar: user.avatar,
      banner: user.banner,
      interests: user.interests,
    },
  });
};
