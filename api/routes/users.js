const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../utils/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取用户统计信息
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 并行获取各种统计数据
    const [
      { data: progress },
      { data: achievements },
      { data: dailyStats },
      { data: vocabulary }
    ] = await Promise.all([
      supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId),
      supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', userId),
      supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(7),
      supabase
        .from('user_vocabulary')
        .select('*')
        .eq('user_id', userId)
    ]);

    // 计算统计数据
    const completedLessons = progress?.filter(p => p.status === 'completed').length || 0;
    const totalTimeMinutes = progress?.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0) / 60 || 0;
    const totalWords = vocabulary?.length || 0;
    const masteredWords = vocabulary?.filter(v => v.mastery_level >= 80).length || 0;

    res.json({
      stats: {
        total_xp: req.user.xp,
        streak_days: req.user.streak_days,
        completed_lessons: completedLessons,
        total_time_minutes: Math.round(totalTimeMinutes),
        total_words: totalWords,
        mastered_words: masteredWords,
        achievements_count: achievements?.length || 0,
      },
      recent_activity: dailyStats || [],
      achievements: achievements || []
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: '获取用户统计失败' });
  }
});

// 更新用户信息
router.patch('/profile', authenticateToken, [
  body('username').optional().trim().isLength({ min: 2, max: 20 }),
  body('target_languages').optional().isArray(),
  body('level').optional().isIn(['beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'proficient']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, target_languages, level, avatar_url } = req.body;
  const userId = req.user.id;

  try {
    // 检查用户名是否已被使用
    if (username && username !== req.user.username) {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existing) {
        return res.status(409).json({ error: '该用户名已被使用' });
      }
    }

    const updates = {};
    if (username) updates.username = username;
    if (target_languages) updates.target_languages = target_languages;
    if (level) updates.level = level;
    if (avatar_url) updates.avatar_url = avatar_url;
    updates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: '更新成功',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
        level: user.level,
        target_languages: user.target_languages,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

// 获取用户学习路径
router.get('/learning-path', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: learningPaths, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        recommended_courses
      `)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ learning_paths: learningPaths || [] });
  } catch (error) {
    console.error('Get learning path error:', error);
    res.status(500).json({ error: '获取学习路径失败' });
  }
});

module.exports = router;
