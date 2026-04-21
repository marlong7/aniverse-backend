const { users, uid } = require('./_db');
const { signToken, json, allowCors } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const {
    username = '',
    password = '',
    displayName = '',
    bio = '',
    interests = [],
  } = req.body || {};

  const cleanUsername = String(username).trim().toLowerCase();
  const cleanPassword = String(password).trim();
  const cleanDisplayName = String(displayName).trim();

  if (!cleanUsername || !cleanPassword || !cleanDisplayName) {
    return json(res, 400, { error: 'Missing required fields' });
  }

  const exists = users.some((u) => u.username === cleanUsername);
  if (exists) {
    return json(res, 409, { error: 'Username already exists' });
  }

  const user = {
    id: uid('u'),
    username: cleanUsername,
    password: cleanPassword,
    displayName: cleanDisplayName,
    bio: String(bio || '').trim(),
    avatar: `https://picsum.photos/120/120?random=${Math.floor(Math.random() * 10000)}`,
    banner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    interests: Array.isArray(interests) ? interests.slice(0, 8) : [],
    followers: [],
    following: [],
    friends: [],
  };

  users.unshift(user);

  const token = signToken(user);

  return json(res, 201, {
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
