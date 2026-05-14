'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  BookOpen,
  MessageCircle,
  CreditCard,
  Shield,
  Settings,
  Headphones,
  ChevronRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const helpCategories = [
  {
    icon: BookOpen,
    title: '课程学习',
    description: '课程购买、学习进度、课程内容相关问题',
    articles: 15,
    color: 'bg-blue-500',
  },
  {
    icon: Settings,
    title: '账户设置',
    description: '注册登录、个人信息、密码重置等问题',
    articles: 12,
    color: 'bg-purple-500',
  },
  {
    icon: CreditCard,
    title: '付费与订阅',
    description: '会员订阅、支付方式、退款等问题',
    articles: 8,
    color: 'bg-green-500',
  },
  {
    icon: MessageCircle,
    title: '社区功能',
    description: '发帖、评论、举报等社区相关问题',
    articles: 6,
    color: 'bg-amber-500',
  },
  {
    icon: Shield,
    title: '隐私与安全',
    description: '数据保护、账户安全、隐私设置等问题',
    articles: 10,
    color: 'bg-red-500',
  },
  {
    icon: Headphones,
    title: '技术支持',
    description: '应用故障、兼容性、性能等技术问题',
    articles: 14,
    color: 'bg-indigo-500',
  },
]

const popularArticles = [
  { id: '1', title: '如何重置密码？', views: 12500 },
  { id: '2', title: '课程购买后可以退款吗？', views: 8900 },
  { id: '3', title: '如何更改学习语言？', views: 7600 },
  { id: '4', title: '学习进度丢失怎么办？', views: 6200 },
  { id: '5', title: '如何联系客服？', views: 5100 },
]

export default function HelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">帮助中心</h1>
          <p className="text-gray-600">查找答案，解决问题</p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索帮助文章..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
            />
          </div>
        </div>

        {/* 帮助分类 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">浏览分类</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpCategories.map((category) => (
              <div
                key={category.title}
                onClick={() => router.push(`/help/${category.title}`)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{category.articles} 篇文章</span>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门文章 */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">热门文章</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {popularArticles.map((article, index) => (
              <div
                key={article.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-500">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 font-medium">{article.title}</span>
                </div>
                <span className="text-sm text-gray-400">{article.views.toLocaleString()} 次浏览</span>
              </div>
            ))}
          </div>
        </div>

        {/* 联系客服 */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white text-center">
          <Headphones className="w-12 h-12 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl font-bold mb-2">没有找到答案？</h2>
          <p className="text-white/80 mb-6">我们的客服团队随时为您提供帮助</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              联系我们
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
            >
              查看常见问题
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
