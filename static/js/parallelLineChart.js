function makeParallelLineData(data) {
    var parallelLineData = [];
    for(var i = 0;i<data.length;i++)
    {
        parallelLineData.push({
            name: data[i][5],
            math: data[i][1],
            chinese: data[i][2],
            english: data[i][3],
            chemistry:data[i][4]
        });
    }
    return parallelLineData;
}
function drawParallelLineChart(){


    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        lineColor: chart._colors[0],
        margins: {top: 10, left: 10, bottom: 10, right: 10},
        textColor: 'black',
        title: '平行坐标系折线图',
        hoverColor: 'red',
        padding: 100,
        animateDuration: 1000
    }
    chart.height(550);
    chart.width(240);
    chart.margins(config.margins);
    const fields =  ['x1', 'x2', 'x3','x4'];
    config.padding=(chart.height()/fields.length).toFixed(0);
    /* ----------------------------尺度转换------------------------  */

    chart.scales = fields.map((subject) => {
        return d3.scaleLinear()
                    .domain([0,20])
                    .range([chart.getBodyWidth()*0.1,chart.getBodyWidth()]);
    });

    /* ----------------------------渲染线条------------------------  */
    chart.renderLines = function(){
        data = [[[0,3],[3,9],[0,20] ]
            [[0,20],[7,11],[5,9]]];
         area = d3.area()
             .x((d) => d[0])
             .y0((d) => d[1])
             .y1((d) => d[2]);
        const lines = chart.body().append('g')
                                .attr('class', 'lines')



              lines.append('path')
                  .attr('stroke',  chart._colors[1])
                  .attr('stroke-width', 2)
                .attr('fill',  chart._colors[1])
                  .attr("opacity",0.5)
                            .attr('d', area(generatePoints([[0,20],[9,20],[5,9],[0,7]],0)))
            lines.append('path')
                      .attr('stroke',  chart._colors[2])
                      .attr('stroke-width', 2)
                    .attr('fill',  chart._colors[2])
                      .attr("opacity",0.5)
                                .attr('d', area(generatePoints([[0,5],[0,11],[0,8],[0,20]],0)))

              // linesEnter.append('text')
              //               .attr('dx', '1em')
              //               .attr('transform', (d,i) => 'translate(' + 3.5 * config.padding + ',' + chart.scales[chart.scales.length-1](d['chemistry'])+')' )
              //               .text((d) => d.name)

              lines.exit()
                      .remove()

        function generatePoints(d,n) {
            return d.map((item, index) => {
                return [
                    (index+0.5+n) * config.padding,
                    chart.scales[index](item[0]),
                    chart.scales[index](item[1])
                ];
            });
        }

    }
    /* ----------------------------渲染坐标轴------------------------  */
    chart.renderAxis = function(){
        chart.scales.forEach((scale, index) => {
            chart.body()
                 .append('g')
                 .attr('class', 'axis axis-' + index)
                 .attr('transform', 'translate(0,' + (index+0.5) * config.padding + ')' )
                 .call(d3.axisBottom(scale).ticks(8));
        });
    }

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){

        fields.forEach((subject, index) => {

            d3.select('.axis-' + (index) ).append('text')
                        .attr('class', 'label label-' + (index))
                        .attr('transform', 'translate(0,0)' )
                        .attr('stroke', config.textColor)
                        .attr('fill', config.textColor)
                        .attr('dx', '1em')
                        .attr('dy', '2em')
                        .text(subject)
        });
    }

    /* ----------------------------渲染图标题------------------------  */
    chart.renderTitle = function(){
        chart.svg().append('text')
                .classed('title', true)
                .attr('x', chart.width()/2)
                .attr('y', 0)
                .attr('dy', '2em')
                .text(config.title)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);
    }

    chart.render = function(){

        chart.renderAxis();

       chart.renderText();

        // chart.renderLines();
        //chart`.renderLines();
        //chart.renderLines();
        //chart.renderLines() ;

        // chart.renderTitle();

    }
    chart.box(d3.select("#streamView"));
    chart.renderChart();

}
// d3.csv('./data/parallelLineChart.csv', function(d){
//     return {
//         name: d.name,
//         math: +d.math,
//         chinese: +d.chinese,
//         english: +d.english,
//         chemistry: +d.chemistry
//     };
// }).then(function (data) {
//     // makeParallelLineData()
//     drawParallelLineChart(data);
// });















