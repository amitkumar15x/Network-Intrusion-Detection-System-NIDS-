import os

from app import create_app, socketio


app = create_app()


if __name__ == "__main__":

    # Check administrator privilege for Scapy on Windows
    is_admin = False

    try:
        import ctypes
        is_admin = ctypes.windll.shell32.IsUserAnAdmin() != 0

    except Exception:
        if hasattr(os, "getuid"):
            is_admin = os.getuid() == 0


    print("=" * 70)
    print(" SECURETECH NETWORK INTRUSION DETECTION SYSTEM (NIDS)")
    print("=" * 70)

    print(" WebSocket Engine            : Threading Mode")
    print(f" Windows Administrator Mode  : {is_admin}")


    if not is_admin:
        print("\n[WARNING]")
        print("Run PowerShell as Administrator")
        print("for Scapy packet capture.")

    else:
        print("\n[SUCCESS]")
        print("Raw socket capture access validated.")


    print("\nStarting backend server...")
    print("URL : http://127.0.0.1:5000")
    print("=" * 70)


    socketio.run(
        app,
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False,
        allow_unsafe_werkzeug=True
    )