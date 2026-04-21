const { comments, posts, users, uid } = require('./_db');
const { json, allowCors, requireAuth } = require('./_auth');

module.exports = async function handler(req, res) {
  if (allowCors(req, res)) return;

  if (req.method === 'GET') {
    const postId = String(req.query.postId || '').trim();
    if (!postId) {
      return json(res, 400, { error: 'postId required' });
    }

    const out = comments
      .filter((c) => c.postId === postId)
      .map((comment) => {
        const user = users.find((u) => u.id === comment.userId);
        return {
          ...comment,
          author: user
            ? {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar,
              }
            : null,
        };
      });

    return json(res, 200, { comments: out });
  }

  if (req.method === 'POST') {
    const auth = requireAuth(req, res);
    if (!auth) return;

    const { postId = '', text = '' } = req.body || {};
    const cleanPostId = String(postId).trim();
    const cleanText = String(text).trim();

    if (!cleanPostId || !cleanText) {
      return json(res, 400, { error: 'postId and text required' });
    }

    const post = posts.find((p) => p.id === cleanPostId);
    if (!post) {
      return json(res, 404, { error: 'Post not found' });
    }

    const comment = {
      id: uid('cm'),
      postId: cleanPostId,
      userId: auth.id,
      parentCommentId: null,
      text: cleanText,
      likedBy: [],
      createdAt: Date.now(),
    };

    comments.unshift(comment);
    post.commentsCount += 1;

    return json(res, 201, { comment });
  }

  return json(res, 405, { error: 'Method not allowed' });
};
