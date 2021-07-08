import numpy as np
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.tree import DecisionTreeClassifier


def readfile(file):
    with open(file, encoding='UTF-8') as csv_file:
        data_file = np.loadtxt(csv_file, str, delimiter=",")
        feature = data_file[0]
        data = data_file[1:]
        return feature, data


def showTSNEView(data,n_feature):
    data = np.array(data)
    result = TSNE(n_components=2, learning_rate=100).fit_transform(data)
    return result


def showPCAView(data,n_feature):
    data = np.array(data)
    result = PCA(n_components=2).fit_transform(data)
    return result


def showAttributeTSNE(data,attribute):
    data = np.array(data)
    attribute = int(attribute)
    data_before = data[:,:attribute]
    data_after = data[:,attribute+1:]
    attributeData = data[:,attribute]
    attributeData = attributeData.reshape((data.shape[0],1))
    data = np.hstack((data_before, data_after))
    result = TSNE(n_components=1, learning_rate=100).fit_transform(data)
    result = np.hstack((attributeData, result))
    return result


def makeRuleTree(data,type,typeArray):
    data = np.array(data)
    typeArray = np.array(typeArray)
    data_y = typeArray[:,type:type+1]
    dtc = DecisionTreeClassifier(criterion='entropy', max_depth=2)  # 建立决策树对象
    dtc.fit(data, data_y)  # 决策树拟合
    dic = {}
    dic['feature'] = dtc.tree_.feature.tolist()
    dic['children_right'] = dtc.tree_.children_right.tolist()
    dic['children_left'] = dtc.tree_.children_left.tolist()
    dic['value'] = dtc.tree_.value.tolist()
    dic['threshold'] = dtc.tree_.threshold.tolist()
    return dic


