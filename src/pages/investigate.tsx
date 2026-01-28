'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCaseStore } from '@/hooks/use-case-store'
import { getDataLayer } from '@/lib/data'
import {
  startInvestigation,
  getInvestigationProgress,
  getInvestigationResults,
  cancelInvestigation,
} from '@/lib/tauri/commands'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Search,
  FileText,
  AlertTriangle,
  Clock,
  Users,
  Scale,
  Play,
  StopCircle,
  ChevronDown,
  ChevronUp,
  Download,
  BarChart3,
  Activity,
  Target,
  Shield,
  Eye,
  Zap,
  Layers,
  GitBranch,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Award,
  Grid3x3,
} from 'lucide-react'
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  LineChart,
  Line,
  Treemap,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'
import type {
  Document,
  InvestigationMode,
  InvestigationProgress,
  InvestigationResults,
  Finding,
  EngineSelection,
  Severity,
} from '@/CONTRACT'

// Color palette matching the app theme
const COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
  info: '#6b7280',
  bronze: '#b8860b',
  charcoal: {
    100: '#f5f5f5',
    300: '#a3a3a3',
    400: '#737373',
    500: '#525252',
    600: '#404040',
    700: '#262626',
  }
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: COLORS.critical,
  high: COLORS.high,
  medium: COLORS.medium,
  low: COLORS.low,
  info: COLORS.info,
}

// Category configuration
const CATEGORIES: Record<string, { label: string; icon: React.ReactNode; color: string; shortLabel: string }> = {
  contradiction: { label: 'Contradictions', shortLabel: 'K', icon: <AlertTriangle className="h-4 w-4" />, color: COLORS.critical },
  omission: { label: 'Omissions', shortLabel: 'O', icon: <Eye className="h-4 w-4" />, color: COLORS.high },
  temporal_parser: { label: 'Timeline Anomalies', shortLabel: 'T', icon: <Clock className="h-4 w-4" />, color: COLORS.bronze },
  entity_resolution: { label: 'Entity Issues', shortLabel: 'E', icon: <Users className="h-4 w-4" />, color: COLORS.charcoal[300] },
  bias_detection: { label: 'Bias Indicators', shortLabel: 'B', icon: <Scale className="h-4 w-4" />, color: COLORS.medium },
  professional_tracker: { label: 'Professional Conduct', shortLabel: 'Π', icon: <Shield className="h-4 w-4" />, color: COLORS.high },
  expert_witness: { label: 'Expert Witness', shortLabel: 'Ξ', icon: <Target className="h-4 w-4" />, color: COLORS.bronze },
  accountability: { label: 'Accountability', shortLabel: 'Λ', icon: <Scale className="h-4 w-4" />, color: COLORS.critical },
  narrative: { label: 'Narrative Mutations', shortLabel: 'M', icon: <GitBranch className="h-4 w-4" />, color: COLORS.charcoal[400] },
  documentary: { label: 'Documentary', shortLabel: 'Δ', icon: <FileText className="h-4 w-4" />, color: COLORS.charcoal[500] },
}

// Metric card component
function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'bronze',
  onClick,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'bronze' | 'critical' | 'high' | 'medium' | 'low' | 'success'
  onClick?: () => void
}) {
  const colorClasses = {
    bronze: 'text-bronze-400 bg-bronze-900/20 border-bronze-500/30',
    critical: 'text-status-critical bg-status-critical/10 border-status-critical/30',
    high: 'text-status-high bg-status-high/10 border-status-high/30',
    medium: 'text-status-medium bg-status-medium/10 border-status-medium/30',
    low: 'text-status-low bg-status-low/10 border-status-low/30',
    success: 'text-status-success bg-status-success/10 border-status-success/30',
  }

  return (
    <Card
      className={`p-4 border ${colorClasses[color]} ${onClick ? 'cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-charcoal-400">{title}</p>
          <p className="mt-1 font-display text-3xl text-charcoal-100">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-charcoal-400">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2 ${colorClasses[color].split(' ')[1]}`}>
          {icon}
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend === 'up' && <ArrowUpRight className="h-3 w-3 text-status-critical" />}
          {trend === 'down' && <ArrowDownRight className="h-3 w-3 text-status-success" />}
          <span className={trend === 'up' ? 'text-status-critical' : trend === 'down' ? 'text-status-success' : 'text-charcoal-400'}>
            {trendValue}
          </span>
        </div>
      )}
    </Card>
  )
}

