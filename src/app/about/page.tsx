'use client'

import Link from 'next/link'
import {
  Globe,
  Users,
  BookOpen,
  Trophy,
  Heart,
  Star,
  Target,
  Sparkles,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const teamMembers = [
  { name: '张明', role: '创始人 & CEO', description: '前某知名教育科技公司产品总监，10年在线教育经验' },
  { name: '李婷', role: '联合创始人 & CTO', description: '人工智能领域专家，专注于自然语言处理和语音识别技术' },
  { name: '王浩', role: '教学总监', description: '语言学博士，精通英日韩三种语言，15年语言教学经验' },
  { name: '陈雪', role: '设计总监', description: '资深UI/UX设计师，致力于打造最佳学习体验' },
]

const milestones = [
  { year: '2022', event: 'LinguaFlow 项目启动，获得天使轮融资' },
  { year: '2023', event: '产品正式上线，注册用户突破50万' },
  { year: '2023', event: '获得A轮融资，团队扩展至50人' },
  { year: '2024', event: '注册用户突破500万，上线6种语言课程' },
  { year: '2024', event: '推出AI口语评测功能，学习效果提升40%' },
]

const values = [
  {
    icon: Target,
    title: '以学习效果为核心',
    description: '我们相信，好的语言学习平台应该以实际效果为导向，帮助每一位学习者真正掌握语言技能。',
  },
  {
    icon: Heart,
    title: '用心服务每一位用户',
    description: '每一位用户的学习需求都是独特的，我们致力于提供个性化的学习体验和贴心的服务。',
  },
  {
    icon: Sparkles,
    title: '技术创新驱动',
    description: '利用人工智能和大数据技术，不断优化学习算法，让语言学习更高效、更有趣。',
  },
  {
    icon: Users,
    title: '构建学习社区',
    description: '语言学习不应是孤独的旅程。我们打造活跃的学习社区，让学习者互相激励、共同进步。',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 text-white/80" />
          <h1 className="text-4xl font-bold mb-4">关于 LinguaFlow</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            我们致力于让每一个人都能高效、有趣地学习新语言，打破语言壁垒，连接世界。
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 使命 */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">我们的使命</h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              LinguaFlow 成立于2022年，我们的使命是通过科技的力量，让语言学习变得高效、有趣且人人可及。
              我们相信，掌握一门新语言不仅能打开职业发展的新大门，更能帮助人们理解不同的文化，建立跨文化的友谊。
            </p>
          </div>

          {/* 数据统计 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">500万+</div>
              <div className="text-sm text-gray-500">注册用户</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">6种</div>
              <div className="text-sm text-gray-500">支持语言</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">1000+</div>
              <div className="text-sm text-gray-500">精品课程</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">98%</div>
              <div className="text-sm text-gray-500">用户好评率</div>
            </div>
          </div>
        </section>

        {/* 价值观 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">我们的价值观</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 发展历程 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">发展历程</h2>
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary-600">{milestone.year}</span>
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-gray-700 font-medium">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 团队 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">核心团队</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">加入我们</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            我们正在寻找对语言教育充满热情的伙伴。如果你也想为全球语言学习者创造价值，欢迎加入 LinguaFlow 团队！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              联系我们
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
            >
              免费注册
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
