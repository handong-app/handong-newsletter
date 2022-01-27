import os
import smtplib, ssl
# from premailer import transform
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from dotenv import load_dotenv

from template.template import render_html

# 시스템 변수 불러오기
load_dotenv()

# 메일 준비하기
# htmlFile = open("newsletter.html", "r", encoding="utf-8")
# htmlBody = htmlFile.read()
htmlMIME = MIMEText(render_html(), "html")
# htmlFile.close()

# print(transform(htmlBody))

# Make email sender(from)
msgFrom = Header(os.getenv("EMAIL_SENDER_NAME"), 'utf-8')
msgFrom.append(f'<{os.getenv("EMAIL_SENDER_EMAIL")}>', 'ascii')

# Make email MIME
msg = MIMEMultipart("alternative")
msg["Subject"] = "This is Subject"
msg["From"] = msgFrom
msg["To"] = "junglesubmarine@gmail.com"
msg.attach(htmlMIME)

# smtp = smtplib.SMTP('localhost')
# smtp.sendmail("test@example.com", "junglesubmarine@gmail.com", msg.as_string())

# 메일 보내기
context = ssl.create_default_context()
with smtplib.SMTP_SSL(os.getenv("SMTP_HOST"), context=context) as smtp:
  smtp.login(os.getenv("SMTP_ID"), os.getenv("SMTP_PW")) # 아이디 비밀번호로 로그인
  smtp.sendmail(os.getenv("EMAIL_SENDER_EMAIL"), msg["To"], msg.as_string())