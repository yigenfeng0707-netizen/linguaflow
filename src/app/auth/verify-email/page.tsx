'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Mail, CheckCircle, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleVerify = async () => {
    setVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setVerifying(false)
    setVerified(true)
  }

  const handleResend = async () => {
    setResending(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setResending(false)
    setResent(true)
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
        </div>

        {!verified ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">验证你的邮箱</h1>
            <p className="text-gray-600 mb-6">
              我们已向你的邮箱发送了一封验证邮件。请点击邮件中的链接完成验证。
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">
                如果没有收到邮件，请检查垃圾邮件文件夹，或者点击下方按钮重新发送。
              </p>
            </div>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {resending ? '发送中...' : resent ? '已重新发送' : '重新发送验证邮件'}
            </button>

            <button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {verifying ? '验证中...' : '我已验证邮箱'}
            </button>

            <p className="text-sm text-gray-500">
              验证遇到问题？{' '}
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                联系客服
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">邮箱验证成功！</h1>
            <p className="text-gray-600 mb-8">
              你的邮箱已成功验证。现在可以开始你的语言学习之旅了！
            </p>

            <Link
              href="/learn"
              className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all"
            >
              开始学习
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
