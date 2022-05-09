import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

class firebase_handler:
  def __init__(self):
    service_acc_key = json.loads(os.getenv("FIREBASE_CONFIG"))
    cred = credentials.Certificate(service_acc_key)
    print("Project ID: %s (Service Acc: %s)" % (cred.project_id, cred.service_account_email))

    self.app = firebase_admin.initialize_app(cred)
  
  def get_mailing_list(self):
    db = firestore.client(self.app)
    docs = db.collection(u'subscribers').stream()

    doc_list = [doc.to_dict() for doc in docs]
    db.close()
    return doc_list

if __name__ == "__main__":
  handler = firebase_handler().get_mailing_list()
  print(handler)