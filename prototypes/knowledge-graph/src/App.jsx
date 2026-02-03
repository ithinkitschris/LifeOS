import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

const API_BASE = '/api';

// Helper function to recursively flatten nested objects into key-value pairs
function flattenObject(obj, prefix = '', items = [], maxDepth = 4, currentDepth = 0) {
    if (currentDepth >= maxDepth || !obj || typeof obj !== 'object') {
        return items;
    }

    Object.entries(obj).forEach(([key, value]) => {
        // Skip meta fields
        if (key === 'meta') return;

        const label = prefix ? `${prefix} › ${key.replace(/_/g, ' ')}` : key.replace(/_/g, ' ');

        if (Array.isArray(value)) {
            if (value.length === 0) return;

            // If array of primitives, join them
            if (typeof value[0] !== 'object') {
                items.push({ label, value: value.join(', '), isArray: true });
            } else {
                // If array of objects, add each object with index
                value.forEach((item, idx) => {
                    if (typeof item === 'object' && item !== null) {
                        flattenObject(item, `${label} [${idx + 1}]`, items, maxDepth, currentDepth + 1);
                    }
                });
            }
        } else if (value !== null && typeof value === 'object') {
            // Recursively flatten nested objects
            flattenObject(value, label, items, maxDepth, currentDepth + 1);
        } else if (value !== null && value !== undefined) {
            // Add primitive values
            items.push({
                label,
                value: String(value),
                depth: currentDepth
            });
        }
    });

    return items;
}

