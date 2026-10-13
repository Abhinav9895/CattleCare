import os
from PIL import Image
import imagehash

dataset_path = r"C:\Users\abhin\Downloads\archive (3)\Cows datasets"

hashes = {}
deleted = 0

print("Scanning images...")

for root, dirs, files in os.walk(dataset_path):
    for file in files:

        if file.lower().endswith((".jpg",".jpeg",".png")):

            path = os.path.join(root,file)

            try:
                img = Image.open(path)

                # remove blurry / empty images
                if img.size[0] < 50 or img.size[1] < 50:
                    os.remove(path)
                    print("Deleted small image:", path)
                    deleted += 1
                    continue

                # detect duplicates
                img_hash = imagehash.average_hash(img)

                if img_hash in hashes:
                    os.remove(path)
                    print("Deleted duplicate:", path)
                    deleted += 1
                else:
                    hashes[img_hash] = path

            except:
                print("Corrupted image removed:", path)
                os.remove(path)
                deleted += 1

print("\nCleaning completed.")
print("Total images removed:", deleted)