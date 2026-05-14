'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CheckCircle,
  Circle,
  Play,
  Clock,
  ArrowRight,
  RotateCcw,
  Trophy,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟课程学习数据
const courseLearningData: Record<string, {
  title: string
  currentLesson: { id: number; title: string; content: string; keyPoints: string[] }
  lessons: { id: number; title: string; duration: string; completed: boolean }[]
}> = {
  '1': {
    title: '英语零基础入门',
    currentLesson: {
      id: 3,
      title: '辅音发音规则',
      content: `英语中有 24 个辅音音素，分为清辅音和浊辅音。清辅音发音时声带不振动，浊辅音发音时声带振动。

今天我们学习以下辅音的发音方法：

**清辅音 /p/ 和浊辅音 /b/**
- /p/：双唇紧闭，然后突然张开，气流从口中冲出。声带不振动。
- /b/：发音方式与 /p/ 相同，但声带要振动。

**清辅音 /t/ 和浊辅音 /d/**
- /t/：舌尖抵住上齿龈，然后突然放开，气流从口中冲出。声带不振动。
- /d/：发音方式与 /t/ 相同，但声带要振动。

**练习技巧**
1. 将手放在喉咙上，感受声带是否振动
2. 对着一张纸发音，清辅音会让纸张明显晃动
3. 多听母语者的发音，反复模仿`,
      keyPoints: ['区分清辅音和浊辅音', '掌握 /p/-/b/ 的发音区别', '掌握 /t/-/d/ 的发音区别', '学会感受声带振动'],
    },
    lessons: [
      { id: 1, title: '英语字母表', duration: '15分钟', completed: true },
      { id: 2, title: '元音发音规则', duration: '20分钟', completed: true },
      { id: 3, title: '辅音发音规则', duration: '25分钟', completed: false },
      { id: 4, title: '数字与颜色', duration: '20分钟', completed: false },
      { id: 5, title: '家庭成员', duration: '15分钟', completed: false },
      { id: 6, title: '日常用品', duration: '20分钟', completed: false },
    ],
  },
}

export default function LearnCoursePage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<number>>(new Set())

  // 验证 ID 是否有效，无效时不回退到默认数据
  const course = courseLearningData[id]

  // 如果课程不存在，显示未找到页面
  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">课程未找到</h1>
            <p className="text-gray-600 mb-6">该课程不存在或已被删除</p>
            <Link
              href="/learn"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            >
              返回学习中心
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const lesson = course.currentLesson
  const completedCount = course.lessons.filter((l) => l.completed || completedLessonIds.has(l.id)).length

  const handleCompleteLesson = () => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev)
      next.add(lesson.id)
      return next
    })
    alert('恭喜！本课已完成！')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/learn" className="text-sm text-gray-500 hover:text-primary-600 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              学习中心
            </Link>
            <span className="text-gray-300">/</span>
            <Link href={`/learn/course/${id}`} className="text-sm text-gray-500 hover:text-primary-600">
              {course.title}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              进度：{completedCount}/{course.lessons.length} 课时
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${(completedCount / course.lessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* 侧边栏 - 课程目录 */}
          {sidebarOpen && (
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4 px-2">课程目录</h3>
                <div className="space-y-1">
                  {course.lessons.map((l) => (
                    <div
                      key={l.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                        l.id === lesson.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-slate-50 text-gray-700'
                      }`}
                    >
                      {l.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : l.id === lesson.id ? (
                        <Play className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${l.completed ? 'text-gray-500' : ''}`}>
                          {l.title}
                        </div>
                        <div className="text-xs text-gray-400">{l.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 主内容区 */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
              {/* 课时标题 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>预计 15 分钟</span>
                  </div>
                </div>
              </div>

              {/* 课时内容 */}
              <div className="prose prose-slate max-w-none">
                {lesson.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return <br key={index} />
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                        {paragraph.slice(2, -2)}
                      </h3>
                    )
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="text-gray-700 leading-relaxed mb-2 ml-4 list-disc">
                        {paragraph.slice(2).split(/(\*\*.*?\*\*)/).map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                          }
                          return part
                        })}
                      </li>
                    )
                  }
                  return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-3">
                      {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                        }
                        return part
                      })}
                    </p>
                  )
                })}
              </div>
            </div>

            {/* 重点总结 */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200 mb-6">
              <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                本课重点
              </h3>
              <ul className="space-y-2">
                {lesson.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-2 text-amber-700">
                    <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 底部操作 */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  const currentIdx = course.lessons.findIndex((l) => l.id === lesson.id)
                  if (currentIdx > 0) {
                    router.push(`/learn/course/${id}`)
                  }
                }}
                disabled={course.lessons.findIndex((l) => l.id === lesson.id) === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                上一课
              </button>
              <button
                onClick={handleCompleteLesson}
                className="flex items-center gap-2 px-8 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                完成本课
              </button>
              <button
                onClick={() => {
                  const currentIdx = course.lessons.findIndex((l) => l.id === lesson.id)
                  if (currentIdx < course.lessons.length - 1) {
                    router.push(`/learn/course/${id}`)
                  }
                }}
                disabled={course.lessons.findIndex((l) => l.id === lesson.id) >= course.lessons.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一课
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
