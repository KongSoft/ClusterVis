
var dataTable =  function () {
    return{
        init:function (features) {
            colums = [];
            colums.push('序号');
            for(var i = 0;i<features.length;i++)
            {
                colums.push(features[i]);
            }
            colums.push("聚类类别");
            d3.select("thead").select("tr").remove();
            ths = d3.select("thead").append("tr").selectAll("th").data(colums);
            ths.enter().append('th').text((d)=>d);
            ths.exit().remove();
        },
        updateTable:function (tableData) {
            d3.select("tbody").selectAll("tr").remove();
            var  length = tableData[0].length;
            trs = d3.select("tbody").selectAll("tr").data(tableData);
            trs_enter = trs.enter().append("tr");
            for (var i=0;i<length;i++)
            {
                trs_enter.append('td').text((d)=>d[i]);
            }
            // trs_enter.on('click', function (d,i) {
            //     layer.prompt({
            //         formType: 0,
            //         value: d[n_feature+1],
            //         title: '请输入值',
            //     }, function(value, index, elem){
            //         tableData[i][n_feature+1] = value;
            //         layer.close(index);
            //         dTable.updateTable(tableData);
            //         drawBasicScatter(showData,1,2);
            //     });
            // });
        },
        upDataType:function () {
            for (var i = 0;i<typeArray.length;i++)
            {
                a = [];
                for (let k = 0;k<typeArray[i].length;k++)
                {
                    if(typeArray[i][k]!=0)
                    {
                        a.push(k+1)
                    }
                }
                if(a.length == 0)
                {
                    a.push(0);
                }
                tableData[i][n_feature+1] = a.toString();
            }
            this.updateTable(tableData);

        }

    }
}