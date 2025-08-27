// 食物選項陣列（12個選項，圍成4x4方形）
const foodOptions = [
    { name: '咖哩飯', emoji: '🍛', message: '香濃咖哩，溫暖你的胃！日式風味讓人回味無窮～' },
    { name: '拌飯', emoji: '🍲', message: '韓式風味，營養滿分！熱騰騰的石鍋拌飯超讚的！' },
    { name: '牛肉麵', emoji: '🍜', message: '台灣之光，暖心牛肉麵！濃郁湯頭配上Q彈麵條～' },
    { name: '火鍋', emoji: '🍲', message: '熱呼呼的火鍋聚餐！和朋友一起吃最溫暖了～' },
    { name: '水餃', emoji: '🥟', message: '餃子配湯，完美組合！一口餃子一口湯，超滿足！' },
    { name: '沙拉', emoji: '🥗', message: '清爽健康，活力滿滿！新鮮蔬菜為你補充能量～' },
    { name: '壽司', emoji: '🍣', message: '新鮮的日式壽司！每一貫都是師傅的用心～' },
    { name: '披薩', emoji: '🍕', message: '起司滿滿的義式披薩！分享的美味加倍快樂～' },
    { name: '減肥', emoji: '🚫', message: '加油！為了更好的自己！多喝水，明天會更美～' },
    { name: '漢堡', emoji: '🍔', message: '厚實多汁的美式漢堡！配上薯條就是完美！' },
    { name: '小籠包', emoji: '🥟', message: '上海名點小籠包！小心燙口，湯汁滿滿～' },
    { name: '義大利麵', emoji: '🍝', message: '異國風情，浪漫義式！奶油白醬還是番茄紅醬都超棒～' }
];

let isSpinning = false;
let selectedSlots = [];

// 拉霸機主要選擇函數
function startSlotMachine() {
    if (isSpinning) return;
    
    isSpinning = true;
    const button = document.getElementById('spinButton');
    const character = document.getElementById('character');
    const speechBubble = document.getElementById('speechBubble');
    const centerIndicator = document.getElementById('centerIndicator');
    const indicatorText = centerIndicator.querySelector('.indicator-text');
    
    // 按鈕狀態變更
    button.disabled = true;
    button.innerHTML = '<span class="button-text">🎰 選擇中...</span>';
    
    // 人像表情變為興奮
    updateCharacterExpression('excited', '拉霸機開始轉動啦！好期待～ 🎉');
    
    // 中央指示器顯示轉動狀態
    indicatorText.textContent = '?';
    indicatorText.style.animation = 'questionPulse 0.5s ease-in-out infinite';
    
    // 開始單個格子繞長方形跑的動畫
    startRectangleAnimation();
    
    // 3秒後停止並選擇結果
    setTimeout(() => {
        stopRectangleAnimation();
        selectFinalResult();
    }, 3000); // 3秒選擇時間
}

// 開始單個格子繞著長方形跑的動畫
function startRectangleAnimation() {
    const slots = document.querySelectorAll('.food-slot');
    let currentIndex = 0;
    const totalSlots = slots.length;
    
    const animationInterval = setInterval(() => {
        if (!isSpinning) {
            clearInterval(animationInterval);
            return;
        }
        
        // 移除所有高亮
        slots.forEach(slot => slot.classList.remove('highlight'));
        
        // 按照position順序高亮當前格子
        const currentSlot = document.querySelector(`[data-position="${currentIndex}"]`);
        if (currentSlot) {
            currentSlot.classList.add('highlight');
        }
        
        // 移動到下一個格子
        currentIndex = (currentIndex + 1) % totalSlots;
        
    }, 100); // 每100毫秒移動一個格子，加快速度
    
    // 保存interval以便後續清理
    window.highlightInterval = animationInterval;
}

// 停止繞長方形動畫
function stopRectangleAnimation() {
    if (window.highlightInterval) {
        clearInterval(window.highlightInterval);
    }
    
    // 移除所有高亮效果
    const slots = document.querySelectorAll('.food-slot');
    slots.forEach(slot => {
        slot.classList.remove('highlight');
    });
}

