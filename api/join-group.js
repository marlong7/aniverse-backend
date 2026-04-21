const { groups } = require('./_db');
const { json, allowCors, requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const auth = requireAuth(req, res);
  if (!auth) return;

  const { groupId = '' } = req.body || {};
  const cleanGroupId = String(groupId).trim();

  const group = groups.find((g) => g.id === cleanGroupId);
  if (!group) {
    return json(res, 404, { error: 'Group not found' });
  }

  const joined = group.memberIds.includes(auth.id);

  if (group.type === 'closed' && !joined) {
    return json(res, 403, { error: 'Closed group requires invite' });
  }

  group.memberIds = joined
    ? group.memberIds.filter((id) => id !== auth.id)
    : [...group.memberIds, auth.id];

  return json(res, 200, {
    joined: !joined,
    membersCount: group.memberIds.length,
    group,
  });
};