// LifeOS 7 Domains - User-facing categorization
const DOMAINS = [
    {
        id: 'navigation_mobility',
        label: 'Navigation & Mobility',
        icon: '🚗',
        color: 'teal',
        colorHex: '#14b8a6',
        description: 'How you move through the world and manage your location-based life',
        extractData: (data) => {
            const subcategories = [];
            if (data.locations?.primary_locations) {
                const items = [];
                flattenObject(data.locations.primary_locations, '', items);
                subcategories.push({ id: 'primary_locations', label: 'Primary Locations', icon: '📍', items });
            }
            if (data.behaviors?.commute_patterns || data.locations?.commute_patterns) {
                const items = [];
                if (data.behaviors?.commute_patterns) flattenObject(data.behaviors.commute_patterns, '', items);
                if (data.locations?.commute_patterns) flattenObject(data.locations.commute_patterns, '', items);
                subcategories.push({ id: 'commute_patterns', label: 'Commute Patterns', icon: '🚃', items });
            }
            if (data.behaviors?.location_patterns) {
                const items = [];
                flattenObject(data.behaviors.location_patterns, '', items);
                subcategories.push({ id: 'location_behaviors', label: 'Location Behaviors', icon: '🗺️', items });
            }
            return { subcategories };
        }
    },
    {
        id: 'communication_connection',
        label: 'Communication & Connection',
        icon: '💬',
        color: 'pink',
        colorHex: '#ec4899',
        description: 'Your relationships and how you communicate with others',
        extractData: (data) => {
            const subcategories = [];
            if (data.relationships) {
                const items = [];
                flattenObject(data.relationships, '', items);
                subcategories.push({ id: 'relationships', label: 'Relationships', icon: '💑', items });
            }
            if (data.communications?.channels) {
                const items = [];
                flattenObject(data.communications.channels, '', items);
                subcategories.push({ id: 'channels', label: 'Communication Channels', icon: '📨', items });
            }
            if (data.behaviors?.communication_patterns || data.communications?.communication_patterns) {
                const items = [];
                if (data.behaviors?.communication_patterns) flattenObject(data.behaviors.communication_patterns, '', items);
                if (data.communications?.communication_patterns) flattenObject(data.communications.communication_patterns, '', items);
                subcategories.push({ id: 'comm_patterns', label: 'Communication Patterns', icon: '📊', items });
            }
            if (data.communications?.notification_preferences) {
                const items = [];
                flattenObject(data.communications.notification_preferences, '', items);
                subcategories.push({ id: 'notifications', label: 'Notification Preferences', icon: '🔔', items });
            }
            return { subcategories };
        }
    },
    {
        id: 'entertainment_media',
        label: 'Entertainment & Media',
        icon: '🎬',
        color: 'purple',
        colorHex: '#a855f7',
        description: 'Your media consumption, creative pursuits, and leisure activities',
        extractData: (data) => {
            const subcategories = [];
            if (data.behaviors?.digital_patterns?.consumption_apps) {
                const items = [];
                flattenObject(data.behaviors.digital_patterns.consumption_apps, '', items);
                subcategories.push({ id: 'consumption_apps', label: 'Consumption Apps', icon: '📱', items });
            }
            if (data.digitalHistory) {
                const items = [];
                flattenObject(data.digitalHistory, '', items);
                subcategories.push({ id: 'digital_behavior', label: 'Digital Behavior', icon: '💻', items });
            }
            if (data.behaviors?.digital_patterns?.problematic_patterns) {
                const items = [];
                flattenObject(data.behaviors.digital_patterns.problematic_patterns, '', items);
                subcategories.push({ id: 'problematic_patterns', label: 'Usage Patterns', icon: '⚠️', items });
            }
            return { subcategories };
        }
    },
    {
        id: 'life_management',
        label: 'Life Management',
        icon: '📋',
        color: 'blue',
        colorHex: '#3b82f6',
        description: 'Your schedules, commitments, and organizational systems',
        extractData: (data) => {
            const subcategories = [];
            if (data.calendar) {
                const items = [];
                flattenObject(data.calendar, '', items);
                subcategories.push({ id: 'calendar', label: 'Calendar & Schedule', icon: '📅', items });
            }
            if (data.behaviors?.temporal_patterns) {
                const items = [];
                flattenObject(data.behaviors.temporal_patterns, '', items);
                subcategories.push({ id: 'temporal_patterns', label: 'Temporal Patterns', icon: '⏰', items });
            }
            if (data.identity?.life_stage) {
                const items = [];
                flattenObject(data.identity.life_stage, '', items);
                subcategories.push({ id: 'life_stage', label: 'Life Stage', icon: '🎯', items });
            }
            if (data.communications?.communication_debt) {
                const items = [];
                flattenObject(data.communications.communication_debt, '', items);
                subcategories.push({ id: 'communication_debt', label: 'Communication Debt', icon: '📬', items });
            }
            return { subcategories };
        }
    },
    {
        id: 'work_career',
        label: 'Work & Career',
        icon: '💼',
        color: 'indigo',
        colorHex: '#6366f1',
        description: 'Your professional life, productivity, and career development',
        extractData: (data) => {
            const subcategories = [];
            if (data.identity?.basics?.occupation) {
                const items = [];
                flattenObject(data.identity.basics.occupation, '', items);
                subcategories.push({ id: 'occupation', label: 'Occupation', icon: '👔', items });
            }
            if (data.behaviors?.work_patterns) {
                const items = [];
                flattenObject(data.behaviors.work_patterns, '', items);
                subcategories.push({ id: 'work_patterns', label: 'Work Patterns', icon: '⚡', items });
            }
            if (data.behaviors?.digital_patterns?.productive_apps) {
                const items = [];
                flattenObject(data.behaviors.digital_patterns.productive_apps, '', items);
                subcategories.push({ id: 'productive_tools', label: 'Productive Tools', icon: '🛠️', items });
            }
            const workLocationItems = [];
            if (data.locations?.primary_locations?.university_studio) {
                flattenObject(data.locations.primary_locations.university_studio, 'studio', workLocationItems);
            }
            if (data.locations?.primary_locations?.cafe_work) {
                flattenObject(data.locations.primary_locations.cafe_work, 'cafe', workLocationItems);
            }
            if (workLocationItems.length > 0) {
                subcategories.push({ id: 'work_locations', label: 'Work Locations', icon: '🏢', items: workLocationItems });
            }
            if (data.identity?.life_stage?.aspirations) {
                const items = [];
                flattenObject({ aspirations: data.identity.life_stage.aspirations }, '', items);
                subcategories.push({ id: 'career_aspirations', label: 'Career Aspirations', icon: '🎓', items });
            }
            return { subcategories };
        }
    },
    {
        id: 'health_wellness',
        label: 'Health & Wellness',
        icon: '💓',
        color: 'red',
        colorHex: '#ef4444',
        description: 'Your physical and mental wellbeing',
        extractData: (data) => {
            const subcategories = [];
            if (data.health) {
                const items = [];
                flattenObject(data.health, '', items);
                subcategories.push({ id: 'physical_health', label: 'Physical Health', icon: '🏥', items });
            }
            if (data.behaviors?.health_patterns?.exercise) {
                const items = [];
                flattenObject(data.behaviors.health_patterns.exercise, '', items);
                subcategories.push({ id: 'exercise', label: 'Exercise Patterns', icon: '🏃', items });
            }
            if (data.behaviors?.health_patterns?.sleep) {
                const items = [];
                flattenObject(data.behaviors.health_patterns.sleep, '', items);
                subcategories.push({ id: 'sleep', label: 'Sleep Patterns', icon: '😴', items });
            }
            const stressItems = [];
            if (data.behaviors?.health_patterns?.stress_indicators) {
                flattenObject(data.behaviors.health_patterns.stress_indicators, 'indicators', stressItems);
            }
            if (data.identity?.personality?.stress_response) {
                stressItems.push({ label: 'stress response', value: data.identity.personality.stress_response });
            }
            if (data.identity?.personality?.recovery_pattern) {
                stressItems.push({ label: 'recovery pattern', value: data.identity.personality.recovery_pattern });
            }
            if (stressItems.length > 0) {
                subcategories.push({ id: 'stress_recovery', label: 'Stress & Recovery', icon: '🧘', items: stressItems });
            }
            return { subcategories };
        }
    },
    {
        id: 'personal_fulfillment',
        label: 'Personal Fulfillment',
        icon: '✨',
        color: 'gold',
        colorHex: '#f59e0b',
        description: 'Your identity, values, aspirations, and personal growth',
        extractData: (data) => {
            const subcategories = [];
            if (data.identity?.personality) {
                const items = [];
                flattenObject(data.identity.personality, '', items);
                subcategories.push({ id: 'personality', label: 'Personality', icon: '🎭', items });
            }
            if (data.identity?.life_stage?.aspirations) {
                const items = [];
                flattenObject({ aspirations: data.identity.life_stage.aspirations }, '', items);
                subcategories.push({ id: 'aspirations', label: 'Aspirations', icon: '🌟', items });
            }
            if (data.identity?.lifeos_relationship) {
                const items = [];
                flattenObject(data.identity.lifeos_relationship, '', items);
                subcategories.push({ id: 'lifeos_relationship', label: 'LifeOS Relationship', icon: '🤖', items });
            }
            if (data.relationships?.inner_circle) {
                const items = [];
                flattenObject(data.relationships.inner_circle, '', items);
                subcategories.push({ id: 'inner_circle', label: 'Inner Circle', icon: '👥', items });
            }
            if (data.behaviors?.context_switching_profile) {
                const items = [];
                flattenObject(data.behaviors.context_switching_profile, '', items);
                subcategories.push({ id: 'preferences', label: 'Personal Preferences', icon: '⚙️', items });
            }
            return { subcategories };
        }
    }
];

