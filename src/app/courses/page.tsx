'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, BookOpen, Clock, Users, Star } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟课程数据
const coursesData = [
  {
    id: '1',
    title: '英语零基础入门',
    description: '从字母和发音开始，系统学习英语基础知识',
    language: 'english',
    level: 'A1',
    category: 'vocabulary',
    total_lessons: 30,
    duration_minutes: 600,
    learners: 50000,
    rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=400',
  },
  {
    id: '2',
    title: '日语N5考试冲刺',
    description: '针对JLPT N5考试的系统备考课程',
    language: 'japanese',
    level: 'A1',
    category: 'grammar',
    total_lessons: 45,
    duration_minutes: 900,
    learners: 35000,
    rating: 4.9,
    cover_image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
  },
  {
    id: '3',
    title: '韩语日常会话',
    description: '掌握韩语日常交流必备词汇和句型',
    language: 'korean',
    level: 'A2',
    category: 'conversation',
    total_lessons: 25,
    duration_minutes: 500,
    learners: 28000,
    rating: 4.7,
    cover_image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400',
  },
  {
    id: '4',
    title: '商务英语进阶',
    description: '职场英语沟通技巧，提升职业竞争力',
    language: 'english',
    level: 'B1',
    category: 'conversation',
    total_lessons: 40,
    duration_minutes: 800,
    learners: 42000,
    rating: 4.6,
    cover_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  },
  {
    id: '5',
    title: '日语听力强化训练',
    description: '通过真实场景对话提升日语听力水平',
    language: 'japanese',
    level: 'B1',
    category: 'listening',
    total_lessons: 35,
    duration_minutes: 700,
    learners: 22000,
    rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400',
  },
  {
    id: '6',
    title: '韩语TOPIK I 备考',
    description: '系统备考TOPIK I，轻松通过初级考试',
    language: 'korean',
    level: 'A2',
    category: 'grammar',
    total_lessons: 50,
    duration_minutes: 1000,
    learners: 18000,
    rating: 4.9,
    cover_image: 'https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?w=400',
  },
]

const languages = [
  { code: 'all', name: '全部', flag: '🌍' },
  { code: 'english', name: '英语', flag: '🇬🇧' },
  { code: 'japanese', name: '日语', flag: '🇯🇵' },
  { code: 'korean', name: '韩语', flag: '🇰🇷' },
]

const levels = [
  { code: 'all', name: '全部等级' },
  { code: 'A1', name: 'A1 入门' },
  { code: 'A2', name: 'A2 初级' },
  { code: 'B1', name: 'B1 中级' },
  { code: 'B2', name: 'B2 中高级' },
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const filteredCourses = coursesData.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    return matchesSearch && matchesLanguage && matchesLevel
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">课程中心</h1>
          <p className="text-gray-600">发现适合你的语言学习课程</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索课程..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Language Filter */}
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {levels.map((level) => (
                <option key={level.code} value={level.code}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-accent-400">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white/30" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-gray-900">
                    {course.level}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.total_lessons}课
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.floor(course.duration_minutes / 60)}小时
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {(course.learners / 1000).toFixed(0)}k 学习
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关课程</h3>
            <p className="text-gray-500">尝试调整筛选条件或搜索其他关键词</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
