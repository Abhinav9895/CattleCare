import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

model = tf.keras.models.load_model("cattle_disease_model.h5")

dataset_path = r"C:\Users\abhin\Downloads\archive (3)\dataset_split"

img_size = (224,224)

test_datagen = ImageDataGenerator(rescale=1./255)

test_data = test_datagen.flow_from_directory(
    dataset_path + "/test",
    target_size=img_size,
    batch_size=32,
    class_mode="categorical",
    shuffle=False
)

loss, accuracy = model.evaluate(test_data)

print("Test Accuracy:", accuracy)