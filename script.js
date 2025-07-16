// Supabase configuration
const SUPABASE_URL = 'https://oswopayqxiouowsnjpxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zd29wYXlxeGlvdW93c25qcHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NjQyMDYsImV4cCI6MjA2ODE0MDIwNn0.7MrbMXH6N4dogh8slNJoOfG-B0HeSU0_x9aITGF1ivI';

let supabase;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client
    if (typeof window.supabase !== 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    
    initializeApp();
    setupScrollAnimations();
    addEventListeners();
    
    // Initialize Naver Map
    if (typeof naver !== 'undefined' && naver.maps) {
        initNaverMap();
    }
});

// Initialize Application
function initializeApp() {
    setTimeout(() => {
        addFadeUpClass();
    }, 500);
    
    setupIntersectionObserver();
    triggerInitialAnimations();
    
    // Load messages
    setTimeout(() => {
        loadMessages();
    }, 1000);
}

// Scroll Animations
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => observer.observe(el));
}

function setupIntersectionObserver() {
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => fadeObserver.observe(el));
}

function addFadeUpClass() {
    const titles = document.querySelectorAll('.section-title');
    const contents = document.querySelectorAll('.section-content');
    
    titles.forEach(title => title.classList.add('fade-up'));
    contents.forEach(content => content.classList.add('fade-up'));
}

function triggerInitialAnimations() {
    const coverElements = document.querySelectorAll('.cover .animate');
    coverElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('in-view');
        }, index * 200);
    });
}

// Map Functions
function openNaverMap() {
    const address = encodeURIComponent('여의도 63빌딩 백리향');
    const url = `https://map.naver.com/v5/search/${address}`;
    window.open(url, '_blank');
    showNotification('네이버 지도로 이동합니다 🗺️');
}

function openKakaoMap() {
    const address = encodeURIComponent('여의도 63빌딩 백리향');
    const url = `https://map.kakao.com/link/search/${address}`;
    window.open(url, '_blank');
    showNotification('카카오맵으로 이동합니다 🗺️');
}