// 選擇最終結果
function selectFinalResult() {
    const slots = document.querySelectorAll('.food-slot');
    const randomIndex = Math.floor(Math.random() * foodOptions.length);
    const selectedFood = foodOptions[randomIndex];
    
    // 找到對應的slot並高亮
    let selectedSlot = null;
    slots.forEach(slot => {
        const slotFood = slot.getAttribute('data-food');
        if (slotFood === selectedFood.name) {
            selectedSlot = slot;
        }
    });
    
    if (selectedSlot) {
        selectedSlot.classList.add('selected');
        
        // 選中動畫效果
        setTimeout(() => {
            selectedSlot.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    }
    
    // 更新中央指示器
    const centerIndicator = document.getElementById('centerIndicator');
    const indicatorText = centerIndicator.querySelector('.indicator-text');
    indicatorText.textContent = selectedFood.emoji;
    indicatorText.style.animation = 'resultEmojiSpin 0.8s ease';
    
    // 重設按鈕
    const button = document.getElementById('spinButton');
    button.disabled = false;
    button.innerHTML = '<span class="button-text">🎰 再選一次！</span><div class="button-glow"></div>';
    
    // 1秒後顯示結果彈窗
    setTimeout(() => {
        isSpinning = false;
        showResult(selectedFood);
        
        // 清除選中狀態
        if (selectedSlot) {
            setTimeout(() => {
                selectedSlot.classList.remove('selected');
            }, 2000);
        }
    }, 1000);
}

// 獲取隨機的slot元素
function getRandomSlots(slots, count) {
    const slotsArray = Array.from(slots);
    const randomSlots = [];
    
    for (let i = 0; i < count && i < slotsArray.length; i++) {
        const randomIndex = Math.floor(Math.random() * slotsArray.length);
        const randomSlot = slotsArray.splice(randomIndex, 1)[0];
        randomSlots.push(randomSlot);
    }
    
    return randomSlots;
}

// 在中央指示器顯示結果
function showResult(food) {
    const centerIndicator = document.getElementById('centerIndicator');
    const indicatorText = centerIndicator.querySelector('.indicator-text');
    const indicatorSubtext = centerIndicator.querySelector('.indicator-subtext');
    
    // 在中央指示器顯示選中的食物
    indicatorText.textContent = food.emoji;
    indicatorSubtext.textContent = food.name;
    
    // 人像表情變為超級開心
    updateCharacterExpression('super-excited', `太棒了！選到了${food.name}！ ✨`);
    
    // 添加慶祝音效
    playResultSound(food);
    
    // 3秒後重置為問號
    setTimeout(() => {
        indicatorText.textContent = '?';
        indicatorSubtext.textContent = '點擊開始';
        updateCharacterExpression('default', '還想再試一次嗎？我隨時準備好！ 😊');
    }, 3000);
}


// 更新人像表情和語音泡泡
function updateCharacterExpression(type, message) {
    const character = document.getElementById('character');
    const mouth = document.getElementById('mouth');
    const speechBubble = document.getElementById('speechBubble');
    
    // 移除所有表情類別
    character.classList.remove('happy', 'excited', 'super-excited');
    mouth.classList.remove('happy', 'excited');
    
    switch(type) {
        case 'excited':
            character.classList.add('happy');
            mouth.classList.add('excited');
            break;
        case 'super-excited':
            character.classList.add('happy');
            mouth.classList.add('excited');
            break;
        case 'happy':
            character.classList.add('happy');
            mouth.classList.add('happy');
            break;
        case 'default':
        default:
            // 使用預設狀態
            break;
    }
    
    // 更新語音泡泡
    if (message) {
        speechBubble.textContent = message;
        speechBubble.style.animation = 'none';
        speechBubble.offsetHeight; // 觸發重排
        speechBubble.style.animation = 'bubbleFloat 0.6s ease';
    }
}

// 播放結果音效（簡單的音效模擬）
function playResultSound(food) {
    // 根據不同食物播放不同音效（這裡用vibration API模擬）
    if ('vibrate' in navigator) {
        if (food.name.includes('減肥')) {
            navigator.vibrate([200, 100, 200]); // 減肥的震動較緩
        } else {
            navigator.vibrate([100, 50, 100, 50, 200]); // 一般食物的歡快震動
        }
    }
}

// 人像點擊互動
function initCharacterInteraction() {
    const character = document.getElementById('character');
    
    const interactiveMessages = [
        '你好！我是你的美食拉霸機小助手！ 👋',
        '今天想吃什麼呢？讓拉霸機幫你決定！ 🎰',
        '按下按鈕，看看會選到什麼驚喜！ ✨',
        '選擇困難症？拉霸機最公平了！ 😊',
        '每種食物都有它的美味之處～ 🍽️',
        '相信拉霸機的選擇，絕對不會錯！ 💫',
        '來試試手氣吧！說不定有驚喜～ 🎲'
    ];
    
    character.addEventListener('click', () => {
        if (!isSpinning) {
            const randomMessage = interactiveMessages[Math.floor(Math.random() * interactiveMessages.length)];
            updateCharacterExpression('happy', randomMessage);
            
            // 2秒後回到預設狀態
            setTimeout(() => {
                updateCharacterExpression('default', '按下按鈕選擇美食吧！✨');
            }, 2500);
        }
    });
}

// 鍵盤支援
function initKeyboardSupport() {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.key === ' ') {
            event.preventDefault();
            if (!isSpinning) {
                startSlotMachine();
            }
        }
        
    });
}

