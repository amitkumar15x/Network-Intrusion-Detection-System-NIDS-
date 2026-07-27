from app import create_app, socketio

app = create_app()


if __name__ == "__main__":

    print("=" * 50)
    print(" SecureTech IDS Backend Starting")
    print("=" * 50)
    print("Server : http://127.0.0.1:5000")
    print("Socket : Socket.IO Enabled")
    print("=" * 50)

    socketio.run(
        app=app,
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False,
        allow_unsafe_werkzeug=True
    )