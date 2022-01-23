from jinja2 import Environment, FileSystemLoader
import json

def render_html():
  with open("template/template.json", encoding="utf8") as dummy_file:
    dummy = json.load(dummy_file)
    FOODDATA = dummy["food"]

  env = Environment(
    loader=FileSystemLoader(".")
  )
  template = env.get_template("template/index.jinja")

  rendered_html = template.render(name="Jungsub", food=FOODDATA)
  return rendered_html