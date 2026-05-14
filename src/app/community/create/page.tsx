'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Image,
  Tag,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Send,
  Eye,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const tagSuggestions = ['日语', '英语', '韩语', '学习方法', '考试', '口语', '听力', '词汇', '语法', '经验分享']

export default function CreatePostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
    }
    setTagInput('')
    setShowTagSuggestions(false)
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return
    setPublishing(true)
    // 模拟发布
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setPublishing(false)
    router.push('/community')
  }

  const filteredSuggestions = tagSuggestions.filter(
    (tag) => tag.includes(tagInput) && !tags.includes(tag)
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回 */}
        <Link href="/community" className="text-sm text-gray-500 hover:text-primary-600 mb-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          返回社区
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">发布帖子</h1>
          <p className="text-gray-600 mt-1">与社区成员分享你的学习心得和经验</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {/* 标题 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入帖子标题..."
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
            />
            <div className="text-right text-sm text-gray-400 mt-1">{title.length}/100</div>
          </div>

          {/* 内容 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">内容</label>
            {/* 工具栏 */}
            <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-t-xl border border-b-0 border-gray-200">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <Bold className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <Italic className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <List className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <LinkIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <Image className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的学习心得、经验或问题..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-200 rounded-b-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* 标签 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              标签（最多5个）
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary-400 hover:text-primary-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => { setTagInput(e.target.value); setShowTagSuggestions(true) }}
                onFocus={() => setShowTagSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault()
                    handleAddTag(tagInput.trim())
                  }
                }}
                placeholder="输入标签后按回车..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              {showTagSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleAddTag(suggestion)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>发布后将对所有用户可见</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/community"
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </Link>
              <button
                onClick={handlePublish}
                disabled={!title.trim() || !content.trim() || publishing}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  '发布中...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    发布帖子
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
