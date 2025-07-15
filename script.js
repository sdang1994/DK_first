// Global Variables

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupScrollAnimations();
    setupContactToggles();
    addEventListeners();
    // 네이버 지도 API가 로드되었는지 확인
    if (typeof naver !== 'undefined' && naver.maps) {
        initNaverMap();
    } else {
        console.error('네이버 지도 API가 로드되지 않았습니다.');
    }
});

// Initialize Application
function initializeApp() {
    // Add initial animations
    setTimeout(() => {
        addFadeUpClass();
    }, 500);
    
    // Setup intersection observer for scroll animations
    setupIntersectionObserver();
    
    // Auto-trigger fade up animations for visible elements
    triggerInitialAnimations();
    
    // Load messages from server
    loadMessages();
}

// Scroll Animations
function setupScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });
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

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });
}

function addFadeUpClass() {
    const titles = document.querySelectorAll('.section-title');
    const contents = document.querySelectorAll('.section-content');
    
    titles.forEach(title => {
        title.classList.add('fade-up');
    });
    
    contents.forEach(content => {
        content.classList.add('fade-up');
    });
}

function triggerInitialAnimations() {
    // Trigger cover animations
    const coverElements = document.querySelectorAll('.cover .animate');
    coverElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('in-view');
        }, index * 200);
    });
}

// Contact Toggle Functions
function setupContactToggles() {
    const contactHeaders = document.querySelectorAll('.contact-header');
    
    contactHeaders.forEach(header => {
        header.addEventListener('click', function() {
            toggleContact(this);
        });
    });
}

function toggleContact(header) {
    const contactItem = header.parentElement;
    const isActive = contactItem.classList.contains('active');
    
    // Close all other contact items
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        contactItem.classList.add('active');
    }
    
    // Animate arrow rotation
    const arrow = header.querySelector('svg');
    if (arrow) {
        arrow.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
        arrow.style.transition = 'transform 0.3s ease';
    }
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

// Communication Functions
function callPhone(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
    showNotification('전화를 걸고 있습니다 📞');
}

function sendMessage(phoneNumber) {
    window.location.href = `sms:${phoneNumber}`;
    showNotification('문자 메시지를 보냅니다 💬');
}

// RSVP Functions
function openRSVP() {
    showRSVPModal();
}

function showRSVPModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 400px;
            width: 90%;
            text-align: left;
        ">
            <h3 style="color: #7eba76; margin-bottom: 20px; text-align: center;">참석의사 전달</h3>
            <form id="rsvpForm">
                <div style="margin-bottom: 15px;">
                    <label for="participantName" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">이름</label>
                    <input type="text" id="participantName" name="name" required style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 16px;
                        box-sizing: border-box;
                    " placeholder="참석자 이름을 입력해주세요">
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="participantMessage" style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">축하메시지</label>
                    <textarea id="participantMessage" name="comments" required style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 16px;
                        min-height: 100px;
                        resize: vertical;
                        box-sizing: border-box;
                    " placeholder="축하 메시지를 입력해주세요"></textarea>
                </div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button type="submit" style="
                        background: #7eba76;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: bold;
                    ">참석의사 전달</button>
                    <button type="button" id="closeModalBtn" style="
                        background: #ccc;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 20px;
                        cursor: pointer;
                        font-size: 16px;
                    ">닫기</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('#rsvpForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const name = formData.get('name').toString().trim();
        const comments = formData.get('comments').toString().trim();
        
        if (!name || !comments) {
            showNotification('모든 항목을 입력해주세요 ❌');
            return;
        }
        
        try {
            const response = await fetch('https://your-server-domain.com/participation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, comments })
            });
            
            if (response.ok) {
                const result = await response.json();
                showNotification('참석의사가 성공적으로 전달되었습니다! 🎉');
                modal.remove();
                // 메시지 목록 새로고침
                loadMessages();
            } else {
                const error = await response.json();
                showNotification(`오류: ${error.error} ❌`);
            }
        } catch (error) {
            console.error('RSVP 전송 오류:', error);
            showNotification('서버 연결 오류가 발생했습니다 ❌');
        }
    });
    
    // Handle close button
    const closeBtn = modal.querySelector('#closeModalBtn');
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Guest Book Functions
async function loadMessages() {
    try {
        const response = await fetch('https://your-server-domain.com/participation');
        if (response.ok) {
            const result = await response.json();
            displayMessages(result.data);
        } else {
            showNotification('메시지를 불러오는데 실패했습니다 ❌');
        }
    } catch (error) {
        console.error('메시지 로드 오류:', error);
        showNotification('서버 연결 오류가 발생했습니다 ❌');
    }
}

