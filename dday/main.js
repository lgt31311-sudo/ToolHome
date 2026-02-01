
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

const dDayPicker = document.getElementById('d-day-picker');
const dDayResult = document.getElementById('d-day-result');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');
const dateDiffResult = document.getElementById('date-diff-result');
const copyBtn = document.getElementById('copyBtn');

function calculateDday() {
    if (!dDayPicker.value) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dDayPicker.value);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        dDayResult.textContent = 'D-day';
    } else if (diffDays > 0) {
        dDayResult.textContent = `D-${diffDays}`;
    } else {
        dDayResult.textContent = `D+${Math.abs(diffDays)}`;
    }
}

function calculateDateDiff() {
    if (!startDate.value || !endDate.value) return;
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    dateDiffResult.textContent = `${diffDays}일 차이`;
}

dDayPicker.addEventListener('change', calculateDday);
startDate.addEventListener('change', calculateDateDiff);
endDate.addEventListener('change', calculateDateDiff);

copyBtn.addEventListener('click', () => {
    let resultText = '';
    const activeTab = document.querySelector('.tab-content.active').id;
    if (activeTab === 'd-day') {
        resultText = dDayResult.textContent;
    } else {
        resultText = dateDiffResult.textContent;
    }
    navigator.clipboard.writeText(resultText).then(() => {
        alert('결과가 복사되었습니다.');
    });
});

// Set default dates
const today = new Date().toISOString().split('T')[0];
dDayPicker.value = today;
startDate.value = today;
endDate.value = today;

document.addEventListener('DOMContentLoaded', () => {
    openTab({ currentTarget: document.querySelector('.tab-link') }, 'd-day');
});
