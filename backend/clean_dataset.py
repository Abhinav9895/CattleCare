from cleanvision import Imagelab

def main():

    dataset_path = r"C:\Users\abhin\Downloads\archive (3)\Cows datasets"

    imagelab = Imagelab(data_path=dataset_path)

    imagelab.find_issues()

    # show detailed report
    imagelab.report()

if __name__ == "__main__":
    main()