function drawOverlapType(){
    var k = typeArray[0].length;//一共有k个类簇
    typeInfo = new Array();
    for(var i = 0;i<k;i++)
     {
        typeInfo[i] = new Array();
        for (var j = 0;j<k;j++)
        {
            typeInfo[i][j] = 0;
        }
        for (var j = 0;j<typeArray.length;j++)
        {
            if(typeArray[j][i]==1)
            {
                for (var m = 0;m<k;m++)
                {
                    if (typeArray[j][m]==1)
                        typeInfo[i][m]++;
                }
            }
        }
    }
    var out_num = typeArray.length;
    for(let k = 0;k<typeArray.length;k++)
    {
        for(let n = 0;n<typeArray[k].length;n++)
        {
            if(typeArray[k][n]==1)
            {
                out_num--;
                break;
            }
        }
    }
    let context = "当前共有"+typeArray.length+"个样本，划分为"+k+"个集群，每个集群的样本个数为";
    let count  = 0;
    for(let i  = 0;i<typeInfo.length;i++)
    {
        count+=typeInfo[i][i];
        context+=typeInfo[i][i]+",";
    }
    context+="异常值个数为"+out_num+"覆盖度为："+count/typeArray.length+"异常值比率为："+out_num/typeArray.length;
    // d3.select("#stateInfoView").text(context);
    $("#cluster_Overlap").val((count/typeArray.length-1).toFixed(2))
    var maxNum =0;
    for(let i =0;i<k;i++){
         if(typeInfo[i][i]>maxNum)
             maxNum = typeInfo[i][i];
     }
    const chart = new Chart();
    chart.width(260);
    chart.scale = d3.scaleLinear()
                    .domain([0, maxNum])
                    .range([0, 60]),
    chart.box(d3.select("#ruleTypeView"));
    chart.renderRect = function(){
        chart.body().selectAll('rect').remove();
        chart.body().append("text")
                    .attr("class","type_text")
                    .attr("x",(0))
                    .attr("y",(0))
                    .attr("font-size",10)
                    .text("样本总数"+(dataSet.length));
        chart.body().append("text")
                    .attr("class","type_text")
                    .attr("x",(0))
                    .attr("y",(20))
                    .attr("font-size",10)
                    .text("重叠度："+(count/typeArray.length-1).toFixed(2));
        var rects = chart.body().selectAll('rect').data(typeInfo);
        rects.enter().append("rect")
            .attr("class","type")
            .attr("x",0)
            .attr("y",(d,i)=>i*40+43)
            .attr("width",(d,i)=>chart.scale(d[i]))
            .attr("height",20)
            .attr("fill",(d,i)=>chart._colors[i+1]);
        rects.enter().append("text")
            .attr("class","type_text")
            .attr("x",0)
            .attr("y",(d,i)=>i*40+75)
            .attr("font-size",12)
            .text((d,i)=>"类别"+i+":"+d[i]);

        rects.enter().each(function (d,i) {
            let div = d3.select(this);
            let arc=d3.arc().innerRadius(10).outerRadius(15);
            div.append("path")
            .attr("fill",chart._colors[0])
            .attr("transform",'translate(' +  (i*40+80) + ',' +20 + ')')
            .attr("d",arc.startAngle(0).endAngle(Math.PI*2))
            div.append("path")
            .attr("fill",chart._colors[i+1])
            .attr("transform",'translate(' +  (i*40+80) + ',' +20 + ')')
            .attr("d",arc.startAngle(0).endAngle(Math.PI*2*d[i]/dataSet.length))
        })

        rects.enter().append("text")
            .attr("class","type_text")
            .attr("x",(d,i)=>(i*40+63))
            .attr("y",0)
            .attr("font-size",12)
            .text((d,i)=>"类别"+i);
        rects.enter().append("text")
            .attr("class","type_text")
            .attr("x",(d,i)=>(i*40+70))
            .attr("y",23)
            .attr("font-size",10)
            .text((d,i)=>(d[i]/dataSet.length).toFixed(2));
         rects.enter().each(function (d,i)
        {
            for(let j =0;j<k;j++)
            {
                let arc=d3.arc().innerRadius(10).outerRadius(15);
                chart.body().append('rect')
                    .attr("x",j*40+60)
                    .attr("y",i*40+40)
                    .attr("height","40px")
                    .attr("width","40px")
                    .attr("fill","white")
                    .attr("stroke",chart._colors[0]);
                if(i!=j)
                {
                    chart.body().append("path")
                    .attr("fill",chart._colors[i+1])
                    .attr("transform",'translate(' +  (j*40+80) + ',' +(i*40+60) + ')')
                    .attr("d",arc.startAngle(0).endAngle(Math.PI*2));
                chart.body().append("path")
                    .attr("fill",chart._colors[j+1])
                    .attr("transform",'translate(' +  (j*40+80) + ',' +(i*40+60) + ')')
                    .attr("d",arc.startAngle(0).endAngle(Math.PI*2*d[j]/d[i]));
                chart.body().append("text")
                    .attr("class","type_text")
                    .attr("x",(j*40+70))
                    .attr("y",(i*40+63))
                    .attr("font-size",10)
                    .text((d[j]/d[i]).toFixed(2));
                }
                else
                {
                     chart.body().append("text")
                    .attr("class","type_text")
                    .attr("x",(j*40+70))
                    .attr("y",(i*40+63))
                    .attr("font-size",10)
                    .text(ruleList[i].length);
                }

            }

        // rects.enter().each(function (d,i) {        });
        //     var offset = d[i];
        //     for (var j =0;j<d.length;j++)
        //     {
        //         if(j!=i && d[j]!=0)
        //         {
        //             offset = offset - d[j];
        //             chart.body().append("rect")
        //                 .attr("x",chart.scale(offset))
        //                 .attr("y",i*50+20)
        //                 .attr("width",chart.scale(d[j]))
        //                 .attr("height",10)
        //                 .attr("fill",(d,i)=>chart._colors[j+1]);
        //         }
        //     }
        });


    }


    chart.addMouseOn = function(){
        d3.selectAll('.type').on('click',function (d,i) {
                typek = i;
                drawRuleTreeChart(ruleTreeList[typek],typek);

                d3.select("#ruleInfoView").selectAll("div").remove();
                divs = d3.select("#ruleInfoView");
                for (j=0;j<ruleList[typek].length;j++)
                {
                    div = divs.append("div");
                    drawRuleInfo(ruleList[typek][j],div);
                }

                d3.select("#streamView").selectAll("div").remove();
                divs =d3.select("#streamView");
                for (i= 0;i<n_feature;i++)
                {
                    div = divs.append("div");
                    drawAttributeScatter(dataSet,i,typeArray,div,typek);
                }
            });
    }
    chart.render = function(){
        chart.renderRect();
        chart.addMouseOn();
    }
    chart.renderChart();
}