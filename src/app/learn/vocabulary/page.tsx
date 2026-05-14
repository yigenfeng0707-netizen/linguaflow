'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Brain,
  Shuffle,
  Star,
  Check,
  X,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟单词数据
const vocabularyData = [
  { id: 1, word: 'ephemeral', phonetic: '/ɪˈfemərəl/', meaning: '短暂的，转瞬即逝的', example: 'The beauty of cherry blossoms is ephemeral.', mastered: false },
  { id: 2, word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', meaning: '无处不在的', example: 'Smartphones have become ubiquitous in modern life.', mastered: false },
  { id: 3, word: 'serendipity', phonetic: '/ˌserənˈdɪpəti/', meaning: '意外发现美好事物的运气', example: 'Finding this cafe was pure serendipity.', mastered: false },
  { id: 4, word: 'resilient', phonetic: '/rɪˈzɪliənt/', meaning: '有弹性的，能迅速恢复的', example: 'Children are remarkably resilient.', mastered: false },
  { id: 5, word: 'eloquent', phonetic: '/ˈeləkwənt/', meaning: '雄辩的，有口才的', example: 'She gave an eloquent speech at the ceremony.', mastered: false },
  { id: 6, word: 'meticulous', phonetic: '/məˈtɪkjələs/', meaning: '一丝不苟的，细致的', example: 'He is meticulous about his work.', mastered: false },
]

type Mode = 'card' | 'quiz' | 'spelling'

export default function VocabularyPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState<Mode>('card')
  const [masteredWords, setMasteredWords] = useState<Set<number>>(new Set())
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null)
  const [spellingInput, setSpellingInput] = useState('')
  const [spellingResult, setSpellingResult] = useState<boolean | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const currentWord = vocabularyData[currentIndex]

  const speakWord = useCallback((word: string) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }, [])

  // 切换单词时停止播放
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [currentIndex])

  // 组件卸载时停止语音
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleNext = () => {
    setFlipped(false)
    setQuizAnswer(null)
    setSpellingInput('')
    setSpellingResult(null)
    setCurrentIndex((prev) => (prev + 1) % vocabularyData.length)
  }

  const handlePrev = () => {
    setFlipped(false)
    setQuizAnswer(null)
    setSpellingInput('')
    setSpellingResult(null)
    setCurrentIndex((prev) => (prev - 1 + vocabularyData.length) % vocabularyData.length)
  }

  const toggleMastered = (id: number) => {
    setMasteredWords((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSpellingCheck = () => {
    setSpellingResult(spellingInput.toLowerCase().trim() === currentWord.word.toLowerCase())
  }

  // 生成选择题选项
  const quizOptions = useMemo(() => {
    const correct = currentWord.meaning
    const others = vocabularyData
      .filter((w) => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.meaning)
    return [...others, correct].sort(() => Math.random() - 0.5)
  }, [currentWord.id])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/learn" className="text-sm text-gray-500 hover:text-primary-600 mb-2 inline-block">
              &larr; 返回学习中心
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">单词记忆</h1>
            <p className="text-gray-600 mt-1">已掌握 {masteredWords.size}/{vocabularyData.length} 个单词</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('card')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'card' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              卡片模式
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'quiz' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              选择题模式
            </button>
            <button
              onClick={() => setMode('spelling')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === 'spelling' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              拼写模式
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">学习进度</span>
            <span className="text-sm font-medium text-gray-900">{currentIndex + 1} / {vocabularyData.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / vocabularyData.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 卡片模式 */}
        {mode === 'card' && (
          <div className="space-y-6">
            <div
              className="bg-white rounded-2xl shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md min-h-[320px] flex flex-col items-center justify-center p-8"
              onClick={() => setFlipped(!flipped)}
            >
              {!flipped ? (
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-4">{currentWord.word}</div>
                  <div className="text-lg text-gray-500 mb-6">{currentWord.phonetic}</div>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); speakWord(currentWord.word) }}
                      disabled={isSpeaking}
                      className={`p-3 rounded-full transition-colors ${
                        isSpeaking
                          ? 'bg-blue-100 cursor-wait'
                          : 'bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-blue-400 animate-pulse' : 'text-blue-500'}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMastered(currentWord.id) }}
                      className={`p-3 rounded-full transition-colors ${
                        masteredWords.has(currentWord.id) ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${masteredWords.has(currentWord.id) ? 'fill-green-500' : ''}`} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mt-6">点击卡片查看释义</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900 mb-4">{currentWord.meaning}</div>
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-600 italic">&quot;{currentWord.example}&quot;</p>
                  </div>
                  <p className="text-sm text-gray-400 mt-4">点击卡片翻回正面</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 选择题模式 */}
        {mode === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="text-3xl font-bold text-gray-900 mb-2">{currentWord.word}</div>
              <div className="text-gray-500">{currentWord.phonetic}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
              {quizOptions.map((option, index) => {
                const isCorrect = option === currentWord.meaning
                const isSelected = quizAnswer === option
                return (
                  <button
                    key={index}
                    onClick={() => setQuizAnswer(option)}
                    disabled={quizAnswer !== null}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      quizAnswer === null
                        ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                        : isCorrect
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : isSelected
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{option}</span>
                      {quizAnswer !== null && isCorrect && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                      {quizAnswer !== null && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500 ml-auto" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 拼写模式 */}
        {mode === 'spelling' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="mb-8">
              <div className="text-xl font-semibold text-gray-900 mb-2">请拼写以下单词</div>
              <div className="text-lg text-gray-500">{currentWord.meaning}</div>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={spellingInput}
                onChange={(e) => { setSpellingInput(e.target.value); setSpellingResult(null) }}
                onKeyDown={(e) => e.key === 'Enter' && handleSpellingCheck()}
                placeholder="输入单词拼写..."
                className="w-full px-6 py-4 text-center text-xl border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSpellingCheck}
                className="mt-4 px-8 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
              >
                检查拼写
              </button>
              {spellingResult !== null && (
                <div className={`mt-4 p-4 rounded-xl ${spellingResult ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {spellingResult ? '拼写正确！' : `正确拼写是：${currentWord.word}`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 导航按钮 */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
            上一个
          </button>
          <button
            onClick={() => setCurrentIndex(Math.floor(Math.random() * vocabularyData.length))}
            className="p-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
          >
            下一个
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
