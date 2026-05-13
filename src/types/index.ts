// 用户相关类型
export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  native_language: Language
  target_languages: Language[]
  level: UserLevel
  xp: number
  streak_days: number
  created_at: string
  updated_at: string
}

export type Language = 'english' | 'japanese' | 'korean' | 'chinese' | 'spanish' | 'french' | 'german'

export type UserLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced' | 'proficient'

// 课程相关类型
export interface Course {
  id: string
  title: string
  description: string
  language: Language
  level: CourseLevel
  cover_image?: string
  total_lessons: number
  duration_minutes: number
  category: CourseCategory
  tags: string[]
  created_at: string
  lessons: Lesson[]
}

export type CourseLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type CourseCategory = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing' | 'conversation'

// 课程单元
export interface Lesson {
  id: string
  course_id: string
  title: string
  description: string
  order: number
  type: LessonType
  duration_minutes: number
  content: LessonContent
  created_at: string
}

export type LessonType = 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading' | 'writing' | 'quiz'

export interface LessonContent {
  vocabulary?: VocabularyItem[]
  grammar?: GrammarRule[]
  listening?: ListeningExercise[]
  speaking?: SpeakingExercise[]
  reading?: ReadingPassage[]
  quiz?: QuizQuestion[]
}

// 单词
export interface VocabularyItem {
  id: string
  word: string
  pronunciation: string
  meaning: string
  example_sentence: string
  audio_url?: string
  image_url?: string
}

// 语法规则
export interface GrammarRule {
  id: string
  title: string
  explanation: string
  examples: string[]
  pattern?: string
}

// 听力练习
export interface ListeningExercise {
  id: string
  audio_url: string
  transcript: string
  questions: ListeningQuestion[]
}

export interface ListeningQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
}

// 口语练习
export interface SpeakingExercise {
  id: string
  prompt: string
  expected_response: string
  audio_url?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// 阅读文章
export interface ReadingPassage {
  id: string
  title: string
  content: string
  questions: ReadingQuestion[]
}

export interface ReadingQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
}

// 测验问题
export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
}

// 学习进度
export interface LearningProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id: string
  status: ProgressStatus
  score?: number
  time_spent_seconds: number
  attempts: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

// 用户学习统计
export interface UserStats {
  user_id: string
  total_xp: number
  total_lessons_completed: number
  total_words_learned: number
  total_time_minutes: number
  streak_days: number
  longest_streak: number
  achievements: Achievement[]
  weekly_progress: DailyProgress[]
}

export interface DailyProgress {
  date: string
  lessons_completed: number
  words_learned: number
  time_minutes: number
  xp_earned: number
}

// 成就
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  requirement: string
  xp_reward: number
  unlocked_at?: string
}

export type AchievementCategory = 'learning' | 'streak' | 'social' | 'mastery' | 'special'

// 社区帖子
export interface CommunityPost {
  id: string
  user_id: string
  user: User
  title: string
  content: string
  language?: Language
  tags: string[]
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
}

// 评论
export interface Comment {
  id: string
  post_id: string
  user_id: string
  user: User
  content: string
  likes_count: number
  created_at: string
}

// 学习路径推荐
export interface LearningPath {
  id: string
  user_id: string
  language: Language
  current_level: CourseLevel
  target_level: CourseLevel
  recommended_courses: RecommendedCourse[]
  created_at: string
}

export interface RecommendedCourse {
  course_id: string
  course: Course
  priority: number
  reason: string
}
