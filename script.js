/**
 * 1. 데이터 및 초기 설정
 */
const shapes = {
    four: [
        [0,0], [1,0], [2,0], [3,0], [3,1], [3,2], [3,3], [3,4],
        [0,3], [1,3], [2,3], [4,3], [5,3], [6,3]
    ],
    zero: [
        [0,1], [0,2], [0,3], [6,1], [6,2], [6,3],
        [1,0], [2,0], [3,0], [4,0], [5,0],
        [1,4], [2,4], [3,4], [4,4], [5,4]
    ]
};

const colorSlider = document.getElementById('colorRange');
const colorText = document.getElementById('colorText');
const detailSection = document.getElementById('project-detail');
const mainBlock = document.querySelector('.main-project-color');
const innerText = document.querySelector('.inner-content');

/**
 * 2. 유틸리티 함수: HSL을 Hex 코드로 변환
 */
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * 3. 404 숫자 그리드 생성 함수
 */
function createDigit(containerId, shapeType) {
    const container = document.getElementById(containerId);
    const shapeCoords = shapes[shapeType];

    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 5; c++) {
            const isPartOfShape = shapeCoords.some(coord => coord[0] === r && coord[1] === c);
            
            if (isPartOfShape) {
                const thumb = document.createElement('div');
                thumb.classList.add('thumb');
                
                // 초기 색상 설정 (슬라이더 기본값 기준)
                const hue = colorSlider.value;
                const randomLight = 45 + (Math.random() * 20);
                thumb.style.backgroundColor = `hsl(${hue}, 80%, ${randomLight}%)`;
                
                thumb.style.gridColumn = c + 1;
                thumb.style.gridRow = r + 1;

                // 클릭 시 상세 페이지 표시
                thumb.addEventListener('click', () => {
                    const currentColor = thumb.style.backgroundColor;
                    showDetail(currentColor);
                });
                
                container.appendChild(thumb);
            }
        }
    }
}

/**
 * 4. 상세 페이지 노출 및 컬러 업데이트 함수
 */
function showDetail(selectedColor) {
    detailSection.classList.add('show');
    mainBlock.style.backgroundColor = selectedColor;
    
    // 프로젝트 번호를 랜덤하게 변경하여 다른 프로젝트 느낌 부여
    innerText.innerText = "Project " + Math.floor(Math.random() * 100);

    // 부드러운 스크롤 이동
    detailSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 5. 컬러 슬라이더 이벤트 리스너 (실시간 업데이트 핵심)
 */
colorSlider.addEventListener('input', (e) => {
    const hue = e.target.value;
    const saturation = 80;
    const lightness = 60;
    
    const newColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hexColor = hslToHex(hue, saturation, lightness);

    // [추가된 기능] 상단 텍스트 내용 및 색상 실시간 변경
    if (colorText) {
        colorText.innerText = hexColor;
        colorText.style.color = newColor;
    }

    // 모든 404 블록 색상 실시간 업데이트
    document.querySelectorAll('.thumb').forEach(thumb => {
        const randomLight = 45 + (Math.random() * 20);
        thumb.style.backgroundColor = `hsl(${hue}, 85%, ${randomLight}%)`;
    });

    // 슬라이더 핸들 테두리 색상 실시간 변경 (Style 태그 주입)
    let styleTag = document.getElementById('dynamic-slider-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-slider-style';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `.color-slider::-webkit-slider-thumb { border-color: ${newColor} !important; }`;

    // 상세 페이지가 이미 열려 있다면 메인 컬러 블록도 실시간 동기화
    if (detailSection.classList.contains('show')) {
        mainBlock.style.backgroundColor = newColor;
    }
});

/**
 * 6. 실행 (초기화)
 */
createDigit('digit1', 'four');
createDigit('digit2', 'zero');
createDigit('digit3', 'four');

// 초기 텍스트 색상 설정
const initialHex = hslToHex(colorSlider.value, 80, 60);
colorText.innerText = initialHex;
colorText.style.color = `hsl(${colorSlider.value}, 80%, 60%)`;