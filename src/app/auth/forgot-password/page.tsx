'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, Mail, ArrowLeft, Send } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // 模拟发送重置邮件
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">LinguaFlow</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6">忘记密码</h1>
          <p className="text-gray-600 mt-2">输入你的邮箱地址，我们将发送密码重置链接</p>
        </div>

        {!sent ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '发送中...' : '发送重置链接'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                &larr; 返回登录
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">邮件已发送</h2>
            <p className="text-gray-600 mb-6">
              我们已向 <span className="font-medium text-gray-900">{email}</span> 发送了密码重置链接，请查收邮箱并按照提示重置密码。
            </p>
            <p className="text-sm text-gray-500 mb-6">
              没有收到邮件？请检查垃圾邮件文件夹，或稍后再试。
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                重新发送
              </button>
              <Link
                href="/auth/login"
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors inline-block"
              >
                返回登录
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
