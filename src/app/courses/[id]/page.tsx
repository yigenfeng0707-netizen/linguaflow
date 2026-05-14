'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Trophy,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟课程详情数据
const courseDetails: Record<string, {
  title: string
  description: string
  language: string
  level: string
  total_lessons: number
  duration: string
  learners: number
  rating: number
  instructor: { name: string; title: string }
  outline: { section: string; lessons: { id: number; title: string; duration: string; completed: boolean; locked: boolean }[] }[]
}> = {
  '1': {
    title: '英语零基础入门',
    description: '从字母和发音开始，系统学习英语基础知识。本课程涵盖英语字母表、基础发音规则、常用词汇和日常会话，适合完全没有英语基础的学员。',
    language: '英语',
    level: 'A1',
    total_lessons: 30,
    duration: '10小时',
    learners: 50000,
    rating: 4.8,
    instructor: { name: '张老师', title: '资深英语教师，10年教学经验' },
    outline: [
      {
        section: '第一章：字母与发音',
        lessons: [
          { id: 1, title: '英语字母表', duration: '15分钟', completed: true, locked: false },
          { id: 2, title: '元音发音规则', duration: '20分钟', completed: true, locked: false },
          { id: 3, title: '辅音发音规则', duration: '25分钟', completed: false, locked: false },
        ],
      },
      {
        section: '第二章：基础词汇',
        lessons: [
          { id: 4, title: '数字与颜色', duration: '20分钟', completed: false, locked: false },
          { id: 5, title: '家庭成员', duration: '15分钟', completed: false, locked: true },
          { id: 6, title: '日常用品', duration: '20分钟', completed: false, locked: true },
        ],
      },
      {
        section: '第三章：日常会话',
        lessons: [
          { id: 7, title: '自我介绍', duration: '20分钟', completed: false, locked: true },
          { id: 8, title: '问路与指路', duration: '25分钟', completed: false, locked: true },
          { id: 9, title: '餐厅点餐', duration: '20分钟', completed: false, locked: true },
        ],
      },
    ],
  },
}

export default function CourseDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))

  const course = courseDetails[id] || courseDetails['1']

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const completedLessons = course.outline.flatMap((s) => s.lessons).filter((l) => l.completed).length
  const progress = Math.round((completedLessons / course.total_lessons) * 100)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回 */}
        <Link href="/courses" className="text-sm text-gray-500 hover:text-primary-600 mb-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          返回课程列表
        </Link>

        {/* 课程头部 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{course.language}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{course.level}</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-white/80 mb-4">{course.description}</p>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> {course.total_lessons} 课时
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {(course.learners / 1000).toFixed(0)}k 学习者
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" /> {course.rating}
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold">
                {course.instructor.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900">{course.instructor.name}</div>
                <div className="text-sm text-gray-500">{course.instructor.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">学习进度</div>
                <div className="font-semibold text-gray-900">{progress}%</div>
              </div>
              <Link
                href={`/learn/course/${id}`}
                className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                {completedLessons > 0 ? '继续学习' : '开始学习'}
              </Link>
            </div>
          </div>
        </div>

        {/* 课程大纲 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">课程大纲</h2>
          <div className="space-y-4">
            {course.outline.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedSections.has(sectionIndex) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-900">{section.section}</span>
                    <span className="text-sm text-gray-500">
                      ({section.lessons.filter((l) => l.completed).length}/{section.lessons.length})
                    </span>
                  </div>
                </button>
                {expandedSections.has(sectionIndex) && (
                  <div className="border-t border-gray-100">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : lesson.locked ? (
                            <Lock className="w-5 h-5 text-gray-300" />
                          ) : (
                            <Play className="w-5 h-5 text-primary-500" />
                          )}
                          <span className={`text-sm ${lesson.locked ? 'text-gray-400' : 'text-gray-700'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 课程统计 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{completedLessons}</div>
            <div className="text-sm text-gray-500">已完成课时</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{course.total_lessons - completedLessons}</div>
            <div className="text-sm text-gray-500">剩余课时</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{progress}%</div>
            <div className="text-sm text-gray-500">完成进度</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
