
import { motion } from 'framer-motion'
import { Calendar, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TimelineEvent {
    id: string
    date: string
    title: string
    description?: string
    documentName?: string
    type: 'strengthened' | 'weakened' | 'unchanged' | 'first' | 'anomaly'
    severity?: 'critical' | 'high' | 'medium' | 'low'
}

interface TimelineViewProps {
    events: TimelineEvent[]
}

export function TimelineView({ events }: TimelineViewProps) {
    // Sort by date
    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return (
        <div className="relative space-y-8 pl-8 py-4">
            {/* Continuous Gradient Line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-charcoal-700 via-bronze-500/50 to-charcoal-700" />

            {sortedEvents.map((event, index) => {
                const isCritical = event.severity === 'critical';
                const isStrengthened = event.type === 'strengthened';

                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        {/* Connector Node with Glow Effect */}
                        <div className={`
                            absolute -left-[29px] top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-bg-tertiary z-10
                            ${isCritical ? 'border-status-critical shadow-[0_0_15px_rgba(201,74,74,0.4)]' :
                                event.severity === 'high' ? 'border-status-high' :
                                    isStrengthened ? 'border-bronze-500 shadow-[0_0_10px_rgba(184,134,11,0.3)]' :
                                        'border-charcoal-600'
                            }
                        `}>
                            {/* Inner Dot */}
                            <div className={`h-2 w-2 rounded-full ${isCritical ? 'bg-status-critical animate-pulse' :
                                event.severity === 'high' ? 'bg-status-high' :
                                    isStrengthened ? 'bg-bronze-500' :
                                        'bg-charcoal-400'
                                }`} />
                        </div>

                        <Card className={`
                            group relative overflow-hidden transition-all duration-300 border-charcoal-700
                            hover:border-bronze-500/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                            ${isCritical ? 'bg-status-critical-bg/5 border-status-critical/30' : 'bg-bg-elevated/40'}
                        `}>
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-bronze-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative p-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-xs font-mono text-bronze-500 bg-bronze-500/10 px-2 py-1 rounded">
                                            <Calendar className="h-3 w-3" />
                                            <time>{new Date(event.date).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}</time>
                                        </div>
                                        {event.documentName && (
                                            <span className="text-xs text-charcoal-400 flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                {event.documentName}
                                            </span>
                                        )}
                                    </div>

                                    <h4 className={`font-display text-lg ${isCritical ? 'text-status-critical' : 'text-charcoal-100'}`}>
                                        {event.title}
                                    </h4>

                                    {event.description && (
                                        <p className="text-sm text-charcoal-300 leading-relaxed max-w-2xl font-sans">
                                            {event.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                                    {event.severity && (
                                        <Badge variant={event.severity} className="shadow-lg">
                                            {event.severity}
                                        </Badge>
                                    )}

                                    {event.type !== 'unchanged' && event.type !== 'first' && (
                                        <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full ${event.type === 'strengthened' ? 'bg-bronze-500/10 text-bronze-500' :
                                            event.type === 'weakened' ? 'bg-charcoal-700 text-charcoal-400' :
                                                'bg-charcoal-800 text-charcoal-500'
                                            }`}>
                                            {event.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )
            })}

            {sortedEvents.length === 0 && (
                <div className="text-center text-charcoal-500 py-12 italic border-2 border-dashed border-charcoal-800 rounded-lg">
                    No timeline events generated yet. Run the narrative engine to populate this view.
                </div>
            )}
        </div>
    )
}
