document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    setupGraphInteraction();
});

function setupEvents() {
    const form = document.getElementById('pointForm');
    const yInput = document.getElementById('y-input');
    
    form.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault();
        }
    });
    
    document.getElementById('clearBtn').addEventListener('click', clearHistory);
    
    yInput.addEventListener('input', (e) => validateYInput(e.target));
    yInput.addEventListener('keydown', preventInvalidKeys);
    
    validateYRange(yInput);
}

function setupGraphInteraction() {
    const canvas = document.getElementById('graf');

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();

        const pixelX = e.clientX - rect.left;
        const pixelY = e.clientY - rect.top;

        const mathX = (pixelX - 250) / 50;
        const mathY = (250 - pixelY) / 50;

        const roundedX = Math.round(mathX * 100) / 100;
        const roundedY = Math.round(mathY * 100) / 100;

        submitGraphCoordinates(roundedX, roundedY);
    });
}

function setClosestXValue(x) {
    const xSelect = document.getElementById('x-select');
    const xOptions = Array.from(xSelect.options);
    let closestOption = xOptions[0];
    let minDiff = Math.abs(parseFloat(xOptions[0].value) - x);
    
    xOptions.forEach(option => {
        const diff = Math.abs(parseFloat(option.value) - x);
        if (diff < minDiff) {
            minDiff = diff;
            closestOption = option;
        }
    });
    
    xSelect.value = closestOption.value;
}

function preventInvalidKeys(e) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 
                        '0','1','2','3','4','5','6','7','8','9','.','-','Enter'];
    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
    }
    if ((e.key === '-' && e.target.value.includes('-')) || 
        (e.key === '.' && e.target.value.includes('.'))) {
        e.preventDefault();
    }
}

function validateYInput(input) {
    let value = input.value.replace(/[^\d.-]/g, '');
    
    if (value.includes('-') && value.indexOf('-') !== 0) {
        value = '-' + value.replace(/-/g, '');
    }
    
    const dots = value.split('.').length - 1;
    if (dots > 1) value = value.substring(0, value.lastIndexOf('.'));
    if (value.length > 8) value = value.substring(0, 8);
    
    input.value = value;
    validateYRange(input);
}

function validateYRange(input) {
    const value = parseFloat(input.value);
    const isValid = !isNaN(value) && value >= -5 && value <= 3;
    
    if (input.value && !isValid) {
        input.style.borderColor = 'red';
        input.title = 'Y должен быть числом от -5 до 3';
    } else {
        input.style.borderColor = '';
        input.title = '';
    }
    
    return isValid;
}

function validateForm() {
    const yInput = document.getElementById('y-input');
    const xSelect = document.getElementById('x-select');
    const rChecked = document.querySelector('input[name="r"]:checked');
    
    if (!validateYRange(yInput)) {
        showToast('Y должен быть числом от -5 до 3');
        yInput.focus();
        return false;
    }
    
    if (!xSelect.value) {
        showToast('Пожалуйста, выберите X');
        return false;
    }
    
    if (!rChecked) {
        showToast('Пожалуйста, выберите R');
        return false;
    }
    
    return true;
}

function clearHistory() {
        fetch('controller?clear=true')
            .then(() => {
                location.reload();
            })
            .catch(error => {
                showToast('Ошибка при очистке истории');
            });
    
}

window.addEventListener('pageshow', function() {
    const xSelect = document.getElementById('x-select');
    if (xSelect) xSelect.disabled = false;
});

