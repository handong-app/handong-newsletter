from jinja2 import Environment, FileSystemLoader
import json

def render_html():
  with open("template/template.json", encoding="utf8") as dummy_file:
    dummy = json.load(dummy_file)
    FOODDATA = dummy["food"]
    ANON_DATA = sorted(dummy["anon"], key=lambda x: x["view"], reverse=True)
    ANON_HOTDATA = ANON_DATA[:5]
    ANON_RESTDATA = ANON_DATA[5:]

  env = Environment(
    loader=FileSystemLoader(".")
  )
  template = env.get_template("template/index.jinja")

  rendered_html = template.render(name="Jungsub", food=FOODDATA, anon_hot=ANON_HOTDATA, anon_rest=ANON_RESTDATA)
  return rendered_html