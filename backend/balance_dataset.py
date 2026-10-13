import os
import random

dataset_path = r"C:\Users\abhin\Downloads\archive (3)\Cows datasets"

target_size = 745

classes = ["healthy", "lumpy", "foot-and-mouth"]

for cls in classes:

    class_path = os.path.join(dataset_path, cls)

    images = os.listdir(class_path)

    print(f"\nClass: {cls}")
    print("Current images:", len(images))

    if len(images) > target_size:

        remove_count = len(images) - target_size

        images_to_remove = random.sample(images, remove_count)

        for img in images_to_remove:

            os.remove(os.path.join(class_path, img))

        print("Removed:", remove_count)

    else:
        print("No removal needed")