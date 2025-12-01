function showToast(message, type = 'error') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

function showClearConfirmation() {
    const confirmationToast = document.createElement('div');
    confirmationToast.className = 'toast confirmation';
    confirmationToast.innerHTML = `
        <div style="margin-bottom: 10px;">Вы уверены, что хотите очистить историю?</div>
        <div style="display: flex; gap: 10px;">
            <button onclick="clearHistory()" style="padding: 5px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Да</button>
            <button onclick="this.parentElement.parentElement.remove()" style="padding: 5px 10px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">Нет</button>
        </div>
    `;
    
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    document.body.appendChild(confirmationToast);
}

function clearHistory() {
    fetch('controller?clear=true')
        .then(() => {
            const toast = document.querySelector('.toast');
            if (toast) toast.remove();
            
            showToast('История очищена', 'success');
            setTimeout(() => location.reload(), 1000);
        })
        .catch(() => {
            showToast('Ошибка при очистке истории', 'error');
        });
}

function getSelectedR() {
    const checked = document.querySelector('input[name="r"]:checked');
    return checked ? parseFloat(checked.value) : 2;
}


document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('graf');
    const form = document.getElementById('pointForm');
    const graphXInput = document.getElementById('graph-x');
    const yInput = document.getElementById('y-input');
    const clearBtn = document.getElementById('clearBtn');
    const xSelect = document.getElementById('x-select');
    
    const initialR = getSelectedR();
    drawGraf(initialR);
    
    form.addEventListener('submit', function(e) {
        const yValue = parseFloat(yInput.value);
        if (isNaN(yValue) || yValue < -5 || yValue > 3) {
            e.preventDefault();
            showToast('Y должен быть числом от -5 до 3', 'error');
            yInput.focus();
            return;
        }
        
        const rChecked = document.querySelector('input[name="r"]:checked');
        if (!rChecked) {
            e.preventDefault();
            showToast('Пожалуйста, выберите R', 'warning');
            return;
        }
    });
    
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();

        const pixelX = event.clientX - rect.left;
        const pixelY = event.clientY - rect.top;

        const mathX = (pixelX - 250) / 40;
        const mathY = (250 - pixelY) / 40;

        const roundedX = Math.round(mathX * 100) / 100;
        const roundedY = Math.round(mathY * 100) / 100;

        graphXInput.value = roundedX;
        yInput.value = roundedY;

        xSelect.disabled = true;

        form.submit();
    });
    
    clearBtn.addEventListener('click', showClearConfirmation);
    
    yInput.addEventListener('input', function() {
        let value = this.value.replace(/[^\d.-]/g, '');
        if (value.includes('-') && value.indexOf('-') !== 0) {
            value = '-' + value.replace(/-/g, '');
        }
        const dots = value.split('.').length - 1;
        if (dots > 1) value = value.substring(0, value.lastIndexOf('.'));
        if (value.length > 8) value = value.substring(0, 8);
        this.value = value;
    });
    
    const radioInputs = document.querySelectorAll('input[name="r"]');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', function() {
            const rValue = parseFloat(this.value);
            drawGraf(rValue);
        });
    });
});