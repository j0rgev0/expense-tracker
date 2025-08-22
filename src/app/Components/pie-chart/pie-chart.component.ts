import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';
import { CATEGORY_ABBREVIATIONS } from '../../utils/consts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html'
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @ViewChild('tooltipRef', { static: true }) private tooltipRef!: ElementRef;
  @Input() data: { category: string; amount: number }[] = [];

  private readonly colorPalette = [
    '#3B82F6', // blue-500
    '#2563EB', // blue-600
    '#10B981', // emerald-500
    '#059669', // emerald-600
    '#F59E0B', // amber-500
    '#D97706', // amber-600
    '#EF4444', // red-500
    '#DC2626', // red-600
    '#8B5CF6', // violet-500
    '#7C3AED', // violet-600
    '#06B6D4', // cyan-500
    '#0891B2', // cyan-600
    '#F97316', // orange-500
    '#EA580C', // orange-600
    '#EC4899', // pink-500
    '#DB2777', // pink-600
    '#84CC16', // lime-500
    '#65A30D', // lime-600
    '#6366F1', // indigo-500
    '#4F46E5' // indigo-600
  ];

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange && this.chartContainer) {
      this.createChart();
    }
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const tooltip = d3.select(this.tooltipRef.nativeElement);
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    if (width === 0 || height === 0) return;

    d3.select(element).selectAll('svg').remove();

    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2 - 55},${height / 2})`); // corrido un poco a la izquierda para dejar sitio a la leyenda

    // Título
    d3.select(element)
      .select('svg')
      .append('text')
      .attr('x', width / 2 - 80)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm font-semibold fill-gray-700')
      .text('Distribution of Expenses');

    if (!this.data || this.data.length === 0) {
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'fill-gray-500 text-xs font-semibold')
        .text('No data available');
      return;
    }

    const total = d3.sum(this.data, d => d.amount);

    // Generador del pie
    const pie = d3
      .pie<{ category: string; amount: number }>()
      .value(d => d.amount)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ category: string; amount: number }>>()
      .innerRadius(0)
      .outerRadius(radius - 34);

    // Colores
    const color = d3
      .scaleOrdinal()
      .domain(this.data.map((_, i) => String(i)))
      .range(this.colorPalette);

    // Slices con animación
    const arcs = svg
      .selectAll<SVGPathElement, d3.PieArcDatum<{ category: string; amount: number }>>('path')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('fill', (_, i) => color(String(i)) as string)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .style('stroke', '#fff')
          .style('stroke-width', 2)
          .style('transform', 'scale(1.03)');

        tooltip.classed('hidden', false).html(`
            <div class="font-semibold text-white capitalize">${d.data.category}</div>
            <div class="text-blue-200 text-center">$${d.data.amount.toLocaleString()}</div>
          `);
      })
      .on('mousemove', event => {
        const [xPos, yPos] = d3.pointer(event);
        tooltip.style('left', `${xPos + 85}px`).style('top', `${yPos + 50}px`);
      })
      .on('mouseout', event => {
        d3.select(event.currentTarget).style('stroke', 'none').style('transform', 'scale(1)');
        tooltip.classed('hidden', true);
      })
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t))!;
      });

    // Etiquetas dentro de los slices solo si >10%
    svg
      .selectAll<SVGTextElement, d3.PieArcDatum<{ category: string; amount: number }>>('text.slice')
      .data(pie(this.data))
      .enter()
      .append('text')
      .attr('class', 'slice text-[11px] fill-white font-bold')
      .style('font-family', 'Inter, system-ui, sans-serif')
      .attr('transform', (d): string => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text((d): string => {
        const percentage = (d.data.amount / total) * 100;
        if (percentage < 10) return '';
        return CATEGORY_ABBREVIATIONS[d.data.category] ?? d.data.category;
      });

    // Leyenda
    const legend = d3
      .select(element)
      .select('svg')
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 110}, ${50})`);

    const legendItems = legend
      .selectAll('.legend-item')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_, i) => `translate(0, ${i * 15})`); // menos separación vertical

    legendItems
      .append('rect')
      .attr('width', 10) // más pequeño
      .attr('height', 10) // más pequeño
      .attr('rx', 2) // esquinas más sutiles
      .attr('fill', (_, i) => color(String(i)) as string);

    legendItems
      .append('text')
      .attr('x', 16) // ajustado al nuevo tamaño del cuadrado
      .attr('y', 8) // centrado con el cuadrado
      .attr('class', 'text-[10px] font-normal fill-gray-600 capitalize')
      .style('font-family', 'Inter, system-ui, sans-serif')
      .text(d => `${CATEGORY_ABBREVIATIONS[d.category] ?? d.category}`);
  }
}
