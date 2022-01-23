from livereload import Server, shell
from jinja2 import Environment, FileSystemLoader

def buildMail():
  env = Environment(
    loader=FileSystemLoader(".")
  )
  template = env.get_template("template/index.html")

  rendered_html = template.render(name="Jungsub")
  with open("build/index.html", "w", encoding="utf-8") as file:
    file.write(rendered_html)
  
buildMail()

server = Server()
server.watch('*.html', buildMail)
server.serve(root='build/')