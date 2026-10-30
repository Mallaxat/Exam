const fs = require('fs');
const original = fs.readFileSync('index.html', 'utf8').replace(/^\uFEFF/, '');
const sections = [...original.matchAll(/<section\b[\s\S]*?<\/section>/g)].map(m => m[0]);
const find = key => sections.find(s => s.includes(key)) || '';
const head = original.slice(0, original.indexOf('<main>'));
const foot = original.slice(original.indexOf('<footer>'));
const benefits = original.match(/<div class="benefits">[\s\S]*?<\/div><\/div>/)[0];
const card = original.match(/<article class="productCard">[\s\S]*?<\/article>/)[0]
 .replace('<h3>Тёплые объятия</h3>', '<h3><a href="product.html">Тёплые объятия</a></h3>');
const voids = new Set(['meta','link','img','input','br','hr','source','area','base','embed','param','wbr','col','track']);
function format(html) {
 const tokens = html.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]+>|[^<]+/g) || [];
 let depth = 0;
 return tokens.map(token => {
  const t = token.trim();
  if (!t) return '';
  if (/^<\//.test(t)) depth = Math.max(0, depth - 1);
  const line = '  '.repeat(depth) + t;
  const name = t.match(/^<([a-z][\w-]*)\b/i)?.[1]?.toLowerCase();
  if (name && !voids.has(name) && !t.endsWith('/>')) depth++;
  return line;
 }).filter(Boolean).join('\n') + '\n';
}
function links(html, page) {
 html = html.replaceAll('href="#catalog"','href="catalog.html"')
 .replaceAll('href="#gifts"','href="index.html#gifts"')
 .replaceAll('href="#about"','href="about.html"')
 .replaceAll('href="#delivery"','href="delivery.html"')
 .replaceAll('href="#faqTitle"','href="delivery.html#faqTitle"')
 .replaceAll('href="#heroTitle"','href="#pageTop"');
 html = html.replace('<body>', '<body id="pageTop">');
 html = html.replace('<button type="button" aria-label="Корзина, 0 товаров">♧<span>Корзина · 0</span></button>', '<a href="cart.html" aria-label="Корзина, 0 товаров">♧<span>Корзина · 0</span></a>');
 html = html.replace('<a href="delivery.html">Доставка</a></nav>', '<a href="delivery.html">Доставка</a><a href="contacts.html">Контакты</a></nav>');
 html = html.replace('<a href="delivery.html">Доставка и оплата</a>', '<a href="delivery.html">Доставка и оплата</a><a href="contacts.html">Контакты</a>');
 return html.replace(/<a href="([^"]+)"(?![^>]*aria-current)/g,(m,href) => href === page ? `<a href="${href}" aria-current="page"` : m);
}
function page(file, title, body) {
 let html = head.replace(/<title>.*?<\/title>/, `<title>${title} — Лепесток</title>`)
 .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${title}. Цветочная мастерская Лепесток в Санкт-Петербурге.">`)
 + '<main><div class="container">' + body + '</div></main>' + foot;
 fs.writeFileSync(file, format(links(html, file)));
}
function intro(title, description) {
 return `<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span aria-hidden="true">/</span><span aria-current="page">${title}</span></nav><div class="pageIntro"><span class="eyebrow">ЦВЕТОЧНАЯ МАСТЕРСКАЯ</span><h1>${title}</h1><p>${description}</p></div>`;
}
page('index.html', 'Цветы с нежностью',
 '<div class="deliveryBar"><span>⌖ Санкт-Петербург</span><a href="delivery.html">Условия доставки ↗</a></div>'
 + find('heroTitle') + benefits + find('occasionTitle')
 + `<section class="sectionSpace" aria-labelledby="featuredTitle"><div class="sectionHeading"><h2 id="featuredTitle">Выбор флориста</h2><a href="catalog.html">Весь каталог ↗</a></div><div class="productGrid">${card}</div></section>`
 + find('id="gifts"') + find('reviewsTitle'));
page('catalog.html', 'Каталог букетов', intro('Каталог букетов', 'Выберите цветы, которые скажут всё за вас.')
 + find('id="catalog"').replace(/<article class="productCard">[\s\S]*?<\/article>/, card));
page('about.html', 'О мастерской', intro('О мастерской', 'Красота в простых вещах. Забота в каждой детали.')
 + find('id="about"') + benefits + find('reviewsTitle'));
