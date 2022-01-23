from jinja2 import Environment, FileSystemLoader

env = Environment(
  loader=FileSystemLoader(".")
)
template = env.get_template("newsletter.jinja")

print(template.render(name="Jungsub"))