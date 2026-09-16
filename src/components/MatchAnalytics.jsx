import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function MatchAnalytics({ summary }) {
  const chartRef = useRef(null);
  const heatmapRef = useRef(null);
  const donutRef = useRef(null);

  const homeTeam = summary?.boxscore?.teams?.[0]?.team;
  const awayTeam = summary?.boxscore?.teams?.[1]?.team;
  const homeStats = summary?.boxscore?.teams?.[0]?.statistics;
  const awayStats = summary?.boxscore?.teams?.[1]?.statistics;

  const getStat = (stats, name) => {
    const s = stats?.find(st => st.name === name);
    return s ? parseFloat(s.displayValue) : 0;
  };

  const homePossession = getStat(homeStats, 'possessionPct') || 50;
  const awayPossession = getStat(awayStats, 'possessionPct') || 50;

  useEffect(() => {
    if (!donutRef.current || !homeTeam || !awayTeam) return;
    d3.select(donutRef.current).selectAll('*').remove();

    const width = 150;
    const height = 150;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(donutRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain([homeTeam.abbreviation, awayTeam.abbreviation])
      .range(['#ff6b00', '#2563eb']);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const dataReady = pie([
      { label: homeTeam.abbreviation, value: homePossession },
      { label: awayTeam.abbreviation, value: awayPossession }
    ]);

    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius);

    svg.selectAll('allSlices')
      .data(dataReady)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', '#18181b')
      .style('stroke-width', '4px')
      .style('opacity', 0.9)
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
        return function(t) {
          d.endAngle = i(t);
          return arc(d);
        }
      });
      
    // Center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .text(`${homePossession}%`)
      .attr('fill', '#fff')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold');
  }, [homePossession, awayPossession, homeTeam, awayTeam]);

  useEffect(() => {
    if (!chartRef.current || !homeTeam || !awayTeam) return;
    d3.select(chartRef.current).selectAll('*').remove();

    // Mock Momentum Data
    const data = Array.from({ length: 90 }, (_, i) => ({
      minute: i + 1,
      momentum: Math.sin(i / 5) * 50 + (Math.random() * 20 - 10), // Values roughly between -60 and +60
    }));

    const width = chartRef.current.clientWidth;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, 90])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([-100, 100])
      .range([innerHeight, 0]);

    // Zero line
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', '#3f3f46') // sports-border
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d => d + "'"))
      .attr('color', '#a1a1aa'); // sports-textMuted

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#a1a1aa');

    const areaHome = d3.area()
      .x(d => x(d.minute))
      .y0(y(0))
      .y1(d => y(Math.max(0, d.momentum)))
      .curve(d3.curveMonotoneX);

    const areaAway = d3.area()
      .x(d => x(d.minute))
      .y0(y(0))
      .y1(d => y(Math.min(0, d.momentum)))
      .curve(d3.curveMonotoneX);

    // Home Area (Positive)
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#home-gradient)')
      .attr('d', areaHome);

    // Away Area (Negative)
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#away-gradient)')
      .attr('d', areaAway);

    // Gradients
    const defs = svg.append('defs');
    const homeGrad = defs.append('linearGradient')
      .attr('id', 'home-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    homeGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ff6b00').attr('stop-opacity', 0.8);
    homeGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ff6b00').attr('stop-opacity', 0.1);

    const awayGrad = defs.append('linearGradient')
      .attr('id', 'away-gradient')
      .attr('x1', '0%').attr('y1', '100%')
      .attr('x2', '0%').attr('y2', '0%');
    awayGrad.append('stop').attr('offset', '0%').attr('stop-color', '#2563eb').attr('stop-opacity', 0.8);
    awayGrad.append('stop').attr('offset', '100%').attr('stop-color', '#2563eb').attr('stop-opacity', 0.1);
    
    // Labels
    svg.append('text')
      .attr('x', 10)
      .attr('y', 10)
      .text(homeTeam?.abbreviation || 'HOME')
      .attr('fill', '#ff6b00')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');
      
    svg.append('text')
      .attr('x', 10)
      .attr('y', innerHeight - 10)
      .text(awayTeam?.abbreviation || 'AWAY')
      .attr('fill', '#2563eb')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

  }, [summary, homeTeam, awayTeam]);

  useEffect(() => {
    if (!heatmapRef.current) return;
    d3.select(heatmapRef.current).selectAll('*').remove();
    
    const width = heatmapRef.current.clientWidth || 600;
    const height = 250;

    const svg = d3.select(heatmapRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', '#143e1d')
      .style('border', '2px solid rgba(255,255,255,0.2)')
      .style('border-radius', '8px');

    // Draw Pitch Lines
    const g = svg.append('g');
    g.append('rect').attr('x', width/2).attr('y', 0).attr('width', 2).attr('height', height).attr('fill', 'rgba(255,255,255,0.2)');
    g.append('circle').attr('cx', width/2).attr('cy', height/2).attr('r', 30).attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-width', 2).attr('fill', 'none');
    g.append('rect').attr('x', 0).attr('y', height/4).attr('width', 40).attr('height', height/2).attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-width', 2).attr('fill', 'none');
    g.append('rect').attr('x', width-40).attr('y', height/4).attr('width', 40).attr('height', height/2).attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-width', 2).attr('fill', 'none');

    // Mock Heatmap Data (Home attacking Right)
    const points = Array.from({ length: 300 }, () => ({
      x: Math.random() * (width * 0.8) + (width * 0.1),
      y: Math.random() * height
    }));
    
    // Bias towards right for home team
    points.push(...Array.from({ length: 150 }, () => ({
      x: Math.random() * (width * 0.4) + (width * 0.5),
      y: Math.random() * height * 0.6 + height * 0.2
    })));

    const density = d3.contourDensity()
      .x(d => d.x)
      .y(d => d.y)
      .size([width, height])
      .bandwidth(20)
      .thresholds(15)
      (points);

    const color = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, d3.max(density, d => d.value)]);

    svg.append('g')
      .selectAll('path')
      .data(density)
      .join('path')
      .attr('fill', d => color(d.value))
      .attr('d', d3.geoPath())
      .attr('opacity', 0.6);

  }, []);

  if (!summary || !summary.boxscore || !summary.boxscore.teams || summary.boxscore.teams.length < 2) {
    return <div className="text-center py-10 text-sports-textMuted text-sm">Analytics not available yet.</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Possession Donut & Momentum */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sports-surfaceHover rounded-xl p-4 border border-sports-border shadow-inner flex flex-col items-center justify-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sports-textMuted mb-2">Possession</h4>
          <div ref={donutRef} className="w-[150px] h-[150px]"></div>
          <div className="flex justify-between w-full mt-4 text-xs font-bold px-4">
             <span className="text-sports-primary">{homeTeam?.abbreviation}</span>
             <span className="text-blue-500">{awayTeam?.abbreviation}</span>
          </div>
        </div>

        <div className="md:col-span-2 bg-sports-surfaceHover rounded-xl p-4 border border-sports-border shadow-inner flex flex-col justify-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sports-textMuted mb-2">Match Momentum</h4>
          <div ref={chartRef} className="w-full"></div>
        </div>
      </div>

      {/* Heatmap */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-sports-textMuted">Action Heatmap</h4>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-sports-primary">{homeTeam?.abbreviation}</span>
            <span className="text-xs text-sports-textMuted text-opacity-50">vs</span>
            <span className="text-xs font-bold text-blue-500">{awayTeam?.abbreviation}</span>
          </div>
        </div>
        <div className="relative w-full rounded-xl overflow-hidden shadow-inner border border-sports-border">
          <div ref={heatmapRef} className="w-full h-[250px]"></div>
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded">
             <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
             <div className="w-2 h-2 rounded-full bg-orange-500"></div>
             <div className="w-2 h-2 rounded-full bg-red-600"></div>
             <span className="text-[10px] font-bold uppercase text-white ml-1">High Intensity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
