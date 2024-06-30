lenCounts = {}
words = []

with open("words.txt") as f:
    for line in f.readlines():
        word = line.strip()
        if str(len(word)) in lenCounts.keys():
            lenCounts[str(len(word))] += 1
        else:
            lenCounts[str(len(word))] = 1

        if 3 < len(word) < 7:
            words.append(word.capitalize())
            print(word.capitalize())


for i in range(2, 16):
    print(f"{i} - {lenCounts[str(i)]}")

print(len(words))


with open("words.json", "w+") as f:
    f.write(str(words))
