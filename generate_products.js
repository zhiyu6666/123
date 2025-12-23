// 生成50个商品的HTML代码
const fs = require('fs');
const path = require('path');

// 商品分类
const categories = [
    { id: 'all', name: '全部' },
    { id: 'fresh', name: '水果生鲜' },
    { id: 'vegetable', name: '蔬菜豆品' },
    { id: 'meat', name: '肉禽蛋品' },
    { id: 'seafood', name: '水产海鲜' },
    { id: 'kitchen', name: '厨房用品' },
    { id: 'home', name: '家居生活' },
    { id: 'clothing', name: '服装配饰' }
];

// 商品名称模板
const productNames = {
    fresh: ['红富士苹果', '新鲜香蕉', '进口葡萄', '草莓', '橙子', '芒果', '猕猴桃', '菠萝', '西瓜', '哈密瓜'],
    vegetable: ['有机青菜', '胡萝卜', '土豆', '西红柿', '黄瓜', '洋葱', '茄子', '青椒', '菠菜', '白菜'],
    meat: ['新鲜猪肉', '牛肉', '羊肉', '鸡肉', '鸭肉', '鸡蛋', '鸭蛋', '鹅蛋', '鹌鹑蛋', '培根'],
    seafood: ['三文鱼', '虾', '螃蟹', '扇贝', '生蚝', '鱿鱼', '章鱼', '带鱼', '黄花鱼', '鳕鱼'],
    kitchen: ['炒锅', '平底锅', '砧板', '刀具', '碗碟套装', '筷子', '勺子', '锅铲', '烤盘', '烘焙工具'],
    home: ['毛巾', '浴巾', '床上四件套', '枕头', '被子', '拖鞋', '牙刷', '牙膏', '洗发水', '沐浴露'],
    clothing: ['T恤', '衬衫', '牛仔裤', '休闲裤', '连衣裙', '外套', '毛衣', '卫衣', '鞋子', '帽子']
};

// 图片资源映射
const imageResources = {
    fresh: ['fresh1.png', 'fresh2.png', 'fresh3.png', 'fresh4.png', 'fresh5.png', 'fresh6.png', 'fresh7.png', 'fresh8.png'],
    vegetable: ['fresh1.png', 'fresh2.png', 'fresh3.png', 'fresh4.png', 'fresh5.png', 'fresh6.png', 'fresh7.png', 'fresh8.png'],
    meat: ['goods1.png', 'goods2.png', 'goods3.png', 'goods4.png', 'hot1.png', 'hot2.png', 'hot3.png', 'hot4.png', 'hot5.png'],
    seafood: ['fresh1.png', 'fresh2.png', 'fresh3.png', 'fresh4.png', 'fresh5.png', 'fresh6.png', 'fresh7.png', 'fresh8.png'],
    kitchen: ['kitchen1.png', 'kitchen2.png', 'kitchen3.png', 'kitchen4.png', 'kitchen5.png', 'kitchen6.png', 'kitchen7.png', 'kitchen8.png'],
    home: ['home1.png', 'home2.png', 'home3.png', 'home4.png', 'home5.png', 'home6.png', 'home7.png', 'home8.png'],
    clothing: ['clothes1.png', 'clothes2.png', 'clothes3.png', 'clothes4.png', 'clothes5.png', 'clothes6.png', 'clothes7.png', 'clothes8.png']
};

// 生成随机价格
function generatePrice() {
    const price = (Math.random() * 99.99 + 5.00).toFixed(2);
    const originalPrice = (parseFloat(price) * 1.2).toFixed(2);
    return { price, originalPrice };
}

// 生成随机评分
function generateRating() {
    const rating = Math.floor(Math.random() * 5) + 1;
    return rating;
}

// 生成单个商品的HTML
function generateProductHTML(id, category, name, image, price, originalPrice, rating) {
    const stars = '<i class="iconfont icon-star-fill"></i>'.repeat(rating) + '<i class="iconfont icon-star"></i>'.repeat(5 - rating);
    return `
                    <!-- 商品${id} -->
                    <div class="product-item" data-category="${category}">
                        <div class="product-image">
                            <img src="uploads/${image}" alt="${name}" class="lazyload" data-src="uploads/${image}">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${name}</h3>
                            <div class="product-price">
                                <span class="price">¥${price}</span>
                                <span class="original-price">¥${originalPrice}</span>
                            </div>
                            <div class="product-rating">
                                ${stars}
                                <span class="rating-count">(${Math.floor(Math.random() * 300) + 50})</span>
                            </div>
                            <button class="add-to-cart">
                                <i class="iconfont icon-cart"></i> 加入购物车
                            </button>
                        </div>
                    </div>`;
}

// 生成所有商品
function generateAllProducts() {
    let productsHTML = '';
    let productCount = 1;
    
    // 为每个分类生成商品
    for (let i = 1; i < categories.length; i++) {
        const category = categories[i];
        const names = productNames[category.id];
        const images = imageResources[category.id];
        
        // 为每个分类生成8-10个商品
        const productsPerCategory = Math.floor(50 / (categories.length - 1)) + (i === categories.length - 1 ? 50 % (categories.length - 1) : 0);
        
        for (let j = 0; j < productsPerCategory; j++) {
            const name = names[j % names.length] + (j >= names.length ? ` ${Math.floor(j / names.length) + 1}` : '');
            const image = images[j % images.length];
            const { price, originalPrice } = generatePrice();
            const rating = generateRating();
            
            productsHTML += generateProductHTML(productCount, category.id, name, image, price, originalPrice, rating);
            productCount++;
        }
    }
    
    return productsHTML;
}

// 读取原始HTML文件
fs.readFile(path.join(__dirname, 'products.html'), 'utf8', (err, data) => {
    if (err) {
        console.error('读取文件失败:', err);
        return;
    }
    
    // 生成商品HTML
    const productsHTML = generateAllProducts();
    
    // 替换商品列表
    const updatedData = data.replace(
        /<!-- 商品1 -->[\s\S]*?<!-- 分页 -->/, 
        productsHTML + '\n                </div>\n            </div>\n        </section>\n\n        <!-- 分页 -->'
    );
    
    // 写入更新后的文件
    fs.writeFile(path.join(__dirname, 'products.html'), updatedData, 'utf8', (err) => {
        if (err) {
            console.error('写入文件失败:', err);
            return;
        }
        console.log('成功生成50个商品!');
    });
});