// RSVP Functions - 참석의사 전달
function openRSVP() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 450px; width: 90%;">
            <h3 style="color: #7eba76; margin-bottom: 20px; text-align: center;">참석의사 전달</h3>
            <form id="rsvpForm">
                <div id="participantList" style="margin-bottom: 20px;">
                    <div class="participant-input" style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" class="participant-name" required style="
                            flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;
                            font-size: 16px; box-sizing: border-box;
                        " placeholder="참석자 이름을 입력해주세요">
                        <button type="button" class="add-participant-btn" style="
                            background: #7eba76; color: white; border: none; padding: 0px;
                            border-radius: 5px; cursor: pointer; width: 40px; height: 40px;
                        "><span style="font-size:30px";>+</span></button>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button type="submit" style="
                        background: #7eba76; color: white; border: none; padding: 12px 24px;
                        border-radius: 20px; cursor: pointer; font-weight: bold;
                    ">참석의사 전달</button>
                    <button type="button" id="closeModalBtn" style="
                        background: #ccc; color: white; border: none; padding: 12px 24px;
                        border-radius: 20px; cursor: pointer;
                    ">닫기</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add participant functionality
    const addBtn = modal.querySelector('.add-participant-btn');
    const participantList = modal.querySelector('#participantList');
    
    addBtn.addEventListener('click', function() {
        const newInput = document.createElement('div');
        newInput.className = 'participant-input';
        newInput.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
        newInput.innerHTML = `
            <input type="text" class="participant-name" required style="
                flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;
                font-size: 16px; box-sizing: border-box;
            " placeholder="참석자 이름을 입력해주세요">
            <button type="button" class="remove-participant-btn" style="
                background: #ff6b6b; color: white; border: none; padding: 0px;
                border-radius: 5px; cursor: pointer; width: 40px; height: 40px;
            "><span style="font-size:30px";>-</span></button>
        `;
        
        newInput.querySelector('.remove-participant-btn').addEventListener('click', function() {
            newInput.remove();
        });
        
        participantList.appendChild(newInput);
    });
    
    // Handle form submission
    const form = modal.querySelector('#rsvpForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nameInputs = modal.querySelectorAll('.participant-name');
        const names = Array.from(nameInputs).map(input => input.value.trim()).filter(name => name);
        
        if (names.length === 0) {
            showNotification('최소 한 명의 이름을 입력해주세요');
            return;
        }
        
        if (!supabase) {
            showNotification('잠시 후 다시 시도해주세요');
            return;
        }
        
        try {
            const participants = names.map(name => ({ name }));
            const { error } = await supabase.from('participant').insert(participants);
            
            if (error) throw error;
            
            showNotification(`${names.length}명의 참석의사가 전달되었습니다! 🎉`);
            modal.remove();
        } catch (error) {
            showNotification('전송 중 오류가 발생했습니다');
        }
    });
    
    // Close handlers
    modal.querySelector('#closeModalBtn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Comment Functions - 축하메시지
function openCommentForm() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); display: flex; align-items: center;
        justify-content: center; z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; width: 90%;">
            <h3 style="color: #7eba76; margin-bottom: 20px; text-align: center;">축하메시지 보내기</h3>
            <form id="commentForm">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">이름</label>
                    <input type="text" name="name" required style="
                        width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;
                        font-size: 16px; box-sizing: border-box;
                    " placeholder="보내는 분 이름을 입력해주세요">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">축하메시지</label>
                    <textarea name="comments" required style="
                        width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;
                        font-size: 16px; min-height: 100px; resize: vertical; box-sizing: border-box;
                        font-family: inherit;
                    " placeholder="축하 메시지를 입력해주세요"></textarea>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button type="submit" style="
                        background: #7eba76; color: white; border: none; padding: 12px 24px;
                        border-radius: 20px; cursor: pointer; font-weight: bold;
                    ">메시지 보내기</button>
                    <button type="button" id="closeCommentModalBtn" style="
                        background: #ccc; color: white; border: none; padding: 12px 24px;
                        border-radius: 20px; cursor: pointer;
                    ">닫기</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('#commentForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name').toString().trim();
        const comments = formData.get('comments').toString().trim();
        
        if (!name || !comments) {
            showNotification('이름과 축하메시지를 모두 입력해주세요');
            return;
        }
        
        if (!supabase) {
            showNotification('잠시 후 다시 시도해주세요');
            return;
        }
        
        try {
            const { error } = await supabase.from('comments').insert([{ name, comments }]);
            
            if (error) throw error;
            
            showNotification('축하메시지가 전송되었습니다! 🎉');
            modal.remove();
            loadMessages();
        } catch (error) {
            showNotification('전송 중 오류가 발생했습니다');
        }
    });
    
    // Close handlers
    modal.querySelector('#closeCommentModalBtn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Load and Display Messages
async function loadMessages() {
    if (!supabase) {
        displayMessages([]);
        return;
    }
    
    try {
        const { data: messages, error } = await supabase
            .from('comments')
            .select('name, comments');
        
        if (error) {
            displayMessages([]);
            return;
        }
        
        displayMessages(messages || []);
    } catch (error) {
        displayMessages([]);
    }
}

function displayMessages(messages) {
    const guestBookList = document.getElementById('guestBookList');
    if (!guestBookList) return;
    
    // 기존 내용 제거
    guestBookList.innerHTML = '';
    
    // 메시지가 없는 경우
    if (!messages || messages.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.style.cssText = `
            text-align: center; color: #999; padding: 20px; list-style: none;
        `;
        emptyMessage.textContent = '아직 축하 메시지가 없습니다.';
        guestBookList.appendChild(emptyMessage);
        return;
    }
    
    // 메시지들을 표시
    messages.forEach((message, index) => {
        // 메시지가 존재하는지만 확인 (comments가 빈 문자열이어도 표시)
        if (!message || !message.comments) {
            return;
        }
        
        const messageItem = document.createElement('li');
        messageItem.className = 'guest-book-item';
        messageItem.style.cssText = `
            list-style: none; margin-bottom: 15px; padding: 20px;
            background: #f8f9fa; border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            opacity: 1; transform: translateY(0);
            transition: all 0.5s ease;
        `;
        
        const name = message.name || '익명';
        const comments = message.comments || '';
        
        messageItem.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; color: #7eba76; font-size: 14px;">from. ${escapeHtml(name)}</div>
            </div>
            <p style="margin: 0; line-height: 1.6; color: #555; font-size: 15px;">${escapeHtml(comments)}</p>
        `;
        
        guestBookList.appendChild(messageItem);
        
        // 간단한 페이드인 애니메이션 (선택적)
        if (index < 5) { // 처음 5개만 애니메이션
            messageItem.style.opacity = '0';
            messageItem.style.transform = 'translateY(20px)';
            setTimeout(() => {
                if (messageItem.parentNode) { // DOM에 여전히 존재하는지 확인
                    messageItem.style.opacity = '1';
                    messageItem.style.transform = 'translateY(0)';
                }
            }, index * 100 + 100);
        }
    });
}

function safeLoadMessages() {
    loadMessages();
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
        background: #7eba76; color: white; padding: 12px 24px; border-radius: 25px;
        font-size: 14px; font-weight: 500; z-index: 10000;
        box-shadow: 0 4px 12px rgba(126, 186, 118, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Event Listeners
function addEventListeners() {
    // Image gallery click events
    document.querySelectorAll('.image-container img').forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

// Image Modal
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.9); display: flex; align-items: center;
        justify-content: center; z-index: 10000; cursor: pointer;
    `;
    
    modal.innerHTML = `
        <div style="max-width: 90%; max-height: 90%; position: relative;">
            <img src="${src}" alt="${alt}" style="
                width: 100%; height: 100%; object-fit: contain; border-radius: 10px;
            ">
            <button onclick="this.closest('div[style*=\\"position: fixed\\"]').remove()" style="
                position: absolute; top: -15px; right: -15px; background: white;
                border: none; width: 30px; height: 30px; border-radius: 50%;
                cursor: pointer; font-size: 18px; color: #333;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.remove();
    });
    
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Naver Map
function initNaverMap() {
    const mapOptions = {
        center: new naver.maps.LatLng(37.5198, 126.9401),
        zoom: 17,
        mapTypeControl: true,
        zoomControl: true
    };

    const map = new naver.maps.Map('naverMap', mapOptions);

    const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(37.5009, 127.0396),
        map: map,
        title: '생일파티 장소'
    });

    const infoWindow = new naver.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-size: 12px; color: #333;">
                <strong>🎉 생일파티 장소</strong><br>
                서울특별시 영등포구 여의도동 60<br>
                2025년 8월 30일 토요일 오후 12:00
            </div>
        `
    });

    naver.maps.Event.addListener(marker, 'click', function() {
        if (infoWindow.getMap()) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
    });
}