function displayMessages(messages) {
    const guestBookList = document.getElementById('guestBookList');
    if (!guestBookList) return;
    
    // 기존 메시지 제거
    guestBookList.innerHTML = '';
    
    if (messages.length === 0) {
        guestBookList.innerHTML = '<li style="text-align: center; color: #999; padding: 20px;">아직 축하 메시지가 없습니다.</li>';
        return;
    }
    
    // 메시지들을 최신순으로 표시
    messages.forEach((message, index) => {
        const messageItem = document.createElement('li');
        messageItem.className = 'guest-book-item';
        messageItem.style.opacity = '0';
        messageItem.style.transform = 'translateY(20px)';
        
        messageItem.innerHTML = `
            <div class="item-header">
                <div class="item-writer">from. ${escapeHtml(message.name)}</div>
            </div>
            <p class="item-message">${escapeHtml(message.comments)}</p>
        `;
        
        guestBookList.appendChild(messageItem);
        
        // 순차적으로 애니메이션 적용
        setTimeout(() => {
            messageItem.style.transition = 'all 0.5s ease';
            messageItem.style.opacity = '1';
            messageItem.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Share Functions
function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('링크가 복사되었습니다! 🔗');
        }).catch(() => {
            fallbackCopyLink(url);
        });
    } else {
        fallbackCopyLink(url);
    }
}

function fallbackCopyLink(url) {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('링크가 복사되었습니다! 🔗');
    } catch (err) {
        showNotification('링크 복사에 실패했습니다');
    }
    
    document.body.removeChild(textArea);
}

function shareKakao() {
    const title = '생일파티에 초대합니다';
    const description = '소중한 하루를 함께 축하해주세요!';
    const url = window.location.href;
    
    // Check if KakaoTalk sharing is available
    if (typeof Kakao !== 'undefined' && Kakao.Share) {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: description,
                imageUrl: 'https://via.placeholder.com/300x400/7eba76/ffffff?text=생일+축하',
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
        });
    } else {
        // Fallback to basic sharing
        const shareText = `${title}\n${description}\n${url}`;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: description,
                url: url,
            }).then(() => {
                showNotification('공유되었습니다! 📤');
            }).catch(() => {
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
    }
}

function fallbackShare(text) {
    copyToClipboard(text);
    showNotification('초대장 정보가 복사되었습니다! 📋');
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #7eba76;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(126, 186, 118, 0.3);
        animation: slideInDown 0.3s ease-out forwards;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translate(-50%, -20px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        @keyframes slideOutUp {
            from {
                opacity: 1;
                transform: translate(-50%, 0);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -20px);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutUp 0.3s ease-out forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Event Listeners
function addEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Image gallery click events
    document.querySelectorAll('.image-container img').forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
    
    // Add touch feedback for buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Image Modal
function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    modal.innerHTML = `
        <div style="max-width: 90%; max-height: 90%; position: relative;">
            <img src="${src}" alt="${alt}" style="
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 10px;
            ">
            <button onclick="this.closest('div[style*=\"position: fixed\"]').remove()" style="
                position: absolute;
                top: -15px;
                right: -15px;
                background: white;
                border: none;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                color: #333;
            ">×</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close modal with escape key
    const handleEscape = function(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Initialize scroll position
window.addEventListener('load', function() {
    window.scrollTo(0, 0);
});

// Performance optimization
window.addEventListener('scroll', throttle(function() {
    // Add any scroll-based animations here if needed
}, 16)); // ~60fps

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
} 

// 네이버 지도 초기화
function initNaverMap() {
    // 여의도동 60 좌표
    var mapOptions = {
        center: new naver.maps.LatLng(37.5198, 126.9401), // 여의도동 60 좌표
        zoom: 17,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: naver.maps.MapTypeControlStyle.BUTTON,
            position: naver.maps.Position.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: naver.maps.ZoomControlStyle.SMALL,
            position: naver.maps.Position.TOP_RIGHT
        }
    };

    var map = new naver.maps.Map('naverMap', mapOptions);

    // 마커 추가
    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(37.5009, 127.0396),
        map: map,
        title: '생일파티 장소'
    });

    // 정보창 추가
    var infoWindow = new naver.maps.InfoWindow({
        content: [
            '<div style="padding: 10px; font-size: 12px; color: #333;">',
            '   <strong>🎉 생일파티 장소</strong><br>',
            '   서울특별시 영등포구 여의도동 60<br>',
            '   2025년 8월 30일 토요일 오후 1:00',
            '</div>'
        ].join('')
    });

    // 마커 클릭 시 정보창 열기
    naver.maps.Event.addListener(marker, 'click', function() {
        if (infoWindow.getMap()) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
    });
} 