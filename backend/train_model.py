import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

from app.config import Config

TOP_FEATURES = [
    "Bwd Packet Length Std",
    "Bwd Packet Length Mean",
    "Avg Bwd Segment Size",
    "Packet Length Variance",
    "Bwd Packets Length Total",
    "Bwd Packet Length Max",
    "Packet Length Std",
    "Subflow Bwd Bytes",
    "Fwd IAT Std",
    "Fwd Packets Length Total",
    "Avg Packet Size",
    "Subflow Fwd Bytes",
    "Packet Length Mean",
    "Packet Length Max",
    "Fwd Packet Length Std",
    "Fwd Act Data Packets",
    "Fwd Packet Length Max",
    "Flow IAT Max",
    "Flow Packets/s",
    "Total Fwd Packets"
]

print("Loading dataset...")

df = pd.read_csv("datasets/cleaned_cicids2017.csv")

print("Dataset Loaded")

X = df[TOP_FEATURES]

y = (df["Label"] != "Benign").astype(int)

print("Train/Test Split...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Scaling...")

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

print("Training Random Forest...")

model = RandomForestClassifier(
    n_estimators=250,
    max_depth=20,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

pred = model.predict(X_test)

print()

print("Accuracy:", accuracy_score(y_test, pred))

print()

print(classification_report(y_test, pred))

joblib.dump(model, Config.MODEL_PATH)
joblib.dump(scaler, Config.SCALER_PATH)

print()

print("Model Saved Successfully")