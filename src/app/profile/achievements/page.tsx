'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  Lock,
  Calendar,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟成就数据
const achievements = [
  {
    id: '1',
    name: '初学者',
    description: '完成首次学习',
    icon: '🎓',
    unlocked: true,
    unlockedDate: '2024-03-15',
    category: '学习',
    rarity: 'common',
  },
  {
    id: '2',
    name: '连续7天',
    description: '连续学习7天',
    icon: '🔥',
    unlocked: true,
    unlockedDate: '2024-03-22',
    category: '坚持',
    rarity: 'common',
  },
  {
    id: '3',
    name: '词汇达人',
    description: '累计学习500个单词',
    icon: '📖',
    unlocked: true,
    unlockedDate: '2024-04-10',
    category: '词汇',
    rarity: 'rare',
  },
  {
    id: '4',
    name: '语法高手',
    description: '完成100道语法题',
    icon: '✏️',
    unlocked: true,
    unlockedDate: '2024-04-20',
    category: '语法',
    rarity: 'rare',
  },
  {
    id: '5',
    name: '听力先锋',
    description: '完成50篇听力练习',
    icon: '🎧',
    unlocked: false,
    unlockedDate: null,
    category: '听力',
    rarity: 'rare',
    progress: 32,
    total: 50,
  },
  {
    id: '6',
    name: '口语达人',
    description: '完成100次口语跟读',
    icon: '🎤',
    unlocked: false,
    unlockedDate: null,
    category: '口语',
    rarity: 'epic',
    progress: 45,
    total: 100,
  },
  {
    id: '7',
    name: '连续30天',
    description: '连续学习30天',
    icon: '💪',
    unlocked: false,
    unlockedDate: null,
    category: '坚持',
    rarity: 'epic',
    progress: 15,
    total: 30,
  },
  {
    id: '8',
    name: '社区之星',
    description: '发布10篇优质帖子',
    icon: '⭐',
    unlocked: false,
    unlockedDate: null,
    category: '社区',
    rarity: 'rare',
    progress: 3,
    total: 10,
  },
  {
    id: '9',
    name: '语言大师',
    description: '掌握3门语言的基础',
    icon: '🌍',
    unlocked: false,
    unlockedDate: null,
    category: '综合',
    rarity: 'legendary',
    progress: 1,
    total: 3,
  },
  {
    id: '10',
    name: '满分王',
    description: '语法练习连续10次满分',
    icon: '👑',
    unlocked: false,
    unlockedDate: null,
    category: '语法',
    rarity: 'legendary',
    progress: 3,
    total: 10,
  },
  {
    id: '11',
    name: '早起鸟',
    description: '在早上6点前完成学习',
    icon: '🐦',
    unlocked: true,
    unlockedDate: '2024-04-25',
    category: '坚持',
    rarity: 'common',
  },
  {
    id: '12',
    name: '完美主义者',
    description: '连续7天完成每日目标',
    icon: '🎯',
    unlocked: false,
    unlockedDate: null,
    category: '坚持',
    rarity: 'rare',
    progress: 4,
    total: 7,
  },
]

const categories = ['全部', '学习', '坚持', '词汇', '语法', '听力', '口语', '社区', '综合']

const rarityColors = {
  common: { bg: 'bg-gray-100', text: 'text-gray-600', label: '普通' },
  rare: { bg: 'bg-blue-100', text: 'text-blue-600', label: '稀有' },
  epic: { bg: 'bg-purple-100', text: 'text-purple-600', label: '史诗' },
  legendary: { bg: 'bg-amber-100', text: 'text-amber-600', label: '传说' },
}

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState('全部')

  const filteredAchievements = activeCategory === '全部'
    ? achievements
    : achievements.filter((a) => a.category === activeCategory)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回 */}
        <Link href="/profile" className="text-sm text-gray-500 hover:text-primary-600 mb-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          返回个人中心
        </Link>

        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">个人成就</h1>
          <p className="text-gray-600 mt-1">收集徽章，记录你的学习里程碑</p>
        </div>

        {/* 总览统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{unlockedCount}/{totalCount}</div>
            <div className="text-sm text-gray-500">已解锁成就</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">15天</div>
            <div className="text-sm text-gray-500">连续学习</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">320</div>
            <div className="text-sm text-gray-500">已学单词</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">48h</div>
            <div className="text-sm text-gray-500">学习时长</div>
          </div>
        </div>

        {/* 总进度 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900">成就收集进度</span>
            <span className="text-sm text-gray-500">{Math.round((unlockedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 成就列表 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => {
            const rarity = rarityColors[achievement.rarity as keyof typeof rarityColors]
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl p-5 shadow-sm transition-all ${
                  achievement.unlocked ? 'hover:shadow-md' : 'opacity-70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    achievement.unlocked ? rarity.bg : 'bg-gray-100'
                  }`}>
                    {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${rarity.bg} ${rarity.text}`}>
                        {rarity.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Calendar className="w-3 h-3" />
                        <span>{achievement.unlockedDate} 解锁</span>
                      </div>
                    ) : achievement.progress !== undefined ? (
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>进度</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-400 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Footer />
    </div>
  )
}
