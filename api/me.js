const { users } = require('./_db');
const { json, allowCors, requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method !== 'GET') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res);
  if (!auth) return;

  const user = users.find((u) => u.id === auth.id);
  if (!user) {
    return json(res, 404, { error: 'User not found' });
  }

  return json(res, 200, {
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatar: user.avatar,
      banner: user.banner,
      interests: user.interests,
      followers: user.followers,
      following: user.following,
      friends: user.friends,
    },
  });
};
