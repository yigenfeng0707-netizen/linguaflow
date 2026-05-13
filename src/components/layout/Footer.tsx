import Link from 'next/link'
import { BookOpen, Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">LinguaFlow</span>
            </Link>
            <p className="text-slate-400 text-sm">
              沉浸式多语种学习平台，让语言学习变得简单有趣
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">产品</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors">课程中心</Link></li>
              <li><Link href="/learn" className="hover:text-white transition-colors">学习中心</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">学习社区</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">支持</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="/help" className="hover:text-white transition-colors">帮助中心</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">常见问题</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">关于</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">服务条款</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-slate-400 text-sm">
            © 2024 LinguaFlow. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
