import websocket
import json
import threading
import time

class OddsWebSocketClient:
    def __init__(self, url="ws://127.0.0.1:8000//ws/odds"):
        self.url = url
        self.ws = None
        self.connected = False

    def on_message(self, ws, message):
        print(f"Received message: {message}")

    def on_error(self, ws, error):
        print(f"Error: {error}")
        self.connected = False

    def on_close(self, ws, close_status_code, close_msg):
        print("WebSocket connection closed")
        self.connected = False

    def on_open(self, ws):
        print("WebSocket connection established")
        self.connected = True

    def connect(self):
        websocket.enableTrace(True)
        self.ws = websocket.WebSocketApp(
            self.url,
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close,
            on_open=self.on_open
        )
        
        # Start WebSocket connection in a separate thread
        wst = threading.Thread(target=self.ws.run_forever)
        wst.daemon = True
        wst.start()

        # Wait for connection to establish
        timeout = 5
        start_time = time.time()
        while not self.connected and time.time() - start_time < timeout:
            time.sleep(0.1)

        if not self.connected:
            raise Exception("Failed to establish WebSocket connection")

    def close(self):
        if self.ws:
            self.ws.close()