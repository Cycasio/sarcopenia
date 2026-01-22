// ==========================================
// 全域變數 / Global Variables
// ==========================================

let currentGuideline = 'awgs2019';
let currentStep = 0;
let diagnosticData = {
    gender: '',
    age: null,
    screening: {
        sarcf: null,
        calfCircumference: null
    },
    strength: {
        handgrip: null
    },
    muscleMass: {
        method: '',
        value: null
    },
    performance: {
        gaitSpeed: null,
        sppb: null,
        chairStand: null,
        tug: null
    }
};

// 診斷標準數據
const guidelines = {
    awgs2019: {
        name: 'AWGS 2019',
        screening: {
            sarcf: 4,
            sarcfCalf: 11,
            calfCircumference: { male: 34, female: 33 }
        },
        strength: {
            handgrip: { male: 28, female: 18 }
        },
        muscleMass: {
            dxa: { male: 7.0, female: 5.4 },
            bia: { male: 7.0, female: 5.7 }
        },
        performance: {
            gaitSpeed: 1.0,
            sppb: 9,
            chairStand: 12
        }
    },
    ewgsop2: {
        name: 'EWGSOP2',
        screening: {
            sarcf: 4,
            calfCircumference: { male: 31, female: 33 }
        },
        strength: {
            handgrip: { male: 27, female: 16 }
        },
        muscleMass: {
            dxa: { male: 7.0, female: 5.5 },
            bia: { male: 7.0, female: 6.0 }
        },
        performance: {
            gaitSpeed: 0.8,
            sppb: 8,
            tug: 20
        }
    }
};

// ==========================================
// 初始化 / Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initGuidelineSelector();
    initTabSystem();
    initDiagnosticTool();
    updateFlowchart();
});

// ==========================================
// 診斷標準選擇 / Guideline Selection
// ==========================================

function initGuidelineSelector() {
    const buttons = document.querySelectorAll('.guideline-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有active類別
            buttons.forEach(btn => btn.classList.remove('active'));

            // 添加active到當前按鈕
            this.classList.add('active');

            // 更新當前指引
            currentGuideline = this.dataset.guideline;

            // 重置診斷
            resetDiagnosis();

            // 更新流程圖
            updateFlowchart();
        });
    });
}

// ==========================================
// Tab 系統 / Tab System
// ==========================================

function initTabSystem() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;

            // 移除所有active類別
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 添加active到當前tab
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// ==========================================
// 診斷工具 / Diagnostic Tool
// ==========================================

function initDiagnosticTool() {
    renderStep();
}

