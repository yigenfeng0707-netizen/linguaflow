'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Target,
  Check,
  X,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Lightbulb,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟语法题目
const grammarQuestions = [
  {
    id: 1,
    title: '现在完成时',
    question: 'She ___ to Paris three times.',
    options: ['has been', 'have been', 'was', 'had been'],
    correct: 0,
    explanation: '主语 She 是第三人称单数，所以使用 has been。现在完成时表示从过去到现在为止的经历。',
  },
  {
    id: 2,
    title: '虚拟语气',
    question: 'If I ___ you, I would accept the offer.',
    options: ['am', 'was', 'were', 'be'],
    correct: 2,
    explanation: '在虚拟语气中，if 从句的 be 动词统一使用 were，无论主语人称。',
  },
  {
    id: 3,
    title: '定语从句',
    question: 'The man ___ is standing there is my teacher.',
    options: ['which', 'who', 'whom', 'whose'],
    correct: 1,
    explanation: '先行词是 The man（人），在从句中作主语，所以使用 who。',
  },
  {
    id: 4,
    title: '被动语态',
    question: 'The book ___ by millions of people worldwide.',
    options: ['reads', 'is read', 'was reading', 'has reading'],
    correct: 1,
    explanation: '书是被阅读的，所以使用被动语态 is read。一般现在时的被动语态结构是 am/is/are + 过去分词。',
  },
  {
    id: 5,
    title: '情态动词',
    question: 'You ___ smoke in the hospital. It is not allowed.',
    options: ['mustn\'t', 'needn\'t', 'shouldn\'t', 'couldn\'t'],
    correct: 0,
    explanation: 'mustn\'t 表示禁止，语气最强。needn\'t 表示不需要，shouldn\'t 表示不应该，couldn\'t 表示不能。',
  },
]

export default function GrammarPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = grammarQuestions[currentIndex]

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setShowExplanation(true)
    setAnsweredCount((prev) => prev + 1)
    if (index === currentQuestion.correct) {
      setCorrectCount((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < grammarQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCorrectCount(0)
    setAnsweredCount(0)
    setCompleted(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <Link href="/learn" className="text-sm text-gray-500 hover:text-primary-600 mb-2 inline-block">
            &larr; 返回学习中心
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">语法练习</h1>
          <p className="text-gray-600 mt-1">系统化语法训练，巩固语言基础</p>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-primary-600">{answeredCount}</div>
            <div className="text-sm text-gray-500">已答题数</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{correctCount}</div>
            <div className="text-sm text-gray-500">正确数量</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-amber-600">
              {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">正确率</div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">题目进度</span>
            <span className="text-sm font-medium text-gray-900">
              {completed ? grammarQuestions.length : currentIndex + 1} / {grammarQuestions.length}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${((completed ? grammarQuestions.length : currentIndex + 1) / grammarQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 完成页面 */}
        {completed ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">练习完成！</h2>
            <p className="text-gray-600 mb-6">
              你答对了 {correctCount}/{grammarQuestions.length} 题，正确率{' '}
              {Math.round((correctCount / grammarQuestions.length) * 100)}%
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                重新练习
              </button>
              <Link
                href="/learn"
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                返回学习中心
              </Link>
            </div>
          </div>
        ) : (
          /* 题目卡片 */
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* 题目标签 */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                {currentQuestion.title}
              </span>
              <span className="text-sm text-gray-400">第 {currentIndex + 1} 题</span>
            </div>

            {/* 题目 */}
            <h2 className="text-xl font-semibold text-gray-900 mb-8">{currentQuestion.question}</h2>

            {/* 选项 */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correct
                const isSelected = selectedAnswer === index
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
                      selectedAnswer === null
                        ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                        : isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isSelected
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      selectedAnswer === null
                        ? 'bg-gray-100 text-gray-600'
                        : isCorrect
                          ? 'bg-green-500 text-white'
                          : isSelected
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                    {selectedAnswer !== null && isCorrect && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                    {selectedAnswer !== null && isSelected && !isCorrect && <X className="w-5 h-5 text-red-500 ml-auto" />}
                  </button>
                )
              })}
            </div>

            {/* 解析 */}
            {showExplanation && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-amber-800">解析</span>
                </div>
                <p className="text-amber-700">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* 下一题按钮 */}
            {selectedAnswer !== null && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                >
                  {currentIndex < grammarQuestions.length - 1 ? '下一题' : '查看结果'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
