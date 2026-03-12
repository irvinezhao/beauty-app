    <script>
        const defaultProjects = [
            { id: 1, title: '光子嫩肤', desc: '采用IPL光子技术，改善肤色不均、色斑、毛孔粗大等问题', price: 899, category: '护肤', cover: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400', detailText: '光子嫩肤是一种非侵入性的皮肤美容技术。\n\n1. 改善肤色不均\n2. 淡化色斑\n3. 收缩毛孔', detailImages: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400' },
            { id: 2, title: '水光针', desc: '深层补水锁水，让肌肤水润透亮', price: 1280, category: '护肤', cover: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400', detailText: '水光针是将透明质酸直接注入真皮层。', detailImages: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400' },
            { id: 3, title: '果酸换肤', desc: '温和去除老化角质，改善肌肤粗糙', price: 680, category: '美容', cover: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400', detailText: '果酸换肤通过使用不同浓度的果酸。', detailImages: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400' }
        ];
        
        let projects = defaultProjects;
        let selectedDate = null;
        let selectedTime = null;
        
        document.querySelectorAll('#userTabs .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#userTabs .tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('#userContent .page').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
        
        function renderUserProjects() {
            const grid = document.getElementById('projectGrid');
            // 优先使用商家后台添加的项目，否则用默认
            const data = window.adminProjects.length > 0 ? window.adminProjects : projects;
            grid.innerHTML = data.map(p => {
                const discountedPrice = getDiscountedPrice(p.price, p.id);
                const hasDiscount = discountedPrice < p.price;
                return `<div class="project-card" onclick="showDetail('${p.id}')"><img src="${p.cover || 'https://via.placeholder.com/400x300'}" alt="${p.title}"><div class="project-info"><div class="project-title">${p.title}</div><div class="project-desc">${p.desc || ''}</div><div class="project-price">${hasDiscount ? `<span style="text-decoration:line-through;color:#999;font-size:12px">¥${p.price}</span> ¥${discountedPrice}` : '¥' + p.price}</div></div></div>`;
            }).join('');
        }
        
        function showDetail(id) {
            const data = window.adminProjects.length > 0 ? window.adminProjects : projects;
            const p = data.find(item => item.id == id || item.id === id);
            if (!p) return;
            const detailPage = document.getElementById('detailPage');
            const content = document.getElementById('detailContent');
            
            const discountedPrice = getDiscountedPrice(p.price, p.id);
            const hasDiscount = discountedPrice < p.price;
            
            // 支持数组或逗号分隔的图片
            let detailImages = [];
            if (Array.isArray(p.detailImages)) {
                detailImages = p.detailImages;
            } else if (p.detailImages) {
                detailImages = p.detailImages.split(',');
            }
            content.innerHTML = `
                <img src="${p.cover || 'https://via.placeholder.com/400x300'}" class="detail-cover">
                <div class="detail-title">${p.title}</div>
                <div class="detail-price">${hasDiscount ? `<span style="text-decoration:line-through;color:#999;font-size:16px;margin-right:8px">¥${p.price}</span>¥${discountedPrice}` : '¥' + p.price}</div>
                <div class="detail-section"><h3>📝 项目介绍</h3><div class="detail-text">${(p.detailText || p.desc || '').replace(/\n/g, '<br>')}</div></div>
                ${detailImages.length ? `<div class="detail-section"><h3>📷 效果图</h3><div class="detail-images">${detailImages.map(img => `<img src="${img.trim()}">`).join('')}</div></div>` : ''}
            `;
            detailPage.classList.add('active');
        }
        
        function closeDetail() { document.getElementById('detailPage').classList.remove('active'); }
        
        const currentWeek = (() => { const week = []; const today = new Date(); for (let i = 0; i < 7; i++) { const date = new Date(today); date.setDate(today.getDate() + i); week.push({ day: ['日','一','二','三','四','五','六'][date.getDay()], num: date.getDate(), full: date.toISOString().split('T')[0] }); } return week; })();
        
        function renderBookingDates() { const container = document.getElementById('bookingDate'); container.innerHTML = currentWeek.map((d, i) => `<div class="date-item ${i===0?'active':''}" onclick="selectDate(${i})"><div class="date-day">周${d.day}</div><div class="date-num">${d.num}</div></div>`).join(''); selectedDate = currentWeek[0].full; renderTimeSlots(); }
        function selectDate(index) { document.querySelectorAll('.date-item').forEach((el, i) => el.classList.toggle('active', i === index)); selectedDate = currentWeek[index].full; selectedTime = null; renderTimeSlots(); }
        
        function renderTimeSlots() {
            const container = document.getElementById('timeSlots');
            let html = '';
            for (let hour = 10; hour <= 21; hour++) { const isBooked = Math.random() < 0.3; html += `<div class="time-slot ${isBooked?'booked':''}" onclick="${isBooked?'':`selectTime('${hour}:00')`}"><div class="slot-time">${hour}:00</div><div class="slot-status">${isBooked?'已约满':'可预约'}</div></div>`; }
            container.innerHTML = html;
        }
        
        function selectTime(time) { 
            if (!window.currentUser) {
                alert('请先登录');
                return openUserLogin();
            }
            document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected')); event.target.closest('.time-slot').classList.add('selected'); selectedTime = time; setTimeout(() => document.getElementById('bookingModal').classList.add('active'), 200); 
        }
        function closeBookingModal() { document.getElementById('bookingModal').classList.remove('active'); selectedTime = null; renderTimeSlots(); }
        
        async function confirmBooking() {
            const name = document.getElementById('bookingName').value.trim();
            const phone = document.getElementById('bookingPhone').value.trim();
            if (!name || !phone) return alert('请填写姓名和联系方式');
            
            // 保存到本地存储
            const booking = { 
                id: Date.now().toString(),
                date: selectedDate, 
                time: selectedTime, 
                name, 
                phone, 
                note: document.getElementById('bookingNote').value, 
                createdAt: new Date().toISOString() 
            };
            window.adminBookings.push(booking);
            localStorage.setItem('adminBookings', JSON.stringify(window.adminBookings));
            
            // 更新用户信息
            updateUserFromBooking(booking);
            
            alert('预约成功！');
            closeBookingModal();
            document.getElementById('bookingName').value = ''; document.getElementById('bookingPhone').value = ''; document.getElementById('bookingNote').value = '';
        }
        
        const timelineData = [ { dateText: '3月8日', projects: ['光子嫩肤', '小气泡清洁', '果酸换肤'], photos: ['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200'] }, { dateText: '2月14日', projects: ['水光针'], photos: ['https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=200'] } ];
        
        function renderTimeline() { const container = document.getElementById('timelineList'); container.innerHTML = timelineData.map(item => `<div class="timeline-item"><div class="timeline-date">${item.dateText}</div><div class="timeline-projects">${item.projects.map(p => `<span class="timeline-tag">${p}</span>`).join('')}</div><div class="timeline-photos">${item.photos.map(photo => `<img src="${photo}">`).join('')}</div></div>`).join(''); }
        
        // 我的页面 - 用户资料管理
        function renderProfile() {
            const container = document.getElementById('profileContent');
            
            if (!window.currentUser) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👤</div>
                        <p>请先登录</p>
                        <button class="btn" style="margin-top:16px" onclick="openUserLogin()">立即登录</button>
                    </div>
                `;
                return;
            }
            
            const user = window.currentUser;
            const myBookings = window.adminBookings.filter(b => b.phone === user.phone);
            const totalSpent = myBookings.length * 500; // 估算
            
            container.innerHTML = `
                <div class="admin-section">
                    <h3>👤 个人资料</h3>
                    <div style="padding:16px;background:var(--bg);border-radius:12px">
                        <div class="form-group">
                            <label>姓名</label>
                            <input type="text" id="profileName" value="${user.name || ''}" placeholder="请输入姓名">
                        </div>
                        <div class="form-group">
                            <label>手机号</label>
                            <input type="tel" value="${user.phone || ''}" disabled style="background:#eee">
                        </div>
                        <button class="btn" onclick="saveProfile()">保存修改</button>
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3>💰 会员信息</h3>
                    <div style="padding:16px;background:var(--bg);border-radius:12px">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
                            <div style="text-align:center;padding:12px;background:var(--card-bg);border-radius:12px">
                                <div style="font-size:24px;font-weight:700;color:var(--primary)">¥${user.balance || 0}</div>
                                <div style="font-size:12px;color:var(--text-light)">储值余额</div>
                            </div>
                            <div style="text-align:center;padding:12px;background:var(--card-bg);border-radius:12px">
                                <div style="font-size:24px;font-weight:700;color:var(--primary)">¥${user.totalSpent || 0}</div>
                                <div style="font-size:12px;color:var(--text-light)">累计消费</div>
                            </div>
                        </div>
                        ${(user.tags || []).length > 0 ? `<p style="font-size:13px"><strong>标签：</strong>${user.tags.join(', ')}</p>` : ''}
                    </div>
                </div>
                
                <div class="admin-section">
                    <h3>📅 我的预约</h3>
                    <div id="myBookingsList"></div>
                </div>
                
                <button class="btn" style="background:#f44336;margin-top:16px" onclick="userLogout()">退出登录</button>
            `;
            
            // 渲染我的预约
            const bookingsContainer = document.getElementById('myBookingsList');
            if (myBookings.length === 0) {
                bookingsContainer.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">暂无预约记录</p>';
            } else {
                bookingsContainer.innerHTML = myBookings.map(b => `
                    <div class="admin-list-item">
                        <div class="admin-item-info">
                            <h4>${b.date} ${b.time}</h4>
                            <p>${b.note || '无备注'}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // 社区功能
        let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        let currentPostId = null;
        
        window.renderCommunity = function() {
            const container = document.getElementById('communityView');
            
            container.innerHTML = `
                <div style="padding:12px;background:var(--card-bg);border-radius:12px;margin-bottom:12px">
                    <button class="btn" onclick="goToPost()" style="padding:10px">+ 发布新帖</button>
                </div>
                <div id="communityPosts"></div>
            `;
            
            const postsContainer = document.getElementById('communityPosts');
            
            if (posts.length === 0) {
                postsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💬</div><p>暂无帖子<br>快来发布第一个吧</p></div>';
                return;
            }
            
            postsContainer.innerHTML = posts.map(post => {
                const author = users.find(u => u.id === post.authorId) || { name: '未知用户' };
                return `
                    <div class="admin-section" style="cursor:pointer" onclick="viewPost('${post.id}')">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                            <div style="font-weight:600">${post.title}</div>
                            <span style="font-size:12px;color:var(--text-light)">${post.comments?.length || 0}评论</span>
                        </div>
                        <div style="font-size:14px;color:var(--text-light);margin-bottom:8px">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</div>
                        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-light)">
                            <span>👤 ${author.name}</span>
                            <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                `;
            }).join('');
        };
        
        window.goToPost = function() {
            if (!window.currentUser) {
                alert('请先登录');
                return openUserLogin();
            }
            document.getElementById('postTitle2').value = '';
            document.getElementById('postContent2').value = '';
            document.getElementById('postImages2').value = '';
            document.getElementById('postPage').classList.add('active');
        };
        
        window.goCommunity = function() {
            document.getElementById('postPage').classList.remove('active');
            document.getElementById('postDetailPage').classList.remove('active');
        };
        
        window.submitPost2 = async function() {
            const title = document.getElementById('postTitle2').value.trim();
            const content = document.getElementById('postContent2').value.trim();
            const imageFiles = document.getElementById('postImages2').files;
            
            if (!title || !content) return alert('请填写标题和内容');
            
            let images = [];
            for (const file of imageFiles) {
                if (file.size > 2 * 1024 * 1024) continue;
                const base64 = await fileToBase64(file);
                images.push(base64);
            }
            
            const post = {
                id: Date.now().toString(),
                authorId: window.currentUser.id,
                title,
                content,
                images,
                comments: [],
                createdAt: new Date().toISOString()
            };
            
            posts.unshift(post);
            localStorage.setItem('communityPosts', JSON.stringify(posts));
            
            goCommunity();
            renderCommunity();
        };
        
        window.viewPost = function(postId) {
            currentPostId = postId;
            const post = posts.find(p => p.id === postId);
            if (!post) return;
            
            const author = users.find(u => u.id === post.authorId) || { name: '未知用户' };
            
            let commentsHtml = '';
            if (post.comments && post.comments.length > 0) {
                commentsHtml = post.comments.map(c => {
                    const commentAuthor = users.find(u => u.id === c.authorId) || { name: '用户' };
                    return `
                        <div style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:8px">
                            <div style="font-weight:600;font-size:13px">${commentAuthor.name}</div>
                            <div style="font-size:14px;margin:4px 0">${c.content}</div>
                            <div style="font-size:11px;color:var(--text-light)">${new Date(c.createdAt).toLocaleString()}</div>
                        </div>
                    `;
                }).join('');
            } else {
                commentsHtml = '<p style="text-align:center;color:var(--text-light);padding:20px">暂无评论，快来抢沙发~</p>';
            }
            
            document.getElementById('postDetailContent').innerHTML = `
                <div style="margin-bottom:16px;padding:16px;background:var(--bg);border-radius:12px">
                    <div style="font-weight:700;font-size:20px;margin-bottom:8px">${post.title}</div>
                    <div style="font-size:14px;line-height:1.8;margin-bottom:12px">${post.content}</div>
                    ${post.images && post.images.length ? `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:12px">${post.images.map(img => `<img src="${img}" style="width:100%;border-radius:8px">`).join('')}</div>` : ''}
                    <div style="font-size:12px;color:var(--text-light)">👤 ${author.name} · ${new Date(post.createdAt).toLocaleString()}</div>
                </div>
                
                <h4 style="margin-bottom:12px">💬 评论 (${post.comments?.length || 0})</h4>
                ${commentsHtml}
                
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid #eee">
                    <textarea id="commentText2" placeholder="写下你的评论..." rows="2" style="width:100%;padding:12px;border:1px solid #eee;border-radius:10px;margin-bottom:12px"></textarea>
                    <button class="btn" onclick="submitComment2()">发表</button>
                </div>
            `;
            
            document.getElementById('postDetailPage').classList.add('active');
        };
        
        window.submitComment2 = function() {
            if (!window.currentUser) {
                alert('请先登录');
                return openUserLogin();
            }
            
            const content = document.getElementById('commentText2').value.trim();
            if (!content) return alert('请填写评论内容');
            
            const post = posts.find(p => p.id === currentPostId);
            if (!post) return;
            
            if (!post.comments) post.comments = [];
            
            post.comments.push({
                id: Date.now().toString(),
                authorId: window.currentUser.id,
                content,
                createdAt: new Date().toISOString()
            });
            
            localStorage.setItem('communityPosts', JSON.stringify(posts));
            
            viewPost(currentPostId); // 刷新评论
            renderCommunity(); // 更新列表显示
        };
        
        window.saveProfile = function() {
            const name = document.getElementById('profileName').value.trim();
            if (!name) return alert('请输入姓名');
            
            // 更新用户信息
            const userIndex = users.findIndex(u => u.phone === window.currentUser.phone);
            if (userIndex !== -1) {
                users[userIndex].name = name;
                localStorage.setItem('users', JSON.stringify(users));
                
                window.currentUser.name = name;
                localStorage.setItem('currentUser', JSON.stringify(window.currentUser));
                
                document.getElementById('userLoginBtn').textContent = name;
                alert('保存成功！');
                renderProfile();
            }
        };
        
        function openAdminLogin() { document.getElementById('loginPage').classList.add('active'); }
        
        function renderAdminProjects() {
            const list = document.getElementById('adminProjectList');
            const data = window.adminProjects;
            if (data.length === 0) { list.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:20px">暂无项目，请添加</p>'; return; }
            list.innerHTML = data.map(p => `<div class="admin-list-item"><div class="admin-item-info"><h4>${p.title}</h4><p>¥${p.price} · ${p.category || '未分类'}</p></div><div class="admin-item-actions"><button class="admin-btn-small admin-btn-edit" onclick="editProject('${p.id}')">编辑</button><button class="admin-btn-small admin-btn-delete" onclick="deleteProjectFromFirestore('${p.id}')">删除</button></div></div>`).join('');
        }
        
        // 商家后台预约日历
        let adminSelectedDate = null;
        
        function renderAdminBookingCalendar() {
            const container = document.getElementById('adminBookingDate');
            const week = [];
            const today = new Date();
            for (let i = 0; i < 14; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dayOfWeek = date.getDay();
                const isOffDay = bookingSettings.offDays.includes(dayOfWeek);
                week.push({ 
                    day: ['日','一','二','三','四','五','六'][dayOfWeek], 
                    num: date.getDate(), 
                    full: date.toISOString().split('T')[0],
                    isOffDay,
                    month: date.getMonth() + 1
                });
            }
            
            container.innerHTML = week.map((d, i) => {
                const isSelected = adminSelectedDate === d.full;
                const isClosed = d.isOffDay || closedDates[d.full];
                return `<div class="date-item ${isSelected?'active':''} ${isClosed?'booked':''}" onclick="selectAdminDate('${d.full}', ${i})"><div class="date-day">${d.month}/${d.num} 周${d.day}</div><div class="date-num">${isClosed?'休':'可'}</div></div>`;
            }).join('');
            
            if (!adminSelectedDate) {
                adminSelectedDate = week.find(d => !d.isOffDay && !closedDates[d.full])?.full || week[0].full;
            }
            renderAdminTimeSlots();
        }
        
        function selectAdminDate(date, index) {
            adminSelectedDate = date;
            document.querySelectorAll('#adminBookingDate .date-item').forEach((el, i) => {
                el.classList.toggle('active', i === index);
            });
            renderAdminTimeSlots();
        }
        
        function renderAdminTimeSlots() {
            const container = document.getElementById('adminTimeSlots');
            if (!adminSelectedDate) return;
            
            const isClosed = closedDates[adminSelectedDate];
            if (isClosed) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">今日已休业</p>';
                return;
            }
            
            const slots = [];
            for (let hour = bookingSettings.startTime; hour < bookingSettings.endTime; hour++) {
                slots.push({ hour, time: `${hour}:00` });
            }
            
            // 找出该日期的预约
            const dayBookings = window.adminBookings.filter(b => b.date === adminSelectedDate);
            
            container.innerHTML = slots.map(slot => {
                const booking = dayBookings.find(b => b.time === slot.time);
                if (booking) {
                    return `<div class="time-slot booked" style="text-align:left;padding:12px"><div style="font-weight:600">${slot.time}</div><div style="font-size:12px">${booking.name}</div><div style="font-size:11px;color:#666">${booking.phone}</div></div>`;
                }
                return `<div class="time-slot"><div class="slot-time">${slot.time}</div><div class="slot-status">可预约</div></div>`;
            }).join('');
        }
        
        function renderAdminBookings() {
            const list = document.getElementById('adminBookingList');
            if (!adminSelectedDate) return;
            
            const dayBookings = window.adminBookings.filter(b => b.date === adminSelectedDate);
            if (dayBookings.length === 0) { 
                list.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:20px">当日暂无预约</p>'; 
                return; 
            }
            
            list.innerHTML = dayBookings.map(b => `
                <div class="admin-list-item">
                    <div class="admin-item-info">
                        <h4>${b.name}</h4>
                        <p>${b.time} · ${b.phone}</p>
                        ${b.note ? `<p style="font-size:11px;color:#999">备注：${b.note}</p>` : ''}
                    </div>
                    <div class="admin-item-actions">
                        <button class="admin-btn-small admin-btn-delete" onclick="deleteBooking('${b.id}')">删除</button>
                    </div>
                </div>
            `).join('');
        }
        
        function deleteBooking(id) {
            if (!confirm('确定删除该预约？')) return;
            window.adminBookings = window.adminBookings.filter(b => b.id !== id);
            localStorage.setItem('adminBookings', JSON.stringify(window.adminBookings));
            renderAdminTimeSlots();
            renderAdminBookings();
        }
        
        // 设置弹窗
        function openSettingsModal() {
            document.getElementById('serviceStartTime').value = bookingSettings.startTime;
            document.getElementById('serviceEndTime').value = bookingSettings.endTime;
            document.getElementById('serviceDuration').value = bookingSettings.duration;
            
            // 清空并重新设置休业日checkbox
            for (let i = 0; i <= 6; i++) {
                document.getElementById('offDay' + i).checked = bookingSettings.offDays.includes(i);
            }
            
            document.getElementById('settingsModal').classList.add('active');
        }
        
        function closeSettingsModal() {
            document.getElementById('settingsModal').classList.remove('active');
        }
        
        function saveSettings() {
            bookingSettings.startTime = parseInt(document.getElementById('serviceStartTime').value);
            bookingSettings.endTime = parseInt(document.getElementById('serviceEndTime').value);
            bookingSettings.duration = parseInt(document.getElementById('serviceDuration').value);
            
            bookingSettings.offDays = [];
            for (let i = 0; i <= 6; i++) {
                if (document.getElementById('offDay' + i).checked) {
                    bookingSettings.offDays.push(i);
                }
            }
            
            localStorage.setItem('bookingSettings', JSON.stringify(bookingSettings));
            
            // 更新显示
            document.getElementById('serviceHoursDisplay').textContent = `${bookingSettings.startTime}:00 - ${bookingSettings.endTime}:00`;
            document.getElementById('serviceDurationDisplay').textContent = bookingSettings.duration;
            
            closeSettingsModal();
            renderAdminBookingCalendar();
        }
        
        function toggleClosedDate(date) {
            if (closedDates[date]) {
                delete closedDates[date];
            } else {
                closedDates[date] = true;
            }
            localStorage.setItem('closedDates', JSON.stringify(closedDates));
            renderAdminBookingCalendar();
        }
        
        // 用户管理
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // 充值方案
        let rechargePlans = JSON.parse(localStorage.getItem('rechargePlans') || '[]');
        
        // 优惠券
        let coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
        
        // 打折配置
        let discounts = JSON.parse(localStorage.getItem('discounts') || '[]');
        
        // 计算折后价
        function getDiscountedPrice(originalPrice, projectId) {
            const discount = discounts.find(d => d.projectIds && d.projectIds.includes(projectId));
            if (!discount) return originalPrice;
            
            if (discount.type === 'fixed') {
                return discount.fixedPrice;
            } else if (discount.type === 'percent') {
                return Math.round(originalPrice * discount.percent / 100);
            }
            return originalPrice;
        }
        
        function renderDiscountList() {
            const container = document.getElementById('discountList');
            if (discounts.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">暂无折扣配置</p>';
                return;
            }
            container.innerHTML = discounts.map(d => {
                let desc = '';
                if (d.type === 'fixed') {
                    desc = `一口价 ¥${d.fixedPrice}`;
                } else {
                    desc = `${d.percent}折`;
                }
                return `
                    <div class="admin-list-item">
                        <div class="admin-item-info">
                            <h4>${desc}</h4>
                            <p style="font-size:12px">${d.projectIds?.length || 0}个项目</p>
                        </div>
                        <button class="admin-btn-small admin-btn-delete" onclick="deleteDiscount('${d.id}')">删除</button>
                    </div>
                `;
            }).join('');
        }
        
        function openDiscountModal() {
            // 加载项目选择
            const select = document.getElementById('discountProjectSelect');
            const allProjects = window.adminProjects.length > 0 ? window.adminProjects : defaultProjects;
            select.innerHTML = allProjects.map(p => `
                <label style="display:flex;align-items:center;gap:8px;padding:8px">
                    <input type="checkbox" value="${p.id}" style="width:auto">
                    ${p.title}
                </label>
            `).join('');
            
            document.getElementById('discountType').value = 'fixed';
            document.getElementById('fixedPriceGroup').style.display = 'block';
            document.getElementById('percentGroup').style.display = 'none';
            document.getElementById('discountModal').classList.add('active');
        }
        
        function toggleDiscountType() {
            const type = document.getElementById('discountType').value;
            document.getElementById('fixedPriceGroup').style.display = type === 'fixed' ? 'block' : 'none';
            document.getElementById('percentGroup').style.display = type === 'percent' ? 'block' : 'none';
        }
        
        function closeDiscountModal() {
            document.getElementById('discountModal').classList.remove('active');
        }
        
        function saveDiscount() {
            const type = document.getElementById('discountType').value;
            let discountData = { type };
            
            if (type === 'fixed') {
                discountData.fixedPrice = parseInt(document.getElementById('fixedPrice').value);
                if (!discountData.fixedPrice) return alert('请填写一口价');
            } else {
                discountData.percent = parseInt(document.getElementById('discountPercent').value);
                if (!discountData.percent || discountData.percent < 1 || discountData.percent > 100) return alert('请填写1-100的折扣比例');
            }
            
            // 获取选中的项目
            const checkboxes = document.querySelectorAll('#discountProjectSelect input:checked');
            const projectIds = Array.from(checkboxes).map(cb => cb.value);
            
            if (projectIds.length === 0) return alert('请至少选择一个项目');
            
            discountData.projectIds = projectIds;
            discountData.id = Date.now().toString();
            
            discounts.push(discountData);
            localStorage.setItem('discounts', JSON.stringify(discounts));
            
            closeDiscountModal();
            renderDiscountList();
            renderUserProjects(); // 刷新显示
        }
        
        function deleteDiscount(id) {
            if (!confirm('确定删除？')) return;
            discounts = discounts.filter(d => d.id !== id);
            localStorage.setItem('discounts', JSON.stringify(discounts));
            renderDiscountList();
            renderUserProjects();
        }
        
        function renderRechargeList() {
            const container = document.getElementById('rechargeList');
            if (rechargePlans.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">暂无充值方案</p>';
                return;
            }
            container.innerHTML = rechargePlans.map(p => `
                <div class="admin-list-item">
                    <div class="admin-item-info">
                        <h4>充¥${p.amount} 送¥${p.bonus}</h4>
                        <p style="font-size:12px">¥${p.amount + p.bonus}到账</p>
                    </div>
                    <button class="admin-btn-small admin-btn-delete" onclick="deleteRecharge('${p.id}')">删除</button>
                </div>
            `).join('');
        }
        
        function openRechargeModal() {
            document.getElementById('rechargeAmount').value = '';
            document.getElementById('rechargeBonus').value = '';
            document.getElementById('rechargeModal').classList.add('active');
        }
        
        function closeRechargeModal() {
            document.getElementById('rechargeModal').classList.remove('active');
        }
        
        function saveRecharge() {
            const amount = parseInt(document.getElementById('rechargeAmount').value);
            const bonus = parseInt(document.getElementById('rechargeBonus').value) || 0;
            if (!amount || amount <= 0) return alert('请填写充值金额');
            
            rechargePlans.push({
                id: Date.now().toString(),
                amount,
                bonus
            });
            localStorage.setItem('rechargePlans', JSON.stringify(rechargePlans));
            closeRechargeModal();
            renderRechargeList();
        }
        
        function deleteRecharge(id) {
            if (!confirm('确定删除？')) return;
            rechargePlans = rechargePlans.filter(p => p.id !== id);
            localStorage.setItem('rechargePlans', JSON.stringify(rechargePlans));
            renderRechargeList();
        }
        
        function renderCouponList() {
            const container = document.getElementById('couponList');
            if (coupons.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">暂无优惠券</p>';
                return;
            }
            container.innerHTML = coupons.map(c => `
                <div class="admin-list-item">
                    <div class="admin-item-info">
                        <h4>${c.name}</h4>
                        <p style="font-size:12px">满¥${c.minSpend}减¥${c.discount} · ${c.expireDays}天有效</p>
                    </div>
                    <button class="admin-btn-small admin-btn-delete" onclick="deleteCoupon('${c.id}')">删除</button>
                </div>
            `).join('');
        }
        
        function openCouponModal() {
            document.getElementById('couponName').value = '';
            document.getElementById('couponDiscount').value = '';
            document.getElementById('couponMinSpend').value = '';
            document.getElementById('couponExpireDays').value = '';
            document.getElementById('couponModal').classList.add('active');
        }
        
        function closeCouponModal() {
            document.getElementById('couponModal').classList.remove('active');
        }
        
        function saveCoupon() {
            const name = document.getElementById('couponName').value.trim();
            const discount = parseInt(document.getElementById('couponDiscount').value);
            const minSpend = parseInt(document.getElementById('couponMinSpend').value) || 0;
            const expireDays = parseInt(document.getElementById('couponExpireDays').value) || 30;
            
            if (!name || !discount) return alert('请填写名称和优惠金额');
            
            coupons.push({
                id: Date.now().toString(),
                name,
                discount,
                minSpend,
                expireDays,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('coupons', JSON.stringify(coupons));
            closeCouponModal();
            renderCouponList();
        }
        
        function deleteCoupon(id) {
            if (!confirm('确定删除？')) return;
            coupons = coupons.filter(c => c.id !== id);
            localStorage.setItem('coupons', JSON.stringify(coupons));
            renderCouponList();
        }
        
        function renderUserStats() {
            const totalUsers = users.length;
            const totalRevenue = users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);
            const totalBalance = users.reduce((sum, u) => sum + (u.balance || 0), 0);
            
            document.getElementById('totalUsers').textContent = totalUsers;
            document.getElementById('totalRevenue').textContent = '¥' + totalRevenue;
            document.getElementById('totalBalance').textContent = '¥' + totalBalance;
        }
        
        function openUserList() {
            const listContent = document.getElementById('userListContent');
            if (users.length === 0) {
                listContent.innerHTML = '<p style="text-align:center;color:var(--text-light);padding:20px">暂无用户</p>';
            } else {
                listContent.innerHTML = users.map(u => `
                    <div class="admin-list-item" style="cursor:pointer" onclick="viewUserDetail('${u.id}')">
                        <div class="admin-item-info">
                            <h4>${u.name}</h4>
                            <p>${u.phone}</p>
                        </div>
                        <div style="text-align:right">
                            <div style="font-size:14px;font-weight:600;color:var(--primary)">¥${u.balance || 0}</div>
                            <p style="font-size:11px;color:var(--text-light)">储值余额</p>
                        </div>
                    </div>
                `).join('');
            }
            document.getElementById('userListModal').classList.add('active');
        }
        
        function closeUserListModal() {
            document.getElementById('userListModal').classList.remove('active');
        }
        
        function viewUserDetail(userId) {
            const user = users.find(u => u.id === userId);
            if (!user) return;
            
            // 获取用户消费记录
            const userBookings = window.adminBookings.filter(b => b.phone === user.phone);
            
            const detailContent = document.getElementById('userDetailContent');
            detailContent.innerHTML = `
                <div style="background:var(--bg);padding:16px;border-radius:12px;margin-bottom:16px">
                    <h4 style="margin-bottom:12px">基本信息</h4>
                    <p><strong>姓名：</strong>${user.name}</p>
                    <p><strong>电话：</strong>${user.phone}</p>
                    <p><strong>标签：</strong>${(user.tags || []).join(', ') || '无'}</p>
                    <p><strong>储值余额：</strong><span style="color:var(--primary);font-weight:700">¥${user.balance || 0}</span></p>
                    <p><strong>累计消费：</strong><span style="color:var(--primary);font-weight:700">¥${user.totalSpent || 0}</span></p>
                </div>
                
                <div style="background:var(--bg);padding:16px;border-radius:12px;margin-bottom:16px">
                    <h4 style="margin-bottom:12px">打标签</h4>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
                        ${['VIP', '老客户', '新客户', '高消费', '潜力客户'].map(tag => `
                            <span class="timeline-tag" style="cursor:pointer" onclick="addUserTag('${user.id}', '${tag}')">${tag}</span>
                        `).join('')}
                    </div>
                    <button class="btn" style="padding:8px;font-size:13px" onclick="addNewUserTag('${user.id}')">+ 自定义标签</button>
                </div>
                
                <div>
                    <h4 style="margin-bottom:12px">美容日记</h4>
                    <div class="timeline" style="padding-left:20px">
                        ${userBookings.length === 0 ? '<p style="color:var(--text-light)">暂无记录</p>' : userBookings.map(b => `
                            <div class="timeline-item">
                                <div class="timeline-date">${b.date}</div>
                                <div class="timeline-projects">
                                    <span class="timeline-tag">预约：${b.time}</span>
                                </div>
                                <p style="font-size:12px;color:var(--text-light)">${b.note || ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-top:16px;padding-top:16px;border-top:1px solid #eee">
                    <h4 style="margin-bottom:12px">储值操作</h4>
                    <div style="display:flex;gap:8px">
                        <input type="number" id="rechargeAmount" placeholder="金额" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:8px">
                        <button class="btn" style="width:auto;padding:10px 20px" onclick="rechargeUser('${user.id}')">充值</button>
                    </div>
                </div>
            `;
            
            document.getElementById('userListModal').classList.remove('active');
            document.getElementById('userDetailModal').classList.add('active');
        }
        
        function closeUserDetailModal() {
            document.getElementById('userDetailModal').classList.remove('active');
        }
        
        function addUserTag(userId, tag) {
            const user = users.find(u => u.id === userId);
            if (!user) return;
            if (!user.tags) user.tags = [];
            if (!user.tags.includes(tag)) {
                user.tags.push(tag);
                localStorage.setItem('users', JSON.stringify(users));
                viewUserDetail(userId);
            }
        }
        
        function addNewUserTag(userId) {
            const tag = prompt('请输入自定义标签：');
            if (tag) addUserTag(userId, tag);
        }
        
        function rechargeUser(userId) {
            const amount = parseInt(document.getElementById('rechargeAmount').value);
            if (!amount || amount <= 0) return alert('请输入有效金额');
            
            const user = users.find(u => u.id === userId);
            if (!user) return;
            
            user.balance = (user.balance || 0) + amount;
            user.totalSpent = (user.totalSpent || 0) + amount;
            
            localStorage.setItem('users', JSON.stringify(users));
            renderUserStats();
            viewUserDetail(userId);
        }
        
        // 用户预约时自动创建/更新用户
        function updateUserFromBooking(booking) {
            let user = users.find(u => u.phone === booking.phone);
            if (!user) {
                user = {
                    id: Date.now().toString(),
                    name: booking.name,
                    phone: booking.phone,
                    balance: 0,
                    totalSpent: 0,
                    tags: [],
                    createdAt: new Date().toISOString()
                };
                users.push(user);
            } else {
                user.name = booking.name;
            }
            localStorage.setItem('users', JSON.stringify(users));
            renderUserStats();
        }
        
        function openProjectModal(project = null) {
            window.editingProjectId = project ? project.id : null;
            document.getElementById('projectModalTitle').textContent = project ? '编辑项目' : '添加项目';
            document.getElementById('projectName').value = project ? project.title : '';
            document.getElementById('projectDesc').value = project ? project.desc : '';
            document.getElementById('projectPrice').value = project ? project.price : '';
            document.getElementById('projectCategory').value = project ? project.category : '护肤';
            // 文件输入不能预设值，清空并提示
            document.getElementById('projectCover').value = '';
            document.getElementById('projectDetailText').value = project ? project.detailText : '';
            document.getElementById('projectDetailImages').value = '';
            document.getElementById('projectModal').classList.add('active');
        }
        
        function closeProjectModal() { document.getElementById('projectModal').classList.remove('active'); window.editingProjectId = null; }
        
        function editProject(id) { const p = window.adminProjects.find(item => item.id === id); if (p) openProjectModal(p); }
        
        // 图片转Base64
        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
        
        // 处理多张图片
        async function handleDetailImages(files) {
            const base64Images = [];
            for (const file of files) {
                if (file.size > 2 * 1024 * 1024) {
                    alert('图片不能超过2MB');
                    continue;
                }
                const base64 = await fileToBase64(file);
                base64Images.push(base64);
            }
            return base64Images;
        }
        
        async function saveProject() {
            const title = document.getElementById('projectName').value.trim();
            const price = document.getElementById('projectPrice').value;
            if (!title || !price) return alert('请填写名称和价格');
            
            // 处理封面图片
            let coverBase64 = '';
            const coverFile = document.getElementById('projectCover').files[0];
            if (coverFile) {
                if (coverFile.size > 2 * 1024 * 1024) return alert('封面图片不能超过2MB');
                coverBase64 = await fileToBase64(coverFile);
            } else {
                // 如果没选新图片，保留原来的
                const existingProject = window.adminProjects.find(p => p.id === window.editingProjectId);
                if (existingProject) coverBase64 = existingProject.cover || '';
            }
            
            // 处理详情图片
            const detailFiles = document.getElementById('projectDetailImages').files;
            let detailImagesBase64 = [];
            if (detailFiles.length > 0) {
                detailImagesBase64 = await handleDetailImages(detailFiles);
            } else {
                const existingProject = window.adminProjects.find(p => p.id === window.editingProjectId);
                if (existingProject) detailImagesBase64 = existingProject.detailImages || [];
            }
            
            window.saveProjectToFirestore({ 
                title, 
                desc: document.getElementById('projectDesc').value, 
                price: parseInt(price), 
                category: document.getElementById('projectCategory').value, 
                cover: coverBase64, 
                detailText: document.getElementById('projectDetailText').value, 
                detailImages: detailImagesBase64 
            });
        }
        
        renderUserProjects();
        renderBookingDates();
        renderTimeSlots();
        renderTimeline();
        renderProfile();
        renderCommunity();
        
        // 检查管理员登录状态
        if (isLoggedIn) {
            document.getElementById('adminPage').classList.add('active');
            renderAdminProjects();
            renderAdminBookingCalendar();
            document.getElementById('serviceHoursDisplay').textContent = `${bookingSettings.startTime}:00 - ${bookingSettings.endTime}:00`;
            document.getElementById('serviceDurationDisplay').textContent = bookingSettings.duration;
            renderAdminBookings();
        }
