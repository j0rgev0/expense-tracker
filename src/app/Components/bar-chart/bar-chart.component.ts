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

    const margin = { top: 10, right: 10, bottom: 50, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

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

    // Eje X
    svg
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#6b7280')
      .attr('text-anchor', 'end');

    // Eje Y
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#6b7280');

    // Barras + tooltip
    svg
      .selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.category) ?? 0)
      .attr('y', d => y(d.amount))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.amount))
      .attr('fill', '#4e79a7')
      .on('mouseover', (event, d) => {
        tooltip.classed('hidden', false).html(`<strong>${d.category}</strong>: ${d.amount}`);
      })
      .on('mousemove', event => {
        const [xPos, yPos] = d3.pointer(event);
        tooltip.style('left', `${xPos + 15}px`).style('top', `${yPos - 20}px`);
      })
      .on('mouseout', () => {
        tooltip.classed('hidden', true);
      });
  }
}