// 方格懸停效果
function initSlotHoverEffect() {
    const slots = document.querySelectorAll('.food-slot');
    
    slots.forEach((slot, index) => {
        const foodName = slot.getAttribute('data-food');
        const food = foodOptions.find(f => f.name === foodName);
        
        if (food) {
            slot.addEventListener('mouseenter', () => {
                if (!isSpinning) {
                    const speechBubble = document.getElementById('speechBubble');
                    speechBubble.textContent = `${food.emoji} ${food.name} 看起來很不錯呢！ 😋`;
                    updateCharacterExpression('happy');
                }
            });
            
            slot.addEventListener('mouseleave', () => {
                if (!isSpinning) {
                    setTimeout(() => {
                        updateCharacterExpression('default', '按下按鈕選擇美食吧！✨');
                    }, 1000);
                }
            });
            
            // 點擊方格也可以觸發選擇（但會隨機選擇，不是點擊的那個）
            slot.addEventListener('click', () => {
                if (!isSpinning) {
                    startSlotMachine();
                }
            });
        }
    });
}

// 拉霸機外框閃爍效果
function addMachineGlowEffect() {
    const machineFrame = document.querySelector('.slot-machine-frame');
    
    setInterval(() => {
        if (!isSpinning) {
            machineFrame.style.boxShadow = `
                0 0 0 4px #bdc3c7,
                0 15px 30px rgba(0, 0, 0, 0.3),
                inset 0 2px 10px rgba(255, 255, 255, 0.1),
                0 0 20px rgba(52, 152, 219, 0.3)
            `;
            
            setTimeout(() => {
                machineFrame.style.boxShadow = `
                    0 0 0 4px #bdc3c7,
                    0 15px 30px rgba(0, 0, 0, 0.3),
                    inset 0 2px 10px rgba(255, 255, 255, 0.1)
                `;
            }, 1000);
        }
    }, 3000);
}

// 頁面載入後初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有互動功能
    initCharacterInteraction();
    initKeyboardSupport();
    initSlotHoverEffect();
    addMachineGlowEffect();
    
    // 初始歡迎訊息
    setTimeout(() => {
        updateCharacterExpression('happy', '歡迎來到美食拉霸機！準備好試試手氣了嗎？ 🎰');
        setTimeout(() => {
            updateCharacterExpression('default', '按下按鈕選擇美食吧！✨');
        }, 3000);
    }, 1000);
    
    console.log('🎰 美食拉霸機載入完成！');
    console.log('💡 小提示：');
    console.log('   - 點擊「開始選擇」按鈕或按空白鍵開始拉霸');
    console.log('   - 點擊可愛小人物互動');
    console.log('   - 滑鼠懸停在方格上看提示');
    console.log('   - 按ESC鍵關閉結果彈窗');
    console.log('   - 點擊任意方格也可以開始選擇');
});

// 添加窗口調整大小時的響應處理
window.addEventListener('resize', () => {
    // 確保在手機螢幕旋轉時重新計算布局
    const container = document.querySelector('.container');
    if (window.innerWidth < 768) {
        container.style.padding = '20px 15px';
    } else {
        container.style.padding = '30px';
    }
});