page('delivery.html', 'Доставка и оплата', intro('Доставка и оплата', 'Бережно доставим ваши чувства по Санкт-Петербургу.')
 + `<section class="infoGrid" aria-label="Условия доставки и оплаты"><article class="infoPanel"><h2>Когда и куда</h2><p>Доставляем по Санкт-Петербургу каждый день с 09:00 до 21:00. Желаемые дату и время вы сможете указать при оформлении заказа.</p><p>Точное время и стоимость доставки будут зависеть от адреса и доступности курьера.</p></article><article class="infoPanel"><h2>Как оплатить</h2><p>В будущем здесь появится оплата заказа банковской картой. Итоговая сумма будет показана до подтверждения заказа.</p><p>Сейчас сайт представлен учебной вёрсткой и не принимает оплату.</p></article></section>
 <section class="sectionSpace" aria-labelledby="mapTitle"><div class="sectionHeading"><div><span class="eyebrow">ВСЕГДА РЯДОМ</span><h2 id="mapTitle">Зона доставки</h2></div></div>
 <!-- Замените src="about:blank" ссылкой для встраивания карты от выбранного сервиса. Затем удалите соседний div.mapPlaceholder. -->
 <div class="mapFrame"><iframe src="about:blank" title="Карта зоны доставки по Санкт-Петербургу" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><div class="mapPlaceholder"><span aria-hidden="true">⌖</span><h3>Здесь будет карта доставки</h3><p>Санкт-Петербург</p></div></div></section>`
 + find('id="delivery"') + find('faqTitle'));
page('contacts.html', 'Контакты', intro('Давайте знакомиться', 'Мы рядом, когда хочется подарить немного тепла.')
 + `<section class="infoGrid" aria-label="Контакты мастерской"><article class="infoPanel"><span class="eyebrow">НАША МАСТЕРСКАЯ</span><h2>Санкт-Петербург</h2><p>Адрес мастерской будет добавлен перед запуском магазина.</p><p>Каждый день · 09:00–21:00</p><a class="textLink" href="delivery.html">Доставка и зона обслуживания ↗</a></article><article class="infoPanel"><span class="eyebrow">НАПИШИТЕ НАМ</span><h2>На связи с вами</h2><p>Телефон, электронная почта и ссылки на социальные сети появятся здесь после подключения настоящих контактов.</p><p>Это учебный проект: вымышленные номера и адреса не используются.</p><a class="textLink" href="about.html">Узнать о мастерской ↗</a></article></section>`);
page('product.html', 'Букет «Тёплые объятия»',
 `<nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="index.html">Главная</a><span>/</span><a href="catalog.html">Каталог</a><span>/</span><span aria-current="page">Тёплые объятия</span></nav>
 <!-- Образец страницы товара: позже содержимое можно получать из базы по ID товара. -->
 <section class="productDetail"><div class="detailImage"><img src="assets/bouquet.svg" alt="Букет розовых цветов в светлой упаковке" width="640" height="680"></div><div class="detailInfo"><span class="eyebrow">АВТОРСКИЙ БУКЕТ</span><h1>Тёплые объятия</h1><p class="stars">★ 4,9 · демонстрационный товар</p><p>Нежный букет в пудровых оттенках для ваших самых искренних слов. Лёгкая упаковка подчёркивает естественную красоту цветов.</p><strong class="detailPrice">3 490 ₽</strong><div class="detailActions"><button class="primaryButton" type="button">В корзину <span>+</span></button><button class="favoriteButton" type="button" aria-label="Добавить в избранное">♡</button></div><a class="textLink" href="delivery.html">О доставке и оплате ↗</a><details open><summary>Состав букета</summary><p>Розовые цветы, декоративная зелень, бумажная упаковка и лента. Демонстрационный состав — уточняется при подключении базы.</p></details><details><summary>Как ухаживать</summary><p>Обновите срез стеблей, поставьте цветы в чистую прохладную воду и меняйте её ежедневно.</p></details></div></section>`);
page('cart.html', 'Корзина', intro('Корзина', 'Почти готово к маленькому празднику.')
 + `<section class="cartLayout" aria-label="Пример заполненной корзины"><div><p class="muted">Пример товара в корзине. Управление количеством будет подключено через JS.</p><article class="cartItem"><a href="product.html"><img src="assets/bouquet.svg" alt="Тёплые объятия" width="120" height="140"></a><div><h2><a href="product.html">Тёплые объятия</a></h2><p>Авторский букет</p><div class="quantityControl"><button type="button" aria-label="Уменьшить количество">−</button><span>1</span><button type="button" aria-label="Увеличить количество">+</button></div></div><div><strong>3 490 ₽</strong><button class="resetButton" type="button">Удалить</button></div></article><a class="textLink" href="catalog.html">← Продолжить выбирать</a></div><aside class="orderSummary"><h2>Ваш заказ</h2><div><span>Букет · 1 шт.</span><span>3 490 ₽</span></div><div><span>Доставка</span><span>По адресу</span></div><div class="orderTotal"><strong>Товары</strong><strong>3 490 ₽</strong></div><p>Стоимость доставки будет рассчитана при оформлении.</p><button class="primaryButton" type="button">Оформить заказ ↗</button><p>Демонстрационная корзина, оформление пока не подключено.</p></aside></section>`);
