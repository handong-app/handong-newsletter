from http.server import SimpleHTTPRequestHandler
import socketserver
PORT = 8000

class MyRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/newsletter.html'
        return SimpleHTTPRequestHandler.do_GET(self)

# Handler = SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()