const textInput = document.getElementById('textInput');
const withSpaces = document.getElementById('withSpaces');
const withoutSpaces = document.getElementById('withoutSpaces');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');
const utf8Bytes = document.getElementById('utf8Bytes');
const eucKrBytes = document.getElementById('eucKrBytes');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

function countCharacters() {
  const text = textInput.value;

  // 공백 포함 글자 수
  withSpaces.textContent = text.length.toLocaleString();

  // 공백 제외 글자 수
  withoutSpaces.textContent = text.replace(/\s/g, '').length.toLocaleString();

  // 단어 수 (한글, 영문 모두 고려)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  wordCount.textContent = words.length.toLocaleString();

  // 줄 수
  const lines = text.length === 0 ? 0 : text.split('\n').length;
  lineCount.textContent = lines.toLocaleString();

  // UTF-8 바이트 수
  const utf8ByteCount = new Blob([text]).size;
  utf8Bytes.textContent = utf8ByteCount.toLocaleString();

  // EUC-KR 바이트 수 (추정: 한글 2바이트, 그 외 1바이트)
  let eucKrCount = 0;
  for (const char of text) {
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(char)) {
      eucKrCount += 2;
    } else {
      eucKrCount += 1;
    }
  }
  eucKrBytes.textContent = eucKrCount.toLocaleString();
}

// 복사 버튼
copyBtn.addEventListener('click', async () => {
  if (textInput.value) {
    try {
      await navigator.clipboard.writeText(textInput.value);
      copyBtn.textContent = '복사됨!';
      setTimeout(() => {
        copyBtn.textContent = '복사';
      }, 1500);
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  }
});

// 지우기 버튼
clearBtn.addEventListener('click', () => {
  textInput.value = '';
  countCharacters();
  textInput.focus();
});

// 실시간 카운트
textInput.addEventListener('input', countCharacters);

// 초기화
countCharacters();