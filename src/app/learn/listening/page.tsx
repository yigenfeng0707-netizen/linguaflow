'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  RotateCcw,
  Headphones,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟听力材料
const listeningMaterials = [
  {
    id: 1,
    title: '日常对话：在咖啡店',
    level: 'A2',
    duration: '2:30',
    transcript: 'A: Hi, can I have a cappuccino, please?\nB: Sure, what size would you like?\nA: A medium, please. And can I also have a chocolate muffin?\nB: Of course. That will be $8.50.\nA: Here you go.\nB: Thank you! Your order will be ready in a moment.',
    questions: [
      {
        question: 'What drink did the person order?',
        options: ['Latte', 'Cappuccino', 'Espresso', 'Americano'],
        correct: 1,
      },
      {
        question: 'What size did they want?',
        options: ['Small', 'Medium', 'Large', 'Extra large'],
        correct: 1,
      },
      {
        question: 'How much was the total?',
        options: ['$6.50', '$7.50', '$8.50', '$9.50'],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    title: '旅行对话：问路',
    level: 'B1',
    duration: '3:15',
    transcript: 'A: Excuse me, could you tell me how to get to the train station?\nB: Sure! Go straight down this road for about 500 meters, then turn left at the traffic light.\nA: Turn left at the traffic light, got it.\nB: Then walk for another 200 meters and you will see the station on your right.\nA: Thank you so much!\nB: You are welcome. Have a safe trip!',
    questions: [
      {
        question: 'Where does the person want to go?',
        options: ['Airport', 'Bus station', 'Train station', 'Subway station'],
        correct: 2,
      },
      {
        question: 'How far should they go straight?',
        options: ['200 meters', '300 meters', '500 meters', '1 kilometer'],
        correct: 2,
      },
    ],
  },
]

export default function ListeningPage() {
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set())
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const material = listeningMaterials[currentMaterialIndex]
  const currentQuestion = material.questions[currentQuestionIndex]

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
  }, [])

  const speak = useCallback((text: string, rate: number = 1) => {
    if (!('speechSynthesis' in window)) return

    // 停止之前的语音
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = rate
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    utteranceRef.current = utterance

    setIsPlaying(true)
    window.speechSynthesis.speak(utterance)
  }, [])

  // 切换播放/暂停
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopSpeaking()
    } else {
      speak(material.transcript, playbackSpeed)
    }
  }, [isPlaying, stopSpeaking, speak, material.transcript, playbackSpeed])

  // 语速变化时，如果正在播放则重新开始
  useEffect(() => {
    if (isPlaying) {
      speak(material.transcript, playbackSpeed)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackSpeed])

  // 切换材料时停止播放
  useEffect(() => {
    stopSpeaking()
  }, [currentMaterialIndex, stopSpeaking])

  // 组件卸载时停止语音
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(index)
    setCompletedQuestions((prev) => new Set(prev).add(currentQuestionIndex))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < material.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      setSelectedAnswer(null)
    }
  }

  const handleNextMaterial = () => {
    if (currentMaterialIndex < listeningMaterials.length - 1) {
      setCurrentMaterialIndex((prev) => prev + 1)
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setCompletedQuestions(new Set())
      setShowTranscript(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">听力训练</h1>
          <p className="text-gray-600 mt-1">真实场景对话，提升听力理解能力</p>
        </div>

        {/* 材料选择 */}
        <div className="flex gap-3 mb-6">
          {listeningMaterials.map((m, index) => (
            <button
              key={m.id}
              onClick={() => {
                stopSpeaking()
                setCurrentMaterialIndex(index)
                setCurrentQuestionIndex(0)
                setSelectedAnswer(null)
                setCompletedQuestions(new Set())
                setShowTranscript(false)
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentMaterialIndex === index
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>

        {/* 音频播放器 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{material.title}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {material.level}
                </span>
                <span className="text-sm text-gray-500">{material.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">语速：</span>
              {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* 播放控制 */}
          <div className="bg-slate-50 rounded-xl p-4">
            {/* 播放状态指示 */}
            <div className="h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isPlaying ? 'bg-primary-500 w-full' : 'bg-gray-300 w-0'} ${isPlaying ? 'animate-pulse' : ''}`}
                style={isPlaying ? {
                  width: '100%',
                  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)',
                  backgroundSize: '1rem 1rem',
                  animation: 'progress-bar-stripes 1s linear infinite',
                } : { width: '0%' }}
              />
              <style jsx>{`
                @keyframes progress-bar-stripes {
                  0% { background-position: 1rem 0; }
                  100% { background-position: 0 0; }
                }
              `}</style>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{isPlaying ? '播放中...' : '就绪'}</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    stopSpeaking()
                    setCurrentMaterialIndex((prev) => Math.max(0, prev - 1))
                  }}
                  disabled={currentMaterialIndex === 0}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <button
                  onClick={handleNextMaterial}
                  disabled={currentMaterialIndex >= listeningMaterials.length - 1}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <span className="text-sm text-gray-500">{material.duration}</span>
            </div>
          </div>

          {/* 显示/隐藏原文 */}
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="mt-4 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            {showTranscript ? '隐藏原文' : '显示原文'}
          </button>

          {showTranscript && (
            <div className="mt-3 bg-slate-50 rounded-xl p-4">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{material.transcript}</p>
            </div>
          )}
        </div>

        {/* 听力理解题 */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">听力理解</h3>
            <span className="text-sm text-gray-500">
              第 {currentQuestionIndex + 1}/{material.questions.length} 题
            </span>
          </div>

          <h4 className="text-base font-medium text-gray-800 mb-4">{currentQuestion.question}</h4>

          <div className="space-y-3">
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
                  {selectedAnswer !== null && isCorrect && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                  {selectedAnswer !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                </button>
              )
            })}
          </div>

          {/* 题目导航 */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一题
            </button>
            {currentQuestionIndex < material.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一题
              </button>
            ) : (
              <button
                onClick={handleNextMaterial}
                disabled={currentMaterialIndex >= listeningMaterials.length - 1}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一篇材料
              </button>
            )}
          </div>
        </div>

        {/* 学习提示 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-start gap-3">
            <Headphones className="w-6 h-6 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-1">听力训练小贴士</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>- 第一遍先不看原文，尝试理解大意</li>
                <li>- 遇到不懂的地方可以调慢语速反复听</li>
                <li>- 听完后对照原文，标记生词和表达</li>
                <li>- 尝试跟读模仿，提升听力和口语</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
