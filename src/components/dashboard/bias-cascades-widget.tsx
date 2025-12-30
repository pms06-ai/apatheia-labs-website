'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { ArrowDown, AlertCircle } from 'lucide-react'

// Mock data - in a real app this would come from the bias_detection engine results
const cascadeData = [
    {
        stage: 'Initial Contact',
        bias: 'Confirmation Bias',
        description: 'Police assumed guilt based on prior history',
        severity: 'medium',
        count: 3
    },
    {
        stage: 'Investigation',
        bias: 'Selective Filtering',
        description: 'Exculpatory evidence excluded from file',
        severity: 'high',
        count: 5
    },
    {
        stage: 'Social Services',
        bias: 'Authority Bias',
        description: 'SW adopted police narrative without question',
        severity: 'critical',
        count: 8
    },
    {
        stage: 'Court',
        bias: 'Anchoring',
        description: 'Judgment anchored to initial flawed report',
        severity: 'critical',
        count: 12
    }
]

export function BiasCascadesWidget() {
    return (
        <Card className="h-full border-charcoal-700 bg-charcoal-800/40 backdrop-blur-sm overflow-hidden flex flex-col">
            <div className="border-b border-charcoal-700/50 px-4 py-3 bg-gradient-to-r from-charcoal-800 to-charcoal-900">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display text-sm text-charcoal-100 uppercase tracking-wide">Bias Amplification</h2>
                        <p className="text-[10px] text-charcoal-400">Systematic prejudice tracking</p>
                    </div>
                    <AlertCircle className="h-4 w-4 text-status-critical" />
                </div>
            </div>

            <div className="p-4 space-y-0 flex-1 relative">
                {/* Background Track Line */}
                <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-charcoal-700/30" />

                {cascadeData.map((step, index) => (
                    <div key={step.stage} className="relative pb-5last:pb-0">
                        {/* Animated Connector Line */}
                        {index < cascadeData.length - 1 && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="absolute left-[13px] top-7 bottom-[-10px] w-0.5 bg-gradient-to-b from-bronze-500/50 to-status-critical/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                            />
                        )}

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="flex items-start gap-3 relative z-10"
                        >
                            {/* Node */}
                            <div className={`
                                relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border 
                                shadow-lg backdrop-blur-md transition-all duration-500
                                ${step.severity === 'critical' ? 'border-status-critical bg-status-critical/10 text-status-critical shadow-status-critical/20' :
                                    step.severity === 'high' ? 'border-status-high bg-status-high/10 text-status-high shadow-status-high/20' :
                                        'border-bronze-500 bg-bronze-500/10 text-bronze-500 shadow-bronze-500/20'}
                            `}>
                                <span className="text-xs font-bold font-mono">{step.count}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5 pb-4 border-b border-charcoal-800/50 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-charcoal-200">{step.stage}</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${step.severity === 'critical' ? 'bg-status-critical/10 text-status-critical' :
                                        step.severity === 'high' ? 'bg-status-high/10 text-status-high' : 'bg-bronze-500/10 text-bronze-500'
                                        }`}>
                                        {step.bias}
                                    </span>
                                </div>
                                <p className="text-xs text-charcoal-400 mt-1 leading-relaxed line-clamp-2">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            <div className="border-t border-charcoal-700/50 px-4 py-3 bg-gradient-to-b from-charcoal-800/80 to-charcoal-900">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-charcoal-400 font-mono">CUMULATIVE ERROR</span>
                    <div className="flex items-center gap-2 text-sm text-status-critical font-bold font-display">
                        <ArrowDown className="h-4 w-4 animate-bounce" />
                        4.0x Factor
                    </div>
                </div>
            </div>
        </Card>
    )
}
