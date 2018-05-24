import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any, Morris: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
      $(function () {
          // Widgets count
          $('.count-to').countTo();

          // Sales count to
          $('.sales-count-to').countTo({
              formatter: function (value, options) {
                  return '$' + value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, ' ').replace('.', ',');
              }
          });

          initRealTimeChart();
          initDonutChart();
          initSparkline();
      });

      var realtime = 'on';
      function initRealTimeChart() {
          // Real time ==========================================================================================
          const plot = $.plot('#real_time_chart', [getRandomData()], {
              series: {
                  shadowSize: 0,
                  color: 'rgb(0, 188, 212)'
              },
              grid: {
                  borderColor: '#f3f3f3',
                  borderWidth: 1,
                  tickColor: '#f3f3f3'
              },
              lines: {
                  fill: true
              },
              yaxis: {
                  min: 0,
                  max: 100
              },
              xaxis: {
                  min: 0,
                  max: 100
              }
          });

          function updateRealTime() {
              plot.setData([getRandomData()]);
              plot.draw();

              var timeout;
              if (realtime === 'on') {
                  timeout = setTimeout(function() { updateRealTime(); }, 320);
              } else {
                  clearTimeout(timeout);
              }
          }

          updateRealTime();

          $('#realtime').on('change', function () {
              realtime = this.checked ? 'on' : 'off';
              updateRealTime();
          });
          // ====================================================================================================
      }

      function initSparkline() {
          $('.sparkline').each(function () {
              const $this = $(this);
              $this.sparkline('html', $this.data());
          });
      }

      function initDonutChart() {
          Morris.Donut({
              element: 'donut_chart',
              data: [{
                  label: 'Chrome',
                  value: 37
              }, {
                  label: 'Firefox',
                  value: 30
              }, {
                  label: 'Safari',
                  value: 18
              }, {
                  label: 'Opera',
                  value: 12
              },
                  {
                      label: 'Other',
                      value: 3
                  }],
              colors: ['rgb(233, 30, 99)', 'rgb(0, 188, 212)', 'rgb(255, 152, 0)', 'rgb(0, 150, 136)', 'rgb(96, 125, 139)'],
              formatter: function (y) {
                  return y + '%';
              }
          });
      }

      var data1 = new Array();
      var totalPoints = 110;
      function getLenth(myObject) {
          var key, count = 0;
          for ( key in myObject ) {
              if(myObject.hasOwnProperty(key)) {
                  count++;
              }
          }
          return count;
      }
      function getRandomData() {
          if (getLenth(data1) > 0) {
              data1 = data1.slice(1);
          }
          while (getLenth(data1) < totalPoints) {
              var prev = getLenth(data1) > 0 ? data1[getLenth(data1) - 1] : 50, y = prev + Math.random() * 10 - 5;
              if (y < 0) { y = 0; } else if (y > 100) { y = 100; }

              data1.push(y);
          }

          var res = [];
          for (var i = 0; i < getLenth(data1); ++i) {
              res.push([i, data1[i]]);
          }

          return res;
      }
  }
}
