'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Mic,
  MicOff,
  RotateCcw,
  Play,
  ChevronRight,
  Volume2,
  Star,
  MessageCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// 模拟跟读材料
const speakingMaterials = [
  {
    id: 1,
    title: '日常问候',
    level: 'A1',
    sentences: [
      { id: 1, text: 'Good morning! How are you doing today?', chinese: '早上好！你今天怎么样？', difficulty: 'easy' },
      { id: 2, text: 'Nice to meet you. My name is Sarah.', chinese: '很高兴认识你。我叫 Sarah。', difficulty: 'easy' },
      { id: 3, text: 'Could you please tell me where the nearest subway station is?', chinese: '请问最近的地铁站在哪里？', difficulty: 'medium' },
      { id: 4, text: 'I have been studying English for about three years.', chinese: '我学英语大约三年了。', difficulty: 'medium' },
    ],
  },
  {
    id: 2,
    title: '餐厅点餐',
    level: 'A2',
    sentences: [
      { id: 1, text: 'I would like to order a steak with a side salad, please.', chinese: '我想点一份牛排配沙拉。', difficulty: 'medium' },
      { id: 2, text: 'Could I see the menu, please?', chinese: '请给我看一下菜单好吗？', difficulty: 'easy' },
      { id: 3, text: 'Is there anything vegetarian on the menu?', chinese: '菜单上有素食吗？', difficulty: 'medium' },
      { id: 4, text: 'The food was absolutely delicious. I would highly recommend this restaurant.', chinese: '食物非常美味。我强烈推荐这家餐厅。', difficulty: 'hard' },
    ],
  },
]

export default function SpeakingPage() {
  const [currentMaterialIndex, setCurrentMaterialIndex] = useState(0)
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [showChinese, setShowChinese] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [scores, setScores] = useState<Record<number, { pronunciation: number; fluency: number; overall: number }>>({})

  const material = speakingMaterials[currentMaterialIndex]
  const sentence = material.sentences[currentSentenceIndex]
  const score = scores[sentence.id]

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }, [])

  const handlePlayStandard = useCallback(() => {
    speak(sentence.text)
  }, [speak, sentence.text])

  // 切换句子时停止播放
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [currentSentenceIndex, currentMaterialIndex])

  // 组件卸载时停止语音
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleStartRecording = () => {
    setIsRecording(true)
    setHasRecorded(false)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setHasRecorded(true)
    // 模拟评分
    setScores((prev) => ({
      ...prev,
      [sentence.id]: {
        pronunciation: Math.floor(Math.random() * 30) + 70,
        fluency: Math.floor(Math.random() * 30) + 65,
        overall: Math.floor(Math.random() * 25) + 75,
      },
    }))
  }

  const handleNextSentence = () => {
    if (currentSentenceIndex < material.sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1)
      setHasRecorded(false)
      setShowChinese(false)
      setIsRecording(false)
    }
  }

  const handlePrevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex((prev) => prev - 1)
      setHasRecorded(false)
      setShowChinese(false)
      setIsRecording(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 75) return 'text-blue-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀'
    if (score >= 75) return '良好'
    if (score >= 60) return '及格'
    return '需要练习'
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
          <h1 className="text-3xl font-bold text-gray-900">口语跟读</h1>
          <p className="text-gray-600 mt-1">AI 语音评测，纠正发音，提升口语流利度</p>
        </div>

        {/* 材料选择 */}
        <div className="flex gap-3 mb-6">
          {speakingMaterials.map((m, index) => (
            <button
              key={m.id}
              onClick={() => {
                setCurrentMaterialIndex(index)
                setCurrentSentenceIndex(0)
                setHasRecorded(false)
                setShowChinese(false)
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

        {/* 句子进度 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">句子进度</span>
            <span className="text-sm font-medium text-gray-900">
              {currentSentenceIndex + 1} / {material.sentences.length}
            </span>
          </div>
          <div className="flex gap-2">
            {material.sentences.map((s, index) => (
              <button
                key={s.id}
                onClick={() => { setCurrentSentenceIndex(index); setHasRecorded(false); setShowChinese(false) }}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index === currentSentenceIndex
                    ? 'bg-primary-500'
                    : scores[s.id]
                      ? 'bg-green-400'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 跟读卡片 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          {/* 难度标签 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              {material.level}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              sentence.difficulty === 'easy' ? 'bg-blue-100 text-blue-700' :
              sentence.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {sentence.difficulty === 'easy' ? '简单' : sentence.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>

          {/* 英文句子 */}
          <div className="text-center mb-6">
            <p className="text-2xl font-semibold text-gray-900 leading-relaxed">{sentence.text}</p>
          </div>

          {/* 中文翻译 */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowChinese(!showChinese)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showChinese ? sentence.chinese : '点击查看中文翻译'}
            </button>
          </div>

          {/* 播放原音按钮 */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handlePlayStandard}
              disabled={isSpeaking}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                isSpeaking
                  ? 'bg-blue-100 text-blue-400 cursor-wait'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {isSpeaking ? '正在播放...' : '播放标准发音'}
            </button>
          </div>

          {/* 录音按钮 */}
          <div className="flex flex-col items-center">
            {!hasRecorded ? (
              <>
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 animate-pulse'
                      : 'bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-200'
                  }`}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>
                <p className="mt-4 text-gray-600">
                  {isRecording ? '正在录音，点击停止...' : '点击开始录音'}
                </p>
              </>
            ) : (
              <>
                {/* 评分结果 */}
                <div className="w-full max-w-md">
                  <div className="text-center mb-6">
                    <div className={`text-5xl font-bold ${getScoreColor(score?.overall || 0)}`}>
                      {score?.overall || 0}
                    </div>
                    <p className={`text-sm mt-1 ${getScoreColor(score?.overall || 0)}`}>
                      {getScoreLabel(score?.overall || 0)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">发音准确度</div>
                      <div className={`text-2xl font-bold ${getScoreColor(score?.pronunciation || 0)}`}>
                        {score?.pronunciation || 0}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">流利度</div>
                      <div className={`text-2xl font-bold ${getScoreColor(score?.fluency || 0)}`}>
                        {score?.fluency || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => { setHasRecorded(false); setScores((prev) => { const next = { ...prev }; delete next[sentence.id]; return next }) }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      重新录音
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevSentence}
            disabled={currentSentenceIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一句
          </button>
          <button
            onClick={handleNextSentence}
            disabled={currentSentenceIndex >= material.sentences.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一句
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
