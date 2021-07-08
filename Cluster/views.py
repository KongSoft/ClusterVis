from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from Cluster.Backend import *
from Cluster.NEOKmeans import  NeoKmeans
import json


# Create your views here.
def index(request):
    return render(request, "index.html", {"hello": "Hello world!"})


def upload_file(request):
    if request.method == "POST":
        myFile = request.FILES.get("file", None)
        if not myFile:
            return HttpResponse("no file for upload")
        # destination = open(myFile.name,"wb+")
        # for chunk in myFile.chunks():
        #     destination.write(chunk)
        # destination.close()
        feature, data = readfile("data2.csv")
        result_data = {
            "code": 1,
            "data": data.tolist(),
            "feature_names": feature.tolist(),
        }
        return JsonResponse(result_data)


def showTSNE(request):
    if request.method == "POST":
       tmp = request.POST.get('showData')
       tmp = json.loads(tmp)
       n_feature = int(request.POST.get('n_feature'))
       dic = {}
       dic['data'] = showTSNEView(tmp,n_feature).tolist()
       return JsonResponse(dic)


def showPCA(request):
    if request.method == "POST":
       tmp = request.POST.get('showData')
       tmp = json.loads(tmp)
       n_feature = int(request.POST.get('n_feature'))
       dic = {}
       dic['data'] = showTSNEView(tmp,n_feature).tolist()
       return JsonResponse(dic)


def getAttributeTSNE(request):
    if request.method == "POST":
        data = request.POST.get('data')
        attribute = request.POST.get('attribute')
        data = json.loads(data)
        dic = {}
        dic['data'] = showAttributeTSNE(data, attribute).tolist()
        return JsonResponse(dic)


def getRuleTree(request):
    if request.method == "POST":
        data = request.POST.get('data')
        data = json.loads(data)
        type = int(request.POST.get('type'))
        typeArray = request.POST.get('typeArray')
        typeArray = json.loads(typeArray)
        reArray = []
        a = 0
        while a < type:
            reArray.push(makeRuleTree(data, a, typeArray))
        return JsonResponse(reArray)


def cluster(request):
    out_val = request.POST.get('out_val')
    over_val = request.POST.get('over_val')
    num_val = request.POST.get('num_val')
    tmp = request.POST.get('showData')
    n_feature = int(request.POST.get('n_feature'))
    over_val = float(over_val)
    num_val = int(num_val)
    out_val = float(out_val)
    data = json.loads(tmp)
    data = np.array(data)
    clusterType,clusterAssment,centeroids  = NeoKmeans(data, num_val, over_val, out_val)
    result = {};
    result["type"] = clusterType
    result["assment"] = clusterAssment
    result['center'] = centeroids
    result['trees'] = []
    a = 0
    while a< num_val:
        result["trees"].append(makeRuleTree(data,a,clusterAssment))
        a+=1
    return JsonResponse(result)