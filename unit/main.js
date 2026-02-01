// 단위 변환 데이터
const unitData = {
    length: {
        name: '길이',
        units: {
            mm: { name: 'mm (밀리미터)', toBase: 0.001 },
            cm: { name: 'cm (센티미터)', toBase: 0.01 },
            m: { name: 'm (미터)', toBase: 1 },
            km: { name: 'km (킬로미터)', toBase: 1000 },
            inch: { name: 'inch (인치)', toBase: 0.0254 },
            feet: { name: 'feet (피트)', toBase: 0.3048 },
            yard: { name: 'yard (야드)', toBase: 0.9144 },
            mile: { name: 'mile (마일)', toBase: 1609.344 }
        },
        baseUnit: 'm'
    },
    weight: {
        name: '무게',
        units: {
            mg: { name: 'mg (밀리그램)', toBase: 0.000001 },
            g: { name: 'g (그램)', toBase: 0.001 },
            kg: { name: 'kg (킬로그램)', toBase: 1 },
            ton: { name: 'ton (톤)', toBase: 1000 },
            lb: { name: 'lb (파운드)', toBase: 0.453592 },
            oz: { name: 'oz (온스)', toBase: 0.0283495 }
        },
        baseUnit: 'kg'
    },
    temperature: {
        name: '온도',
        units: {
            celsius: { name: '°C (섭씨)' },
            fahrenheit: { name: '°F (화씨)' },
            kelvin: { name: 'K (켈빈)' }
        },
        baseUnit: 'celsius',
        special: true
    },
    area: {
        name: '넓이',
        units: {
            sqm: { name: '㎡ (제곱미터)', toBase: 1 },
            pyeong: { name: '평', toBase: 3.305785 },
            acre: { name: 'acre (에이커)', toBase: 4046.8564224 },
            ha: { name: 'ha (헥타르)', toBase: 10000 }
        },
        baseUnit: 'sqm'
    },
    volume: {
        name: '부피',
        units: {
            ml: { name: 'ml (밀리리터)', toBase: 0.001 },
            L: { name: 'L (리터)', toBase: 1 },
            gallon: { name: 'gallon (갤런)', toBase: 3.785411784 },
            floz: { name: 'fl oz (액량 온스)', toBase: 0.0295735295625 }
        },
        baseUnit: 'L'
    },
    data: {
        name: '데이터',
        units: {
            B: { name: 'B (바이트)', toBase: 1 },
            KB: { name: 'KB (킬로바이트)', toBase: 1024 },
            MB: { name: 'MB (메가바이트)', toBase: 1048576 },
            GB: { name: 'GB (기가바이트)', toBase: 1073741824 },
            TB: { name: 'TB (테라바이트)', toBase: 1099511627776 }
        },
        baseUnit: 'B'
    }
};

let currentCategory = 'length';

// DOM 요소
const tabs = document.querySelectorAll('.tab');
const inputValue = document.getElementById('inputValue');
const inputUnit = document.getElementById('inputUnit');
const resultGrid = document.getElementById('resultGrid');

// 초기화
function init() {
    setupTabs();
    updateUnitSelect();
    setupEventListeners();
    convert();
}

// 탭 설정
function setupTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            currentCategory = tab.dataset.category;
            updateUnitSelect();
            convert();
        });
    });
}

// 단위 선택 업데이트
function updateUnitSelect() {
    const category = unitData[currentCategory];
    inputUnit.innerHTML = '';

    Object.entries(category.units).forEach(([key, unit]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = unit.name;
        inputUnit.appendChild(option);
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    inputValue.addEventListener('input', convert);
    inputUnit.addEventListener('change', convert);
}

// 온도 변환 (특수 처리)
function convertTemperature(value, fromUnit, toUnit) {
    let celsius;

    // 먼저 섭씨로 변환
    switch (fromUnit) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5 / 9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }

    // 섭씨에서 목표 단위로 변환
    switch (toUnit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return celsius * 9 / 5 + 32;
        case 'kelvin':
            return celsius + 273.15;
    }
}

// 숫자 포맷팅
function formatNumber(num) {
    if (num === 0) return '0';
    if (isNaN(num) || !isFinite(num)) return '-';

    const absNum = Math.abs(num);

    // 아주 크거나 작은 숫자는 지수 표기법 사용
    if (absNum >= 1e12 || (absNum < 1e-6 && absNum > 0)) {
        return num.toExponential(4);
    }

    // 소수점 이하 자릿수 결정
    if (absNum >= 1000) {
        return num.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
    } else if (absNum >= 1) {
        return num.toLocaleString('ko-KR', { maximumFractionDigits: 6 });
    } else {
        return num.toLocaleString('ko-KR', { maximumFractionDigits: 10 });
    }
}

// 변환 수행
function convert() {
    const value = parseFloat(inputValue.value);
    const fromUnit = inputUnit.value;
    const category = unitData[currentCategory];

    resultGrid.innerHTML = '';

    if (isNaN(value)) {
        // 값이 없으면 기본 표시
        Object.entries(category.units).forEach(([key, unit], index) => {
            const div = document.createElement('div');
            div.className = `result-item${index % 2 === 1 ? ' alt' : ''}`;
            div.innerHTML = `
                <span class="result-unit">${unit.name}</span>
                <span class="result-value">-</span>
            `;
            resultGrid.appendChild(div);
        });
        return;
    }

    // 각 단위로 변환
    Object.entries(category.units).forEach(([key, unit], index) => {
        let result;

        if (category.special) {
            // 온도 변환
            result = convertTemperature(value, fromUnit, key);
        } else {
            // 일반 단위 변환: 입력값을 기본 단위로 변환 후 목표 단위로 변환
            const baseValue = value * category.units[fromUnit].toBase;
            result = baseValue / unit.toBase;
        }

        const div = document.createElement('div');
        div.className = `result-item${index % 2 === 1 ? ' alt' : ''}`;
        div.innerHTML = `
            <span class="result-unit">${unit.name}</span>
            <span class="result-value">${formatNumber(result)}</span>
        `;
        resultGrid.appendChild(div);
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);
