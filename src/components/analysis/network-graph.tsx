
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface Node {
    id: string
    label: string
    type: 'police' | 'social_services' | 'expert' | 'court' | 'other'
}

interface Link {
    source: string
    target: string
    strength: number
    label?: string
}

interface NetworkGraphProps {
    nodes: Node[]
    links: Link[]
}

export function NetworkGraph({ nodes, links }: NetworkGraphProps) {
    // Simple circular layout calculation
    const width = 600
    const height = 400
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 60

    const processedNodes = nodes.map((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2
        return {
            ...node,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        }
    })

    return (
        <Card className="overflow-hidden bg-bg-primary border-charcoal-700 p-0 relative shadow-inner">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-bronze-900/10 via-transparent to-charcoal-900/50 pointer-events-none" />

            <div className="relative w-full overflow-x-auto">
                <svg width={width} height={height} className="mx-auto" viewBox={`0 0 ${width} ${height}`}>
                    <defs>
                        <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4B5563" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#D4A017" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.2" />
                        </linearGradient>

                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <filter id="critical-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="7"
                            refX="22" // Adjusted for larger nodes
                            refY="3.5"
                            orient="auto"
                        >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" opacity="0.8" />
                        </marker>
                    </defs>

                    {/* Links */}
                    {links.map((link, i) => {
                        const source = processedNodes.find(n => n.id === link.source)
                        const target = processedNodes.find(n => n.id === link.target)

                        if (!source || !target) return null

                        return (
                            <g key={`link-${i}`}>
                                <motion.line
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.6 }}
                                    transition={{ duration: 1.5, delay: i * 0.05, ease: "easeInOut" }}
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke="url(#linkGradient)"
                                    strokeWidth={Math.max(1, link.strength * 0.8)}
                                    markerEnd="url(#arrowhead)"
                                />
                                {link.label && (
                                    <g>
                                        <rect
                                            x={(source.x + target.x) / 2 - (link.label.length * 3)}
                                            y={(source.y + target.y) / 2 - 9}
                                            width={(link.label.length * 6) + 10}
                                            height="14"
                                            rx="4"
                                            fill="#1C1C1E"
                                            stroke="#4B5563"
                                            strokeWidth="0.5"
                                        />
                                        <text
                                            x={(source.x + target.x) / 2}
                                            y={(source.y + target.y) / 2 + 1}
                                            textAnchor="middle"
                                            fill="#9CA3AF"
                                            fontSize="9"
                                            fontWeight="500"
                                            className="font-mono tracking-tight"
                                        >
                                            {link.label}
                                        </text>
                                    </g>
                                )}
                            </g>
                        )
                    })}

                    {/* Nodes */}
                    {processedNodes.map((node, i) => {
                        const isPolice = node.type === 'police';
                        const isExpert = node.type === 'expert';
                        const isSocial = node.type === 'social_services';

                        return (
                            <motion.g
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                                className="cursor-default hover:opacity-90 transition-opacity"
                            >
                                {/* Outer Ring / Glow */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={isExpert ? 22 : 20}
                                    fill="transparent"
                                    stroke={
                                        isPolice ? '#EF4444' :
                                            isSocial ? '#F59E0B' :
                                                isExpert ? '#D4A017' :
                                                    '#6B7280'
                                    }
                                    strokeWidth="1.5"
                                    opacity="0.3"
                                    filter={isPolice || isExpert ? "url(#critical-glow)" : "url(#glow)"}
                                >
                                    {/* Pulse Animation for key nodes */}
                                    {(isPolice || isExpert || isSocial) && (
                                        <animate
                                            attributeName="r"
                                            values={isExpert ? "22;26;22" : "20;24;20"}
                                            dur="3s"
                                            repeatCount="indefinite"
                                        />
                                    )}
                                    {(isPolice || isExpert || isSocial) && (
                                        <animate
                                            attributeName="opacity"
                                            values="0.3;0.1;0.3"
                                            dur="3s"
                                            repeatCount="indefinite"
                                        />
                                    )}
                                </circle>

                                {/* Main Node Body */}
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={18}
                                    className="transition-colors duration-300"
                                    fill="#1C1C1E"
                                    stroke={
                                        isPolice ? '#EF4444' :
                                            isSocial ? '#F59E0B' :
                                                isExpert ? '#D4A017' :
                                                    '#4B5563'
                                    }
                                    strokeWidth="2"
                                />

                                {/* Label below node */}
                                <text
                                    x={node.x}
                                    y={node.y + 35}
                                    textAnchor="middle"
                                    fill="#E5E5E5"
                                    className="text-xs font-medium font-sans tracking-wide"
                                    style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
                                >
                                    {node.label}
                                </text>

                                {/* Icon/Text inside node */}
                                <text
                                    x={node.x}
                                    y={node.y + 4}
                                    textAnchor="middle"
                                    fill={
                                        isPolice ? '#EF4444' :
                                            isSocial ? '#F59E0B' :
                                                isExpert ? '#D4A017' :
                                                    '#9CA3AF'
                                    }
                                    className="text-[10px] font-bold uppercase pointer-events-none font-mono"
                                >
                                    {node.type.slice(0, 2)}
                                </text>
                            </motion.g>
                        )
                    })}
                </svg>
            </div>

            {/* Legend - Floating Bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-[10px] text-charcoal-400 font-mono tracking-wider uppercase">
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-charcoal-700/50 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-bronze-500 shadow-[0_0_8px_rgba(212,160,23,0.5)]"></div>
                    Expert
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-charcoal-700/50 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-critical shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    Police
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-charcoal-700/50 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-high shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    Social Svcs
                </div>
            </div>
        </Card>
    )
}