// Detail Panel Component
function DetailPanel({ subcategory, parentDomain, onClose }) {
    if (!subcategory) return null;

    return (
        <div
            className="fixed right-0 top-0 h-screen w-96 glass backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto custom-scrollbar"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
        >
            {/* Header */}
            <div className="sticky top-0 bg-dark-900/80 backdrop-blur-md p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{subcategory.icon}</span>
                        <h3 className="text-lg font-semibold text-white">{subcategory.label}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white/90 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>{parentDomain.icon}</span>
                    <span>{parentDomain.label}</span>
                    <span>›</span>
                    <span>{subcategory.items.length} items</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
                {subcategory.items.map((item, i) => {
                    const labelParts = item.label.split(' › ');
                    const displayLabel = labelParts[labelParts.length - 1];
                    const hasHierarchy = labelParts.length > 1;

                    return (
                        <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            {hasHierarchy && (
                                <span className="text-[9px] text-white/30 font-mono uppercase tracking-wide">
                                    {labelParts.slice(0, -1).join(' › ')}
                                </span>
                            )}
                            <div className="flex justify-between text-sm gap-4">
                                <span className="text-white/60 shrink-0 capitalize font-medium">{displayLabel}</span>
                                <span className="text-white/95 text-right break-words leading-relaxed">{item.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Physics-based Force Graph Component
function ForceGraph({ data, onSelectSubcategory, expandedDomains, onDomainClick }) {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const simulationRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [hoveredNode, setHoveredNode] = useState(null);

    // Build graph data from domains
    const buildGraphData = useCallback(() => {
        if (!data) return { nodes: [], links: [] };

        const nodes = [];
        const links = [];

        // Central node (user)
        const centerNode = {
            id: 'center',
            type: 'center',
            label: data.identity?.basics?.name || 'You',
            icon: '🧑‍💻',
            radius: 50,
            color: '#8b5cf6',
            fx: 0,
            fy: 0
        };
        nodes.push(centerNode);

        // Domain nodes
        DOMAINS.forEach((domain, i) => {
            const angle = (i / DOMAINS.length) * 2 * Math.PI - Math.PI / 2;
            const domainData = domain.extractData(data);
            const subcategoryCount = domainData.subcategories?.length || 0;

            const domainNode = {
                id: domain.id,
                type: 'domain',
                label: domain.label,
                icon: domain.icon,
                color: domain.colorHex,
                colorName: domain.color,
                radius: 35,
                subcategories: domainData.subcategories || [],
                subcategoryCount,
                // Initial position based on angle
                x: Math.cos(angle) * 200,
                y: Math.sin(angle) * 200
            };
            nodes.push(domainNode);
            links.push({ source: 'center', target: domain.id, strength: 0.3 });

            // Only add subcategory nodes if this domain is expanded
            if (expandedDomains.includes(domain.id)) {
                domainData.subcategories?.forEach((subcat, j) => {
                    const subAngle = angle + ((j - (domainData.subcategories.length - 1) / 2) * 0.4);
                    const subcatNode = {
                        id: `${domain.id}-${subcat.id}`,
                        type: 'subcategory',
                        label: subcat.label,
                        icon: subcat.icon,
                        color: domain.colorHex,
                        colorName: domain.color,
                        parentDomain: domain,
                        subcategory: subcat,
                        radius: 22,
                        itemCount: subcat.items?.length || 0,
                        x: Math.cos(subAngle) * 320,
                        y: Math.sin(subAngle) * 320
                    };
                    nodes.push(subcatNode);
                    links.push({ source: domain.id, target: subcatNode.id, strength: 0.5 });
                });
            }
        });

        return { nodes, links };
    }, [data, expandedDomains]);

    // Update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // D3 Force Simulation
    useEffect(() => {
        if (!svgRef.current || !data || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const width = dimensions.width;
        const height = dimensions.height;
        const centerX = width / 2;
        const centerY = height / 2;

        const { nodes, links } = buildGraphData();

        // Track pan offset and scale
        let panX = 0;
        let panY = 0;
        let currentScale = 1;

        // Main container for pannable/zoomable content
        const container = svg.append('g')
            .attr('transform', `translate(${centerX}, ${centerY}) scale(1)`);

        // Create zoom behavior for pinch-to-zoom
        // Filter wheel events: only zoom on pinch (ctrlKey) or touch gestures
        const zoom = d3.zoom()
            .scaleExtent([0.3, 3])
            .filter((event) => {
                // Allow touch events (pinch gestures)
                if (event.type === 'touchstart' || event.type === 'touchmove' || event.type === 'touchend') {
                    return true;
                }
                // Allow Ctrl+scroll for zoom (pinch on trackpad)
                if (event.type === 'wheel' && event.ctrlKey) {
                    return true;
                }
                // Block regular wheel events (we handle those separately for panning)
                if (event.type === 'wheel') {
                    return false;
                }
                // Allow other zoom events (like double-click if we add it)
                return !event.button;
            })
            .on('zoom', (event) => {
                // Update scale from zoom transform
                currentScale = event.transform.k;
                panX = event.transform.x - centerX;
                panY = event.transform.y - centerY;
                container.attr('transform', `translate(${centerX + panX}, ${centerY + panY}) scale(${currentScale})`);
            });

        svg.call(zoom);

        // Pan behavior using regular wheel/scroll (non-pinch)
        svg.on('wheel', (event) => {
            // Only handle non-pinch scroll events
            if (!event.ctrlKey) {
                event.preventDefault();

                // Use deltaX for horizontal scroll, deltaY for vertical scroll
                const deltaX = event.deltaX;
                const deltaY = event.deltaY;

                // Update pan offset
                panX -= deltaX;
                panY -= deltaY;

                // Apply transform with current scale
                container.attr('transform', `translate(${centerX + panX}, ${centerY + panY}) scale(${currentScale})`);

                // Update zoom transform to keep it in sync
                svg.call(zoom.transform, d3.zoomIdentity.translate(centerX + panX, centerY + panY).scale(currentScale));
            }
        });

        // Also support drag to pan
        const drag = d3.drag()
            .on('start', function (event) {
                d3.select(this).style('cursor', 'grabbing');
            })
            .on('drag', function (event) {
                panX += event.dx;
                panY += event.dy;
                container.attr('transform', `translate(${centerX + panX}, ${centerY + panY}) scale(${currentScale})`);

                // Update zoom transform to keep it in sync
                svg.call(zoom.transform, d3.zoomIdentity.translate(centerX + panX, centerY + panY).scale(currentScale));
            })
            .on('end', function (event) {
                d3.select(this).style('cursor', 'grab');
            });

        // Apply drag to svg background (not to nodes)
        svg.call(drag);

        // Gradient definitions
        const defs = svg.append('defs');

        // Create gradients for each domain color
        DOMAINS.forEach(domain => {
            const gradient = defs.append('linearGradient')
                .attr('id', `gradient-${domain.color}`)
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '100%');
            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', domain.colorHex)
                .attr('stop-opacity', 0.8);
            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', domain.colorHex)
                .attr('stop-opacity', 0.4);
        });

        // Glow filter
        const filter = defs.append('filter')
            .attr('id', 'glow')
            .attr('x', '-50%')
            .attr('y', '-50%')
            .attr('width', '200%')
            .attr('height', '200%');
        filter.append('feGaussianBlur')
            .attr('stdDeviation', '4')
            .attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
                .id(d => d.id)
                .distance(d => {
                    if (d.source.type === 'center') return 180;
                    return 100;
                })
                .strength(d => d.strength || 0.3))
            .force('charge', d3.forceManyBody()
                .strength(d => {
                    if (d.type === 'center') return -800;
                    if (d.type === 'domain') return -400;
                    return -200;
                }))
            .force('collision', d3.forceCollide().radius(d => d.radius + 15))
            .force('radial', d3.forceRadial(d => {
                if (d.type === 'center') return 0;
                if (d.type === 'domain') return 180;
                return 300;
            }, 0, 0).strength(0.3))
            .alphaDecay(0.02)
            .velocityDecay(0.4);

        simulationRef.current = simulation;

        // Draw links
        const linkGroup = container.append('g').attr('class', 'links');
        const link = linkGroup.selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', d => {
                const targetNode = nodes.find(n => n.id === (typeof d.target === 'string' ? d.target : d.target.id));
                return targetNode?.color || '#6366f1';
            })
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', d => d.source.type === 'center' ? 2 : 1.5)
            .style('stroke-dasharray', '5,5');

        // Draw nodes
        const nodeGroup = container.append('g').attr('class', 'nodes');
        const node = nodeGroup.selectAll('g')
            .data(nodes)
            .join('g')
            .attr('class', d => `node node-${d.type}`)
            .style('cursor', d => d.type === 'subcategory' ? 'pointer' : 'grab')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Node backgrounds
        node.append('circle')
            .attr('r', d => d.radius)
            .attr('fill', d => {
                if (d.type === 'center') {
                    return 'url(#gradient-purple)';
                }
                return `url(#gradient-${d.colorName})`;
            })
            .attr('stroke', d => d.color)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.5)
            .attr('filter', 'url(#glow)')
            .attr('class', 'node-circle');

        // Outer glow ring for center node
        node.filter(d => d.type === 'center')
            .insert('circle', ':first-child')
            .attr('r', d => d.radius + 15)
            .attr('fill', 'none')
            .attr('stroke', '#8b5cf6')
            .attr('stroke-width', 1)
            .attr('stroke-opacity', 0.3)
            .style('animation', 'pulse 2s infinite');

        // Node icons
        node.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('dy', d => d.type === 'center' ? '-0.3em' : d.type === 'domain' ? '-0.2em' : 0)
            .style('font-size', d => {
                if (d.type === 'center') return '28px';
                if (d.type === 'domain') return '20px';
                return '14px';
            })
            .style('pointer-events', 'none')
            .text(d => d.icon);

        // Node labels
        node.filter(d => d.type !== 'subcategory')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', d => d.type === 'center' ? '1.5em' : '1.2em')
            .style('font-size', d => d.type === 'center' ? '12px' : '9px')
            .style('font-weight', '500')
            .style('fill', 'rgba(255,255,255,0.9)')
            .style('pointer-events', 'none')
            .text(d => d.type === 'center' ? d.label : d.label.split(' ')[0]);

        // Subcategory count for domain nodes
        node.filter(d => d.type === 'domain')
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '2.3em')
            .style('font-size', '7px')
            .style('fill', 'rgba(255,255,255,0.4)')
            .style('pointer-events', 'none')
            .text(d => `${d.subcategoryCount} topics`);

        // Tooltip group (hidden by default)
        const tooltip = container.append('g')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('pointer-events', 'none');

        tooltip.append('rect')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('fill', 'rgba(26, 26, 37, 0.95)')
            .attr('stroke', 'rgba(255,255,255,0.1)')
            .attr('stroke-width', 1);

        tooltip.append('text')
            .attr('fill', 'white')
            .attr('font-size', '11px')
            .attr('text-anchor', 'middle');

        // Hover effects
        node.on('mouseenter', function (event, d) {
            if (d.type === 'subcategory' || d.type === 'domain') {
                d3.select(this).select('.node-circle')
                    .transition()
                    .duration(200)
                    .attr('r', d.radius * 1.15);

                if (d.type === 'subcategory') {
                    // Show tooltip for subcategories
                    const tooltipText = tooltip.select('text')
                        .text(`${d.label} (${d.itemCount} items)`);
                    const textBBox = tooltipText.node().getBBox();

                    tooltip.select('rect')
                        .attr('x', -textBBox.width / 2 - 10)
                        .attr('y', -textBBox.height / 2 - 6)
                        .attr('width', textBBox.width + 20)
                        .attr('height', textBBox.height + 12);

                    tooltip
                        .attr('transform', `translate(${d.x}, ${d.y - d.radius - 25})`)
                        .transition()
                        .duration(200)
                        .style('opacity', 1);

                    setHoveredNode(d);
                }
            }
        })
            .on('mouseleave', function (event, d) {
                if (d.type === 'subcategory' || d.type === 'domain') {
                    d3.select(this).select('.node-circle')
                        .transition()
                        .duration(200)
                        .attr('r', d.radius);

                    if (d.type === 'subcategory') {
                        tooltip.transition()
                            .duration(200)
                            .style('opacity', 0);

                        setHoveredNode(null);
                    }
                }
            })
            .on('click', function (event, d) {
                event.stopPropagation();
                if (d.type === 'subcategory') {
                    onSelectSubcategory(d.parentDomain, d.subcategory);
                } else if (d.type === 'domain') {
                    onDomainClick(d.id);
                }
            });

        // Simulation tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x}, ${d.y})`);

            // Update tooltip position
            if (hoveredNode) {
                tooltip.attr('transform', `translate(${hoveredNode.x}, ${hoveredNode.y - hoveredNode.radius - 25})`);
            }
        });

        // Drag functions
        function dragstarted(event, d) {
            if (d.type === 'center') return; // Can't drag center
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            if (d.type === 'center') return;
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (d.type === 'center') return;
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Cleanup
        return () => {
            simulation.stop();
        };
    }, [data, dimensions, buildGraphData, onSelectSubcategory]);

    return (
        <div ref={containerRef} className="absolute inset-0">
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="w-full h-full"
            />
        </div>
    );
}

// Main App
function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [expandedDomains, setExpandedDomains] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/context/knowledge-graph`);
                if (!res.ok) throw new Error('Failed to fetch knowledge graph');
                const graphData = await res.json();
                setData(graphData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSelectSubcategory = useCallback((domain, subcategory) => {
        setSelectedSubcategory({ domain, subcategory });
    }, []);

    const handleDomainClick = useCallback((domainId) => {
        setExpandedDomains(prev => {
            if (prev.includes(domainId)) {
                // Remove domain from expanded list
                return prev.filter(id => id !== domainId);
            } else {
                // Add domain to expanded list
                return [...prev, domainId];
            }
        });
        // Don't close selected subcategory unless it belongs to the domain being closed
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="text-white/60 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    <span>Loading knowledge graph...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="glass rounded-2xl p-8 max-w-md text-center">
                    <h2 className="text-xl font-semibold text-red-400 mb-3">Connection Error</h2>
                    <p className="text-white/60 mb-4">{error}</p>
                    <p className="text-white/40 text-sm mb-2">Make sure the backend is running:</p>
                    <code className="bg-dark-700 text-cyan-400 px-3 py-1.5 rounded text-sm">cd backend && npm run dev</code>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 overflow-hidden relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-radial opacity-50" />

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 p-6 z-40">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-white/90">Knowledge Graph</h1>
                        <p className="text-xs text-white/40">Personal context overview</p>
                    </div>
                    <div className="glass rounded-full px-4 py-2">
                        <span className="text-xs text-white/60">LifeOS</span>
                    </div>
                </div>
            </header>

            {/* Physics-based Force Graph */}
            <ForceGraph
                data={data}
                onSelectSubcategory={handleSelectSubcategory}
                expandedDomains={expandedDomains}
                onDomainClick={handleDomainClick}
            />

            {/* Detail Panel */}
            {selectedSubcategory && (
                <DetailPanel
                    subcategory={selectedSubcategory.subcategory}
                    parentDomain={selectedSubcategory.domain}
                    onClose={() => setSelectedSubcategory(null)}
                />
            )}

            {/* Footer hint */}
            <footer className="absolute bottom-0 left-0 right-0 p-6 z-40">
                <p className="text-center text-xs text-white/30">
                    Scroll or drag to pan • Pinch to zoom • Drag nodes to rearrange • Click domains to expand
                </p>
            </footer>
        </div>
    );
}

export default App;
