import random
f = "../data2.csv"
a = 20
with open(f,"w") as file:
    file.write(str("x1") + "," + str("x2") + "," + str("x3") + "," + str("x4") + "," + str("x5") + "," + str("x6") + "\n")
    for i in range(a):
        file.write(str(round(random.uniform(1, 5), 2)) + "," + str(round(random.uniform(4, 9), 2)) + ","
                   # + str(round(random.uniform(5, 8), 2)) + "," + str(round(random.uniform(0, 20), 2)) + ","
                   + str(round(random.uniform(0, 20), 2)) + "," + str(round(random.uniform(0, 20), 2)) + "\n")
    for i in range(a):
        file.write(str(round(random.uniform(0, 20), 2)) + "," + str(round(random.uniform(0, 20), 2)) + ","
                   # + str(round(random.uniform(0, 20), 2)) + "," + str(round(random.uniform(7, 12), 2)) + ","
                   + str(round(random.uniform(9, 14), 2)) + "," + str(round(random.uniform(17, 20), 2)) + "\n")
    # for i in range(a):
    #     file.write(str(round(random.uniform(17, 20), 2)) + "," + str(round(random.uniform(0, 20), 2)) + ","
    #                + str(round(random.uniform(0, 5), 2)) + "," + str(round(random.uniform(11, 25), 2)) + ","
    #                + str(round(random.uniform(6, 11), 2)) + "," + str(round(random.uniform(16, 18), 2)) + "\n")
    # for i in range(a):
    #     file.write(str(round(random.uniform(15, 18), 2)) + "," + str(round(random.uniform(5, 9), 2)) + ","
    #                + str(round(random.uniform(7, 10), 2)) + "," + str(round(random.uniform(17, 20), 2)) + ","
    #                + str(round(random.uniform(9, 15), 2)) + "," + str(round(random.uniform(0, 20), 2)) + "\n")