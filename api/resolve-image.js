const { json, allowCors } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  const { title = '', type = 'anime', genre = '', description = '' } = req.body || {};
  const text = `${title} ${genre} ${description}`.toLowerCase();

  let imageUrl =
    'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&w=1200&q=80';

  if (type === 'manga' || text.includes('manga') || text.includes('berserk')) {
    imageUrl =
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80';
  } else if (type === 'film' || text.includes('film') || text.includes('movie')) {
    imageUrl =
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';
  }

  return json(res, 200, { imageUrl });
};
