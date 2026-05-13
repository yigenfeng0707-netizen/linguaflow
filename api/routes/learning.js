const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../utils/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 记录学习进度
router.post('/progress', authenticateToken, [
  body('lesson_id').isUUID(),
  body('status').isIn(['not_started', 'in_progress', 'completed']),
  body('score').optional().isInt({ min: 0, max: 100 }),
  body('time_spent_seconds').optional().isInt({ min: 0 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { lesson_id, status, score, time_spent_seconds } = req.body;
  const userId = req.user.id;

  try {
    // 获取课程信息
    const { data: lesson } = await supabase
      .from('lessons')
      .select('course_id')
      .eq('id', lesson_id)
      .single();

    if (!lesson) {
      return res.status(404).json({ error: '课程单元不存在' });
    }

    // 检查是否已有进度记录
    const { data: existingProgress } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lesson_id)
      .single();

    const now = new Date().toISOString();
    let result;

    if (existingProgress) {
      // 更新进度
      const updates = {
        status,
        attempts: existingProgress.attempts + 1,
        updated_at: now,
      };
      if (score !== undefined) updates.score = score;
      if (time_spent_seconds !== undefined) {
        updates.time_spent_seconds = existingProgress.time_spent_seconds + time_spent_seconds;
      }
      if (status === 'completed' && !existingProgress.completed_at) {
        updates.completed_at = now;
      }

      const { data, error } = await supabase
        .from('learning_progress')
        .update(updates)
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 创建新进度
      const { data, error } = await supabase
        .from('learning_progress')
        .insert([{
          user_id: userId,
          course_id: lesson.course_id,
          lesson_id,
          status,
          score,
          time_spent_seconds: time_spent_seconds || 0,
          attempts: 1,
          completed_at: status === 'completed' ? now : null,
        }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // 如果完成课程，增加用户XP
    if (status === 'completed') {
      const xpGain = 10 + (score || 0) / 10; // 基础10XP + 根据分数奖励
      await supabase
        .from('users')
        .update({ xp: req.user.xp + xpGain })
        .eq('id', userId);

      // 更新每日统计
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyStat } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (dailyStat) {
        await supabase
          .from('daily_stats')
          .update({
            lessons_completed: dailyStat.lessons_completed + 1,
            xp_earned: dailyStat.xp_earned + xpGain,
            time_minutes: dailyStat.time_minutes + Math.round((time_spent_seconds || 0) / 60),
          })
          .eq('id', dailyStat.id);
      } else {
        await supabase
          .from('daily_stats')
          .insert([{
            user_id: userId,
            date: today,
            lessons_completed: 1,
            xp_earned: xpGain,
            time_minutes: Math.round((time_spent_seconds || 0) / 60),
          }]);
      }
    }

    res.json({
      message: '学习进度已记录',
      progress: result,
      xp_gained: status === 'completed' ? 10 + (score || 0) / 10 : 0,
    });
  } catch (error) {
    console.error('Record progress error:', error);
    res.status(500).json({ error: '记录学习进度失败' });
  }
});

// 获取用户学习进度
router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id } = req.query;

    let query = supabase
      .from('learning_progress')
      .select(`
        *,
        lessons (title, order_index)
      `)
      .eq('user_id', userId);

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    const { data: progress, error } = await query.order('updated_at', { ascending: false });

    if (error) throw error;

    res.json({ progress: progress || [] });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: '获取学习进度失败' });
  }
});

// 记录单词学习
router.post('/vocabulary', authenticateToken, [
  body('vocabulary_id').isUUID(),
  body('mastery_level').isInt({ min: 0, max: 100 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { vocabulary_id, mastery_level } = req.body;
  const userId = req.user.id;

  try {
    const now = new Date().toISOString();
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + (mastery_level >= 80 ? 7 : 1));

    const { data: existing } = await supabase
      .from('user_vocabulary')
      .select('*')
      .eq('user_id', userId)
      .eq('vocabulary_id', vocabulary_id)
      .single();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from('user_vocabulary')
        .update({
          mastery_level,
          review_count: existing.review_count + 1,
          last_reviewed_at: now,
          next_review_at: nextReview.toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('user_vocabulary')
        .insert([{
          user_id: userId,
          vocabulary_id,
          mastery_level,
          review_count: 1,
          last_reviewed_at: now,
          next_review_at: nextReview.toISOString(),
        }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    res.json({ message: '单词学习记录已更新', vocabulary: result });
  } catch (error) {
    console.error('Record vocabulary error:', error);
    res.status(500).json({ error: '记录单词学习失败' });
  }
});

module.exports = router;
