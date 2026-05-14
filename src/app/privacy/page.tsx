import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
        <p className="text-gray-500 mb-8">最后更新日期：2026年5月14日</p>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 信息收集</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              我们收集以下类型的信息以提供和改进我们的服务：
            </p>
            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li><strong>账户信息</strong>：注册时提供的姓名、邮箱地址和密码。</li>
              <li><strong>学习数据</strong>：您的学习进度、练习成绩、学习时长和偏好设置。</li>
              <li><strong>使用数据</strong>：您使用本平台的方式、频率和功能偏好。</li>
              <li><strong>设备信息</strong>：设备类型、操作系统、浏览器类型和IP地址。</li>
              <li><strong>社区内容</strong>：您在社区中发布的帖子和评论。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 信息使用</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              我们使用收集的信息用于以下目的：
            </p>
            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li>提供、维护和改进我们的语言学习服务</li>
              <li>个性化您的学习体验和推荐内容</li>
              <li>跟踪学习进度和生成学习报告</li>
              <li>发送服务通知和学习提醒</li>
              <li>分析和改善平台性能</li>
              <li>防止欺诈和确保平台安全</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 信息保护</h2>
            <p className="text-gray-700 leading-relaxed">
              我们采用行业标准的安全措施来保护您的个人信息，包括数据加密、安全存储和访问控制。我们会定期审查和更新我们的安全措施，以应对新的安全威胁。但请注意，互联网传输不能保证100%的安全。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. 信息共享</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              我们不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：
            </p>
            <ul className="text-gray-700 space-y-2 list-disc list-inside">
              <li><strong>服务提供商</strong>：与帮助我们运营平台的受信任第三方共享。</li>
              <li><strong>法律要求</strong>：在法律要求或法律程序需要时。</li>
              <li><strong>用户同意</strong>：在获得您明确同意的情况下。</li>
              <li><strong>社区功能</strong>：您在社区中公开分享的信息对其他用户可见。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookie 使用</h2>
            <p className="text-gray-700 leading-relaxed">
              我们使用 Cookie 和类似技术来改善您的使用体验。Cookie 帮助我们记住您的登录状态、偏好设置和学习进度。您可以通过浏览器设置管理 Cookie，但禁用 Cookie 可能会影响某些功能的正常使用。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 数据存储</h2>
            <p className="text-gray-700 leading-relaxed">
              您的数据存储在安全的服务器上。根据适用法律，您有权访问、更正、删除或导出您的个人数据。如需行使这些权利，请联系我们的数据保护团队。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. 儿童隐私</h2>
            <p className="text-gray-700 leading-relaxed">
              本平台不面向13岁以下的儿童。我们不会有意收集13岁以下儿童的个人信息。如果我们发现无意中收集了此类信息，将立即删除。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. 政策更新</h2>
            <p className="text-gray-700 leading-relaxed">
              我们可能会不时更新本隐私政策。更新后的政策将在本页面上发布，并更新"最后更新日期"。重大变更将通过邮件或平台通知的方式告知用户。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. 联系我们</h2>
            <p className="text-gray-700 leading-relaxed">
              如对本隐私政策有任何疑问或建议，请通过以下方式联系我们的数据保护团队：
            </p>
            <ul className="text-gray-700 mt-2 space-y-1 list-disc list-inside">
              <li>邮箱：privacy@linguaflow.com</li>
              <li>电话：400-888-9999</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
