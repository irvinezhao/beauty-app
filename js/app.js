        // 预设管理员账号
        const ADMIN_USER = {
            username: 'admin',
            password: 'beauty123',
            name: '管理员'
        };
        
        let isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        // 预约设置
        let bookingSettings = JSON.parse(localStorage.getItem('bookingSettings')) || {
            startTime: 10,
            endTime: 22,
            duration: 60,
            offDays: []
        };
        
        // 休业日
        let closedDates = JSON.parse(localStorage.getItem('closedDates')) || {};
        
        function initDarkMode() {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); document.getElementById('darkModeBtn').textContent = '☀️'; }
        }
        
        function toggleDarkMode() {
            const html = document.documentElement;
            const isDark = html.getAttribute('data-theme') === 'dark';
            if (isDark) { html.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); document.getElementById('darkModeBtn').textContent = '🌙'; }
            else { html.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); document.getElementById('darkModeBtn').textContent = '☀️'; }
        }
        
        document.getElementById('darkModeBtn').onclick = toggleDarkMode;
        initDarkMode();
        
        // 验证码相关（模拟发送）
        let verificationCodes = {};
        
        window.adminSendCode = function() {
            const phone = document.getElementById('adminLoginPhone').value.trim();
            if (!/^1\d{10}$/.test(phone)) return alert('请输入正确的手机号');
            
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            verificationCodes[phone] = { code, expires: Date.now() + 5 * 60 * 1000 };
            
            alert(`验证码已发送（测试码：${code}）`);
            
            let countdown = 60;
            const btn = document.getElementById('adminSendCodeBtn');
            btn.disabled = true;
            btn.textContent = `${countdown}s`;
            
            const timer = setInterval(() => {
                countdown--;
                btn.textContent = `${countdown}s`;
                if (countdown <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.textContent = '发送验证码';
                }
            }, 1000);
        };
        
        window.adminLogin = function() {
            const phone = document.getElementById('adminLoginPhone').value.trim();
            const code = document.getElementById('adminLoginCode').value.trim();
            
            const adminPhones = ['17665124666', '13632736654'];
            
            if (!phone || !code) return alert('请填写手机号和验证码');
            if (!adminPhones.includes(phone)) return alert('此手机号不是管理员账号');
            
            const stored = verificationCodes[phone];
            if (!stored) return alert('请先获取验证码');
            if (Date.now() > stored.expires) return alert('验证码已过期，请重新获取');
            if (stored.code !== code) return alert('验证码错误');
            
            isLoggedIn = true;
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('loginPage').classList.remove('active');
            document.getElementById('adminPage').classList.add('active');
            renderAdminProjects();
            renderAdminBookingCalendar();
            document.getElementById('serviceHoursDisplay').textContent = `${bookingSettings.startTime}:00 - ${bookingSettings.endTime}:00`;
            document.getElementById('serviceDurationDisplay').textContent = bookingSettings.duration;
            renderAdminBookings();
            renderRechargeList();
            renderCouponList();
            renderDiscountList();
        };
        
        // 手机号验证码登录
        window.loginWithCode = function() {
            const phone = document.getElementById('loginPhone').value.trim();
            const code = document.getElementById('loginCode').value.trim();
            
            // 管理员手机号白名单
            const adminPhones = ['17665124666', '13632736654'];
            
            if (!phone || !code) return alert('请填写手机号和验证码');
            if (!adminPhones.includes(phone)) return alert('此手机号不是管理员账号');
            
            const stored = verificationCodes[phone];
            if (!stored) return alert('请先获取验证码');
            if (Date.now() > stored.expires) return alert('验证码已过期，请重新获取');
            if (stored.code !== code) return alert('验证码错误');
            
            // 管理员登录成功
            isLoggedIn = true;
            localStorage.setItem('adminLoggedIn', 'true');
            document.getElementById('loginPage').classList.remove('active');
            document.getElementById('adminPage').classList.add('active');
            renderAdminProjects();
            renderAdminBookingCalendar();
            document.getElementById('serviceHoursDisplay').textContent = `${bookingSettings.startTime}:00 - ${bookingSettings.endTime}:00`;
            document.getElementById('serviceDurationDisplay').textContent = bookingSettings.duration;
            renderAdminBookings();
            renderRechargeList();
            renderCouponList();
            renderDiscountList();
        };
        
        // 用户端登录相关
                    balance: 0,
                    totalSpent: 0,
                    tags: [],
                    createdAt: new Date().toISOString()
                };
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // 保存登录状态
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            alert('登录成功！');
            document.getElementById('loginPage').classList.remove('active');
            // 用户端逻辑可以根据登录状态显示不同内容
        };
        
        // 账号密码登录
        window.loginWithPassword = function() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
                isLoggedIn = true;
                localStorage.setItem('adminLoggedIn', 'true');
                document.getElementById('loginPage').classList.remove('active');
                document.getElementById('adminPage').classList.add('active');
                renderAdminProjects();
                renderAdminBookingCalendar();
                document.getElementById('serviceHoursDisplay').textContent = `${bookingSettings.startTime}:00 - ${bookingSettings.endTime}:00`;
                document.getElementById('serviceDurationDisplay').textContent = bookingSettings.duration;
                renderAdminBookings();
                renderRechargeList();
                renderCouponList();
                renderDiscountList();
            } else {
                alert('账号或密码错误');
            }
        };
        
        window.logoutAdmin = function() {
            isLoggedIn = false;
            localStorage.setItem('adminLoggedIn', 'false');
            document.getElementById('adminPage').classList.remove('active');
        };
        
        window.showPasswordLogin = function() {
            document.getElementById('loginSubtitle').textContent = '请输入账号密码登录';
            document.getElementById('phoneLoginForm').style.display = 'none';
            document.getElementById('passwordLoginForm').style.display = 'block';
        };
        
        window.showPhoneLogin = function() {
            document.getElementById('loginSubtitle').textContent = '请输入手机号登录';
            document.getElementById('phoneLoginForm').style.display = 'block';
            document.getElementById('passwordLoginForm').style.display = 'none';
        };
        
        // 用户端登录
        window.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        window.openUserLogin = function() {
            document.getElementById('userLoginPage').classList.add('active');
        };
        
        window.closeUserLogin = function() {
            document.getElementById('userLoginPage').classList.remove('active');
        };
        
        window.closeAdminLogin = function() {
            document.getElementById('loginPage').classList.remove('active');
        };
        
        window.sendUserCode = function() {
            const phone = document.getElementById('userLoginPhone').value.trim();
            if (!/^1\d{10}$/.test(phone)) return alert('请输入正确的手机号');
            
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            verificationCodes[phone] = { code, expires: Date.now() + 5 * 60 * 1000 };
            
            alert(`验证码已发送（测试码：${code}）`);
            
            let countdown = 60;
            const btn = document.getElementById('userSendCodeBtn');
            btn.disabled = true;
            btn.textContent = `${countdown}s`;
            
            const timer = setInterval(() => {
                countdown--;
                btn.textContent = `${countdown}s`;
                if (countdown <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.textContent = '发送验证码';
                }
            }, 1000);
        };
        
        window.userLogin = function() {
            const phone = document.getElementById('userLoginPhone').value.trim();
            const code = document.getElementById('userLoginCode').value.trim();
            
            if (!phone || !code) return alert('请填写手机号和验证码');
            
            const stored = verificationCodes[phone];
            if (!stored) return alert('请先获取验证码');
            if (Date.now() > stored.expires) return alert('验证码已过期');
            if (stored.code !== code) return alert('验证码错误');
            
            // 查找或创建用户
            let user = users.find(u => u.phone === phone);
            if (!user) {
                user = {
                    id: Date.now().toString(),
                    name: '用户' + phone.slice(-4),
                    phone: phone,
                    balance: 0,
                    totalSpent: 0,
                    tags: [],
                    createdAt: new Date().toISOString()
                };
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            window.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 更新UI
            document.getElementById('userLoginBtn').textContent = user.name;
            document.getElementById('userLoginBtn').onclick = userLogout;
            
            alert('登录成功！');
            closeUserLogin();
            renderProfile();
        };
        
        window.userLogout = function() {
            if (!confirm('确定要退出登录吗？')) return;
            window.currentUser = null;
            localStorage.removeItem('currentUser');
            document.getElementById('userLoginBtn').textContent = '登录';
            document.getElementById('userLoginBtn').onclick = openUserLogin;
            renderProfile();
        };
        
        // 检查登录状态
        if (window.currentUser) {
            document.getElementById('userLoginBtn').textContent = window.currentUser.name;
            document.getElementById('userLoginBtn').onclick = userLogout;
        }
        
        // 项目管理数据（本地存储）
        window.adminProjects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
        window.adminBookings = JSON.parse(localStorage.getItem('adminBookings') || '[]');
        
        // 保存到本地存储
        function saveAdminData() {
            localStorage.setItem('adminProjects', JSON.stringify(window.adminProjects));
            localStorage.setItem('adminBookings', JSON.stringify(window.adminBookings));
        }
        
        window.saveProjectToFirestore = function(data) {
            if (window.editingProjectId) {
                const index = window.adminProjects.findIndex(p => p.id === window.editingProjectId);
                if (index !== -1) {
                    window.adminProjects[index] = { ...window.adminProjects[index], ...data };
                }
            } else {
                window.adminProjects.push({ id: Date.now().toString(), ...data, createdAt: new Date().toISOString() });
            }
            saveAdminData();
            closeProjectModal();
            renderAdminProjects();
            renderUserProjects();
        };
        
        window.deleteProjectFromFirestore = function(id) {
            if (!confirm('确定删除?')) return;
            window.adminProjects = window.adminProjects.filter(p => p.id !== id);
            saveAdminData();
            renderAdminProjects();
            renderUserProjects();
        };
    </script>
    
