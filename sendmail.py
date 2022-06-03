import os
import smtplib, ssl
# from premailer import transform
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from dotenv import load_dotenv
from firebase_handler import firebase_handler

from template.template import render_html, todayDate

# 시스템 변수 불러오기
load_dotenv()

# 메일 준비하기
# htmlFile = open("newsletter.html", "r", encoding="utf-8")
# htmlBody = htmlFile.read()
# htmlFile.close()

# print(transform(htmlBody))

# Make email sender(from)
msgFrom = Header(f'\'{os.getenv("EMAIL_SENDER_NAME")}\'', 'utf-8')
msgFrom.append(f'<{os.getenv("EMAIL_SENDER_EMAIL")}>', 'ascii')

# Make email MIME
msg = MIMEMultipart("alternative")
msg["Subject"] = f"{todayDate()[0]} 한동 뉴스레터"
msg["From"] = msgFrom

def send_email(smtp, to_user, html):
  email = to_user["email"]
  msg["To"] = email
  htmlMIME = MIMEText(html, "html")
  msg.attach(htmlMIME)
  smtp.sendmail(os.getenv("EMAIL_SENDER_EMAIL"), msg["To"], msg.as_string())
  print("Sent to %s" % (email[0] + "#####" + email[email.find("@") - 1:]))

# 지금은 하나의 HTML 만 사용. 나중에는 변경될 예정.
html = render_html()

# Mailing List 가져오기
firebase_app = firebase_handler()
mailing_list = firebase_app.get_mailing_list()
print("Got %d email(s) to send." % len(mailing_list))

# 메일 보내기
# context = ssl.create_default_context()
with smtplib.SMTP(os.getenv("SMTP_HOST"), port=os.getenv("SMTP_PORT")) as smtp:
  smtp.ehlo()
  smtp.starttls()
  smtp.ehlo()
  smtp.login(os.getenv("SMTP_ID"), os.getenv("SMTP_PW")) # 아이디 비밀번호로 로그인
  for user in mailing_list:
    send_email(smtp, user, html)

# smtp = smtplib.SMTP('localhost')
# smtp.sendmail("test@example.com", "junglesubmarine@gmail.com", msg.as_string())
