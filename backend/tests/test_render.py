@app.get("/test-render-smtp")
async def test_smtp_on_render():
    import socket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex(('smtp.gmail.com', 587))
        sock.close()
        return {"port_587_accessible": result == 0}
    except Exception as e:
        return {"error": str(e)}