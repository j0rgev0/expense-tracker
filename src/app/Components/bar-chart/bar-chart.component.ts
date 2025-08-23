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
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html'
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @ViewChild('tooltipRef', { static: true }) private tooltipRef!: ElementRef;
  @Input() data: { category: string; amount: number }[] = [];

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

    const margin = { top: 30, right: 10, bottom: 50, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svgElement = d3.select(element).append('svg').attr('width', width).attr('height', height);

    svgElement
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm font-semibold fill-gray-700')
      .text('Distribution of Expenses');

    const svg = svgElement.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    if (!this.data || this.data.length === 0) {
      svg
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'fill-gray-500 text-xs font-semibold')
        .text('No data available');
      return;
    }

    const x = d3
      .scaleBand()
      .domain(this.data.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.2);

    const yMax = d3.max(this.data, d => d.amount) ?? 0;
    const y = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickFormat((d: string) => CATEGORY_ABBREVIATIONS[d] ?? d))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .style('text-transform', 'capitalize');

    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(10))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#6b7280');

    const bars = svg
      .selectAll<SVGPathElement, (typeof this.data)[0]>('.bar')
      .data(this.data, d => d.category);

    bars.join(
      enter =>
        enter
          .append('path')
          .attr('class', 'bar')
          .attr('fill', (_, i) => (i % 2 === 0 ? '#3b82f6' : '#bfdbfe'))
          .attr('d', d => {
            const xVal = x(d.category) ?? 0;
            const barWidth = x.bandwidth();
            const r = Math.min(6, barWidth / 2, 0);
            return `
              M${xVal},${innerHeight}
              a${r},${r} 0 0 1 ${r},0
              h${barWidth - 2 * r}
              a${r},${r} 0 0 1 ${r},0
              v0
              h-${barWidth}
              Z
            `;
          })
          .on('mouseover', (event, d) => {
            tooltip.classed('hidden', false).html(`
            <div class="font-semibold text-white capitalize">${d.category}</div>
            <div class="text-blue-200 text-center">$${d.amount.toLocaleString()}</div>
          `);
          })
          .on('mousemove', event => {
            const [xPos, yPos] = d3.pointer(event);
            tooltip.style('left', `${xPos + 15}px`).style('top', `${yPos - 20}px`);
          })
          .on('mouseout', () => {
            tooltip.classed('hidden', true);
          })
          .transition()
          .duration(600)
          .attr('d', d => {
            const xVal = x(d.category) ?? 0;
            const yVal = y(d.amount);
            const barWidth = x.bandwidth();
            const barHeight = innerHeight - yVal;
            const r = Math.min(6, barWidth / 2, barHeight);
            return `
              M${xVal},${yVal + r}
              a${r},${r} 0 0 1 ${r},-${r}
              h${barWidth - 2 * r}
              a${r},${r} 0 0 1 ${r},${r}
              v${barHeight - r}
              h-${barWidth}
              Z
            `;
          }),

      update =>
        update
          .on('mouseover', (event, d) => {
            tooltip.classed('hidden', false).html(`$${d.amount}`);
          })
          .on('mousemove', event => {
            const [xPos, yPos] = d3.pointer(event);
            tooltip.style('left', `${xPos + 15}px`).style('top', `${yPos - 20}px`);
          })
          .on('mouseout', () => {
            tooltip.classed('hidden', true);
          })
          .transition()
          .duration(600)
          .attr('d', d => {
            const xVal = x(d.category) ?? 0;
            const yVal = y(d.amount);
            const barWidth = x.bandwidth();
            const barHeight = innerHeight - yVal;
            const r = Math.min(6, barWidth / 2, barHeight);
            return `
              M${xVal},${yVal + r}
              a${r},${r} 0 0 1 ${r},-${r}
              h${barWidth - 2 * r}
              a${r},${r} 0 0 1 ${r},${r}
              v${barHeight - r}
              h-${barWidth}
              Z
            `;
          }),
      exit =>
        exit
          .transition()
          .duration(400)
          .attr('d', d => {
            const xVal = x(d.category) ?? 0;
            const barWidth = x.bandwidth();
            const r = Math.min(6, barWidth / 2, 0);
            return `
                M${xVal},${innerHeight}
                a${r},${r} 0 0 1 ${r},0
                h${barWidth - 2 * r}
                a${r},${r} 0 0 1 ${r},0
                v0
                h-${barWidth}
                Z
              `;
          })
          .remove()
    );
  }
}
