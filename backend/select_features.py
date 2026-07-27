import pandas as pd
from sklearn.ensemble import RandomForestClassifier

print("Loading dataset...")

df = pd.read_csv("datasets/cleaned_cicids2017.csv")

print("Dataset Shape:", df.shape)

X = df.drop("Label", axis=1)
y = df["Label"]

print("Training Random Forest for feature importance...")

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

model.fit(X, y)

importance = pd.DataFrame({
    "Feature": X.columns,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print("\nTop 20 Features\n")

print(importance.head(20))

importance.to_csv(
    "datasets/feature_importance.csv",
    index=False
)

print("\nSaved feature importance to datasets/feature_importance.csv")