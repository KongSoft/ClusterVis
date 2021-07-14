function doUPLoadFile(result){
    featureNames = result.feature_names;
    dataSet = [];
    n_feature = featureNames.length;
    typeList = [];
    typeArray=[];
    dTable.init(featureNames);
    tableData = [];
    for(var i = 0;i<result.data.length;i++)
    {
        dataRow =[];
        showRow= [];
        dataRow.push(i);
        for(var j = 0;j<n_feature;j++)
        {
            dataRow.push(parseFloat(result.data[i][j]));
            showRow.push(parseFloat(result.data[i][j]));
        }
        dataRow.push(0);
        typeList.push("0");
        tableData.push(dataRow);
        dataSet.push(showRow);
    }

    let clusterInfo = d3.select("#uploadDiv").html("");
    clusterInfo.append("div").text("样本总数"+dataSet.length)
    clusterInfo.append("div").text("特征个数"+n_feature)
   // clusterInfo.append("<div>特征个数:"+n_feature+"</div>")
    // clusterInfo.append("div").text("特征个数"+n_feature)
    dTable.updateTable(tableData);
    drawBasicScatter();
    d3.select("#streamView").selectAll("div").remove();
    divs =d3.select("#streamView");
    for (i= 0;i<n_feature;i++)
    {
        div = divs.append("div");
        drawAttributeScatter(dataSet,i,typeArray,div,0);
    }


}
function showRuleResult(k){
    var test_url = "/getRuleTree/";
    $.ajax({
        type:"post",
        url:test_url,
        data:{
            "data":JSON.stringify(showData),
            "type":k,
            "typeArray":JSON.stringify(typeArray)
        },
        dataType:"json",
        success:function (dataRes) {
            var temp ={};
            feature = dataRes['feature'];
            var right=dataRes['children_right'];
            var left=dataRes['children_left'];
            var threshold=dataRes['threshold'];
            for(var i = 0;i<threshold.length;i++){
                threshold[i] = threshold[i].toFixed(2);
            }
            makeRuleTreeData(feature,right,left,threshold,k);
            drawRuleTree(ruleTreeList[k],k);
            rules = [];
            resetRuleTypeArray(k);
            getRuleNode(ruleTreeList[k],k);
            ruleList.push(rules);
        }
    });
}
function showClusterResult(){

        var test_url = "/cluster/";
        a = $("#cluster_num").val();
        b = $("#cluster_Overlap").val();
        c = $("#cluster_Outlier").val();
        if(a == "" || b == "" || c=="")
        {
            layer.msg('请输入聚类参数');
            return;
        }
        $.ajax({
            type: "post",
            //async: false,
            url: test_url,
            data: {
                'out_val': c,
                'over_val': b,
                'num_val':a,
                "showData":JSON.stringify(dataSet),
                "n_feature":n_feature,
            },
            //JSON.stringify(d.ind),
            dataType: "json",
            success: function (dataRes) {
                //console.log(dataRes);

                typeList = dataRes['type'];
                typeArray = dataRes['assment'];
                centerPoint = dataRes['center'];
                n_cluster = a;
                trees = dataRes.trees;
                drawBasicScatter();
                for(let i =0;i<typeArray.length;i++)
                {
                    ruleTypeArray[i] = [];
                    for (let j =0;j<typeArray[0].length;j++)
                        ruleTypeArray[i].push(0);
                }
                typek = 0;
                ruleTreeList = [];
                ruleList = [];
                for (let i = 0;i<a ;i++)
                {
                    let feature = trees[i]['feature'];
                    let right=trees[i]['children_right'];
                    let left=trees[i]['children_left'];
                    let threshold=trees[i]['threshold'];
                    for(let j = 0;j<threshold.length;j++){
                        threshold[j] = threshold[j].toFixed(2);
                    }
                    makeRuleTreeData(feature,right,left,threshold,i);
                    drawRuleTree(ruleTreeList[i],i);

                    rules = [];
                    resetRuleTypeArray(i);
                    getRuleNode(ruleTreeList[i],i);
                    ruleList.push(rules);
                }
                dTable.upDataType();
                drawOverlapType();

            }
        });

    }
function changeScatterType() {
    drawBasicScatter();
}

function  array2Json(colName) {
    var json=[];
    colName.forEach(function(item){
        var temp={};
        item.forEach(function(value,index){
            temp[index]=value;
        });
        json.push(temp);
    })
    return json;
}
function changeRiverChart() {
    tmp = parseInt($("#select_5").val())+1;
    drawStreamChart(makeStreamData(showData,tmp));
}
// function getTypeNum(data){
//     var TypeSet = [];
//     for(var i = 0;i<data.length;i++)
//     {
//         flag = true;
//         for(var j = 0;j<TypeSet.length;j++) {
//             if(TypeSet[j].name == data[i][n_feature+1])
//             {
//                 TypeSet[j].num++;
//                 flag = false;
//                 break;
//             }
//         }
//         if(flag)
//         {
//             typeNum = {};
//             typeNum.name = data[i][n_feature+1];
//             typeNum.num = 1;
//             TypeSet.push(typeNum);
//         }
//     }
//     return TypeSet;
// }
// function getTypeInfo(data){
//     typeInfo = {};
//     typeInfo.name =0;
//     typeInfo.num = 0;
//     typeInfo.allNum = data.length;
//     for(var i = 0;i<data.length;i++)
//     {
//
//         if(data[i][n_feature+1]!=9)
//         {
//             typeInfo.name = data[i][n_feature+1];
//             typeInfo.num++;
//         }
//
//     }
//     return typeInfo;
// }
function getTypeNum(data,k) {
    s = 0;
    for (var i = 0; i < data.length; i++)
        s += parseInt(data[i][k]);
    return s;
}
function setOutType() {
    let Changetype = rules[ruleIndex].nodelist.data.typeInfo;
     for(let i =0;i<Changetype.length;i++)
    {
        Changetype[i][typek]=0;
    }
    showRuleResult(typek);
    drawBasicScatter();
    dTable.upDataType();
    drawOverlapType();
}
function setInType() {
    let Changetype = rules[ruleIndex].nodelist.data.typeInfo;
     for(let i =0;i<Changetype.length;i++)
    {
        Changetype[i][typek]=1;
    }
    showRuleResult(typek);
    drawBasicScatter();
    dTable.upDataType();
    drawOverlapType();
}
function splitNode() {
    changeNode.feature = $("#select_Attribute").val();
    changeNode.threshold = $("#min_value").val();
    changeNode.max_threshold = $("#max_value").val();
    changeNode.children = [];
    let tmpLeftNode = new Denode(changeNode.id+2,[],null, null,[],[],"");
    let tmpRightNode= new Denode(changeNode.id+3,[],null, null,[],[],"");
    changeNode.children.push(tmpLeftNode);
    changeNode.children.push(tmpRightNode);
    drawRuleTree(changeNode,typek);
    rules = [];
    resetRuleTypeArray(typek);
    getRuleNode(ruleTreeList[typek],typek);
    ruleList[typek]= rules;

    drawRuleTreeChart(ruleTreeList[typek],typek);

    d3.select("#ruleInfoView").selectAll("div").remove();
    divs = d3.select("#ruleInfoView");
    for (let j=0;j<ruleList[typek].length;j++)
    {
        div = divs.append("div");
        drawRuleInfo(ruleList[typek][j],div);
    }
}