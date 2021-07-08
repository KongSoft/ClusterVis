import numpy as np


# 加载数据
def loadDataSet(fileName):
    data = np.loadtxt(fileName, delimiter=',')
    return data


# 欧氏距离计算
def distEclud(x, y):
    return np.sqrt(np.sum((x - y) ** 2))  # 计算欧氏距离


# 为给定数据集构建一个包含K个随机质心的集合
def randCent(dataSet, k):
    m, n = dataSet.shape
    centroids = np.zeros((k, n))
    for i in range(k):
        index = int(np.random.uniform(0, m))  #
        centroids[i, :] = dataSet[index, :]
    return centroids


# k均值聚类
def KMeans(dataSet, k):
    m = np.shape(dataSet)[0]  # 行的数目
    # 第一列存样本属于哪一簇
    # 第二列存样本的到簇的中心点的误差
    clusterAssment = np.mat(np.zeros((m, 2)))
    clusterChange = True

    # 第1步 初始化centroids
    centroids = randCent(dataSet, k)
    while clusterChange:
        clusterChange = False

        # 遍历所有的样本（行数）
        for i in range(m):
            minDist = 100000.0
            minIndex = -1

            # 遍历所有的质心
            # 第2步 找出最近的质心
            for j in range(k):
                # 计算该样本到质心的欧式距离
                distance = distEclud(centroids[j, :], dataSet[i, :  ])
                if distance < minDist:
                    minDist = distance
                    minIndex = j
            # 第 3 步：更新每一行样本所属的簇
            if clusterAssment[i, 0] != minIndex:
                clusterChange = True
                clusterAssment[i, :] = minIndex, minDist ** 2
        # 第 4 步：更新质心
        for j in range(k):
            pointsInCluster = dataSet[np.nonzero(clusterAssment[:, 0].A == j)[0]]  # 获取簇类所有的点
            centroids[j, :] = np.mean(pointsInCluster, axis=0)  # 对矩阵的行求均值

    print("Congratulations,cluster complete!")
    return centroids, clusterAssment

def NeoKmeans(dataSet, k,over_val, out_val):
    dataSet = dataSet.astype(np.float)
    m = np.shape(dataSet)[0]  # 行的数目
    # 第一列存样本属于哪一簇
    # 第二列存样本的到簇的中心点的误差

    distanceMat = np.zeros((m*k, 3))
    clusterAssment = np.zeros((m, k))
    clusterAssmentCopy = np.zeros((m,k))
    clusterChange = True

    # 第1步 初始化centroids
    centroids = randCent(dataSet, k)
    count = 0;
    while clusterChange:
        clusterChange = False
        clusterAssment = np.zeros((m, k))
        # 遍历所有的样本（行数）,并计算距离
        for i in range(m):
            for j in range(k):
                # 计算该样本到质心的欧式距离
                distance = distEclud(centroids[j, :], dataSet[i, :  ])
                distanceMat[i * k + j][0] = i
                distanceMat[i * k + j][1] = j
                distanceMat[i*k+j][2] = distance
       #根据距离排序
        distanceMat = distanceMat[np.argsort(distanceMat[:, 2])]
        #已经分类的样本
        overSet = []
        overSet1 = []
        index1 = 0
        index2 = 0
        for i in range (int(m*(1+over_val))):
            if(i<int(m*(1-out_val))):
                while True:
                    a = (int)(distanceMat[index1][0])
                    b = (int)(distanceMat[index1][1])
                    if a not in overSet:
                        clusterAssment[a][b] = 1
                        if clusterAssmentCopy[a][b] != 1:
                            clusterChange = True
                        overSet.append(a)
                        overSet1.append(index1)
                        index1 = index1+1
                        break
                    else:
                        index1 = index1+1
            else:
                while True:
                    a = (int)(distanceMat[index2][0])
                    b = (int)(distanceMat[index2][1])
                    if index2 not in overSet1:
                        clusterAssment[a][b] = 1
                        if clusterAssmentCopy[a][b] != 1:
                            clusterChange = True
                        index2+=1
                        break
                    else:
                        index2+=1
        clusterAssmentCopy = clusterAssment.copy()
        for j in range(k):
            pointsInCluster =  dataSet[np.nonzero(clusterAssment[:,j] ==1)[0]]  # 获取簇类所有的点
            centroids[j, :] = np.mean(pointsInCluster, axis=0)  # 对矩阵的行求均值
        count=count+1
        if (count>100):
            clusterChange = False
    print("Congratulations,cluster complete!")
    print(clusterAssment)
    list = []
    for j in range(m):
        typelist =np.nonzero(clusterAssment[j,:] == 1)[0]
        ls2 = [str(i+1) for i in typelist]
        item2 = "_".join(ls2)
        list.append(item2)
    return list, clusterAssment.tolist(), centroids.tolist()

def showCluster(dataSet, k, centroids, clusterAssment):
    m, n = dataSet.shape
    if n != 2:
        print("数据不是二维的")
        return 1

    mark = ['or', 'ob', 'og', 'ok', '^r', '+r', 'sr', 'dr', '<r', 'pr']
    if k > len(mark):
        print("k值太大了")
        return 1

    # 绘制所有的样本
    for i in range(m):
        markIndex = int(clusterAssment[i, 0])
        plt.plot(dataSet[i, 0], dataSet[i, 1], mark[markIndex])

    mark = ['Dr', 'Db', 'Dg', 'Dk', '^b', '+b', 'sb', 'db', '<b', 'pb']
    # 绘制质心
    for i in range(k):
        plt.plot(centroids[i, 0], centroids[i, 1], mark[i])

    plt.show()


# dataSet = loadDataSet("lucky.txt")
# k = 2
# NeoKmeans(dataSet,k,0,0)
# centroids, clusterAssment = KMeans(dataSet, k)
#
# showCluster(dataSet, k, centroids, clusterAssment)