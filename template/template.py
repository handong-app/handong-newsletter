from jinja2 import Environment, FileSystemLoader
import json, subprocess, time

def runScript():
  subprocess.call("npm run script --prefix handong-newsletter-script", shell=True)

def todayDate():
  days = "일월화수목금토"
  day = days[int(time.strftime("%w"))] + "요일"
  date = time.strftime("%Y.%m.%d")
  return [day, date]

def render_html():
  runScript()
  with open("handong-newsletter-script/data.json", encoding="utf8") as dummy_file:
    dummy = json.load(dummy_file)
    FOODDATA = dummy["food"]
    ANON_DATA = sorted(dummy["anon"], key=lambda x: x["view"], reverse=True)
    ANON_HOTDATA = ANON_DATA[:5]
    ANON_RESTDATA = ANON_DATA[5:]

  env = Environment(
    loader=FileSystemLoader(".")
  )
  template = env.get_template("template/index.jinja")

  rendered_html = template.render(date=todayDate(), food=FOODDATA, anon_hot=ANON_HOTDATA, anon_rest=ANON_RESTDATA)
  return rendered_html