'use client'

import { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  BookOpen,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const contactInfo = [
  {
    icon: Mail,
    title: '邮箱',
    content: 'support@linguaflow.com',
    description: '工作日24小时内回复',
    color: 'bg-blue-500',
  },
  {
    icon: Phone,
    title: '电话',
    content: '400-888-9999',
    description: '工作日 9:00-18:00',
    color: 'bg-green-500',
  },
  {
    icon: MapPin,
    title: '地址',
    content: '北京市朝阳区xxx路xxx号',
    description: 'LinguaFlow 总部',
    color: 'bg-purple-500',
  },
  {
    icon: MessageCircle,
    title: '在线客服',
    content: '点击开始对话',
    description: '7x24小时在线',
    color: 'bg-amber-500',
  },
]

const subjectOptions = [
  '账户问题',
  '课程咨询',
  '付费与退款',
  '技术故障',
  '合作洽谈',
  '意见建议',
  '其他',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">联系我们</h1>
          <p className="text-gray-600">我们很乐意听到你的声音</p>
        </div>

        {/* 联系方式 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactInfo.map((info) => (
            <div key={info.title} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <info.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
              <p className="text-sm text-primary-600 font-medium">{info.content}</p>
              <p className="text-xs text-gray-500 mt-1">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* 联系表单 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">发送消息</h2>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="你的姓名"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">主题 *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">请选择主题</option>
                      {subjectOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">消息内容 *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="请详细描述你的问题或建议..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? '发送中...' : (
                      <>
                        <Send className="w-5 h-5" />
                        发送消息
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">消息已发送！</h3>
                  <p className="text-gray-600 mb-6">
                    感谢你的来信，我们会在1-2个工作日内回复你的消息。
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }) }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    发送新消息
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 侧边信息 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-gray-900">工作时间</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>周一至周五：9:00 - 18:00</p>
                <p>周六：10:00 - 16:00</p>
                <p>周日及节假日：休息</p>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                在线客服和邮件支持全年无休，我们会在收到消息后尽快回复。
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
              <BookOpen className="w-8 h-8 text-primary-500 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">常见问题</h3>
              <p className="text-sm text-gray-600 mb-4">
                在联系我们之前，你可以先查看常见问题页面，也许能快速找到答案。
              </p>
              <a
                href="/faq"
                className="inline-flex items-center text-sm text-primary-600 font-medium hover:text-primary-700"
              >
                查看常见问题 &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
