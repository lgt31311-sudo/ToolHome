document.addEventListener('DOMContentLoaded', function() {
    const birthYearSelect = document.getElementById('birthYear');
    const birthMonthSelect = document.getElementById('birthMonth');
    const birthDaySelect = document.getElementById('birthDay');
    const resultSection = document.getElementById('resultSection');

    // 띠 배열 (쥐부터 시작, 1900년이 쥐띠)
    const zodiacAnimals = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
    const zodiacEmojis = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐏', '🐵', '🐔', '🐶', '🐷'];

    // 별자리 배열
    const constellations = [
        { name: '염소자리', emoji: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
        { name: '물병자리', emoji: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
        { name: '물고기자리', emoji: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
        { name: '양자리', emoji: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
        { name: '황소자리', emoji: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
        { name: '쌍둥이자리', emoji: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
        { name: '게자리', emoji: '♋', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
        { name: '사자자리', emoji: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
        { name: '처녀자리', emoji: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
        { name: '천칭자리', emoji: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
        { name: '전갈자리', emoji: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
        { name: '사수자리', emoji: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 }
    ];

    // 연도 옵션 생성 (현재 연도부터 1900년까지)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '년';
        birthYearSelect.appendChild(option);
    }

    // 월 옵션 생성
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '월';
        birthMonthSelect.appendChild(option);
    }

    // 일 옵션 생성 (기본 31일)
    function updateDays() {
        const year = parseInt(birthYearSelect.value) || currentYear;
        const month = parseInt(birthMonthSelect.value) || 1;
        const currentDay = birthDaySelect.value;

        // 해당 월의 마지막 날 계산
        const lastDay = new Date(year, month, 0).getDate();

        // 기존 옵션 제거 (첫 번째 placeholder 제외)
        while (birthDaySelect.options.length > 1) {
            birthDaySelect.remove(1);
        }

        // 새로운 일 옵션 생성
        for (let day = 1; day <= lastDay; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day + '일';
            birthDaySelect.appendChild(option);
        }

        // 이전 선택값 복원 (가능한 경우)
        if (currentDay && parseInt(currentDay) <= lastDay) {
            birthDaySelect.value = currentDay;
        }
    }

    // 초기 일 옵션 생성
    updateDays();

    // 이벤트 리스너
    birthYearSelect.addEventListener('change', function() {
        updateDays();
        calculateAge();
    });

    birthMonthSelect.addEventListener('change', function() {
        updateDays();
        calculateAge();
    });

    birthDaySelect.addEventListener('change', calculateAge);

    function calculateAge() {
        const year = parseInt(birthYearSelect.value);
        const month = parseInt(birthMonthSelect.value);
        const day = parseInt(birthDaySelect.value);

        // 모든 값이 선택되지 않으면 결과 숨김
        if (!year || !month || !day) {
            resultSection.style.display = 'none';
            return;
        }

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        // 오늘 날짜 자정으로 설정
        today.setHours(0, 0, 0, 0);
        birthDate.setHours(0, 0, 0, 0);

        const birthYear = birthDate.getFullYear();
        const birthMonth = birthDate.getMonth();
        const birthDay = birthDate.getDate();

        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const currentDay = today.getDate();

        // 만 나이 계산
        let fullAge = currentYear - birthYear;
        if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
            fullAge--;
        }

        // 세는 나이 계산
        const koreanAge = currentYear - birthYear + 1;

        // 연 나이 계산
        const yearAge = currentYear - birthYear;

        // 다음 생일까지 D-day 계산
        let nextBirthday = new Date(currentYear, birthMonth, birthDay);
        if (nextBirthday <= today) {
            nextBirthday = new Date(currentYear + 1, birthMonth, birthDay);
        }
        const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

        // 태어난 지 며칠째인지
        const daysLived = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24)) + 1;

        // 띠 계산
        const zodiacIndex = (birthYear - 1900) % 12;
        const zodiac = zodiacAnimals[zodiacIndex < 0 ? zodiacIndex + 12 : zodiacIndex];
        const zodiacEmoji = zodiacEmojis[zodiacIndex < 0 ? zodiacIndex + 12 : zodiacIndex];

        // 별자리 계산
        const constellation = getConstellation(birthMonth + 1, birthDay);

        // 결과 표시
        resultSection.style.display = 'block';

        document.getElementById('fullAge').textContent = fullAge + '세';
        document.getElementById('koreanAge').textContent = koreanAge + '세';
        document.getElementById('yearAge').textContent = yearAge + '세';

        if (daysUntilBirthday === 0) {
            document.getElementById('nextBirthday').textContent = '오늘!';
            document.getElementById('nextBirthdayDesc').textContent = '생일 축하합니다 🎂';
        } else {
            document.getElementById('nextBirthday').textContent = 'D-' + daysUntilBirthday;
            document.getElementById('nextBirthdayDesc').textContent = formatDate(nextBirthday);
        }

        document.getElementById('daysLived').textContent = daysLived.toLocaleString();
        document.getElementById('zodiac').textContent = zodiacEmoji + ' ' + zodiac;
        document.getElementById('zodiacDesc').textContent = birthYear + '년생';
        document.getElementById('constellation').textContent = constellation.emoji;
        document.getElementById('constellationDesc').textContent = constellation.name;
    }

    function getConstellation(month, day) {
        for (const c of constellations) {
            if (c.startMonth === 12 && c.endMonth === 1) {
                // 염소자리 특수 처리 (12월~1월)
                if ((month === 12 && day >= c.startDay) || (month === 1 && day <= c.endDay)) {
                    return c;
                }
            } else {
                if ((month === c.startMonth && day >= c.startDay) ||
                    (month === c.endMonth && day <= c.endDay)) {
                    return c;
                }
            }
        }
        return { name: '-', emoji: '-' };
    }

    function formatDate(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return month + '월 ' + day + '일';
    }
});
