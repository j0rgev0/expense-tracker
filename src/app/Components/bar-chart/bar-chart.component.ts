import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
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
export class BarChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @Input() data: { category: string; amount: number }[] = [];

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => this.createChart());
    this.resizeObserver.observe(this.chartContainer.nativeElement);
    this.createChart(); // Llamada inicial
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange && this.chartContainer) {
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    console.log('Creating chart with dimensions:', {
      width,
      height,
      dataLength: this.data?.length
    });

    if (width === 0 || height === 0) {
      console.log('Container has no dimensions, skipping chart creation');
      return;
    }

    d3.select(element).selectAll('*').remove();

    const margin = { top: 5, right: 5, bottom: 15, left: 20 };
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
      console.log('No data available, showing message');
      svg
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('class', 'fill-gray-500 text-xs font-semibold')
        .text('No data available');
      return;
    }

    console.log('Creating chart with data:', this.data);

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
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '8px')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');

    svg.append('g').call(d3.axisLeft(y)).selectAll('text').style('font-size', '8px');

    svg
      .selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => {
        const xValue = x(d.category);
        return xValue !== undefined ? xValue : 0;
      })
      .attr('y', d => y(d.amount))
      .attr('width', x.bandwidth())
      .attr('height', d => innerHeight - y(d.amount))
      .attr('fill', '#4e79a7');

    console.log('Chart created successfully');
  }
}
