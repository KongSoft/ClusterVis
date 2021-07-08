function drawBasicPieChart(data){
 /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    chart.width(300);
    chart.height(200);
    const config = {
        margins: {top: 10, left: 10, bottom: 10, right: 10},
        textColor: 'black',
        title: '饼图',
        innerRadius: 0,
        outerRadius: 50,
        textOffsetH: 10,
        lineColor: 'black',
        animateDuration: 1000
    }

    chart.margins(config.margins);

    /* ----------------------------尺度转换------------------------  */
    chart.arcAngle = d3.pie()
                    .sort((d,i) => i)
                    .value((d) => d.num);

    /* ----------------------------渲染扇形------------------------  */
    chart.renderSlices = function(){
        const slices = chart.body().append('g')
                            .classed('pie', true)
                            .attr('transform', 'translate(' + chart.getBodyWidth()/2 + ',' + chart.getBodyHeight()/2 + ')')
                            .selectAll('.arc')
                            .data(chart.arcAngle(data));

              slices.enter()
                        .append('path')
                        .attr('class', (d,i) => 'arc arc-' + i)
                          .attr('fill', (d,i) => chart._colors(i))
                        .transition().duration(config.animateDuration)
                        .attrTween("d", arcTween)

              slices.exit()
                        .remove();

        const arc = d3.arc()
                        .outerRadius(config.outerRadius)
                        .innerRadius(config.innerRadius);

        function arcTween(d){
            let currentArc = this._current;

            if (!currentArc){
                currentArc = {startAngle: 0, endAngle: 0};
            }

            const interpolate = d3.interpolate(currentArc, d);
            this._current = interpolate(1);   //当饼图更新时，从当前角度过渡到新角度

            return function(t){
                return arc(interpolate(t));
            }
        }
    }

    /* ----------------------------渲染文本标签和线条------------------------  */
    chart.renderText = function(){

        // ----渲染文本标签-----
        const arc = d3.arc()
                        .outerRadius(config.outerRadius * 2.5)
                        .innerRadius(config.innerRadius);

        const scaleTextDx = d3.scaleLinear()
                                .domain([0, Math.PI/2])
                                .range([config.textOffsetH, config.textOffsetH * 3]);

        const labels = d3.select('.pie')
                            .selectAll('.label')
                            .data(chart.arcAngle(data));

              labels.enter()
                        .append('text')
                        .classed('label', true)
                    .merge(labels)
                        .attr('stroke', config.textColor)
                        .attr('fill', config.textColor)
                        .attr('text-anchor', (d) => {
                            return (d.endAngle + d.startAngle)/2 > Math.PI ? 'end' : 'start';
                        })
                        .attr('dy', '0.35em')
                        .attr('dx', computeTextDx)
                        .transition().duration(0).delay(config.animateDuration)
                        .attr('transform', (d) => {
                            return 'translate(' + arc.centroid(d) + ')'
                        })
                        .text((d) => 'Type'+d.data.name+': '+d.data.num);

                labels.exit()
                        .remove();

        // ----渲染标签连线-----
        const arc1 = d3.arc()
                        .outerRadius(config.outerRadius * 2)
                        .innerRadius(config.innerRadius);

        const points = getLinePoints();

        const generateLine = d3.line()
                                .x((d) => d[0])
                                .y((d) => d[1]);

        const  lines = d3.select('.pie')
                            .selectAll('.line')
                            .data(points);

               lines.enter()
                        .insert('path',':first-child')
                        .classed('line', true)
                    .merge(lines)
                        .transition().duration(0).delay(config.animateDuration)
                        .attr('fill', 'none')
                        .attr('stroke', config.lineColor)
                        .attr('d', generateLine);

                lines.exit()
                        .remove();

        function computeTextDx(d){                      //计算文本水平偏移
            const middleAngle = (d.endAngle + d.startAngle)/2;
            let dx = ''
            if (middleAngle < Math.PI){
                dx = scaleTextDx(Math.abs(middleAngle - Math.PI/2));
            }else{
                dx = -scaleTextDx(Math.abs(middleAngle - Math.PI*3/2));
            }
            return dx;
        }

        function getLinePoints(){                       //生成连线的点
            return chart.arcAngle(data).map((d) =>{
                const line = [];
                const tempPoint = arc.centroid(d);
                const tempDx = computeTextDx(d);
                const dx = tempDx > 0 ? tempDx - config.textOffsetH : tempDx + config.textOffsetH;
                line.push(arc1.centroid(d));
                line.push(tempPoint);
                line.push([tempPoint[0] + dx, tempPoint[1]]);
                return line;
            })
        }
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

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){

        const arcLarger = d3.arc()
                            .outerRadius(config.outerRadius * 1.1)
                            .innerRadius(config.innerRadius);

        const arcNormal = d3.arc()
                            .outerRadius(config.outerRadius)
                            .innerRadius(config.innerRadius);

        d3.selectAll('.arc')
            .on('mouseover', function(d){
                const e = d3.event;

                d3.select(e.target)
                    .attr('d', arcLarger(d));
            })
            .on('mouseleave', function(d){
                const e = d3.event;

                d3.select(e.target)
                    .attr('d', arcNormal(d));
            })
            .on('click',function (d) {
                type = d.data.name;
                objString = JSON.stringify(analyData);
                showData = JSON.parse(objString);
                for(var i = 0; i<showData.length;i++)
                {

                    if(showData[i][n_feature+1]!=type)
                        showData[i][n_feature+1] = 9;
                }
                MakeBasicScatterData(showData,1,2);
                showRuleResult(showData);
            });
    }

    chart.render = function(){


        chart.renderSlices();

        chart.renderText();

        chart.addMouseOn();
    }

    chart.box(d3.select("#typeView"));
    chart.renderChart();

}














