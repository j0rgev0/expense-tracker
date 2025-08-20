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
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
    '#84CC16', // lime-500
    '#6366F1' // indigo-500
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
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Título mejorado con mejor tipografía y estilo
    d3.select(element)
      .select('svg')
      .append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-bold fill-gray-800')
      .text('Distribución de Gastos');

    if (!this.data || this.data.length === 0) {
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'fill-gray-400 text-sm font-medium')
        .text('Sin datos disponibles');
      return;
    }

    // Generador del pie
    const pie = d3
      .pie<{ category: string; amount: number }>()
      .value(d => d.amount)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ category: string; amount: number }>>()
      .innerRadius(0)
      .outerRadius(radius - 34);

    // Usar paleta de colores personalizada
    const color = d3
      .scaleOrdinal()
      .domain(this.data.map((_, i) => String(i)))
      .range(this.colorPalette);

    const arcs = svg
      .selectAll<SVGPathElement, d3.PieArcDatum<{ category: string; amount: number }>>('path')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => color(String(i)) as string)
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).style('transform', 'scale(1.02)');

        tooltip.classed('hidden', false).html(`
            <div class="font-semibold text-white">${d.data.category}</div>
            <div class="text-blue-200">$${d.data.amount.toLocaleString()}</div>
          `);
      })
      .on('mousemove', event => {
        const [xPos, yPos] = d3.pointer(event);
        tooltip.style('left', `${xPos + 15}px`).style('top', `${yPos - 20}px`);
      })
      .on('mouseout', event => {
        d3.select(event.currentTarget)
          .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))')
          .style('transform', 'scale(1)');
        tooltip.classed('hidden', true);
      });

    // Etiquetas mejoradas dentro de los slices
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
      .text((d): string => CATEGORY_ABBREVIATIONS[d.data.category] ?? d.data.category);
  }
}
