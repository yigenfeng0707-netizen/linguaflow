'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Trophy, 
  Flame, 
  Target, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Star,
  Award
} from 'lucide-react'
import { Header } from '@/components/layout/Header'

// 模拟用户数据
const userData = {
  username: '学习者',
  level: 'intermediate',
  xp: 2450,
  streak_days: 15,
  total_words: 320,
  total_time: 48,
  achievements: [
    { id: '1', name: '初学者', icon: '🎓', unlocked: true },
    { id: '2', name: '连续7天', icon: '🔥', unlocked: true },
    { id: '3', name: '词汇达人', icon: '📖', unlocked: false },
  ],
}

// 模拟学习进度
const progressData = [
  { day: '周一', minutes: 45, words: 15 },
  { day: '周二', minutes: 30, words: 10 },
  { day: '周三', minutes: 60, words: 20 },
  { day: '周四', minutes: 25, words: 8 },
  { day: '周五', minutes: 40, words: 12 },
  { day: '周六', minutes: 55, words: 18 },
  { day: '周日', minutes: 35, words: 11 },
]

// 模拟推荐课程
const recommendedCourses = [
  { id: '1', title: '英语口语进阶', progress: 65, lessons: 30, completed: 20 },
  { id: '2', title: '日语N5词汇', progress: 30, lessons: 50, completed: 15 },
  { id: '3', title: '韩语语法基础', progress: 0, lessons: 25, completed: 0 },
]

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">欢迎回来，{userData.username}！</h1>
              <p className="text-white/80">继续你的学习之旅，今天也要加油哦！</p>
            </div>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Flame className="w-5 h-5 text-amber-300" />
                  <span className="text-2xl font-bold">{userData.streak_days}</span>
                </div>
                <span className="text-sm text-white/80">连续学习</span>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-300" />
                  <span className="text-2xl font-bold">{userData.xp}</span>
                </div>
                <span className="text-sm text-white/80">经验值</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">快速开始</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/learn/vocabulary"
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">单词记忆</span>
                </Link>
                <Link
                  href="/learn/grammar"
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <Target className="w-8 h-8 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">语法练习</span>
                </Link>
                <Link
                  href="/learn/listening"
                  className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <Clock className="w-8 h-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">听力训练</span>
                </Link>
                <Link
                  href="/learn/speaking"
                  className="flex flex-col items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  <TrendingUp className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">口语跟读</span>
                </Link>
              </div>
            </div>

            {/* Current Courses */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">正在学习</h2>
                <Link href="/courses" className="text-primary-600 text-sm hover:underline">
                  查看全部
                </Link>
              </div>
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{course.completed}/{course.lessons} 课</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span>{course.progress}%</span>
                      </div>
                    </div>
                    <Link
                      href={`/learn/course/${course.id}`}
                      className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      继续
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">本周学习</h2>
              <div className="grid grid-cols-7 gap-2">
                {progressData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">{day.day}</div>
                    <div
                      className="h-24 bg-slate-100 rounded-lg relative overflow-hidden"
                      style={{
                        background: `linear-gradient(to top, rgba(14, 165, 233, 0.2) ${day.minutes}%, transparent ${day.minutes}%)`,
                      }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-b-lg transition-all"
                        style={{ height: `${(day.minutes / 60) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{day.minutes}分钟</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">学习统计</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-gray-600">已学单词</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userData.total_words}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-600">学习时长</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userData.total_time}小时</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-gray-600">连续学习</span>
                  </div>
                  <span className="font-semibold text-gray-900">{userData.streak_days}天</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">成就徽章</h2>
                <Link href="/profile/achievements" className="text-primary-600 text-sm hover:underline">
                  查看全部
                </Link>
              </div>
              <div className="flex gap-4">
                {userData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex-1 text-center p-4 rounded-xl ${
                      achievement.unlocked ? 'bg-amber-50' : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-xs text-gray-600">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Goal */}
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6" />
                <h2 className="text-lg font-semibold">今日目标</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">学习15分钟</span>
                  <span className="font-semibold">10/15 分钟</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '67%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">学习10个单词</span>
                  <span className="font-semibold">8/10 个</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
