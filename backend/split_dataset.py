import os
import random
import shutil

dataset_path = r"C:\Users\abhin\Downloads\archive (3)\Cows datasets"
output_path = r"C:\Users\abhin\Downloads\archive (3)\dataset_split"

classes = ["healthy", "lumpy", "foot-and-mouth"]

train_ratio = 0.7
val_ratio = 0.2
test_ratio = 0.1

for cls in classes:

    src = os.path.join(dataset_path, cls)
    images = os.listdir(src)

    random.shuffle(images)

    train_split = int(len(images) * train_ratio)
    val_split = int(len(images) * val_ratio)

    train_imgs = images[:train_split]
    val_imgs = images[train_split:train_split + val_split]
    test_imgs = images[train_split + val_split:]

    for folder in ["train","val","test"]:
        os.makedirs(os.path.join(output_path, folder, cls), exist_ok=True)

    for img in train_imgs:
        shutil.copy(os.path.join(src,img), os.path.join(output_path,"train",cls,img))

    for img in val_imgs:
        shutil.copy(os.path.join(src,img), os.path.join(output_path,"val",cls,img))

    for img in test_imgs:
        shutil.copy(os.path.join(src,img), os.path.join(output_path,"test",cls,img))

print("Dataset successfully split.")