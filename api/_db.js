const users = [
  {
    id: 'u1',
    username: 'sir_m',
    password: '1234',
    displayName: 'Sir .M',
    bio: 'Anime, manga e community.',
    avatar: 'https://picsum.photos/120/120?random=9001',
    banner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    interests: ['One Piece', 'Berserk', 'Jujutsu Kaisen'],
    followers: [],
    following: [],
    friends: [],
  },
];

const groups = [
  {
    id: 'g1',
    name: 'One Piece Italia',
    slug: 'one-piece-italia',
    category: 'Anime',
    type: 'public',
    avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    banner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    description: 'Teorie, spoiler, episodi e meme.',
    rules: ['No spam', 'Spoiler segnalati'],
    ownerId: 'u1',
    adminIds: ['u1'],
    memberIds: ['u1'],
    channels: [
      { id: 'c1', name: 'generale', type: 'open', description: 'Discuss
