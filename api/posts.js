const { posts, groups, users, uid } = require('./_db');
const { json, allowCors, requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method === 'GET') {
    const q = String(req.query.q || '').trim().toLowerCase();
    const category = String(req.query.category || '').trim();
    const type = String(req.query.type || '').trim();

    let out = posts.map((post) => {
      const user = users.find((u) => u.id === post.userId);
      const group = groups.find((g) => g.id === post.groupId);

      return {
        ...post,
        author: user
          ? {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              avatar: user.avatar,
            }
          : null,
        group: group
          ? {
              id: group.id,
              name: group.name,
              category: group.category,
              type: group.type,
            }
          : null,
      };
    });

    if (category && category !== 'Tutti') {
      out = out.filter((p) => p.category === category);
    }

    if (type) {
      out = out.filter((p) => p.visibility === type);
    }

    if (q) {
      out = out.filter((p) => {
        const text = [
          p.title,
          p.text,
          ...(p.tags || []),
          p.author?.username || '',
          p.author?.displayName || '',
          p.group?.name || '',
        ]
          .join(' ')
          .toLowerCase();

        return text.includes(q);
      });
    }

    out.sort((a, b) => b.createdAt - a.createdAt);

    return json(res, 200, { posts: out });
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res);
    if (!auth) return;

    const {
      title = '',
      text = '',
      visibility = 'public',
      category = 'Teorie',
      groupId = null,
      channelId = null,
      mediaType = null,
      mediaUri = null,
      tags = [],
      spoiler = false,
    } = req.body || {};

    const cleanTitle = String(title).trim();
    const cleanText = String(text).trim();

    if (!cleanTitle || !cleanText) {
      return json(res, 400, { error: 'Missing title or text' });
    }

    if (visibility === 'group' && !groupId) {
      return json(res, 400, { error: 'groupId required for group post' });
    }

    const post = {
      id: uid('p'),
      userId: auth.id,
      groupId: groupId || null,
      channelId: channelId || null,
      visibility,
      category,
      title: cleanTitle,
      text: cleanText,
      mediaType: mediaType || null,
      mediaUri: mediaUri || null,
      tags: Array.isArray(tags) ? tags.slice(0, 8) : [],
      spoiler: Boolean(spoiler),
      likedBy: [],
      savedBy: [],
      commentsCount: 0,
      createdAt: Date.now(),
    };

    posts.unshift(post);

    return json(res, 201, { post });
  }

  return json(res, 405, { error: 'Method not allowed' });
};
