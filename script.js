document.addEventListener('DOMContentLoaded', () => {
    // Navigasyon Elemanları
    const topNav = document.getElementById('topNav');
    const navHomeBtn = document.getElementById('navHomeBtn');
    const navProfileBtn = document.getElementById('navProfileBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Sayfa Görünümleri
    const authSection = document.getElementById('authSection');
    const homeView = document.getElementById('homeView');
    const profileView = document.getElementById('profileView');

    // Formlar
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // İlanlar
    const skillForm = document.getElementById('skillForm');
    const skillList = document.getElementById('skillList');

    // Kendi Profilini Düzenleme
    const myProfileForm = document.getElementById('myProfileForm');
    const myProfileName = document.getElementById('myProfileName');
    const myProfileEmail = document.getElementById('myProfileEmail');
    const myProfilePhone = document.getElementById('myProfilePhone');
    const myProfileBirthDate = document.getElementById('myProfileBirthDate');
    const myProfileBio = document.getElementById('myProfileBio');

    // Chat
    const conversationList = document.getElementById('conversationList');
    const chatTargetUser = document.getElementById('chatTargetUser');
    const chatBox = document.getElementById('chatBox');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');

    // Modal
    const profileModal = document.getElementById('profileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalName = document.getElementById('modalName');
    const modalAvatar = document.getElementById('modalAvatar');
    const modalAge = document.getElementById('modalAge');
    const modalRating = document.getElementById('modalRating');
    const modalSwaps = document.getElementById('modalSwaps');
    const modalBio = document.getElementById('modalBio');
    const modalChatBtn = document.getElementById('modalChatBtn');

    let currentUser = null;
    let activeChatTarget = null;

    // Yaş Hesaplama Fonksiyonu
    function calculateAge(birthDateString) {
        if (!birthDateString) return "Belirtilmedi";
        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // LOCAL STORAGE VERİLERİ
    let users = JSON.parse(localStorage.getItem('bt_users')) || {};
    let skills = JSON.parse(localStorage.getItem('bt_skills')) || [
        { name: "Ahmet K.", offered: "1 Saat Java Temelleri", wanted: "1 Saat Gitar Dersi" },
        { name: "Ayşe M.", offered: "İspanyolca Konuşma Pratiği", wanted: "HTML/CSS Tasarım Yardımı" }
    ];
    let privateMessages = JSON.parse(localStorage.getItem('bt_messages')) || {};

    if (!users["ahmet@mail.com"]) {
        users["ahmet@mail.com"] = { name: "Ahmet K.", email: "ahmet@mail.com", phone: "05551112233", password: "123", birthDate: "2000-05-15", rating: "4.9 ★", swaps: 14, bio: "Java ve backend uzmanı." };
        users["ayse@mail.com"] = { name: "Ayşe M.", email: "ayse@mail.com", phone: "05559998877", password: "123", birthDate: "2002-09-20", rating: "5.0 ★", swaps: 22, bio: "İspanyolca eğitmeni." };
        saveUsers();
    }

    function saveUsers() { localStorage.setItem('bt_users', JSON.stringify(users)); }
    function saveSkills() { localStorage.setItem('bt_skills', JSON.stringify(skills)); }
    function saveMessages() { localStorage.setItem('bt_messages', JSON.stringify(privateMessages)); }

    // Sekme Geçişleri
    loginTab.onclick = () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    };

    registerTab.onclick = () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    };

    // Kayıt Olma
    registerForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const birthDate = document.getElementById('regBirthDate').value;
        const phone = document.getElementById('regPhone').value.trim();
        const email = document.getElementById('regEmail').value.trim().toLowerCase();
        const password = document.getElementById('regPassword').value;

        if (users[email]) {
            alert("Bu e-posta adresiyle kayıtlı bir hesap var! Lütfen giriş yapın.");
            loginTab.click();
            return;
        }

        users[email] = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            birthDate: birthDate,
            rating: "Yeni Üye",
            swaps: 0,
            bio: "Henüz bir biyografi eklenmedi."
        };
        saveUsers();

        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        registerForm.reset();
        loginTab.click();
    };

    // Giriş Yapma
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        const user = users[email];

        if (!user) {
            alert("Bu e-posta adresine ait kayıtlı hesap bulunamadı! Önce kayıt olun.");
            registerTab.click();
            return;
        }

        if (user.password !== password) {
            alert("Girdiğiniz şifre yanlış!");
            return;
        }

        currentUser = user;
        loginSuccess();
        loginForm.reset();
    };

    function loginSuccess() {
        authSection.classList.add('hidden');
        topNav.classList.remove('hidden');
        showHomeView();
        renderCards();
    }

    // Gezinti Menüsü
    navHomeBtn.onclick = showHomeView;
    navProfileBtn.onclick = showProfileView;

    function showHomeView() {
        navHomeBtn.classList.add('active');
        navProfileBtn.classList.remove('active');
        homeView.classList.remove('hidden');
        profileView.classList.add('hidden');
    }

    function showProfileView() {
        navProfileBtn.classList.add('active');
        navHomeBtn.classList.remove('active');
        profileView.classList.remove('hidden');
        homeView.classList.add('hidden');

        myProfileName.value = currentUser.name;
        myProfileEmail.value = currentUser.email;
        myProfilePhone.value = currentUser.phone || "";
        myProfileBirthDate.value = currentUser.birthDate || "";
        myProfileBio.value = currentUser.bio;

        updateConversationList();
    }

    // Çıkış
    logoutBtn.onclick = () => {
        currentUser = null;
        authSection.classList.remove('hidden');
        topNav.classList.add('hidden');
        homeView.classList.add('hidden');
        profileView.classList.add('hidden');
    };

    // Profil Güncelleme
    myProfileForm.onsubmit = (e) => {
        e.preventDefault();
        currentUser.phone = myProfilePhone.value;
        currentUser.birthDate = myProfileBirthDate.value;
        currentUser.bio = myProfileBio.value;
        
        users[currentUser.email] = currentUser;
        saveUsers();
        alert("Profil bilgileriniz başarıyla güncellendi!");
    };

    // İlan Sahibinin Profilini Açma (Telefon gizli kalır)
    window.openProfile = function(userName) {
        const targetUser = Object.values(users).find(u => u.name === userName) || { name: userName, birthDate: null, rating: "5.0 ★", swaps: 0, bio: "Topluluk üyesi." };
        const calculatedAge = calculateAge(targetUser.birthDate);

        modalName.textContent = targetUser.name;
        modalAvatar.textContent = targetUser.name.charAt(0).toUpperCase();
        modalAge.textContent = `Yaş: ${calculatedAge}`;
        modalRating.textContent = targetUser.rating || "5.0 ★";
        modalSwaps.textContent = targetUser.swaps || 0;
        modalBio.textContent = targetUser.bio || "Biyografi yok.";

        modalChatBtn.onclick = () => {
            profileModal.classList.add('hidden');
            if (currentUser) {
                startChatWith(targetUser.name);
            } else {
                alert("Mesaj göndermek için giriş yapın.");
            }
        };

        profileModal.classList.remove('hidden');
    };

    closeModalBtn.onclick = () => profileModal.classList.add('hidden');

    // İlanları Listeleme
    function renderCards() {
        skillList.innerHTML = '';
        skills.forEach(item => {
            const card = document.createElement('div');
            card.className = 'skill-card';
            
            const isSelf = currentUser && currentUser.name === item.name;
            const btnHtml = currentUser 
                ? (isSelf ? '<small>Sizin İlanınız</small>' : `<button type="button" class="apply-btn" onclick="startChatWith('${item.name}')">Mesaj Gönder</button>`)
                : '<small>Giriş yapın</small>';

            card.innerHTML = `
                <div class="skill-card-content">
                    <h3><span class="user-link" onclick="openProfile('${item.name}')">${item.name}</span></h3>
                    <p><span class="badge-offer">Sunduğu:</span> ${item.offered}</p>
                    <p><span class="badge-want">Aradığı:</span> ${item.wanted}</p>
                </div>
                <div>${btnHtml}</div>
            `;
            skillList.appendChild(card);
        });
    }

    // Mesaj Başlatma
    window.startChatWith = function(targetUser) {
        activeChatTarget = targetUser;
        if (!privateMessages[targetUser]) {
            privateMessages[targetUser] = [
                { sender: targetUser, text: `Merhaba! Benimle iletişime geçtiğin için teşekkürler. İlanım hakkında konuşabiliriz.` }
            ];
            saveMessages();
        }
        showProfileView();
        renderChatBox();
    };

    function updateConversationList() {
        conversationList.innerHTML = '';
        Object.keys(privateMessages).forEach(target => {
            const li = document.createElement('li');
            li.textContent = target;
            if (target === activeChatTarget) li.className = 'active';
            li.onclick = () => {
                activeChatTarget = target;
                updateConversationList();
                renderChatBox();
            };
            conversationList.appendChild(li);
        });
    }

    function renderChatBox() {
        chatBox.innerHTML = '';
        if (!activeChatTarget || !privateMessages[activeChatTarget]) {
            chatForm.classList.add('hidden');
            return;
        }

        chatTargetUser.textContent = activeChatTarget;
        chatForm.classList.remove('hidden');

        privateMessages[activeChatTarget].forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = msg.sender === currentUser.name ? 'msg msg-sent' : 'msg msg-received';
            msgDiv.textContent = msg.text;
            chatBox.appendChild(msgDiv);
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Mesaj Gönderme
    chatForm.onsubmit = (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text || !activeChatTarget) return;

        privateMessages[activeChatTarget].push({ sender: currentUser.name, text: text });
        saveMessages();
        renderChatBox();
        chatInput.value = '';
    };

    // İlan Ekleme
    skillForm.onsubmit = (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const newSkill = {
            name: currentUser.name,
            offered: document.getElementById('offered').value,
            wanted: document.getElementById('wanted').value
        };

        skills.unshift(newSkill);
        saveSkills();
        renderCards();
        skillForm.reset();
    };

    renderCards();
});