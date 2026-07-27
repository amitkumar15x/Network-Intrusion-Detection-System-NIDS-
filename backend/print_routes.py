from app import create_app

app = create_app()

print("\n" + "="*50)
print("   REGISTERED NIDS ENGINE ENDPOINTS")
print("="*50)

# Loop through Flask's internal URL map
for rule in app.url_map.iter_rules():
    # Filter out internal static assets
    if "static" not in rule.endpoint:
        methods = ', '.join(sorted(list(rule.methods - {'OPTIONS', 'HEAD'})))
        print(f"[{methods}] -> {rule.rule}")

print("="*50 + "\n")