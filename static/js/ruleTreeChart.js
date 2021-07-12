
 function getRuleNode(data,k) {
    allnum = getTypeNum(typeArray,k);
    if(data.children.length==0)
    {
        rule = {};
        var denode = data;
        rule.typeInfo = denode.typeInfo;
        rule.rule = denode.rule;
        rule.num = denode.num;
        rule.support = rule.num/allnum;
        rule.confidence = rule.num/denode.data.length;
        rule.ruleArray = denode.ruleArray;
        rules.push(rule);


    }
    else{
        getRuleNode(data.children[0],k);
        getRuleNode(data.children[1],k);
    }
}
function makeRuleTreeData(feature,right,left,threshold,k){
    //定义每个决策树结点name:id,data:数据点数组，feature:特征，que_value:不同类的点数数组
    //threshold:属性划分点，parent:父结点id，children：子结点
    var dectree_tmp = [];
    //存储结点数组
    for (var i = 0; i < feature.length; i++) {
        dectree_tmp.push(new Denode(i,[],feature[i], threshold[i],[],[],""));
    }
    for (var i = 0; i < feature.length; i++) {
        if (left[i] > 0) {
            dectree_tmp[i].children.push(dectree_tmp[left[i]]);
        }
        if (right[i] > 0) {
            dectree_tmp[i].children.push(dectree_tmp[right[i]]);
        }
    }
    dectree_tmp[0].data=dataSet;
    dectree_tmp[0].typeInfo = typeArray;
    dectree_tmp[0].num = getTypeNum(typeArray,k);
    for (let i = 0;i<typeArray.length;i++)
    {
        dectree_tmp[0].indexArray.push(i)
    }


    //console.log(dectree_tmp[0]);
    //treeData是参考决策树的数据名称，直接利用这个接口
    ruleTreeList.push(dectree_tmp[0]);
   // drawRuleTreeChart(dectree_tmp[0],k);
}
function drawRuleTree(dectree_tmp,k) {
    //console.log(dectree_tmp);
    //dectree[0]=dectree_tmp[0];
    //赋予根结点data数组，其子结点逐层划分

    if(dectree_tmp.children.length!=0)
    {
        let right_sub_data=[];
        let right_sub_typeInfo=[];
        let right_sub_index = [];
        let left_sub_data=[];
        let left_sub_typeInfo=[];
        let left_sub_index = [];
        for (var j = 0;j<dectree_tmp.data.length;j++) {
            if (dectree_tmp.data[j][dectree_tmp.feature] <= dectree_tmp.threshold) {
                left_sub_data.push(dectree_tmp.data[j]);
                left_sub_typeInfo.push(dectree_tmp.typeInfo[j]);
                left_sub_index.push(j);
            } else {
                right_sub_data.push(dectree_tmp.data[j]);
                right_sub_typeInfo.push(dectree_tmp.typeInfo[j]);
                right_sub_index.push(j);
            }
        }
        for (let i=0;i<dectree_tmp.ruleArray.length;i++)
        {
             dectree_tmp.children[0].ruleArray.push(dectree_tmp.ruleArray[i]);
             dectree_tmp.children[1].ruleArray.push(dectree_tmp.ruleArray[i]);
        }
        dectree_tmp.children[0].data = left_sub_data;
        dectree_tmp.children[0].typeInfo = left_sub_typeInfo;
        dectree_tmp.children[0].indexArray = left_sub_index--;
        dectree_tmp.children[0].num = getTypeNum(left_sub_typeInfo,k);
        dectree_tmp.children[0].text = featureNames[dectree_tmp.feature]+"<="+dectree_tmp.threshold;
        dectree_tmp.children[0].brotherOrder = 0;
        if (dectree_tmp.rule=="")
           dectree_tmp.children[0].rule = featureNames[dectree_tmp.feature]+"<="+dectree_tmp.threshold;
        else
            dectree_tmp.children[0].rule = dectree_tmp.rule+" && " +featureNames[dectree_tmp.feature]+"<="+dectree_tmp.threshold;
        leftruleElement = {};
        leftruleElement.feature = dectree_tmp.feature;
        leftruleElement.threshold = dectree_tmp.threshold;
        leftruleElement.max_threshold = dectree_tmp.max_threshold;
        leftruleElement.flag = true;
        dectree_tmp.children[0].ruleArray.push(leftruleElement);


        dectree_tmp.children[1].data = right_sub_data;
        dectree_tmp.children[1].typeInfo = right_sub_typeInfo;
        dectree_tmp.children[1].indexArray = right_sub_index--;
        dectree_tmp.children[1].num = getTypeNum(right_sub_typeInfo,k);
        dectree_tmp.children[1].text = featureNames[dectree_tmp.feature]+">"+dectree_tmp.threshold;
        dectree_tmp.children[1].brotherOrder = 1;
        if (dectree_tmp.rule=="")
           dectree_tmp.children[1].rule = featureNames[dectree_tmp.feature]+">"+dectree_tmp.threshold;
        else
            dectree_tmp.children[1].rule = dectree_tmp.rule+" && " +featureNames[dectree_tmp.feature]+">"+dectree_tmp.threshold;
        rightruleElement = {};
        rightruleElement.feature = dectree_tmp.feature;
        rightruleElement.threshold = dectree_tmp.threshold;
        rightruleElement.max_threshold = dectree_tmp.max_threshold;
        rightruleElement.flag = false;
        dectree_tmp.children[1].ruleArray.push(rightruleElement);
        drawRuleTree(dectree_tmp.children[0],k);
        drawRuleTree(dectree_tmp.children[1],k);
    }

}
function drawRuleTreeChart(data,k){
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    rules = [];
    const config = {
        margins: {top: 10, left: 10, bottom: 80, right: 10},
        textColor: 'black',
        title: '基础树图',
        hoverColor: 'gray',
        animateDuration: 1000,
        pointSize: 5,
        pointFill: 'white',
        pointStroke: 'red',
        paddingLeft: 20,
        lineStroke: 'gray'
    }

    chart.margins(config.margins);
    chart.width(540);
    chart.height(300);
    /* ----------------------------数据转换------------------------  */
    chart._nodeId = 0;  //用于标识数据唯一性

    const root = d3.hierarchy(data);

    const generateTree = d3.tree()
                    .size([chart.getBodyWidth()*0.9,chart.getBodyHeight()-20]);

    generateTree(root);

    /* ----------------------------渲染节点------------------------  */
    chart.renderNode = function(){

        const groups = chart.body().selectAll('.g')
                                    .data(root.descendants(), (d) => d.id || (d.id = ++chart._nodeId));

        const groupsEnter = groups.enter()
            .append('g')
            .attr('class', (d) => 'g g-' + d.id)
            .attr('transform-origin', (d) => {    //子树从点击位置逐渐放大
                if (d.parent){
                    return chart.oldX + config.paddingLeft + ' ' + chart.oldY;
                }
                return d.x + config.paddingLeft + ' ' + d.y;
            })
            .attr('transform', (d) => {    //首次渲染进入不放缩
                if (d.parent && chart.first)
                    return 'scale(0.01)' + 'translate(' + (chart.oldX + config.paddingLeft) + ',' + chart.oldY + ')';
                return 'scale(1)' + 'translate(' + (d.x + config.paddingLeft  ) + ',' + d.y + ')';
            })

        groupsEnter.selectAll('rect').remove();
        groupsEnter.append('rect')
            .attr('width',(d) => d.data.typeInfo.length)
            .attr('height',15)
            .attr('fill', "white")
            .attr('stroke',"black");


        groupsEnter.append('circle')
            .attr("r",1)
            .attr("fill","green");
         groupsEnter.append('rect')
            .attr('width',(d) => d.data.num)
            .attr('height',15)
            .attr('fill', chart._colors[k+1]);
        groupsEnter.merge(groups)
            .transition().duration(config.animateDuration)
                    .attr('transform', (d) => 'translate(' + (d.x + config.paddingLeft) + ',' + d.y + ')');
        groupsEnter.each(function (d,i) {
            if (d.data.children.length ==0)
            {
                let arc=d3.arc().innerRadius(10).outerRadius(15);
                let div = d3.select(this);
                 div.append("path").attr("fill",chart._colors[0])
                    .attr("transform",(d)=> 'translate(' +  (d.data.typeInfo.length/2) + ',' + (40 ) + ')')
                    .attr("d",arc.startAngle(0).endAngle(Math.PI*2));
                div.append("path").attr("fill",chart._colors[k+1])
                    .attr("transform",(d)=> 'translate(' +  (d.data.typeInfo.length/2) + ',' + (40 ) + ')')
                    .attr("d",arc.startAngle(0).endAngle(Math.PI*2*d.data.num/d.data.data.length));
                div.append("text").attr("class","num")
                    .attr("font-size",10)
                    .attr("transform",(d)=> 'translate(' + (d.data.typeInfo.length/2-11) + ',' + (44) + ')')
                    .text((d.data.num/typeInfo[k][k]).toFixed(2));
            }
        });
        groups.exit()
            .attr('transform-origin', (d) => (chart.targetNode.x + config.paddingLeft) + ' ' + chart.targetNode.y)  //子树逐渐缩小到新位置
            .transition().duration(config.animateDuration)
            .attr('transform', 'scale(0.01)')
            .remove();


    }

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){
        const nodesExceptRoot = root.descendants().slice(1);

        const texts = chart.body().selectAll('text.rule')
                                .data(nodesExceptRoot, (d) => d.id || (d.id = ++chart._nodeId));
        texts.enter()
            .insert("text")
            .attr("class","rule")
            .merge(texts)
            .attr("x",((d)=>d.x+5))
            .attr("y",((d)=>d.y-5))
            .attr("font-size",12)
            .text((d)=>(d.data.text));
        texts.exit().remove();
        // const groups = d3.seletAll('.g');
        //
        // groups.append('text')
        //       .attr('class', 'text')
        //       .text((d) => d.data.name + ":"+ d.data.feature +" <" +Math.round( d.data.threshold*100)/100)
        //       .attr('dy', function(){
        //           return chart.textDy || (chart.textDy = this.getBBox().height/4);
        //       })
        //       .attr('text-anchor', (d) =>{
        //           return d.children ? 'end' : 'start';
        //       })
        //       .attr('dx', (d) =>{
        //         return d.children ? -config.pointSize*1.5 : config.pointSize*1.5;
        //     });
    }

    /* ----------------------------渲染连线------------------------  */
    chart.renderLines = function(){
        const nodesExceptRoot = root.descendants().slice(1);

        const links = chart.body().selectAll('.link')
                                .data(nodesExceptRoot, (d) => d.id || (d.id = ++chart._nodeId));

             linkenter =  links.enter()
                     .insert('path', '.g')
                     .attr('class', 'link')
                     .attr('transform-origin', (d) => {
                        if (d.parent){           //连线从点击位置逐渐放大
                            return chart.oldX + config.paddingLeft + ' ' + chart.oldY;
                        }
                        return d.x + config.paddingLeft + ' ' + d.y;
                    })
                    .attr('transform', (d) => {                //首次渲染进入不放缩
                        if (d.parent && chart.first) return 'scale(0.01)  translate(' + (d.data.num/2) + ',0)';
                        return 'scale(1) translate(' + (d.data.num/2) + ',0)';
                    })
                  .attr("stroke-width",(d)=> d.data.num != '0'?d.data.num:1);
             linkenter.merge(links)
                  .transition().duration(config.animateDuration)
                  .attr('d', (d) => {
                      return generatePath(d, d.parent);
                  })
                  .attr('transform',(d)=> 'scale(1) translate(' + (d.data.num/2) + ',0) ')
                  .attr('fill', 'none').attr('stroke',(d)=> d.data.num != '0'?chart._colors[k+1]:chart._colors[0])
                  .attr("opacity",0.4);
              links.exit()
                     .attr('transform-origin', (d) => {    //连线逐渐缩小到新位置
                         return chart.targetNode.x + config.paddingLeft + ' ' + chart.targetNode.y;
                     })
                     .transition().duration(config.animateDuration)
                     .attr('transform', 'scale(0.01)')
                     .remove();

        function generatePath(node1, node2){
            const path = d3.path();
            var offset = 0;
            for(var i = 0; node1!= node2.children[i];i++)
            {
                offset+=node2.children[i].data.num;
            }
            path.moveTo(node1.x + config.paddingLeft, node1.y);
            path.bezierCurveTo(
                                 node1.x+ config.paddingLeft,(node1.y + node2.y)/2 ,
                                 node2.x+offset+ config.paddingLeft,(node1.y + node2.y)/2 ,
                                 node2.x +offset+ config.paddingLeft, node2.y
                              );

            return path.toString();
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

        d3.selectAll('.g')
            .on('click', function(d){
                changeNode = d.data;
                d3.select("#streamView").selectAll("div").remove();
                divs =d3.select("#streamView");
                for (i= 0;i<n_feature;i++)
                {
                    div = divs.append("div");
                    drawAttributeScatter(d.data.data,i,d.data.typeInfo,div,typek);
                }
                let tmp = $("#select_Tree").val();


                    // if(d.children == null)
                    //
                    // {
                    //     layer.msg("改变类别",{
                    //         btn:["归入该类","剔除出类"],
                    //         yes:function () {
                    //             let Changetype = d.data.typeInfo;
                    //             for(let i =0;i<Changetype.length;i++)
                    //             {
                    //                 Changetype[i][k]=1;
                    //             }
                    //             showRuleResult(k);
                    //             drawBasicScatter();
                    //             dTable.upDataType();
                    //             drawOverlapType();
                    //
                    //         },
                    //         btn2:function () {
                    //              let Changetype = d.data.typeInfo;
                    //             for(let i =0;i<Changetype.length;i++)
                    //             {
                    //                 Changetype[i][k]=0;
                    //             }
                    //             showRuleResult(k);
                    //             drawBasicScatter();
                    //             dTable.upDataType();
                    //             drawOverlapType();
                    //         }
                    //     });
                    //
                    // }
                    // else
                    // {
                    //     toggle(d);
                    //     generateTree(root);
                    //     chart.renderNode();
                    //     chart.renderLines();
                    //     chart.renderText();
                    //     chart.addMouseOn();
                    // }





                //drawStreamChart(makeStreamData(d.data,k),k);

                // getRuleNode(root,k);
                // showRuleInfo(rules);

            });

        function toggle(d){
            chart.first = true;
            if (d.children){
                d._children = d.children;
                d.children = null;
            }else{
                d.children = d._children;
                d._children = null;
            }
            chart.oldX = d.x;  //点击位置x坐标
            chart.oldY = d.y;  //点击位置y坐标
            chart.targetNode = d;  //被点击的节点
        }
    }

    chart.render = function(){

        // chart.renderTitle();

        chart.renderNode();

        chart.renderText();

        chart.renderLines();

        chart.addMouseOn();

    }
    chart.box(d3.select("#ruleTreeView"));
    chart.renderChart();
    // rules = [];
    // getRuleNode(root,k);
    // showRuleInfo(rules);
    //makeAttributeScatter(root,k);

}














