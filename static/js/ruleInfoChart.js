function drawRuleInfo(rule,div) {
    for(let i = 0;i <rule.ruleArray.length;i++)
    {
        attributediv = div.append("div");
        attributediv.style("display","inline-block");
        getRuleInfo(rule.ruleArray[i],attributediv);
    }
    attributediv = div.append("div");
    attributediv.style("display","inline-block");
    attributediv.text("置信度:"+rule.confidence);
    attributediv = div.append("div");
    attributediv.style("display","inline-block");
    attributediv.text("支持度:"+rule.support);

}
function getRuleInfo(rule,attributediv) {
    let url = "/getAttributeTSNE/";
    $.ajax({
            type:"POST",
            url:url,
            data:{
                "data":JSON.stringify(dataSet ),
                "attribute":rule.feature,
            },
            success:function (dataRes) {
                data = dataRes.data;
                 drawRuleInfoChart(data,typeArray,rule,attributediv,typek);
            }
        });
}
function drawRuleInfoChart(data,type,rule,div,k) {
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        pointColor: chart._colors[0],
        margins: {top:15, left: 10, bottom: 20, right: 20},
        textColor: 'black',
        gridColor: 'gray',
        title: '散点图',
        pointSize: 5,
        hoverColor: 'white',
        animateDuration: 1000
    }

    chart.margins(config.margins);
    chart.width(200);
    chart.height(80);
    /* ----------------------------尺度转换------------------------  */
    chart.scaleX = d3.scaleLinear()
                    .domain([0,20])
                    .range([0, chart.getBodyWidth()]),

    chart.scaleY = d3.scaleLinear()
                    .domain([d3.min(data, (d) => d[1]), d3.max(data, (d) => d[1])])
                    .range([chart.getBodyHeight(), 0]);
    inScaleX = d3.scaleLinear()
                    .domain([0, chart.getBodyWidth()])
                    .range([d3.min(data, (d) => d[0]), d3.max(data, (d) => d[0])]);
    inScaleY = d3.scaleLinear()
        .domain([chart.getBodyHeight(), 0])
        .range([d3.min(data, (d) => d[1]), d3.max(data, (d) => d[1])]);
    /* ----------------------------渲染数据点------------------------  */
    chart.renderPoints = function(){
        let points = chart.body().selectAll('.point')
                    .data(data);

        var arc=d3.arc()
		    .innerRadius(0)
		    .outerRadius(3);
            arcs = points.enter()
                .append('g')
                .attr("class","point")
                .attr("transform",(d)=>"translate("+chart.scaleX(d[0])+","+chart.scaleY(d[1])+")");
            arcs.each(function (d,i) {
                a=[];
                if(type.length ==0)
                    a.push(0);
                else
                {
                    if(type[i][k]!=0) {
                        a.push(k + 1)
                    }
                    if (a.length==0)
                    {
                        a.push(0);
                    }
                }

                for(let j  = 0;j<a.length;j++)
                {
                    d3.select(this).append("path").attr("fill", chart._colors[a[j]])
                    .attr("d",arc.startAngle((Math.PI*2/a.length)*j).endAngle((Math.PI*2/a.length)*(j+1)));
                }
            });
            points.exit()
                    .remove();
    },

    /* ----------------------------渲染坐标轴------------------------  */
    chart.renderX = function(){
        chart.svg().insert('g','.body')
                .attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
                .attr('class', 'xAxis')
                .call(d3.axisBottom(chart.scaleX).tickValues([0,2,4,6,8,10,12,14,16,18,20]));
    },

    chart.renderY = function(){
        chart.svg().insert('g','.body')
                .attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
                .attr('class', 'yAxis')
                .call(d3.axisLeft(chart.scaleY));
    },

    chart.renderAxis = function(){
        chart.renderX();
        //chart.renderY();
    },

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){
        chart.svg().select('.xAxis').append('rect')
            .attr('x',0)
            .attr('y',-chart.getBodyHeight())
            .attr('width',chart.getBodyWidth())
            .attr('height',chart.getBodyHeight())
            .attr("stroke-width",1)
            .attr('stroke',chart._colors[0])
        ;
        chart.svg().append('text')
                            .attr('class', 'axisText')
                            .attr('x', 10)
                            .attr('y', 10)
                            .attr('fill', config.textColor)
                            .attr('dy', 0)
                            .text(rule.threshold+"<="+featureNames[rule.feature]+"<="+rule.max_threshold);

        // d3.select('.yAxis').append('text')
        //                     .attr('class', 'axisText')
        //                     .attr('x', 0)
        //                     .attr('y', 0)
        //                     .attr('fill', config.textColor)
        //                     .attr('dx', '-30')
        //                     .attr('dy', '10')
        //                     .text('Y');
    },

    /* ----------------------------渲染网格线------------------------  */
    chart.renderGrid = function(){
       chart.svg().selectAll('.yAxis .tick')
            .each(function(d, i){
                    d3.select(this).append('line')
                        .attr('class','grid')
                        .attr('stroke', config.gridColor)
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', chart.getBodyWidth())
                        .attr('y2', 0);
            });

       chart.svg().selectAll('.xAxis .tick')
            .each(function(d, i){
                    d3.select(this).append('line')
                        .attr('class','grid')
                        .attr('stroke', config.gridColor)
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', 0)
                        .attr('y2', -chart.getBodyHeight());
            });
    },

    /* ----------------------------渲染图标题------------------------  */
    chart.renderTitle = function(){
        chart.svg().append('text')
                .classed('title', true)
                .attr('x', chart.width()/2)
                .attr('y', 0)
                .attr('dy', '2em')
                .text("属性"+featureNames[attribute]+"分布图")
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);

    },

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){

        chart.svg().selectAll('.point').on('click',function (d) {
            a = d3.select(this);
        });
        chart.svg()
            .on('mousemove',function (d) {
            const e = d3.event;
            const position = d3.mouse(chart._body.node());
            chart.svg().selectAll(".tip").remove();
            chart.svg()
                    .append('text')
                    .classed('tip', true)
                    .attr('x', position[0]+5)
                    .attr('y', position[1] )
                    .attr('fill', config.textColor)
                    .text('x:' +parseFloat(inScaleX(position[0])).toFixed(2));
            });

            // .on('mouseover', function(d){
            //     const e = d3.event;
            //     const position = d3.mouse(chart.svg().node());
            //     e.target.style.cursor = 'hand'
            //     chart.svg()
            //         .append('text')
            //         .classed('tip', true)
            //         .attr('x', position[0]+5)
            //         .attr('y', position[1])
            //         .attr('fill', config.textColor)
            //         .text('x: ' + d[0] + ', y: ' + d[1]);
            // })
            // .on('mouseleave', function(){
            //     const e = d3.event;
            //
            //     d3.select('.tip').remove();
            // })
            // .on('mousemove', debounce(function(){
            //         const position = d3.mouse(chart.svg().node());
            //         d3.select('.tip')
            //         .attr('x', position[0]+5)
            //         .attr('y', position[1]-5);
            //     }, 6)
            // );
    },

    chart.render = function(){

        // chart.renderTitle();
        chart.renderAxis();

        chart.renderText();

        //chart.renderGrid();

        chart.renderPoints();

        // chart.addMouseOn();

    },
    chart.box(div),
    chart.renderChart()
}