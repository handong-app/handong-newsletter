from livereload import Server, shell
from template.template import render_html
import os


def buildMail():
  if not os.path.exists("build"):
    os.makedirs("build")
  with open("build/index.html", "w", encoding="utf-8") as file:
    file.write(render_html())
  
buildMail()

server = Server()
server.watch('template/*.*', buildMail)
server.serve(root='build/')