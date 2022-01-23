from livereload import Server, shell
from jinja2 import Environment, FileSystemLoader

FOODDATA = {
    "koreantable": {
      "breakfast": "운영없음",
      "lunch": "잔치국수<br />추가밥<br />찐만두<br />요구르트<br />맛김치",
      "dinner": "쌀밥<br />미역국<br />닭살간장볶음<br />데친두부<br />열무나물<br />깍두기"
    },
    "fryfry": "운영없음",
    "mixedrice": "돼지국밥<br />양념돈까스",
    "lounge": "운영없음",
    "momskitchen": "운영없음",
    "gracetable": "운영없음"
  }

def buildMail():
  env = Environment(
    loader=FileSystemLoader(".")
  )
  template = env.get_template("template/index.jinja")

  rendered_html = template.render(name="Jungsub", food=FOODDATA)
  with open("build/index.html", "w", encoding="utf-8") as file:
    file.write(rendered_html)
  
buildMail()

server = Server()
server.watch('template/*.jinja', buildMail)
server.serve(root='build/')