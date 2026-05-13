'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, BookOpen, User, Bell } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LinguaFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-600 hover:text-primary-600 transition-colors">
              课程
            </Link>
            <Link href="/learn" className="text-gray-600 hover:text-primary-600 transition-colors">
              学习
            </Link>
            <Link href="/community" className="text-gray-600 hover:text-primary-600 transition-colors">
              社区
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              登录
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              免费注册
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <nav className="flex flex-col space-y-4">
              <Link href="/courses" className="text-gray-600 hover:text-primary-600">
                课程
              </Link>
              <Link href="/learn" className="text-gray-600 hover:text-primary-600">
                学习
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-primary-600">
                社区
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-100">
                <Link href="/auth/login" className="text-gray-600">
                  登录
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg text-center"
                >
                  免费注册
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
