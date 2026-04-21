const { groups, uid } = require('./_db');
const { json, allowCors, requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method === 'GET') {
    const q = String(req.query.q || '').trim().toLowerCase();

    let out = [...groups];

    if (q) {
      out = out.filter((g) => {
        const text = [g.name, g.description, g.category, ...g.channels.map((c) => c.name)]
          .join(' ')
          .toLowerCase();
        return text.includes(q);
      });
    }

    return json(res, 200, { groups: out });
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res);
    if (!auth) return;

    const {
      name = '',
      description = '',
      category = 'Anime',
      type = 'public',
      channels = [],
    } = req.body || {};

    const cleanName = String(name).trim();
    const cleanDescription = String(description).trim();

    if (!cleanName || !cleanDescription) {
      return json(res, 400, { error: 'Missing name or description' });
    }

    const group = {
      id: uid('g'),
      name: cleanName,
      slug: cleanName.toLowerCase().replace(/\s+/g, '-'),
      category,
      type,
      avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      banner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      description: cleanDescription,
      rules: ['No spam', 'Rispetto', 'Contenuti coerenti al gruppo'],
      ownerId: auth.id,
      adminIds: [auth.id],
      moderatorIds: [],
      memberIds: [auth.id],
      channels: Array.isArray(channels) && channels.length
        ? channels.slice(0, 8).map((name, i) => ({
            id: uid(`c${i}`),
            name: String(name).trim().toLowerCase(),
            type: 'open',
            description: `Canale ${String(name).trim().toLowerCase()}`,
          }))
        : [
            {
              id: uid('c'),
              name: 'generale',
              type: 'open',
              description: 'Canale generale',
            },
          ],
    };

    groups.unshift(group);

    return json(res, 201, { group });
  }

  return json(res, 405, { error: 'Method not allowed' });
};