function renderStep() {
    const container = document.getElementById('diagnosticSteps');
    const guideline = guidelines[currentGuideline];

    let stepHTML = '';

    switch(currentStep) {
        case 0:
            stepHTML = `
                <div class="step-container">
                    <div class="step-header">
                        <h3>步驟 1: 基本資料 / Basic Information</h3>
                        <p>請輸入患者基本資料</p>
                    </div>
                    <div class="input-group">
                        <label>性別 / Gender</label>
                        <div class="button-group">
                            <button class="choice-btn" onclick="selectGender('male')">男性 Male</button>
                            <button class="choice-btn" onclick="selectGender('female')">女性 Female</button>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>年齡 / Age</label>
                        <input type="number" id="ageInput" placeholder="請輸入年齡" min="0" max="120">
                    </div>
                    <button class="btn-next" onclick="nextStep()" disabled id="nextBtn">下一步 Next</button>
                </div>
            `;
            break;

        case 1:
            stepHTML = `
                <div class="step-container">
                    <div class="step-header">
                        <h3>步驟 2: 篩檢 / Screening</h3>
                        <p>進行初步篩檢評估</p>
                    </div>
                    <div class="input-group">
                        <label>SARC-F 評分 (0-10分)</label>
                        <input type="number" id="sarcfInput" placeholder="請輸入SARC-F總分" min="0" max="10">
                        <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;">
                            ≥${guideline.screening.sarcf}分為異常
                        </small>
                    </div>
                    <div class="input-group">
                        <label>小腿圍 / Calf Circumference (cm)</label>
                        <input type="number" id="calfInput" placeholder="請輸入小腿圍 (cm)" step="0.1">
                        <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;">
                            ${diagnosticData.gender === 'male' ? '男性' : '女性'} &lt;${guideline.screening.calfCircumference[diagnosticData.gender]}cm 為異常
                        </small>
                    </div>
                    <button class="btn-next" onclick="nextStep()" id="nextBtn">下一步 Next</button>
                </div>
            `;
            break;

        case 2:
            stepHTML = `
                <div class="step-container">
                    <div class="step-header">
                        <h3>步驟 3: 肌力評估 / Muscle Strength</h3>
                        <p>評估握力表現</p>
                    </div>
                    <div class="input-group">
                        <label>握力 / Handgrip Strength (kg)</label>
                        <input type="number" id="handgripInput" placeholder="請輸入握力 (kg)" step="0.1">
                        <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;">
                            ${diagnosticData.gender === 'male' ? '男性' : '女性'} &lt;${guideline.strength.handgrip[diagnosticData.gender]}kg 為低肌力
                        </small>
                    </div>
                    <button class="btn-next" onclick="nextStep()" id="nextBtn">下一步 Next</button>
                </div>
            `;
            break;

        case 3:
            stepHTML = `
                <div class="step-container">
                    <div class="step-header">
                        <h3>步驟 4: 肌肉量評估 / Muscle Mass</h3>
                        <p>評估骨骼肌質量</p>
                    </div>
                    <div class="input-group">
                        <label>測量方法 / Measurement Method</label>
                        <select id="methodSelect" onchange="updateMuscleMassInput()">
                            <option value="">請選擇</option>
                            <option value="dxa">DXA (雙能量X光吸收)</option>
                            <option value="bia">BIA (生物電阻分析)</option>
                        </select>
                    </div>
                    <div class="input-group" id="muscleMassInputGroup" style="display: none;">
                        <label>ASM/Height² (kg/m²)</label>
                        <input type="number" id="muscleMassInput" placeholder="請輸入 ASM/Height²" step="0.1">
                        <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;" id="muscleMassHint">
                        </small>
                    </div>
                    <button class="btn-next" onclick="nextStep()" id="nextBtn">下一步 Next</button>
                </div>
            `;
            break;

        case 4:
            stepHTML = `
                <div class="step-container">
                    <div class="step-header">
                        <h3>步驟 5: 身體功能 / Physical Performance</h3>
                        <p>評估身體功能表現</p>
                    </div>
                    <div class="input-group">
                        <label>步行速度 / Gait Speed (m/s)</label>
                        <input type="number" id="gaitSpeedInput" placeholder="請輸入步行速度 (m/s)" step="0.01">
                        <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;">
                            ${currentGuideline === 'awgs2019' ? '< 1.0 m/s' : '≤ 0.8 m/s'} 為異常
                        </small>
                    </div>
                    <div class="input-group">
                        <label>SPPB 評分 / SPPB Score (0-12)</label>
                        <input type="number" id="sppbInput" placeholder="請輸入SPPB評分" min="0" max="12">
                        <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;">
                            ≤${guideline.performance.sppb}分為異常
                        </small>
                    </div>
                    ${currentGuideline === 'awgs2019' ? `
                        <div class="input-group">
                            <label>5次起坐測試 / 5-Time Chair Stand (秒)</label>
                            <input type="number" id="chairStandInput" placeholder="請輸入完成時間(秒)" step="0.1">
                            <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;">
                                ≥12秒為異常
                            </small>
                        </div>
                    ` : `
                        <div class="input-group">
                            <label>TUG 測試 / Timed Up and Go (秒)</label>
                            <input type="number" id="tugInput" placeholder="請輸入完成時間(秒)" step="0.1">
                            <small style="color: #7f8c8d; display: block; margin-top: 0.5rem;">
                                ≥20秒為異常
                            </small>
                        </div>
                    `}
                    <button class="btn-next" onclick="calculateResult()">查看結果 View Result</button>
                </div>
            `;
            break;
    }

    container.innerHTML = stepHTML;
    updateProgress();

    // 為年齡輸入添加事件監聽
    if (currentStep === 0) {
        const ageInput = document.getElementById('ageInput');
        if (ageInput) {
            ageInput.addEventListener('input', checkStep0Complete);
        }
    }
}

