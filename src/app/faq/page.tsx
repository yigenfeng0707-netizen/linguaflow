'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const faqData = [
  {
    category: '账户相关',
    questions: [
      {
        q: '如何注册 LinguaFlow 账户？',
        a: '点击页面右上角的"注册"按钮，填写您的邮箱地址和密码，即可完成注册。您也可以使用 Google 或 GitHub 账号快速注册。注册完成后，请验证您的邮箱地址以激活账户。',
      },
      {
        q: '忘记密码怎么办？',
        a: '在登录页面点击"忘记密码"链接，输入您注册时使用的邮箱地址，我们将发送一封包含密码重置链接的邮件。点击邮件中的链接即可设置新密码。如果未收到邮件，请检查垃圾邮件文件夹。',
      },
      {
        q: '如何修改个人信息？',
        a: '登录后，点击右上角的头像进入"个人中心"，在"个人信息"页面可以修改您的昵称、头像、学习语言偏好等设置。',
      },
      {
        q: '如何注销账户？',
        a: '进入"个人中心" > "账户设置" > "注销账户"。请注意，注销账户后您的所有学习数据将被永久删除且无法恢复，请在操作前确认。',
      },
    ],
  },
  {
    category: '课程学习',
    questions: [
      {
        q: 'LinguaFlow 提供哪些语言的学习课程？',
        a: '目前我们提供英语、日语、韩语、西班牙语、法语和德语六种语言的学习课程，涵盖从 A1 入门到 C2 精通的全级别内容。我们还在不断开发新的语言课程。',
      },
      {
        q: '课程是免费的吗？',
        a: 'LinguaFlow 提供免费和付费两种课程。基础课程和部分练习功能可以免费使用。高级课程、AI 口语评测、个性化学习计划等高级功能需要订阅会员。我们提供月度和年度两种会员方案。',
      },
      {
        q: '学习进度会同步吗？',
        a: '是的，您的学习进度会自动同步到云端。无论您使用电脑、手机还是平板，都可以无缝继续学习。请确保您已登录同一账户。',
      },
      {
        q: '如何选择适合自己的课程？',
        a: '您可以通过课程中心的筛选功能，按语言、等级和类别筛选课程。如果您不确定自己的水平，可以参加我们的免费水平测试，我们会根据测试结果推荐适合的课程。',
      },
    ],
  },
  {
    category: '付费与会员',
    questions: [
      {
        q: '如何订阅会员？',
        a: '登录后进入"个人中心" > "会员中心"，选择您需要的会员方案（月度或年度），完成支付即可。我们支持支付宝、微信支付和信用卡等多种支付方式。',
      },
      {
        q: '可以退款吗？',
        a: '年度会员订阅在购买后7天内可以申请全额退款，月度会员订阅在购买后3天内可以申请全额退款。超过退款期限的订阅将不予退款。如需退款，请联系客服团队。',
      },
      {
        q: '会员到期后会怎样？',
        a: '会员到期后，您将自动降级为免费用户。您的学习进度和已完成的课程记录会保留，但高级功能（如 AI 口语评测、个性化学习计划等）将无法使用。',
      },
    ],
  },
  {
    category: '社区功能',
    questions: [
      {
        q: '如何发布帖子？',
        a: '进入"学习社区"页面，点击右上角的"发布帖子"按钮。填写标题和内容，添加相关标签后即可发布。请遵守社区准则，发布有价值的学习相关内容。',
      },
      {
        q: '如何举报不当内容？',
        a: '在帖子或评论下方点击"举报"按钮，选择举报原因并提交。我们的审核团队会在24小时内处理您的举报。',
      },
    ],
  },
]

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState('全部')

  const toggleItem = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const categories = ['全部', ...faqData.map((c) => c.category)]

  const filteredData = activeCategory === '全部'
    ? faqData
    : faqData.filter((c) => c.category === activeCategory)

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">常见问题</h1>
          <p className="text-gray-600">快速找到你需要的答案</p>
        </div>

        {/* 搜索 */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索问题..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
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

        {/* FAQ 列表 */}
        <div className="space-y-6">
          {filteredData.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{category.category}</h2>
              <div className="space-y-2">
                {category.questions
                  .filter((item) =>
                    !searchQuery ||
                    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.a.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => {
                    const key = `${category.category}-${item.q}`
                    const isExpanded = expandedItems.has(key)
                    return (
                      <div key={key} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed pt-4">{item.a}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-12 bg-white rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到你的问题？</h3>
          <p className="text-gray-600 mb-4">欢迎通过以下方式联系我们</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
              联系我们
            </Link>
            <Link href="/help" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              帮助中心
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
