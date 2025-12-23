// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 导航栏滚动效果
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 移动端菜单
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', function () {
        mobileMenu.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    mobileMenuClose.addEventListener('click', function () {
        mobileMenu.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    // 点击移动端菜单外部关闭菜单
    mobileMenu.addEventListener('click', function (e) {
        if (e.target === mobileMenu) {
            mobileMenu.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 轮播图功能
    const bannerWrapper = document.querySelector('.banner-wrapper');
    const bannerItems = document.querySelectorAll('.banner-item');
    const bannerIndicators = document.querySelectorAll('.banner-indicator');
    const bannerPrev = document.querySelector('.banner-prev');
    const bannerNext = document.querySelector('.banner-next');

    let currentIndex = 0;
    let slideInterval = null;
    const slideCount = bannerItems.length;
    const slideWidth = 100;

    // 初始化轮播图
    function initSlider() {
        // 设置自动轮播
        slideInterval = setInterval(nextSlide, 3000);

        // 绑定事件
        bannerPrev.addEventListener('click', prevSlide);
        bannerNext.addEventListener('click', nextSlide);

        // 指示器点击事件
        bannerIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // 鼠标悬停暂停轮播
        bannerWrapper.addEventListener('mouseenter', pauseSlider);
        bannerWrapper.addEventListener('mouseleave', startSlider);
    }

    // 下一张幻灯片
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }

    // 上一张幻灯片
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    }

    // 跳转到指定幻灯片
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    // 更新幻灯片状态
    function updateSlider() {
        bannerWrapper.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

        // 更新指示器
        bannerIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // 暂停轮播
    function pauseSlider() {
        clearInterval(slideInterval);
    }

    // 开始轮播
    function startSlider() {
        slideInterval = setInterval(nextSlide, 3000);
    }

    // 如果存在轮播图，则初始化
    if (bannerWrapper) {
        initSlider();
    }

    // 商品图片悬停放大效果
    const productImages = document.querySelectorAll('.product-image img');

    productImages.forEach(image => {
        image.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.15)';
        });

        image.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });

    // 图片懒加载
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('.lazyload');

        lazyImages.forEach(image => {
            if (image.getBoundingClientRect().top < window.innerHeight) {
                image.src = image.dataset.src;
                image.classList.add('loaded');
            }
        });
    }

    // 初始加载
    lazyLoadImages();

    // 滚动时加载
    window.addEventListener('scroll', lazyLoadImages);

    // 购物车功能
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');

    // 从本地存储获取购物车数据
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    // 保存购物车数据到本地存储
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // 更新购物车数量显示
    function updateCartCount() {
        const cart = getCart();
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalCount;
        }
    }

    // 添加商品到购物车
    function addToCart(productId, productName, productPrice, productImage) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        saveCart(cart);
        showNotification('商品已添加到购物车');
    }

    // 显示通知
    function showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: #00BE9A;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // 添加到页面
        document.body.appendChild(notification);

        // 3秒后移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 为添加到购物车按钮添加事件
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productItem = this.closest('.product-item') || this.closest('.waterfall-item');
            const productId = productItem.dataset.id || Math.random().toString(36).substr(2, 9);
            const productName = productItem.querySelector('.product-name').textContent;
            const productPrice = parseFloat(productItem.querySelector('.price').textContent.replace('¥', ''));
            const productImage = productItem.querySelector('.product-image img').src;

            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // 页面加载时更新购物车数量
    updateCartCount();

    // 购物车页面功能
    const cartItemsContainer = document.querySelector('.cart-items');

    if (cartItemsContainer) {
        renderCartItems();
    }

    // 渲染购物车商品
    function renderCartItems() {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 50px; color: #999;">购物车是空的，快去添加商品吧！</p>';
            updateCartSummary();
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
                <button class="cart-item-remove" data-index="${index}">
                    <i class="iconfont icon-close"></i>
                </button>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        // 添加事件监听
        addCartItemEvents();
        updateCartSummary();
    }

    // 添加购物车商品事件
    function addCartItemEvents() {
        const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
        const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
        const removeButtons = document.querySelectorAll('.cart-item-remove');

        decreaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                updateQuantity(index, -1);
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                updateQuantity(index, 1);
            });
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.dataset.index);
                removeItem(index);
            });
        });
    }

    // 更新商品数量
    function updateQuantity(index, change) {
        const cart = getCart();
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            removeItem(index);
            return;
        }

        saveCart(cart);
        renderCartItems();
    }

    // 移除商品
    function removeItem(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCartItems();
    }

    // 更新购物车摘要
    function updateCartSummary() {
        const cart = getCart();
        const summaryContainer = document.querySelector('.cart-summary');

        if (!summaryContainer) return;

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        const totalPriceElement = summaryContainer.querySelector('.total-price');
        if (totalPriceElement) {
            totalPriceElement.textContent = `¥${totalPrice.toFixed(2)}`;
        }
    }

    // 登录表单验证
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;

            if (!username || !password) {
                showNotification('请输入用户名和密码');
                return;
            }

            // 模拟登录
            setTimeout(() => {
                showNotification('登录成功');
                // 重定向到首页
                window.location.href = 'index.html';
            }, 1000);
        });
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        /* 添加菜单图标 */
        .icon-menu::before {
            content: "\e602";
        }
        
        .icon-close::before {
            content: "\e601";
        }
    `;

    document.head.appendChild(style);

    // 平滑滚动
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

    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        if (searchInput) {
            const keyword = searchInput.value.trim();
            if (keyword) {
                // 这里可以添加搜索逻辑
                showNotification(`搜索关键词: ${keyword}`);
            } else {
                showNotification('请输入搜索关键词');
            }
        }
    }

    // 商品分类筛选功能
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productItems = document.querySelectorAll('.product-item');

    if (categoryBtns.length > 0 && productItems.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // 移除所有分类按钮的激活状态
                categoryBtns.forEach(b => b.classList.remove('active'));
                // 添加当前按钮的激活状态
                this.classList.add('active');

                const category = this.dataset.category;

                // 显示/隐藏商品
                productItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });

                // 触发一次滚动事件以加载图片
                setTimeout(() => {
                    lazyLoadImages();
                }, 100);
            });
        });
    }
});