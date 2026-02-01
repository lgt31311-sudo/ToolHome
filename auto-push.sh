#!/bin/bash

# 자동 커밋 및 푸시 스크립트
# 파일 변경 감지 시 자동으로 GitHub에 업로드

cd /home/user/tool-home

echo "자동 푸시 스크립트 시작..."
echo "파일 변경을 감지하면 자동으로 GitHub에 업로드됩니다."
echo "중지하려면 Ctrl+C를 누르세요."
echo ""

while true; do
  # 변경사항 확인
  if [[ -n $(git status --porcelain 2>/dev/null | grep -E '^\s?M|^\?\?') ]]; then
    echo "[$(date '+%H:%M:%S')] 변경사항 감지됨"

    # 스테이징 (주요 파일만)
    git add index.html main.js style.css 2>/dev/null

    # 변경사항이 스테이징되었는지 확인
    if [[ -n $(git diff --cached --name-only) ]]; then
      # 커밋
      git commit -m "자동 업데이트: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null

      # 푸시
      if git push origin main 2>/dev/null; then
        echo "[$(date '+%H:%M:%S')] GitHub에 업로드 완료!"
      else
        echo "[$(date '+%H:%M:%S')] 푸시 실패"
      fi
    fi
  fi

  # 5초마다 확인
  sleep 5
done
