
function  makeTypeInfoData(){
    var data = inData.data;
    var feature = inData.feature;
    if(feature<0)
        feature = 0;
    var typeInfo = inData.typeInfo;
    var x1,x2;
    var types = ["other","typek"];
    var minfeature = parseFloat(d3.min(data,function (d) {
        return d[feature];
    }));
    var maxfeature =parseFloat( d3.max(data,function (d) {
        return d[feature];
    }));
    streamData = [];
    for(var a = minfeature;a <= maxfeature; a=a+1)
    {
        tmp = {};
        tmp.feature =parseFloat(a.toFixed(0));
        tmp.other = 0;
        tmp.typek = 0;
        streamData.push(tmp);
    }
    for(var i = 0;i<data.length;i++)
    {
        for(var j=0;j<streamData.length;j++)
        {
            if(streamData[j].feature==parseFloat(data[i][feature]).toFixed(0))
            {
                if(typeInfo[i][k]==1)
                {
                     streamData[j].typek++;
                }
                else
                {
                     streamData[j].other++;
                }
            }

        }
    }
    if(Order==0)
    {
        x1 = minfeature;
        x2 = inData.threshold;
    }
    else
    {
        x1 = inData.threshold;
        x2 = maxfeature;
    }
    x2 = parseFloat(x2);
    x1 = parseFloat(x1);
    stream ={};
    stream.data = streamData;
    stream.type = types;
    stream.x1 =parseFloat(x1.toFixed(0));
    stream.x2 =parseFloat(x2.toFixed(0));
    stream.text = inData.text;
    return stream;
}
function drawStreamChart(stream,k,con,showtext){
    var data = stream.data;
    var types = stream.type;
    var x1 = stream.x1;
    var x2 = stream.x2;
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        margins: {top: 40, left: 40, bottom: 40, right: 40},
        textColor: 'black',
        gridColor: 'gray',
        title: '基础河流图',
        animateDuration: 1000
    }

    chart.margins(config.margins);
    chart.width(260);
    chart.height(200)

    /* ----------------------------尺度转换------------------------  */
    chart.scaleX = d3.scaleLinear()
                    .domain([d3.min(data,function (d) {
                        return d.feature;
                    }),d3.max(data,function (d) {
                        return d.feature;})])
                    .range([0, chart.getBodyWidth()]);

    chart.scaleY = d3.scaleLinear()
                    .domain([0,Math.floor(d3.max(data,function (d) {
                         tmp = 0;
                        for(type of types)
                            tmp+=d[type]
                        return tmp;
                    }))+1])
                    .range([chart.getBodyHeight(), 0])

    chart.stack = d3.stack()
                    .keys(types)
                    .order(d3.stackOrderInsideOut);

    /* ----------------------------渲染面------------------------  */
    var maxnum = chart.stack(data);
    var max = d3.max(maxnum);
    max = d3.max(max,(d)=>d[1]);
    max = chart.scaleY(max);
    var min = d3.min(maxnum);
    min = d3.min(min,(d)=>d[0]);
    min = chart.scaleY(min)-chart.scaleY(0);

    chart.renderArea = function(){
        const areas = chart.body().insert('g',':first-child')
                        .selectAll('.area')
                        .data(maxnum);

              areas.enter()
                        .append('path')
                        .attr('class', (d) => 'area area-' + d.key)
                    .merge(areas)
                        .style('fill', function(d){
                            if (d.key == "typek")
                                return chart._colors[typek+1];
                            else
                                return chart._colors[0];
                        })
                        .transition().duration(config.animateDuration)
                        .attrTween('d', areaTween);

        //中间帧函数
        function areaTween(_d){
            if (!_d) return;
            const generateArea = d3.area()
                        .x((d) => d[0])
                        .y0((d) => d[1])
                        .y1((d) => d[2])
                        .curve(d3.curveCardinal.tension(0));

            const pointX = data.map((d) => chart.scaleX(d.feature));
            const pointY0 = _d.map((d) => chart.scaleY(d[0]));
            const pointY1 = _d.map((d) => chart.scaleY(d[1]));

            const interpolate = getAreaInterpolate(pointX, pointY0, pointY1);

            const ponits = [];

            return function(t){
                ponits.push([interpolate.x(t), interpolate.y0(t), interpolate.y1(t)]);
                return generateArea(ponits);
            }
        }

        //点插值
        function getAreaInterpolate(pointX, pointY0, pointY1){

            const domain = d3.range(0, 1, 1/(pointX.length-1));
            domain.push(1);

            const interpolateX = d3.scaleLinear()
                                    .domain(domain)
                                    .range(pointX);

            const interpolateY0 = d3.scaleLinear()
                                    .domain(domain)
                                    .range(pointY0);

             const interpolateY1 = d3.scaleLinear()
                                    .domain(domain)
                                    .range(pointY1);
            return {
                x: interpolateX,
                y0: interpolateY0,
                y1: interpolateY1
            };

        }

    }

    /* ----------------------------渲染坐标轴------------------------  */
    chart.renderX = function(){
        chart.svg().insert('g','.body')
                .attr('transform', 'translate(' + chart.bodyX() + ',' + (chart.bodyY() + chart.getBodyHeight()) + ')')
                .attr('class', 'xAxis')
                .call(d3.axisBottom(chart.scaleX));
    }

    chart.renderY = function(){
        chart.svg().insert('g','.body')
                .attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
                .attr('class', 'yAxis')
                .call(d3.axisLeft(chart.scaleY));
    }

    chart.renderAxis = function(){
        chart.renderX();
        chart.renderY();
    }

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){
        d3.select('.xAxis').append('text')
                            .attr('class', 'axisText')
                            .attr('x', chart.getBodyWidth())
                            .attr('y', 0)
                            .attr('fill', config.textColor)
                            .attr('dy', 40)
                            .text('特征');

        d3.select('.yAxis').append('text')
                            .attr('class', 'axisText')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('fill', config.textColor)
                            .attr('transform', 'rotate(-90)')
                            .attr('dy', -40)
                            .attr('text-anchor','end')
                            .text('个数）');
    }

    /* ----------------------------渲染网格线------------------------  */
    chart.renderGrid = function(){
        d3.selectAll('.xAxis .tick')
            .append('line')
            .attr('class','grid')
            .attr('stroke', config.gridColor)
            .attr('stroke-dasharray', '10,10')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', -chart.getBodyHeight());
    }

    /* ----------------------------渲染图标题------------------------  */
    chart.renderTitle = function(){
        chart.svg().append('text')
                .classed('title', true)
                .attr('x', chart.width()/2)
                .attr('y', 0)
                .attr('dy', '2em')
                .text(showtext)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);

        chart.svg().append("rect")
            .attr("x",chart.scaleX(x1))
            .attr("width",chart.scaleX(x2)-chart.scaleX(x1))
            .attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
            .attr("height",200)
            .attr("fill","grey")
            .attr("opacity",0.4);

    }

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){
        //防抖函数
        function debounce(fn, time){
            let timeId = null;
            return function(){
                const context = this;
                const event = d3.event;
                timeId && clearTimeout(timeId)
                timeId = setTimeout(function(){
                    d3.event = event;
                    fn.apply(context, arguments);
                }, time);
            }
        }

        d3.selectAll('.area')
            .on('mouseover', function(d){
                const e = d3.event;
                const position = d3.mouse(chart.svg().node());
                e.target.style.cursor = 'hand'

                d3.selectAll('.area')
                    .attr('fill-opacity', 0.3);

                d3.select(e.target)
                    .attr('fill-opacity', 1);

                chart.svg()
                    .append('text')
                    .classed('tip', true)
                    .attr('x', position[0]+5)
                    .attr('y', position[1])
                    .attr('fill', config.textColor)
                    .text(d.key);
            })
            .on('mouseleave', function(){
                const e = d3.event;

                d3.selectAll('.area')
                    .attr('fill-opacity', 1);

                d3.select('.tip').remove();
            })
            .on('mousemove', debounce(function(){
                    const position = d3.mouse(chart.svg().node());
                    d3.select('.tip')
                    .attr('x', position[0]+5)
                    .attr('y', position[1]-5);
                }, 6)
            );
    }

    chart.render = function(){

        chart.renderAxis();

        chart.renderText();

       // chart.renderGrid();

        chart.renderTitle();

        chart.renderArea();

        chart.addMouseOn();
    }
    chart.box(con);
    chart.renderChart();


}










