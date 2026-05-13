const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { supabase } = require('../utils/supabase');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// 获取课程列表
router.get('/', [
  query('language').optional().isIn(['english', 'japanese', 'korean', 'spanish', 'french', 'german']),
  query('level').optional().isIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  query('category').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { language, level, category, page = 1, limit = 20, search } = req.query;

  try {
    let queryBuilder = supabase
      .from('courses')
      .select('*', { count: 'exact' });

    // 筛选条件
    if (language && language !== 'all') {
      queryBuilder = queryBuilder.eq('language', language);
    }
    if (level && level !== 'all') {
      queryBuilder = queryBuilder.eq('level', level);
    }
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }
    if (search) {
      queryBuilder = queryBuilder.ilike('title', `%${search}%`);
    }

    // 分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data: courses, error, count } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      courses: courses || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: '获取课程失败' });
  }
});

// 获取单个课程详情
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '课程不存在' });
      }
      throw error;
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: '获取课程详情失败' });
  }
});

// 获取课程单元详情
router.get('/:courseId/lessons/:lessonId', optionalAuth, async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        vocabulary (*)
      `)
      .eq('id', lessonId)
      .eq('course_id', courseId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '课程单元不存在' });
      }
      throw error;
    }

    // 如果用户已登录，获取学习进度
    let progress = null;
    if (req.user) {
      const { data: progressData } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('lesson_id', lessonId)
        .single();
      progress = progressData;
    }

    res.json({ lesson, progress });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: '获取课程单元失败' });
  }
});

module.exports = router;
