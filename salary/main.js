// 2024년 4대보험 요율
const RATES = {
    pension: 0.045,           // 국민연금 4.5%
    health: 0.03545,          // 건강보험 3.545%
    longterm: 0.1295,         // 장기요양보험 (건강보험의 12.95%)
    employment: 0.009,        // 고용보험 0.9%
    pensionMaxIncome: 5900000 // 국민연금 기준소득월액 상한 (2024년)
};

// 소득세 누진세율 (2024년)
const TAX_BRACKETS = [
    { limit: 14000000, rate: 0.06, deduction: 0 },
    { limit: 50000000, rate: 0.15, deduction: 1260000 },
    { limit: 88000000, rate: 0.24, deduction: 5760000 },
    { limit: 150000000, rate: 0.35, deduction: 15440000 },
    { limit: 300000000, rate: 0.38, deduction: 19940000 },
    { limit: 500000000, rate: 0.40, deduction: 25940000 },
    { limit: 1000000000, rate: 0.42, deduction: 35940000 },
    { limit: Infinity, rate: 0.45, deduction: 65940000 }
];

// DOM 요소
const salaryInput = document.getElementById('salary');
const salaryUnitSelect = document.getElementById('salaryUnit');
const dependentsSelect = document.getElementById('dependents');
const childrenSelect = document.getElementById('children');
const nonTaxableInput = document.getElementById('nonTaxable');
const calculateBtn = document.getElementById('calculateBtn');
const resultSection = document.getElementById('resultSection');

// 이벤트 리스너
calculateBtn.addEventListener('click', calculate);
salaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculate();
});

// 숫자 포맷팅
function formatNumber(num) {
    return Math.round(num).toLocaleString('ko-KR');
}

// 근로소득공제 계산
function calculateEarnedIncomeDeduction(totalSalary) {
    if (totalSalary <= 5000000) {
        return totalSalary * 0.7;
    } else if (totalSalary <= 15000000) {
        return 3500000 + (totalSalary - 5000000) * 0.4;
    } else if (totalSalary <= 45000000) {
        return 7500000 + (totalSalary - 15000000) * 0.15;
    } else if (totalSalary <= 100000000) {
        return 12000000 + (totalSalary - 45000000) * 0.05;
    } else {
        return 14750000 + (totalSalary - 100000000) * 0.02;
    }
}

// 소득세 계산
function calculateIncomeTax(taxableIncome) {
    if (taxableIncome <= 0) return 0;

    for (const bracket of TAX_BRACKETS) {
        if (taxableIncome <= bracket.limit) {
            return taxableIncome * bracket.rate - bracket.deduction;
        }
    }
    return 0;
}

// 간이세액 계산 (부양가족 수에 따른 조정)
function calculateSimplifiedTax(monthlyTaxableIncome, dependents, children) {
    // 연간 과세소득 계산
    const yearlyTaxableIncome = monthlyTaxableIncome * 12;

    // 근로소득공제
    const earnedIncomeDeduction = calculateEarnedIncomeDeduction(yearlyTaxableIncome);

    // 인적공제 (1인당 150만원)
    const personalDeduction = dependents * 1500000;

    // 자녀세액공제를 위한 추가 공제 (자녀 1인당 연 15만원 세액공제 -> 소득공제로 환산 약 100만원)
    const childDeduction = children * 1000000;

    // 국민연금 공제 (연간)
    const pensionDeduction = Math.min(monthlyTaxableIncome, RATES.pensionMaxIncome) * RATES.pension * 12;

    // 건강보험 공제 (연간)
    const healthDeduction = monthlyTaxableIncome * RATES.health * 12;
    const longtermDeduction = healthDeduction * RATES.longterm;

    // 고용보험 공제 (연간)
    const employmentDeduction = monthlyTaxableIncome * RATES.employment * 12;

    // 보험료 공제 합계
    const insuranceDeduction = pensionDeduction + healthDeduction + longtermDeduction + employmentDeduction;

    // 표준세액공제 (13만원)
    const standardDeduction = 130000;

    // 과세표준 계산
    let taxBase = yearlyTaxableIncome - earnedIncomeDeduction - personalDeduction - childDeduction - insuranceDeduction;
    taxBase = Math.max(0, taxBase);

    // 산출세액
    let calculatedTax = calculateIncomeTax(taxBase);

    // 자녀세액공제 적용
    if (children >= 1) {
        const childTaxCredit = children <= 2 ? children * 150000 : 300000 + (children - 2) * 300000;
        calculatedTax = Math.max(0, calculatedTax - childTaxCredit);
    }

    // 표준세액공제 적용
    calculatedTax = Math.max(0, calculatedTax - standardDeduction);

    // 월 소득세
    return calculatedTax / 12;
}

// 메인 계산 함수
function calculate() {
    const salaryValue = parseFloat(salaryInput.value);
    const salaryUnit = parseInt(salaryUnitSelect.value);
    const dependents = parseInt(dependentsSelect.value);
    const children = parseInt(childrenSelect.value);
    const nonTaxable = parseFloat(nonTaxableInput.value) || 0;

    if (isNaN(salaryValue) || salaryValue <= 0) {
        alert('연봉을 입력해주세요.');
        return;
    }

    // 연봉을 원 단위로 변환
    const yearlySalary = salaryValue * salaryUnit;
    const monthlySalary = yearlySalary / 12;

    // 과세 대상 월급 (비과세액 제외)
    const monthlyTaxable = Math.max(0, monthlySalary - nonTaxable);

    // 4대보험 계산 (과세 대상 금액 기준)
    const pension = Math.min(monthlyTaxable, RATES.pensionMaxIncome) * RATES.pension;
    const health = monthlyTaxable * RATES.health;
    const longterm = health * RATES.longterm;
    const employment = monthlyTaxable * RATES.employment;

    // 소득세 계산
    const incomeTax = calculateSimplifiedTax(monthlyTaxable, dependents, children);
    const localTax = incomeTax * 0.1;

    // 총 공제액
    const totalDeduction = pension + health + longterm + employment + incomeTax + localTax;

    // 실수령액
    const monthlyNet = monthlySalary - totalDeduction;
    const yearlyNet = monthlyNet * 12;
    const netRatio = (yearlyNet / yearlySalary) * 100;

    // 결과 표시
    resultSection.style.display = 'block';

    document.getElementById('monthlyNet').textContent = formatNumber(monthlyNet) + '원';
    document.getElementById('yearlyNet').textContent = formatNumber(yearlyNet) + '원';
    document.getElementById('netRatio').textContent = netRatio.toFixed(1) + '%';
    document.getElementById('totalDeduction').textContent = formatNumber(totalDeduction) + '원';

    document.getElementById('pension').textContent = formatNumber(pension) + '원';
    document.getElementById('health').textContent = formatNumber(health) + '원';
    document.getElementById('longterm').textContent = formatNumber(longterm) + '원';
    document.getElementById('employment').textContent = formatNumber(employment) + '원';
    document.getElementById('incomeTax').textContent = formatNumber(incomeTax) + '원';
    document.getElementById('localTax').textContent = formatNumber(localTax) + '원';
    document.getElementById('totalDeductionDetail').textContent = formatNumber(totalDeduction) + '원';

    // 결과 섹션으로 스크롤
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
