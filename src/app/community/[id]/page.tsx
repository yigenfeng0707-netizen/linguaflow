'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Bookmark,
  Send,
  ThumbsUp,
  Flag,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// HTML 转义函数，防止 XSS 攻击
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 模拟帖子详情数据
const postsDetail: Record<string, {
  id: string
  author: { name: string; avatar: null; joinDate: string; posts: number }
  title: string
  content: string
  tags: string[]
  likes: number
  created_at: string
  comments: { id: string; author: string; content: string; time: string; likes: number }[]
}> = {
  '1': {
    id: '1',
    author: { name: '语言爱好者', avatar: null, joinDate: '2024年3月', posts: 42 },
    title: '分享我的日语学习心得',
    content: `学习日语已经三个月了，从五十音图开始，现在已经能看懂简单的动漫了。分享一下我的学习方法：

1. **每天坚持背单词**：使用间隔重复法，每天新学20个单词，复习50个旧单词。推荐使用Anki或者LinguaFlow的单词记忆功能。

2. **看日剧练习听力**：从简单的日常剧开始，先看中文字幕，再切换日文字幕，最后尝试无字幕。推荐《孤独的美食家》和《非自然死亡》。

3. **找语言伙伴**：在HelloTalk上找日本朋友聊天，每周至少进行3次30分钟的对话练习。

4. **语法学习**：使用《大家的日语》教材，配合LinguaFlow的语法练习功能，每天做一套语法题。

5. **写作练习**：每周写一篇日语日记，用日语记录日常生活。

希望这些方法对大家有帮助！加油！`,
    tags: ['日语', '学习方法'],
    likes: 128,
    created_at: '2小时前',
    comments: [
      { id: 'c1', author: '日语初学者', content: '感谢分享！正好最近开始学日语，这些方法很有参考价值。请问五十音图大概需要多久能记住？', time: '1小时前', likes: 12 },
      { id: 'c2', author: '动漫迷', content: '看动漫学日语确实有效！我也是通过看番剧学会了很多日常用语，推荐《白熊咖啡厅》，语速慢适合初学者。', time: '45分钟前', likes: 8 },
      { id: 'c3', author: '学习达人', content: '间隔重复法真的很好用，我背单词的效率提高了很多。另外推荐一个网站NHK NEWS WEB EASY，适合日语初学者阅读。', time: '30分钟前', likes: 15 },
    ],
  },
}

export default function CommunityPostPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [newComments, setNewComments] = useState<string[]>([])

  // 验证 ID 是否有效，无效时不回退到默认数据
  const post = postsDetail[id]

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      setNewComments((prev) => [...prev, commentText.trim()])
      setCommentText('')
    }
  }

  // 如果帖子不存在，显示未找到页面
  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/community" className="text-sm text-gray-500 hover:text-primary-600 mb-4 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            返回社区
          </Link>
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">帖子未找到</h1>
            <p className="text-gray-600 mb-6">该帖子不存在或已被删除</p>
            <Link
              href="/community"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors"
            >
              返回社区
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回 */}
        <Link href="/community" className="text-sm text-gray-500 hover:text-primary-600 mb-4 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          返回社区
        </Link>

        {/* 帖子内容 */}
        <article className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
          {/* 作者信息 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-semibold">
              {post.author?.name?.charAt(0) || '?'}
            </div>
            <div>
              <div className="font-medium text-gray-900">{post.author?.name || '未知用户'}</div>
              <div className="text-sm text-gray-500">
                {post.author?.joinDate || ''} 加入 · {post.author?.posts || 0} 篇帖子
              </div>
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* 标签 */}
          <div className="flex gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* 内容 */}
          <div className="prose prose-slate max-w-none mb-6">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return <br key={index} />
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-3">
                  {paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      // 对粗体内容也进行 HTML 转义
                      return <strong key={i} className="font-semibold text-gray-900">{escapeHtml(part.slice(2, -2))}</strong>
                    }
                    // 对普通文本进行 HTML 转义，防止 XSS
                    return escapeHtml(part)
                  })}
                </p>
              )
            })}
          </div>

          {/* 元信息 */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Clock className="w-4 h-4" />
            <span>发布于 {post.created_at}</span>
          </div>

          {/* 操作栏 */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                liked ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
              <span>{post.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length + newComments.length}</span>
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                bookmarked ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-amber-500' : ''}`} />
              <span>{bookmarked ? '已收藏' : '收藏'}</span>
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href)
                  toast.success('链接已复制到剪贴板')
                } catch (err) {
                  toast.error('复制链接失败，请手动复制')
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors ml-auto"
            >
              <Share2 className="w-5 h-5" />
              <span>分享</span>
            </button>
          </div>
        </article>

        {/* 评论区 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            评论 ({post.comments.length + newComments.length})
          </h2>

          {/* 发表评论 */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                我
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                />
                <div className="text-right text-sm text-gray-400 mt-1">{commentText.length}/1000</div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    发表评论
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 评论列表 */}
          <div className="space-y-4">
            {newComments.map((comment, idx) => (
              <div key={`new-${idx}`} className="flex gap-3 p-4 bg-primary-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  我
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">我</span>
                    <span className="text-sm text-gray-400">刚刚</span>
                  </div>
                  <p className="text-gray-700">{comment}</p>
                </div>
              </div>
            ))}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {comment.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-400">{comment.time}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-primary-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                      <Flag className="w-4 h-4" />
                      举报
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