function selectGender(gender) {
    diagnosticData.gender = gender;

    // 更新按鈕狀態
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');

    checkStep0Complete();
}

function checkStep0Complete() {
    const ageInput = document.getElementById('ageInput');
    const nextBtn = document.getElementById('nextBtn');

    if (diagnosticData.gender && ageInput && ageInput.value) {
        diagnosticData.age = parseInt(ageInput.value);
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

function updateMuscleMassInput() {
    const method = document.getElementById('methodSelect').value;
    const inputGroup = document.getElementById('muscleMassInputGroup');
    const hint = document.getElementById('muscleMassHint');
    const guideline = guidelines[currentGuideline];

    if (method) {
        diagnosticData.muscleMass.method = method;
        inputGroup.style.display = 'block';

        const cutoff = guideline.muscleMass[method][diagnosticData.gender];
        hint.textContent = `${diagnosticData.gender === 'male' ? '男性' : '女性'} <${cutoff} kg/m² 為低肌肉量`;
    } else {
        inputGroup.style.display = 'none';
    }
}

function nextStep() {
    // 儲存當前步驟的數據
    saveStepData();

    // 移動到下一步
    currentStep++;
    renderStep();
}

function saveStepData() {
    const guideline = guidelines[currentGuideline];

    switch(currentStep) {
        case 1:
            const sarcfInput = document.getElementById('sarcfInput');
            const calfInput = document.getElementById('calfInput');
            if (sarcfInput.value) diagnosticData.screening.sarcf = parseFloat(sarcfInput.value);
            if (calfInput.value) diagnosticData.screening.calfCircumference = parseFloat(calfInput.value);
            break;

        case 2:
            const handgripInput = document.getElementById('handgripInput');
            if (handgripInput.value) diagnosticData.strength.handgrip = parseFloat(handgripInput.value);
            break;

        case 3:
            const muscleMassInput = document.getElementById('muscleMassInput');
            if (muscleMassInput.value) diagnosticData.muscleMass.value = parseFloat(muscleMassInput.value);
            break;

        case 4:
            const gaitSpeedInput = document.getElementById('gaitSpeedInput');
            const sppbInput = document.getElementById('sppbInput');
            if (gaitSpeedInput.value) diagnosticData.performance.gaitSpeed = parseFloat(gaitSpeedInput.value);
            if (sppbInput.value) diagnosticData.performance.sppb = parseInt(sppbInput.value);

            if (currentGuideline === 'awgs2019') {
                const chairStandInput = document.getElementById('chairStandInput');
                if (chairStandInput.value) diagnosticData.performance.chairStand = parseFloat(chairStandInput.value);
            } else {
                const tugInput = document.getElementById('tugInput');
                if (tugInput.value) diagnosticData.performance.tug = parseFloat(tugInput.value);
            }
            break;
    }
}

function calculateResult() {
    saveStepData();

    const guideline = guidelines[currentGuideline];
    const gender = diagnosticData.gender;

    // 判斷各項指標
    const lowStrength = diagnosticData.strength.handgrip < guideline.strength.handgrip[gender];

    let lowMuscleMass = false;
    if (diagnosticData.muscleMass.method && diagnosticData.muscleMass.value) {
        const cutoff = guideline.muscleMass[diagnosticData.muscleMass.method][gender];
        lowMuscleMass = diagnosticData.muscleMass.value < cutoff;
    }

    let lowPerformance = false;
    if (diagnosticData.performance.gaitSpeed !== null) {
        if (currentGuideline === 'awgs2019') {
            lowPerformance = diagnosticData.performance.gaitSpeed < guideline.performance.gaitSpeed;
        } else {
            lowPerformance = diagnosticData.performance.gaitSpeed <= guideline.performance.gaitSpeed;
        }
    }
    if (diagnosticData.performance.sppb !== null) {
        lowPerformance = lowPerformance || diagnosticData.performance.sppb <= guideline.performance.sppb;
    }
    if (currentGuideline === 'awgs2019' && diagnosticData.performance.chairStand !== null) {
        lowPerformance = lowPerformance || diagnosticData.performance.chairStand >= guideline.performance.chairStand;
    }
    if (currentGuideline === 'ewgsop2' && diagnosticData.performance.tug !== null) {
        lowPerformance = lowPerformance || diagnosticData.performance.tug >= guideline.performance.tug;
    }

    // 根據標準判斷結果
    let resultClass = 'result-normal';
    let resultTitle = '無肌少症 / No Sarcopenia';
    let resultDescription = '目前評估結果未達肌少症診斷標準。';
    let recommendations = [];

    if (currentGuideline === 'awgs2019') {
        if (lowStrength || lowPerformance) {
            resultClass = 'result-possible';
            resultTitle = '可能肌少症 / Possible Sarcopenia';
            resultDescription = '檢測到低肌力或低身體功能，建議進一步評估肌肉量。';
            recommendations = [
                '進行肌肉量測量（DXA或BIA）',
                '開始運動介入，特別是阻力訓練',
                '評估營養狀態，確保足夠蛋白質攝取',
                '定期追蹤評估'
            ];
        }

        if (lowStrength && lowMuscleMass) {
            resultClass = 'result-confirmed';
            resultTitle = '肌少症 / Sarcopenia';
            resultDescription = '符合肌少症診斷標準（低肌力 + 低肌肉量）。';
            recommendations = [
                '開始綜合性運動計畫（阻力訓練 + 有氧運動）',
                '營養介入：蛋白質攝取 1.0-1.2 g/kg/day',
                '考慮維生素D補充（如血清濃度不足）',
                '評估並處理可能的共病',
                '每3-6個月追蹤評估'
            ];
        }

        if (lowStrength && lowMuscleMass && lowPerformance) {
            resultClass = 'result-severe';
            resultTitle = '嚴重肌少症 / Severe Sarcopenia';
            resultDescription = '符合嚴重肌少症診斷標準（低肌力 + 低肌肉量 + 低身體功能）。';
            recommendations = [
                '積極的多元介入計畫',
                '個人化運動訓練計畫（需專業指導）',
                '強化營養支持（必要時諮詢營養師）',
                '跌倒風險評估與預防',
                '功能性訓練以改善日常生活活動',
                '密切追蹤（每1-3個月）',
                '考慮轉介至專科評估'
            ];
        }
    } else { // EWGSOP2
        if (lowStrength) {
            resultClass = 'result-possible';
            resultTitle = '可能肌少症 / Probable Sarcopenia';
            resultDescription = '檢測到低肌力，建議進一步評估肌肉量確認診斷。';
            recommendations = [
                '進行肌肉量測量（DXA或BIA）',
                '開始運動介入，特別是阻力訓練',
                '評估營養狀態',
                '定期追蹤評估'
            ];
        }

        if (lowStrength && lowMuscleMass) {
            resultClass = 'result-confirmed';
            resultTitle = '肌少症 / Sarcopenia';
            resultDescription = '確診肌少症（低肌力 + 低肌肉量）。';
            recommendations = [
                '開始綜合性運動計畫',
                '營養介入：蛋白質攝取 1.0-1.2 g/kg/day',
                '考慮維生素D補充',
                '評估並處理共病',
                '每3-6個月追蹤'
            ];
        }

        if (lowStrength && lowMuscleMass && lowPerformance) {
            resultClass = 'result-severe';
            resultTitle = '嚴重肌少症 / Severe Sarcopenia';
            resultDescription = '確診嚴重肌少症（低肌力 + 低肌肉量 + 低身體功能）。';
            recommendations = [
                '積極的多元介入計畫',
                '個人化運動訓練（專業指導）',
                '強化營養支持',
                '跌倒風險評估與預防',
                '功能性訓練',
                '密切追蹤（每1-3個月）',
                '轉介至專科評估'
            ];
        }
    }

    displayResult(resultClass, resultTitle, resultDescription, recommendations);
}

function displayResult(resultClass, resultTitle, resultDescription, recommendations) {
    const resultContainer = document.getElementById('resultContainer');
    const resultBox = document.getElementById('resultBox');
    const stepsContainer = document.getElementById('diagnosticSteps');

    let recommendationsHTML = '';
    if (recommendations.length > 0) {
        recommendationsHTML = '<h4 style="margin-top: 1.5rem;">建議 / Recommendations:</h4><ul>';
        recommendations.forEach(rec => {
            recommendationsHTML += `<li>${rec}</li>`;
        });
        recommendationsHTML += '</ul>';
    }

    resultBox.className = `result-box ${resultClass}`;
    resultBox.innerHTML = `
        <h4>${resultTitle}</h4>
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">${resultDescription}</p>
        <div style="background: rgba(255,255,255,0.2); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <strong>診斷標準：</strong> ${guidelines[currentGuideline].name}
        </div>
        ${recommendationsHTML}
    `;

    stepsContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    // 更新進度條為100%
    document.getElementById('progressFill').style.width = '100%';
}

function resetDiagnosis() {
    currentStep = 0;
    diagnosticData = {
        gender: '',
        age: null,
        screening: {
            sarcf: null,
            calfCircumference: null
        },
        strength: {
            handgrip: null
        },
        muscleMass: {
            method: '',
            value: null
        },
        performance: {
            gaitSpeed: null,
            sppb: null,
            chairStand: null,
            tug: null
        }
    };

    document.getElementById('diagnosticSteps').style.display = 'block';
    document.getElementById('resultContainer').style.display = 'none';

    renderStep();
}

function updateProgress() {
    const progress = (currentStep / 5) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

// ==========================================
// 流程圖 / Flowchart
// ==========================================

function updateFlowchart() {
    const container = document.getElementById('flowchartContainer');
    const guideline = guidelines[currentGuideline];

    let flowchartHTML = '<div class="flowchart">';

    if (currentGuideline === 'awgs2019') {
        flowchartHTML += `
            <div class="flow-step screening">
                <strong>1. 篩檢</strong><br>
                SARC-F ≥4 或<br>
                SARC-CalF ≥11 或<br>
                小腿圍: 男&lt;34cm, 女&lt;33cm
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step assessment">
                <strong>2. 評估肌力</strong><br>
                握力: 男&lt;28kg, 女&lt;18kg
            </div>
            <div class="flow-arrow">↓ (若低肌力)</div>
            <div class="flow-step diagnosis">
                <strong>3. 測量肌肉量</strong><br>
                DXA/BIA: ASM/Height²<br>
                男&lt;7.0, 女&lt;5.4-5.7 kg/m²
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step result">
                <strong>診斷結果</strong><br>
                • 可能肌少症: 低肌力或低身體功能<br>
                • 肌少症: 低肌力 + 低肌肉量<br>
                • 嚴重肌少症: + 低身體功能
            </div>
        `;
    } else {
        flowchartHTML += `
            <div class="flow-step screening">
                <strong>1. 尋找病例</strong><br>
                SARC-F ≥4 或<br>
                臨床懷疑
            </div>
            <div class="flow-arrow">↓</div>
            <div class="flow-step assessment">
                <strong>2. 評估肌力</strong><br>
                握力: 男&lt;27kg, 女&lt;16kg
            </div>
            <div class="flow-arrow">↓ (若低肌力 = 可能肌少症)</div>
            <div class="flow-step diagnosis">
                <strong>3. 測量肌肉量</strong><br>
                確認診斷<br>
                DXA: 男&lt;7.0, 女&lt;5.5 kg/m²
            </div>
            <div class="flow-arrow">↓ (低肌力+低肌肉量 = 肌少症)</div>
            <div class="flow-step result">
                <strong>4. 評估嚴重度</strong><br>
                步行速度 ≤0.8 m/s 或<br>
                SPPB ≤8 或 TUG ≥20s<br>
                → 嚴重肌少症
            </div>
        `;
    }

    flowchartHTML += '</div>';
    container.innerHTML = flowchartHTML;
}
