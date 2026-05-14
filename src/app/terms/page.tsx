import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
        <p className="text-gray-500 mb-8">最后更新日期：2026年5月14日</p>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 服务概述</h2>
            <p className="text-gray-700 leading-relaxed">
              欢迎使用 LinguaFlow（以下简称"本平台"）。LinguaFlow 是一个在线语言学习平台，提供包括但不限于英语、日语、韩语等多种语言的学习课程、练习工具和社区交流服务。通过注册和使用本平台，您同意遵守以下服务条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 用户注册与账户</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              2.1 您需要提供真实、准确、完整的个人信息来完成注册。
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              2.2 您有责任保管好您的账户和密码安全，对账户下的所有活动承担全部责任。
            </p>
            <p className="text-gray-700 leading-relaxed">
              2.3 如发现未经授权使用您账户的情况，请立即通知我们。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 使用规范</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              3.1 您同意不会利用本平台从事任何违法或违规活动，包括但不限于发布违法信息、侵犯他人知识产权、传播恶意软件等。
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              3.2 您在社区中发布的内容应遵守社区准则，尊重其他用户，不发布歧视性、侮辱性或骚扰性内容。
            </p>
            <p className="text-gray-700 leading-relaxed">
              3.3 您不得以任何方式对本平台进行反向工程、反编译或其他试图获取源代码的行为。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. 知识产权</h2>
            <p className="text-gray-700 leading-relaxed">
              本平台上的所有内容，包括但不限于课程内容、软件代码、设计、标志、图片和文本，均受知识产权法保护。未经我们事先书面同意，您不得复制、修改、分发或以其他方式使用本平台的任何内容。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. 付费服务</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              5.1 本平台提供免费和付费两种服务。付费服务的价格和条款以购买页面显示为准。
            </p>
            <p className="text-gray-700 leading-relaxed">
              5.2 付费服务一经购买，除法律另有规定外，一般不予退款。如需退款，请联系我们的客服团队。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 免责声明</h2>
            <p className="text-gray-700 leading-relaxed">
              本平台按"现状"提供服务，不作任何明示或暗示的保证。我们不对学习效果做出任何承诺。本平台不对因使用或无法使用本平台而导致的任何直接、间接、附带或后果性损害承担责任。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. 条款修改</h2>
            <p className="text-gray-700 leading-relaxed">
              我们保留随时修改本服务条款的权利。修改后的条款将在本页面上发布，并更新"最后更新日期"。继续使用本平台即表示您同意修改后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. 联系方式</h2>
            <p className="text-gray-700 leading-relaxed">
              如对本服务条款有任何疑问，请通过以下方式联系我们：
            </p>
            <ul className="text-gray-700 mt-2 space-y-1 list-disc list-inside">
              <li>邮箱：support@linguaflow.com</li>
              <li>电话：400-888-9999</li>
              <li>地址：中国上海市浦东新区</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
