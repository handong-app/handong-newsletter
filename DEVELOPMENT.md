## 의존성 라이브러리 설치

```
python3 -m venv .venv # venv 사용 권장
source ./.venv/bin/activate # venv 활성화 (MAC / LINUX)

pip install -r requirements.txt
```

## 실시간 템플릿 제작

```
python live-mail-pv.py
```

## Handong News Letter (Submodule) 업데이트

```

git submodule update --remote --init # submodule 추가하기
git submodule foreach git reset --hard # 리셋하기
```
