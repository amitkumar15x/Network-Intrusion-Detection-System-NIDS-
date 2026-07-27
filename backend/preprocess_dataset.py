import os
import glob
import pandas as pd
import numpy as np

DATASET_DIR = "datasets"
OUTPUT_FILE = os.path.join(DATASET_DIR, "cleaned_cicids2017.csv")


def clean_dataframe(df):
    df.columns = df.columns.str.strip()

    if "Label" not in df.columns:
        raise Exception("Label column not found.")

    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    df.drop_duplicates(inplace=True)

    return df


def main():

    parquet_files = glob.glob(os.path.join(DATASET_DIR, "*.parquet"))

    if len(parquet_files) == 0:
        raise Exception("No parquet files found.")

    print(f"\nFound {len(parquet_files)} parquet files\n")

    dfs = []

    for file in parquet_files:

        print("Loading :", os.path.basename(file))

        df = pd.read_parquet(file)

        df = clean_dataframe(df)

        dfs.append(df)

        print("Rows :", len(df))

    dataset = pd.concat(dfs, ignore_index=True)

    print("\nMerged Rows :", len(dataset))

    print("\nAttack Distribution\n")

    print(dataset["Label"].value_counts())

    dataset.to_csv(OUTPUT_FILE, index=False)

    print("\nSaved :", OUTPUT_FILE)


if __name__ == "__main__":
    main()