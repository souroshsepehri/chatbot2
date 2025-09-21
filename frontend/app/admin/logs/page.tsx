'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Trash2, Eye, EyeOff } from 'lucide-react'
import { getLogs, getLogStats, deleteLog, LogFilters, ChatLog } from '@/lib/api'
import { format } from 'date-fns'
import { fa } from 'date-fns/locale'

export default function LogsPage() {
  const [logs, setLogs] = useState<ChatLog[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<LogFilters>({
    page: 1,
    page_size: 50
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        getLogs(filters),
        getLogStats()
      ])
      
      setLogs(logsResponse.items)
      setStats(statsResponse)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLog = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این لاگ را حذف کنید؟')) return
    
    try {
      await deleteLog(id)
      loadData()
    } catch (error) {
      console.error('Error deleting log:', error)
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['زمان', 'سؤال کاربر', 'پاسخ ربات', 'نیت', 'منبع', 'اطمینان', 'موفقیت', 'توکن ورودی', 'توکن خروجی', 'زمان پاسخ (ms)'],
      ...logs.map(log => [
        format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss', { locale: fa }),
        log.user_text,
        log.ai_text,
        log.intent || '',
        log.source || '',
        log.confidence ? (log.confidence * 100).toFixed(1) + '%' : '',
        log.success ? 'بله' : 'خیر',
        log.tokens_in || '',
        log.tokens_out || '',
        log.latency_ms || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `chat-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'faq':
        return 'bg-green-100 text-green-800'
      case 'rag':
        return 'bg-blue-100 text-blue-800'
      case 'llm':
        return 'bg-yellow-100 text-yellow-800'
      case 'fallback':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'faq':
        return 'bg-blue-100 text-blue-800'
      case 'smalltalk':
        return 'bg-green-100 text-green-800'
      case 'chitchat':
        return 'bg-purple-100 text-purple-800'
      case 'complaint':
        return 'bg-red-100 text-red-800'
      case 'sales':
        return 'bg-orange-100 text-orange-800'
      case 'support':
        return 'bg-indigo-100 text-indigo-800'
      case 'out_of_scope':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">گزارش گفت‌وگوها</h1>
          <p className="text-gray-600">لاگ‌های گفت‌وگو و آمار عملکرد سیستم</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900">{stats.total_logs}</div>
              <div className="text-sm text-gray-600">کل گفت‌وگوها</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-green-600">{stats.success_rate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">نرخ موفقیت</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-orange-600">{stats.unanswered_logs}</div>
              <div className="text-sm text-gray-600">سؤالات بی‌پاسخ</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.unanswered_rate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">نرخ بی‌پاسخی</div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="جستجو در گفت‌وگوها..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={20} />
              فیلترها
              {showFilters ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {/* Export */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={20} />
              خروجی CSV
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وضعیت موفقیت</label>
                  <select
                    value={filters.success === undefined ? '' : filters.success.toString()}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      success: e.target.value === '' ? undefined : e.target.value === 'true',
                      page: 1
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    <option value="true">موفق</option>
                    <option value="false">ناموفق</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نیت</label>
                  <select
                    value={filters.intent || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      intent: e.target.value || undefined,
                      page: 1
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    <option value="faq">سؤال متداول</option>
                    <option value="smalltalk">گفت‌وگوی دوستانه</option>
                    <option value="chitchat">گفت‌وگوی غیررسمی</option>
                    <option value="complaint">شکایت</option>
                    <option value="sales">فروش</option>
                    <option value="support">پشتیبانی</option>
                    <option value="out_of_scope">خارج از حوزه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">سؤالات بی‌پاسخ</label>
                  <select
                    value={filters.unanswered_only === undefined ? '' : filters.unanswered_only.toString()}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      unanswered_only: e.target.value === '' ? undefined : e.target.value === 'true',
                      page: 1
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    <option value="true">فقط بی‌پاسخ</option>
                    <option value="false">فقط پاسخ‌دار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تعداد در صفحه</label>
                  <select
                    value={filters.page_size || 50}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      page_size: parseInt(e.target.value),
                      page: 1
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    زمان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    سؤال کاربر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پاسخ ربات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    منبع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اطمینان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    موفقیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      در حال بارگذاری...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      هیچ لاگی یافت نشد
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {format(new Date(log.timestamp), 'yyyy-MM-dd', { locale: fa })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(log.timestamp), 'HH:mm:ss', { locale: fa })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {truncateText(log.user_text, 50)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {truncateText(log.ai_text, 50)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {log.intent && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIntentColor(log.intent)}`}>
                            {log.intent}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {log.source && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(log.source)}`}>
                            {log.source}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {log.confidence ? `${(log.confidence * 100).toFixed(1)}%` : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.success ? 'موفق' : 'ناموفق'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
