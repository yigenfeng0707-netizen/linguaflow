'use client'

import Link from 'next/link'
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Globe, 
  ChevronRight, 
  Sparkles,
  Headphones,
  MessageCircle,
  PenTool
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LanguageCard } from '@/components/ui/LanguageCard'
import { FeatureCard } from '@/components/ui/FeatureCard'

const languages = [
  { code: 'english', name: '英语', flag: '🇬🇧', learners: '120万+' },
  { code: 'japanese', name: '日语', flag: '🇯🇵', learners: '80万+' },
  { code: 'korean', name: '韩语', flag: '🇰🇷', learners: '60万+' },
  { code: 'spanish', name: '西班牙语', flag: '🇪🇸', learners: '40万+' },
  { code: 'french', name: '法语', flag: '🇫🇷', learners: '35万+' },
  { code: 'german', name: '德语', flag: '🇩🇪', learners: '25万+' },
]

const features = [
  {
    icon: BookOpen,
    title: '分级课程体系',
    description: '从A1到C2，科学分级，循序渐进掌握语言技能',
    color: 'bg-blue-500',
  },
  {
    icon: Sparkles,
    title: '互动式学习',
    description: '单词记忆、语法练习、口语跟读、听力训练全覆盖',
    color: 'bg-purple-500',
  },
  {
    icon: Trophy,
    title: '成就激励系统',
    description: '学习打卡、徽章收集、排行榜竞技，让学习更有趣',
    color: 'bg-amber-500',
  },
  {
    icon: Users,
    title: '社区交流',
    description: '与全球语言学习者交流，分享学习心得',
    color: 'bg-green-500',
  },
]

const learningModes = [
  { icon: BookOpen, title: '单词记忆', description: '科学记忆曲线，高效掌握词汇' },
  { icon: PenTool, title: '语法练习', description: '系统化语法训练，巩固基础' },
  { icon: Headphones, title: '听力训练', description: '真实场景对话，提升听力' },
  { icon: MessageCircle, title: '口语跟读', description: 'AI语音评测，纠正发音' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              沉浸式语言学习
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                开启你的多语种之旅
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              支持英语、日语、韩语等主流语言，科学的分级课程体系，
              让语言学习变得简单有趣
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
              >
                免费开始学习
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all"
              >
                浏览课程
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Language Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">选择你想学习的语言</h2>
            <p className="text-gray-600">覆盖全球主流语言，满足不同学习需求</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {languages.map((lang) => (
              <LanguageCard key={lang.code} language={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择 LinguaFlow</h2>
            <p className="text-gray-600">全方位的语言学习解决方案</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Learning Modes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">四大学习模块</h2>
            <p className="text-gray-600">听说读写全面覆盖，打造沉浸式学习体验</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningModes.map((mode, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                  <mode.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{mode.title}</h3>
                <p className="text-gray-600 text-sm">{mode.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">500万+</div>
              <div className="text-white/80">注册用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/80">精品课程</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50万+</div>
              <div className="text-white/80">学习词汇</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-white/80">用户好评</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="w-16 h-16 text-primary-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            准备好开始你的语言学习之旅了吗？
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            加入500万+学习者，开启多语种学习新体验
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg hover:shadow-xl"
          >
            立即免费注册
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
