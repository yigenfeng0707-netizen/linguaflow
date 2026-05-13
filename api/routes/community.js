const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { supabase } = require('../utils/supabase');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 获取帖子列表
router.get('/posts', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('tag').optional().isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { page = 1, limit = 20, tag, sort = 'latest' } = req.query;

  try {
    let queryBuilder = supabase
      .from('community_posts')
      .select(`
        *,
        user:users (id, username, avatar_url)
      `, { count: 'exact' });

    if (tag) {
      queryBuilder = queryBuilder.contains('tags', [tag]);
    }

    // 排序
    if (sort === 'hot') {
      queryBuilder = queryBuilder.order('likes_count', { ascending: false });
    } else {
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: posts, error, count } = await queryBuilder.range(from, to);

    if (error) throw error;

    res.json({
      posts: posts || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: '获取帖子失败' });
  }
});

// 获取单个帖子
router.get('/posts/:id', optionalAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const { data: post, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:users (id, username, avatar_url),
        comments (
          *,
          user:users (id, username, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '帖子不存在' });
      }
      throw error;
    }

    // 检查当前用户是否点赞
    let isLiked = false;
    if (req.user) {
      const { data: like } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', req.user.id)
        .eq('likeable_type', 'post')
        .eq('likeable_id', id)
        .single();
      isLiked = !!like;
    }

    res.json({ post: { ...post, is_liked: isLiked } });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: '获取帖子详情失败' });
  }
});

// 创建帖子
router.post('/posts', authenticateToken, [
  body('title').trim().isLength({ min: 5, max: 100 }),
  body('content').trim().isLength({ min: 10 }),
  body('tags').optional().isArray(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, tags = [] } = req.body;
  const userId = req.user.id;

  try {
    const { data: post, error } = await supabase
      .from('community_posts')
      .insert([{
        user_id: userId,
        title,
        content,
        tags,
      }])
      .select(`
        *,
        user:users (id, username, avatar_url)
      `)
      .single();

    if (error) throw error;

    res.status(201).json({ message: '发布成功', post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: '发布帖子失败' });
  }
});

// 点赞/取消点赞
router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('likeable_type', 'post')
      .eq('likeable_id', id)
      .single();

    if (existingLike) {
      // 取消点赞
      await supabase.from('likes').delete().eq('id', existingLike.id);
      
      // 更新帖子点赞数
      await supabase.rpc('decrement_likes', { post_id: id });
      
      res.json({ message: '取消点赞', liked: false });
    } else {
      // 添加点赞
      await supabase.from('likes').insert([{
        user_id: userId,
        likeable_type: 'post',
        likeable_id: id,
      }]);
      
      // 更新帖子点赞数
      await supabase.rpc('increment_likes', { post_id: id });
      
      res.json({ message: '点赞成功', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: '操作失败' });
  }
});

// 添加评论
router.post('/posts/:id/comments', authenticateToken, [
  body('content').trim().isLength({ min: 1, max: 500 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const { data: comment, error } = await supabase
      .from('comments')
      .insert([{
        post_id: id,
        user_id: userId,
        content,
      }])
      .select(`
        *,
        user:users (id, username, avatar_url)
      `)
      .single();

    if (error) throw error;

    // 更新帖子评论数
    await supabase.rpc('increment_comments', { post_id: id });

    res.status(201).json({ message: '评论成功', comment });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: '发表评论失败' });
  }
});

// 获取热门话题
router.get('/topics', async (req, res) => {
  try {
    // 从帖子标签中统计热门话题
    const { data: posts } = await supabase
      .from('community_posts')
      .select('tags');

    const tagCount = {};
    posts?.forEach(post => {
      post.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const topics = Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ error: '获取热门话题失败' });
  }
});

module.exports = router;
