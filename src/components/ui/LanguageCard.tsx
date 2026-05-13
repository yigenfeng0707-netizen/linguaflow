import Link from 'next/link'

interface LanguageCardProps {
  language: {
    code: string
    name: string
    flag: string
    learners: string
  }
}

export function LanguageCard({ language }: LanguageCardProps) {
  return (
    <Link
      href={`/courses?language=${language.code}`}
      className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 text-center"
    >
      <div className="text-4xl mb-2">{language.flag}</div>
      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
        {language.name}
      </h3>
      <p className="text-sm text-gray-500 mt-1">{language.learners}学习者</p>
    </Link>
  )
}
