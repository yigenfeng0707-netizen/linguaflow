'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Plus, 
  MessageCircle, 
  Heart, 
  Share2,
  Clock,
  User
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟社区帖子数据
const postsData = [
  {
    id: '1',
    author: { name: '语言爱好者', avatar: null },
    title: '分享我的日语学习心得',
    content: '学习日语已经三个月了，从五十音图开始，现在已经能看懂简单的动漫了。分享一下我的学习方法：每天坚持背单词，看日剧练习听力...',
    tags: ['日语', '学习方法'],
    likes: 128,
    comments: 24,
    created_at: '2小时前',
  },
  {
    id: '2',
    author: { name: '英语达人', avatar: null },
    title: '如何突破英语口语瓶颈？',
    content: '学了十几年英语，阅读和听力都不错，但口语一直是个短板。最近尝试了影子跟读法，感觉效果不错，推荐给大家...',
    tags: ['英语', '口语'],
    likes: 256,
    comments: 48,
    created_at: '5小时前',
  },
  {
    id: '3',
    author: { name: '韩语小白', avatar: null },
    title: 'TOPIK I 备考经验分享',
    content: '刚通过TOPIK I 考试，分享一下备考经验。首先是词汇量，建议至少掌握800个基础词汇。语法方面，重点掌握初级语法点...',
    tags: ['韩语', 'TOPIK', '考试'],
    likes: 89,
    comments: 15,
    created_at: '1天前',
  },
]

const hotTopics = [
  { id: '1', name: '日语学习', count: 1234 },
  { id: '2', name: '英语口语', count: 987 },
  { id: '3', name: '韩语入门', count: 654 },
  { id: '4', name: '考试技巧', count: 432 },
  { id: '5', name: '学习方法', count: 321 },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('latest')

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">学习社区</h1>
            <p className="text-gray-600">与全球语言学习者交流分享</p>
          </div>
          <Link
            href="/community/create"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            发布帖子
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Tabs */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索帖子..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('latest')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeTab === 'latest'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    最新
                  </button>
                  <button
                    onClick={() => setActiveTab('hot')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      activeTab === 'hot'
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    热门
                  </button>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {postsData.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{post.author.name}</span>
                        <span className="text-gray-400 text-sm flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.created_at}
                        </span>
                      </div>
                      <Link href={`/community/${post.id}`}>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-gray-500">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                            <MessageCircle className="w-5 h-5" />
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary-500 transition-colors">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hot Topics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">热门话题</h3>
              <div className="space-y-3">
                {hotTopics.map((topic, index) => (
                  <Link
                    key={topic.id}
                    href={`/community?tag=${topic.name}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < 3 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-gray-700">#{topic.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{topic.count} 讨论</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">活跃用户</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">用户{i}</div>
                      <div className="text-sm text-gray-500">发布了 {10 - i} 篇帖子</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