// Progress ring component
function ProgressRing({ progress, size = 120, strokeWidth = 8, color = COLORS.bronze }: {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-charcoal-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-2xl text-charcoal-100">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string; dataKey?: string }>; label?: string }) {
  if (!active || !payload) return null

  return (
    <div className="rounded-lg border border-charcoal-600 bg-bg-secondary p-3 shadow-xl backdrop-blur-sm">
      {label && <p className="mb-2 text-sm font-medium text-charcoal-100">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-charcoal-400">{entry.name}:</span>
          <span className="text-xs font-medium text-charcoal-100">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Expandable Finding Card
function FindingCard({ finding, index, onExpand }: { finding: Finding; index: number; onExpand?: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORIES[finding.engine] || {
    label: finding.engine,
    shortLabel: '?',
    icon: <FileText className="h-4 w-4" />,
    color: COLORS.charcoal[400]
  }

  // Format evidence for display
  const evidenceEntries = finding.evidence && typeof finding.evidence === 'object'
    ? Object.entries(finding.evidence)
    : []

  return (
    <div className="rounded-lg border border-charcoal-700 bg-bg-tertiary transition-all hover:border-charcoal-600 hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1 rounded-lg p-2 transition-transform hover:scale-110" style={{ backgroundColor: `${config.color}20` }}>
              <span style={{ color: config.color }}>{config.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-charcoal-100">{finding.title}</span>
                <Badge variant="default" className="text-xs">{config.label}</Badge>
                {finding.severity && (
                  <Badge
                    variant={finding.severity as 'critical' | 'high' | 'medium' | 'low' | 'info'}
                    className="text-xs"
                  >
                    {finding.severity}
                  </Badge>
                )}
              </div>
              {finding.description && (
                <p className={`mt-2 text-sm text-charcoal-400 ${expanded ? '' : 'line-clamp-2'}`}>
                  {finding.description}
                </p>
              )}
              {finding.confidence && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-charcoal-500">Confidence:</span>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-charcoal-700">
                    <div
                      className="h-full rounded-full bg-bronze-500 transition-all duration-500"
                      style={{ width: `${finding.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-charcoal-400">{Math.round(finding.confidence * 100)}%</span>
                </div>
              )}
              {expanded && evidenceEntries.length > 0 && (
                <div className="mt-3 rounded-lg bg-charcoal-700/50 p-3">
                  <div className="text-xs font-medium text-charcoal-300 mb-2">Evidence:</div>
                  <div className="text-xs text-charcoal-400 space-y-1">
                    {evidenceEntries.map(([key, value], i) => (
                      <div key={i} className="pl-2 border-l-2 border-bronze-500/30">
                        <span className="font-medium text-charcoal-300">{key}:</span> {JSON.stringify(value)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 rounded-lg p-2 text-charcoal-400 transition hover:bg-charcoal-700 hover:text-charcoal-100"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InvestigatePage() {
  const { activeCase } = useCaseStore()

  // Document selection state
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  // Investigation mode state
  const [mode, setMode] = useState<InvestigationMode>('full')
  const [customEngines, setCustomEngines] = useState<EngineSelection>({
    sam: true,
    contradiction: true,
    omission: true,
    temporal: true,
    entity: true,
    bias: true,
    professional: true,
    expert: true,
    accountability: true,
    narrative: true,
    documentary: true,
  })

  // Investigation state
  const [investigationId, setInvestigationId] = useState<string | null>(null)
  const [progress, setProgress] = useState<InvestigationProgress | null>(null)
  const [results, setResults] = useState<InvestigationResults | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState<Severity | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const activeCaseId = activeCase?.id

  // Load documents when case changes
  useEffect(() => {
    if (!activeCaseId) {
      setDocuments([])
      setSelectedDocIds([])
      return
    }

    const loadDocuments = async () => {
      setLoadingDocs(true)
      try {
        const db = await getDataLayer()
        const docs = await db.getDocuments(activeCaseId)
        setDocuments(docs.filter(d => d.status === 'completed'))
      } catch (err) {
        console.error('Failed to load documents:', err)
      } finally {
        setLoadingDocs(false)
      }
    }

    loadDocuments()
  }, [activeCaseId])

  // Poll for progress while investigation is running
  useEffect(() => {
    if (!investigationId || progress?.status === 'completed' || progress?.status === 'failed' || progress?.status === 'cancelled') {
      return
    }

    const poll = async () => {
      try {
        const result = await getInvestigationProgress(investigationId)
        if (result.success && result.progress) {
          setProgress(result.progress)

          if (result.progress.status === 'completed') {
            const resultsResp = await getInvestigationResults(investigationId)
            if (resultsResp.success && resultsResp.results) {
              setResults(resultsResp.results)
            }
          }
        }
      } catch (err) {
        console.error('Failed to get progress:', err)
      }
    }

    const interval = setInterval(poll, 1000)
    return () => clearInterval(interval)
  }, [investigationId, progress?.status])

  // Computed metrics
  const metrics = useMemo(() => {
    if (!results) return null

    const findings = results.findings
    const severityCounts = findings.reduce((acc, f) => {
      const sev = f.severity || 'info'
      acc[sev] = (acc[sev] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categoryCounts = findings.reduce((acc, f) => {
      acc[f.engine] = (acc[f.engine] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const criticalRate = findings.length > 0
      ? ((severityCounts.critical || 0) / findings.length * 100).toFixed(1)
      : '0'

    // Calculate risk score (0-100)
    const riskScore = findings.length > 0
      ? Math.min(
          100,
          ((severityCounts.critical || 0) * 10 +
            (severityCounts.high || 0) * 5 +
            (severityCounts.medium || 0) * 2 +
            (severityCounts.low || 0) * 0.5) /
            findings.length
        ).toFixed(1)
      : '0'

    // Average confidence
    const avgConfidence = findings.length > 0
      ? (findings.reduce((sum, f) => sum + (f.confidence || 0), 0) / findings.length * 100).toFixed(1)
      : '0'

    return {
      total: findings.length,
      critical: severityCounts.critical || 0,
      high: severityCounts.high || 0,
      medium: severityCounts.medium || 0,
      low: severityCounts.low || 0,
      criticalRate,
      riskScore,
      avgConfidence,
      severityCounts,
      categoryCounts,
      documentsAnalyzed: selectedDocIds.length,
      enginesRun: progress?.total_engines || 0,
    }
  }, [results, selectedDocIds.length, progress?.total_engines])

  // Chart data
  const severityPieData = useMemo(() => {
    if (!metrics) return []
    return [
      { name: 'Critical', value: metrics.critical, color: SEVERITY_COLORS.critical },
      { name: 'High', value: metrics.high, color: SEVERITY_COLORS.high },
      { name: 'Medium', value: metrics.medium, color: SEVERITY_COLORS.medium },
      { name: 'Low', value: metrics.low, color: SEVERITY_COLORS.low },
    ].filter(d => d.value > 0)
  }, [metrics])

  const categoryBarData = useMemo(() => {
    if (!metrics) return []
    return Object.entries(metrics.categoryCounts)
      .map(([key, value]) => ({
        name: CATEGORIES[key]?.shortLabel || key.substring(0, 3).toUpperCase(),
        fullName: CATEGORIES[key]?.label || key,
        value,
        color: CATEGORIES[key]?.color || COLORS.charcoal[400],
      }))
      .sort((a, b) => b.value - a.value)
  }, [metrics])

  const radarData = useMemo(() => {
    if (!metrics) return []
    const maxValue = Math.max(...Object.values(metrics.categoryCounts), 1)
    return Object.entries(CATEGORIES).map(([key, config]) => ({
      category: config.shortLabel,
      fullName: config.label,
      value: metrics.categoryCounts[key] || 0,
      fullMark: maxValue,
    }))
  }, [metrics])

  // Confidence vs Severity scatter plot data
  const confidenceSeverityData = useMemo(() => {
    if (!results) return []
    const severityMap: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1, info: 0 }
    return results.findings
      .filter(f => f.confidence !== undefined && f.confidence !== null && f.severity)
      .map(f => ({
        x: (f.confidence || 0) * 100,
        y: severityMap[f.severity || 'info'] || 0,
        z: 1,
        severity: f.severity || 'info',
        title: f.title,
      }))
  }, [results])

  // Document-Category heatmap data
  const heatmapData = useMemo(() => {
    if (!results) return []
    const docMap = new Map<string, Map<string, number>>()

    results.findings.forEach(f => {
      if (!f.document_ids || f.document_ids.length === 0) return
      // Use first document ID for heatmap
      const docId = f.document_ids[0]
      if (!docMap.has(docId)) {
        docMap.set(docId, new Map())
      }
      const catMap = docMap.get(docId)!
      catMap.set(f.engine, (catMap.get(f.engine) || 0) + 1)
    })

    const data: Array<{ document: string; category: string; value: number }> = []
    docMap.forEach((catMap, docId) => {
      const doc = documents.find(d => d.id === docId)
      const docName = doc ? doc.filename.substring(0, 20) : docId.substring(0, 8)
      catMap.forEach((count, category) => {
        data.push({ document: docName, category: CATEGORIES[category]?.shortLabel || category, value: count })
      })
    })

    return data
  }, [results, documents])

  // Timeline data
  const timelineData = useMemo(() => {
    if (!results) return []

    // Group findings by hour
    const timeMap = new Map<string, { critical: number; high: number; medium: number; low: number }>()

    results.findings.forEach(f => {
      const timestamp = f.created_at || new Date().toISOString()
      const date = new Date(timestamp)
      const key = `${date.getHours()}:00`

      if (!timeMap.has(key)) {
        timeMap.set(key, { critical: 0, high: 0, medium: 0, low: 0 })
      }
      const entry = timeMap.get(key)!
      const sev = f.severity || 'low'
      if (sev in entry) {
        entry[sev as keyof typeof entry]++
      }
    })

    return Array.from(timeMap.entries())
      .map(([time, counts]) => ({ time, ...counts }))
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [results])

  // Count selected engines in custom mode
  const selectedEngineCount = useMemo(() => {
    return Object.values(customEngines).filter(Boolean).length
  }, [customEngines])

  // Start investigation
  const handleStartInvestigation = useCallback(async () => {
    if (!activeCase || selectedDocIds.length === 0) return

    // Validate at least one engine is selected in custom mode
    if (mode === 'custom' && selectedEngineCount === 0) {
      setError('At least one analysis engine must be selected')
      return
    }

    setError(null)
    setProgress(null)
    setResults(null)

    try {
      const result = await startInvestigation({
        case_id: activeCase.id,
        document_ids: selectedDocIds,
        mode,
        engines: mode === 'custom' ? customEngines : null,
      })

      if (result.success && result.investigation_id) {
        setInvestigationId(result.investigation_id)
        const progressResult = await getInvestigationProgress(result.investigation_id)
        if (progressResult.success && progressResult.progress) {
          setProgress(progressResult.progress)
        }
      } else {
        setError(result.error || 'Failed to start investigation')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start investigation')
    }
  }, [activeCase, selectedDocIds, mode, customEngines, selectedEngineCount])

  // Cancel investigation
  const handleCancel = useCallback(async () => {
    if (!investigationId) return
    try {
      await cancelInvestigation(investigationId)
      setProgress(prev => prev ? { ...prev, status: 'cancelled' } : null)
    } catch (err) {
      console.error('Failed to cancel:', err)
    }
  }, [investigationId])

  // Toggle document selection
  const toggleDocument = (docId: string) => {
    setSelectedDocIds(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    )
  }

  const selectAllDocuments = () => setSelectedDocIds(documents.map(d => d.id))
  const clearSelection = () => setSelectedDocIds([])

  // Filter findings with search
  const filteredFindings = useMemo(() => {
    if (!results) return []
    return results.findings.filter(f => {
      if (categoryFilter && f.engine !== categoryFilter) return false
      if (severityFilter && f.severity !== severityFilter) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          f.title.toLowerCase().includes(query) ||
          (f.description && f.description.toLowerCase().includes(query))
        )
      }
      return true
    })
  }, [results, categoryFilter, severityFilter, searchQuery])

  // Handle chart click to filter
  const handleChartClick = useCallback((category: string | null, severity: Severity | null) => {
    setCategoryFilter(category)
    setSeverityFilter(severity)
    setActiveTab('findings')
    // Scroll to findings section
    setTimeout(() => {
      document.getElementById('findings-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  // Render if no case selected
  if (!activeCase) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={<BarChart3 className="h-12 w-12" />}
          title="No Case Selected"
          description="Select a case from the sidebar to access the Analytics Hub"
        />
      </div>
    )
  }

  const isRunning = progress?.status === 'running'
  const isComplete = progress?.status === 'completed'

  // Investigation Setup Screen
  if (!isRunning && !isComplete) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-charcoal-100">Analytics Hub</h1>
            <p className="text-sm text-charcoal-400">
              Unified forensic analysis with S.A.M. methodology
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Document Selection */}
          <Card className="p-4 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-charcoal-100">Evidence Corpus</h2>
              <div className="flex gap-2 text-xs">
                <button onClick={selectAllDocuments} className="text-bronze-400 hover:text-bronze-300 transition">
                  Select All
                </button>
                <span className="text-charcoal-600">|</span>
                <button onClick={clearSelection} className="text-charcoal-400 hover:text-charcoal-300 transition">
                  Clear
                </button>
              </div>
            </div>

            {loadingDocs ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : documents.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-8 w-8" />}
                title="No Documents"
                description="Upload and process documents before analysis"
              />
            ) : (
              <div className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
                {documents.map(doc => (
                  <label
                    key={doc.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all ${
                      selectedDocIds.includes(doc.id)
                        ? 'bg-bronze-900/20 border border-bronze-500/30 scale-[1.02]'
                        : 'bg-bg-tertiary hover:bg-charcoal-700 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDocIds.includes(doc.id)}
                      onChange={() => toggleDocument(doc.id)}
                      className="h-4 w-4 rounded border-charcoal-600 bg-bg-tertiary text-bronze-500"
                    />
                    <FileText className="h-4 w-4 shrink-0 text-charcoal-400" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-charcoal-100">{doc.filename}</div>
                      <div className="text-xs text-charcoal-500">{doc.doc_type || 'Document'}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-charcoal-700 pt-4">
              <span className="text-sm text-charcoal-400">
                {selectedDocIds.length} of {documents.length} documents selected
              </span>
              <Badge variant={selectedDocIds.length > 0 ? 'default' : 'info'}>
                {selectedDocIds.length > 0 ? 'Ready' : 'Select Documents'}
              </Badge>
            </div>
          </Card>

          {/* Mode Selection */}
          <Card className="p-4">
            <h2 className="mb-4 font-medium text-charcoal-100">Analysis Mode</h2>

            <div className="space-y-3">
              {[
                { key: 'quick', label: 'Quick Scan', desc: 'Core findings (4 engines)', icon: <Zap className="h-5 w-5" /> },
                { key: 'full', label: 'Full Investigation', desc: 'S.A.M. + all engines', icon: <Layers className="h-5 w-5" /> },
                { key: 'custom', label: 'Custom', desc: 'Select engines', icon: <Activity className="h-5 w-5" /> },
              ].map(opt => (
                <label
                  key={opt.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-4 transition-all ${
                    mode === opt.key
                      ? 'bg-bronze-900/20 border border-bronze-500/30 scale-[1.02]'
                      : 'bg-bg-tertiary hover:bg-charcoal-700 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="mode"
                    value={opt.key}
                    checked={mode === opt.key}
                    onChange={() => setMode(opt.key as InvestigationMode)}
                    className="sr-only"
                  />
                  <div className={`rounded-lg p-2 transition ${mode === opt.key ? 'bg-bronze-600/20 text-bronze-400' : 'bg-charcoal-700 text-charcoal-400'}`}>
                    {opt.icon}
                  </div>
                  <div>
                    <div className="font-medium text-charcoal-100">{opt.label}</div>
                    <div className="text-xs text-charcoal-400">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {mode === 'custom' && (
              <div className="mt-4 rounded-lg border border-charcoal-700 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-charcoal-400">Select engines to run</span>
                  <span className={`text-xs ${selectedEngineCount === 0 ? 'text-status-critical' : 'text-charcoal-400'}`}>
                    {selectedEngineCount} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries({
                    sam: 'S.A.M.',
                    contradiction: 'Contradictions',
                    omission: 'Omissions',
                    temporal: 'Timeline',
                    entity: 'Entities',
                    bias: 'Bias',
                    professional: 'Professional',
                    expert: 'Expert',
                    accountability: 'Accountability',
                    narrative: 'Narrative',
                    documentary: 'Documentary',
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={customEngines[key as keyof EngineSelection]}
                        onChange={e => setCustomEngines(prev => ({ ...prev, [key]: e.target.checked }))}
                        className="h-3 w-3 rounded border-charcoal-600 bg-bg-tertiary text-bronze-500"
                      />
                      <span className="text-charcoal-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-status-critical/30 bg-status-critical/10 p-3 text-sm text-status-critical">
                {error}
              </div>
            )}

            <button
              onClick={handleStartInvestigation}
              disabled={selectedDocIds.length === 0 || (mode === 'custom' && selectedEngineCount === 0)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-bronze-600 px-4 py-3 font-medium text-white transition hover:bg-bronze-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-5 w-5" />
              Run Analysis
            </button>
          </Card>
        </div>
      </div>
    )
  }

  // Progress Screen
  if (isRunning) {
    const progressPercent = progress ? (progress.completed_engines / progress.total_engines) * 100 : 0

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-charcoal-100">Analysis in Progress</h1>
            <p className="text-sm text-charcoal-400">
              Processing {selectedDocIds.length} documents across {progress?.total_engines || 0} engines
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 rounded-lg border border-status-critical/30 px-4 py-2 text-sm text-status-critical transition hover:bg-status-critical/10"
          >
            <StopCircle className="h-4 w-4" />
            Cancel
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="flex flex-col items-center justify-center p-8 lg:col-span-1">
            <ProgressRing progress={progressPercent} size={160} strokeWidth={12} />
            <p className="mt-4 text-center text-sm text-charcoal-400">
              {progress?.completed_engines || 0} of {progress?.total_engines || 0} engines complete
            </p>
            {progress?.current_engine && (
              <Badge variant="default" className="mt-2">
                <Activity className="mr-1 h-3 w-3 animate-pulse" />
                {progress.current_engine}
              </Badge>
            )}
          </Card>

          <Card className="p-4 lg:col-span-2">
            <h2 className="mb-4 font-medium text-charcoal-100">Engine Status</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {progress?.engines.map(engine => (
                <div
                  key={engine.engine}
                  className={`flex items-center justify-between rounded-lg p-3 transition-all ${
                    engine.status === 'running'
                      ? 'bg-bronze-900/20 border border-bronze-500/30 scale-[1.02]'
                      : engine.status === 'completed'
                      ? 'bg-status-success/5 border border-status-success/20'
                      : engine.status === 'failed'
                      ? 'bg-status-critical/5 border border-status-critical/20'
                      : 'bg-bg-tertiary border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {engine.status === 'completed' && <CheckCircle className="h-4 w-4 text-status-success" />}
                    {engine.status === 'running' && <Spinner size="sm" />}
                    {engine.status === 'failed' && <XCircle className="h-4 w-4 text-status-critical" />}
                    {engine.status === 'pending' && <Clock className="h-4 w-4 text-charcoal-500" />}
                    <span className={`text-sm ${engine.status === 'running' ? 'text-bronze-400' : 'text-charcoal-300'}`}>
                      {engine.engine}
                    </span>
                  </div>
                  {engine.status === 'completed' && (
                    <span className="text-xs text-charcoal-400">{engine.findings_count}</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Results/Analytics Dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-100">Analytics Hub</h1>
          <p className="text-sm text-charcoal-400">
            {metrics?.total || 0} findings across {metrics?.enginesRun || 0} engines
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setInvestigationId(null)
              setProgress(null)
              setResults(null)
              setSearchQuery('')
              setCategoryFilter(null)
              setSeverityFilter(null)
            }}
            className="flex items-center gap-2 rounded-lg border border-charcoal-600 bg-bg-tertiary px-4 py-2 text-sm text-charcoal-300 transition hover:bg-charcoal-700 hover:shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            New Analysis
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-bronze-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-bronze-500 hover:shadow-lg">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Findings"
          value={metrics?.total || 0}
          subtitle={`${metrics?.documentsAnalyzed || 0} documents analyzed`}
          icon={<BarChart3 className="h-5 w-5" />}
          color="bronze"
          onClick={() => handleChartClick(null, null)}
        />
        <MetricCard
          title="Critical Issues"
          value={metrics?.critical || 0}
          subtitle={`${metrics?.criticalRate}% of findings`}
          icon={<AlertCircle className="h-5 w-5" />}
          color="critical"
          trend={metrics?.critical && metrics.critical > 5 ? 'up' : undefined}
          trendValue={metrics?.critical && metrics.critical > 5 ? 'Requires attention' : undefined}
          onClick={() => handleChartClick(null, 'critical')}
        />
        <MetricCard
          title="High Priority"
          value={metrics?.high || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="high"
          onClick={() => handleChartClick(null, 'high')}
        />
        <MetricCard
          title="Risk Score"
          value={metrics?.riskScore || 0}
          subtitle="Weighted severity"
          icon={<Award className="h-5 w-5" />}
          color={parseFloat(metrics?.riskScore || '0') > 50 ? 'critical' : 'bronze'}
        />
        <MetricCard
          title="Avg Confidence"
          value={`${metrics?.avgConfidence || 0}%`}
          subtitle="Analysis confidence"
          icon={<Target className="h-5 w-5" />}
          color="success"
        />
      </div>

      {/* S.A.M. Summary (if available) */}
      {results?.sam_summary && (
        <Card className="p-4 transition-shadow hover:shadow-lg">
          <h2 className="mb-4 font-medium text-charcoal-100">S.A.M. Methodology Results</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-bg-tertiary p-4 text-center transition-transform hover:scale-105">
              <div className="mb-1 text-xs uppercase tracking-wider text-charcoal-500">ANCHOR</div>
              <div className="font-display text-2xl text-status-critical">{results.sam_summary.false_premises_found}</div>
              <div className="text-xs text-charcoal-400">False Premises</div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-4 text-center transition-transform hover:scale-105">
              <div className="mb-1 text-xs uppercase tracking-wider text-charcoal-500">INHERIT</div>
              <div className="font-display text-2xl text-status-high">{results.sam_summary.propagation_chains_found}</div>
              <div className="text-xs text-charcoal-400">Propagation Chains</div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-4 text-center transition-transform hover:scale-105">
              <div className="mb-1 text-xs uppercase tracking-wider text-charcoal-500">COMPOUND</div>
              <div className="font-display text-2xl text-bronze-400">{results.sam_summary.authority_accumulations_found}</div>
              <div className="text-xs text-charcoal-400">Authority Markers</div>
            </div>
            <div className="rounded-lg bg-bg-tertiary p-4 text-center transition-transform hover:scale-105">
              <div className="mb-1 text-xs uppercase tracking-wider text-charcoal-500">ARRIVE</div>
              <div className="font-display text-2xl text-charcoal-100">{results.sam_summary.outcomes_linked}</div>
              <div className="text-xs text-charcoal-400">Outcomes Linked</div>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-bg-tertiary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="scatter">Confidence</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Severity Distribution */}
            <Card className="p-4 transition-shadow hover:shadow-lg">
              <h2 className="mb-4 font-medium text-charcoal-100">Severity Distribution</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={severityPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                      onClick={(data) => handleChartClick(null, data.name.toLowerCase() as Severity)}
                      className="cursor-pointer"
                    >
                      {severityPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="transition-opacity hover:opacity-80" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Findings by Category */}
            <Card className="p-4 transition-shadow hover:shadow-lg">
              <h2 className="mb-4 font-medium text-charcoal-100">Findings by Category</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBarData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.charcoal[700]} />
                    <XAxis type="number" stroke={COLORS.charcoal[500]} fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke={COLORS.charcoal[500]} fontSize={12} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      onClick={(data) => {
                        const fullEntry = categoryBarData.find(e => e.name === data.name)
                        if (fullEntry) {
                          const categoryKey = Object.keys(CATEGORIES).find(k => CATEGORIES[k].shortLabel === fullEntry.name)
                          handleChartClick(categoryKey || null, null)
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {categoryBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="transition-opacity hover:opacity-80" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Analysis Coverage Radar */}
            <Card className="p-4 transition-shadow hover:shadow-lg">
              <h2 className="mb-4 font-medium text-charcoal-100">Analysis Coverage</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={COLORS.charcoal[700]} />
                    <PolarAngleAxis dataKey="category" stroke={COLORS.charcoal[400]} fontSize={11} />
                    <PolarRadiusAxis stroke={COLORS.charcoal[600]} fontSize={10} />
                    <Radar
                      name="Findings"
                      dataKey="value"
                      stroke={COLORS.bronze}
                      fill={COLORS.bronze}
                      fillOpacity={0.3}
                      className="transition-opacity hover:opacity-100"
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Severity Stacked Area */}
            <Card className="p-4 transition-shadow hover:shadow-lg">
              <h2 className="mb-4 font-medium text-charcoal-100">Issue Severity Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Current', critical: metrics?.critical || 0, high: metrics?.high || 0, medium: metrics?.medium || 0, low: metrics?.low || 0 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.charcoal[700]} />
                    <XAxis dataKey="name" stroke={COLORS.charcoal[500]} />
                    <YAxis stroke={COLORS.charcoal[500]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="critical" stackId="1" stroke={SEVERITY_COLORS.critical} fill={SEVERITY_COLORS.critical} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="high" stackId="1" stroke={SEVERITY_COLORS.high} fill={SEVERITY_COLORS.high} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="medium" stackId="1" stroke={SEVERITY_COLORS.medium} fill={SEVERITY_COLORS.medium} fillOpacity={0.6} />
                    <Area type="monotone" dataKey="low" stackId="1" stroke={SEVERITY_COLORS.low} fill={SEVERITY_COLORS.low} fillOpacity={0.6} />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card className="p-4 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-charcoal-100">Findings Timeline</h2>
              <Calendar className="h-5 w-5 text-charcoal-400" />
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.charcoal[700]} />
                  <XAxis dataKey="time" stroke={COLORS.charcoal[500]} fontSize={11} />
                  <YAxis stroke={COLORS.charcoal[500]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="critical" stroke={SEVERITY_COLORS.critical} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="high" stroke={SEVERITY_COLORS.high} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="medium" stroke={SEVERITY_COLORS.medium} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="low" stroke={SEVERITY_COLORS.low} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-6">
          <Card className="p-4 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-charcoal-100">Document-Category Heatmap</h2>
              <Grid3x3 className="h-5 w-5 text-charcoal-400" />
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={heatmapData.map(d => ({ name: `${d.document} - ${d.category}`, size: d.value, value: d.value }))}
                  dataKey="size"
                  stroke="#262626"
                  fill={COLORS.bronze}
                >
                  <Tooltip content={<CustomTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            </div>
            {heatmapData.length === 0 && (
              <div className="py-12 text-center text-sm text-charcoal-400">
                No document-level data available
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Scatter Tab */}
        <TabsContent value="scatter" className="space-y-6">
          <Card className="p-4 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-charcoal-100">Confidence vs Severity Analysis</h2>
              <Target className="h-5 w-5 text-charcoal-400" />
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.charcoal[700]} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Confidence"
                    unit="%"
                    stroke={COLORS.charcoal[500]}
                    label={{ value: 'Confidence %', position: 'insideBottom', offset: -5, fill: COLORS.charcoal[400] }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Severity"
                    stroke={COLORS.charcoal[500]}
                    ticks={[0, 1, 2, 3, 4]}
                    tickFormatter={(v) => ['Info', 'Low', 'Medium', 'High', 'Critical'][v] || ''}
                    label={{ value: 'Severity', angle: -90, position: 'insideLeft', fill: COLORS.charcoal[400] }}
                  />
                  <ZAxis range={[50, 400]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {['critical', 'high', 'medium', 'low'].map(sev => (
                    <Scatter
                      key={sev}
                      name={sev.charAt(0).toUpperCase() + sev.slice(1)}
                      data={confidenceSeverityData.filter(d => d.severity === sev)}
                      fill={SEVERITY_COLORS[sev]}
                      fillOpacity={0.6}
                      className="transition-opacity hover:opacity-100 cursor-pointer"
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings" id="findings-section" className="space-y-6">
          <Card className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-medium text-charcoal-100">Detailed Findings</h2>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-500" />
                  <Input
                    type="text"
                    placeholder="Search findings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-48 pl-9 bg-bg-tertiary border-charcoal-600 text-charcoal-100 placeholder:text-charcoal-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1 rounded-lg bg-bg-tertiary p-1">
                  <button
                    onClick={() => setCategoryFilter(null)}
                    className={`rounded px-3 py-1 text-xs transition ${!categoryFilter ? 'bg-bronze-600 text-white' : 'text-charcoal-400 hover:text-charcoal-100'}`}
                  >
                    All
                  </button>
                  {Object.entries(results?.findings_by_category || {}).slice(0, 5).map(([cat, count]) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                      className={`rounded px-2 py-1 text-xs transition ${categoryFilter === cat ? 'bg-bronze-600 text-white' : 'text-charcoal-400 hover:text-charcoal-100'}`}
                    >
                      {CATEGORIES[cat]?.shortLabel || cat.substring(0, 2).toUpperCase()} ({count})
                    </button>
                  ))}
                </div>

                {/* Severity Filter */}
                <div className="flex items-center gap-1 rounded-lg bg-bg-tertiary p-1">
                  {(['critical', 'high', 'medium', 'low'] as Severity[]).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setSeverityFilter(sev === severityFilter ? null : sev)}
                      className={`rounded px-2 py-1 text-xs transition flex items-center gap-1 ${severityFilter === sev ? 'bg-bronze-600 text-white' : 'text-charcoal-400 hover:text-charcoal-100'}`}
                    >
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[sev] }} />
                      {sev.charAt(0).toUpperCase() + sev.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {filteredFindings.length === 0 ? (
                <div className="py-12 text-center text-sm text-charcoal-400">
                  No findings match the current filters
                </div>
              ) : (
                filteredFindings.map((finding, index) => (
                  <FindingCard key={finding.id || index} finding={finding} index={index} />
                ))
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-charcoal-700 pt-4 text-sm text-charcoal-400">
              <span>Showing {filteredFindings.length} of {results?.total_findings || 0} findings</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 rounded-lg border border-charcoal-600 px-3 py-1 transition hover:bg-charcoal-700">
                  <Download className="h-3 w-3" />
                  Export CSV
                </button>
                <button className="flex items-center gap-1 rounded-lg bg-bronze-600 px-3 py-1 text-white transition hover:bg-bronze-500">
                  <Scale className="h-3 w-3" />
                  Generate Complaint
                </button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
