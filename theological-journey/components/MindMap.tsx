import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MindMapData, MindMapNode, MindMapLink } from '../types';

interface MindMapProps {
  data: MindMapData;
}

const MindMap: React.FC<MindMapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.nodes.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svg.node()?.getBoundingClientRect().width || 600;
    const height = svg.node()?.getBoundingClientRect().height || 400;

    const links: (MindMapLink & { source: MindMapNode, target: MindMapNode })[] = data.links.map(d => Object.create(d) as any);
    const nodes: MindMapNode[] = data.nodes.map(d => Object.create(d) as MindMapNode);

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d: any) => d.id).distance(70))
        .force("charge", d3.forceManyBody().strength(-150))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 8)
        .attr("fill", d => color(d.group.toString()));
        
    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
        .attr("class", "label")
        .attr("fill", "#ddd")
        .attr("font-size", "10px")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(d => d.label);

    node.append("title")
        .text(d => d.label);

    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

      node
          .attr("cx", d => d.x!)
          .attr("cy", d => d.y!);

      labels
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    });

  }, [data]);

  return (
    <div className="w-full h-full p-4 bg-slate-800/50 border-l border-slate-700">
        <h3 className="text-xl font-bold text-purple-300 mb-2">Concept Map</h3>
        {data.nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
                <p>Generate a map from your text to visualize connections.</p>
            </div>
        ) : (
            <svg ref={svgRef} className="w-full h-full"></svg>
        )}
    </div>
  );
};

export default MindMap;
