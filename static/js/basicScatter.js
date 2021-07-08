function drawBasicScatter() {
    let tmp = $("#select_Projection").val();
    url = "";
    if(tmp == "0")
    {
        url = "/showPCA/";
    }
    else
    {
        url= "/showTSNE/";
    }
    $.ajax({
        type:"POST",
        url:url,
        data:{
            "showData":JSON.stringify(dataSet ),
            "n_feature":n_feature,
        },
        success:function (dataRes) {
                data = dataRes.data;
                drawScatterChart(data,typeArray,0,1);
        }
    });
}
function  drawScatterChart(data,type,x1,x2) {
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        pointColor: chart._colors[0],
        margins: {top: 20, left: 40, bottom: 50, right: 40},
        textColor: 'black',
        gridColor: 'gray',
        title: '散点图',
        pointSize: 5,
        hoverColor: 'white',
        animateDuration: 1000
    }
    chart.width(250);
    chart.height(250);
    chart.margins(config.margins);

    /* ----------------------------尺度转换------------------------  */
    chart.scaleX = d3.scaleLinear()
                    .domain([d3.min(data, (d) => d[x1]), d3.max(data, (d) => d[x1])])
                    .range([0, chart.getBodyWidth()]),

    chart.scaleY = d3.scaleLinear()
                    .domain([d3.min(data, (d) => d[x2]), d3.max(data, (d) => d[x2])])
                    .range([chart.getBodyHeight(), 0]);

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
                .attr("transform",(d)=>"translate("+chart.scaleX(d[x1])+","+chart.scaleY(d[x2])+")");
            arcs.each(function (d,i) {
                 a=[];
                 if(type.length ==0)
                 {
                     a.push(0);
                 }
                 else
                 {
                      for (let k = 0;k<type[i].length;k++)
                    {
                        if(type[i][k]!=0)
                        {
                            a.push(k+1)
                        }
                    }
                    if(a.length == 0)
                    {
                        a.push(0);
                    }
                 }

                for(var j  = 0;j<a.length;j++)
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
                .call(d3.axisBottom(chart.scaleX));
    },

    chart.renderY = function(){
        chart.svg().insert('g','.body')
                .attr('transform', 'translate(' + chart.bodyX() + ',' + chart.bodyY() + ')')
                .attr('class', 'yAxis')
                .call(d3.axisLeft(chart.scaleY));
    },

    chart.renderAxis = function(){
        chart.renderX();
        chart.renderY();
    },

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){
        d3.select('.xAxis').append('text')
                            .attr('class', 'axisText')
                            .attr('x', chart.getBodyWidth())
                            .attr('y', 0)
                            .attr('fill', config.textColor)
                            .attr('dy', 30)
                            .text('X');

        d3.select('.yAxis').append('text')
                            .attr('class', 'axisText')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('fill', config.textColor)
                            .attr('dx', '-30')
                            .attr('dy', '10')
                            .text('Y');
    },

    /* ----------------------------渲染网格线------------------------  */
    chart.renderGrid = function(){
        d3.selectAll('.yAxis .tick')
            .each(function(d, i){
                    d3.select(this).append('line')
                        .attr('class','grid')
                        .attr('stroke', config.gridColor)
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', chart.getBodyWidth())
                        .attr('y2', 0);
            });

        d3.selectAll('.xAxis .tick')
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
                .text(config.title)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);

    },

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){

        d3.selectAll('.point').on('click',function (d) {
            a = d3.select(this);
            a.attr("stroke","red");
            alert(d);
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

        //chart.renderAxis();

        //chart.renderText();

        //chart.renderGrid();

        chart.renderPoints();

        chart.addMouseOn();

    },
    chart.box(d3.select("#scatterView")),
    chart.renderChart()
}
function makeAttributeScatter(d,k) {
    divs =d3.select("#streamView");
    div = divs.append("div")
   let a = 0;
        drawAttributeScatter(d.data.data,a,d.data.typeInfo,div,k);


}
function drawAttributeScatter(data,attribute,type,div,k)
{
    let url = "/getAttributeTSNE/";
    $.ajax({
            type:"POST",
            url:url,
            data:{
                "data":JSON.stringify(data ),
                "attribute":attribute,
            },
            success:function (dataRes) {
                    data = dataRes.data;
                    drawAttributeScatterChart(data,type,attribute,div,k)
            }
        });
}
function  drawAttributeScatterChart(data,type,attribute,div,k) {
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        pointColor: chart._colors[0],
        margins: {top:5, left: 30, bottom: 20, right: 20},
        textColor: 'black',
        gridColor: 'gray',
        title: '散点图',
        pointSize: 5,
        hoverColor: 'white',
        animateDuration: 1000
    }

    chart.margins(config.margins);
    chart.width(275);
    chart.height(100);
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
                            .attr('x', 0)
                            .attr('y', 50)
                            .attr('fill', config.textColor)
                            .attr('dy', 0)
                            .text(featureNames[attribute]);

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