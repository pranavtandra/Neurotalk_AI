import React, { useState, useEffect } from 'react';
import './WordLibrary.css';
import EmojiPicker from 'emoji-picker-react';
// import 'emoji-mart/css/emoji-mart.css';

// Translation dictionaries for each word
const wordTranslations = {
  // Basic Needs
  hungry: { en: 'Hungry', es: 'Hambriento', fr: 'Affamé', de: 'Hungrig', it: 'Affamato', pt: 'Faminto', ru: 'Голодный', zh: '饥饿', ja: 'お腹が空いた', ko: '배고픈', ar: 'جائع', hi: 'भूखा' },
  thirsty: { en: 'Thirsty', es: 'Sediento', fr: 'Assoiffé', de: 'Durstig', it: 'Assetato', pt: 'Sede', ru: 'Жаждущий', zh: '口渴', ja: '喉が渇いた', ko: '목마른', ar: 'عطشان', hi: 'प्यासा' },
  tired: { en: 'Tired', es: 'Cansado', fr: 'Fatigué', de: 'Müde', it: 'Stanco', pt: 'Cansado', ru: 'Уставший', zh: '疲倦', ja: '疲れた', ko: '피곤한', ar: 'متعب', hi: 'थका हुआ' },
  bathroom: { en: 'Bathroom', es: 'Baño', fr: 'Salle de bain', de: 'Badezimmer', it: 'Bagno', pt: 'Banheiro', ru: 'Ванная', zh: '浴室', ja: 'お手洗い', ko: '화장실', ar: 'حمام', hi: 'बाथरूम' },
  pain: { en: 'Pain', es: 'Dolor', fr: 'Douleur', de: 'Schmerz', it: 'Dolore', pt: 'Dor', ru: 'Боль', zh: '疼痛', ja: '痛み', ko: '통증', ar: 'ألم', hi: 'दर्द' },
  hot: { en: 'Hot', es: 'Caliente', fr: 'Chaud', de: 'Heiß', it: 'Caldo', pt: 'Quente', ru: 'Горячий', zh: '热', ja: '暑い', ko: '뜨거운', ar: 'حار', hi: 'गरम' },
  cold: { en: 'Cold', es: 'Frío', fr: 'Froid', de: 'Kalt', it: 'Freddo', pt: 'Frio', ru: 'Холодный', zh: '冷', ja: '寒い', ko: '추운', ar: 'بارد', hi: 'ठंडा' },
  sick: { en: 'Sick', es: 'Enfermo', fr: 'Malade', de: 'Krank', it: 'Malato', pt: 'Doente', ru: 'Больной', zh: '生病', ja: '病気', ko: '아픈', ar: 'مريض', hi: 'बीमार' },
  medicine: { en: 'Medicine', es: 'Medicina', fr: 'Médicament', de: 'Medizin', it: 'Medicina', pt: 'Remédio', ru: 'Лекарство', zh: '药物', ja: '薬', ko: '약', ar: 'دواء', hi: 'दवा' },
  help: { en: 'Help', es: 'Ayuda', fr: 'Aide', de: 'Hilfe', it: 'Aiuto', pt: 'Ajuda', ru: 'Помощь', zh: '帮助', ja: '助け', ko: '도움', ar: 'مساعدة', hi: 'मदद' },
  
  // Emotions
  happy: { en: 'Happy', es: 'Feliz', fr: 'Heureux', de: 'Glücklich', it: 'Felice', pt: 'Feliz', ru: 'Счастливый', zh: '快乐', ja: '幸せ', ko: '행복한', ar: 'سعيد', hi: 'खुश' },
  sad: { en: 'Sad', es: 'Triste', fr: 'Triste', de: 'Traurig', it: 'Triste', pt: 'Triste', ru: 'Грустный', zh: '悲伤', ja: '悲しい', ko: '슬픈', ar: 'حزين', hi: 'उदास' },
  angry: { en: 'Angry', es: 'Enojado', fr: 'En colère', de: 'Wütend', it: 'Arrabbiato', pt: 'Bravo', ru: 'Сердитый', zh: '生气', ja: '怒っている', ko: '화난', ar: 'غاضب', hi: 'गुस्सा' },
  scared: { en: 'Scared', es: 'Asustado', fr: 'Effrayé', de: 'Verängstigt', it: 'Spaventato', pt: 'Assustado', ru: 'Испуганный', zh: '害怕', ja: '怖い', ko: '무서운', ar: 'خائف', hi: 'डरा हुआ' },
  excited: { en: 'Excited', es: 'Emocionado', fr: 'Excité', de: 'Aufgeregt', it: 'Eccitato', pt: 'Empolgado', ru: 'Взволнованный', zh: '兴奋', ja: '興奮した', ko: '흥분한', ar: 'متحمس', hi: 'उत्साहित' },
  confused: { en: 'Confused', es: 'Confundido', fr: 'Confus', de: 'Verwirrt', it: 'Confuso', pt: 'Confuso', ru: 'Растерянный', zh: '困惑', ja: '混乱した', ko: '혼란스러운', ar: 'مرتبك', hi: 'उलझन में' },
  surprised: { en: 'Surprised', es: 'Sorprendido', fr: 'Surpris', de: 'Überrascht', it: 'Sorpreso', pt: 'Surpreso', ru: 'Удивленный', zh: '惊讶', ja: '驚いた', ko: '놀란', ar: 'متفاجئ', hi: 'आश्चर्यचकित' },
  worried: { en: 'Worried', es: 'Preocupado', fr: 'Inquiet', de: 'Besorgt', it: 'Preoccupato', pt: 'Preocupado', ru: 'Волнующийся', zh: '担心', ja: '心配', ko: '걱정하는', ar: 'قلق', hi: 'चिंतित' },
  calm: { en: 'Calm', es: 'Tranquilo', fr: 'Calme', de: 'Ruhig', it: 'Calmo', pt: 'Calmo', ru: 'Спокойный', zh: '平静', ja: '落ち着いた', ko: '차분한', ar: 'هادئ', hi: 'शांत' },
  proud: { en: 'Proud', es: 'Orgulloso', fr: 'Fier', de: 'Stolz', it: 'Orgoglioso', pt: 'Orgulhoso', ru: 'Гордый', zh: '骄傲', ja: '誇りに思う', ko: '자랑스러운', ar: 'فخور', hi: 'गर्वित' },
  
  // Activities
  play: { en: 'Play', es: 'Jugar', fr: 'Jouer', de: 'Spielen', it: 'Giocare', pt: 'Brincar', ru: 'Играть', zh: '玩', ja: '遊ぶ', ko: '놀다', ar: 'لعب', hi: 'खेलना' },
  read: { en: 'Read', es: 'Leer', fr: 'Lire', de: 'Lesen', it: 'Leggere', pt: 'Ler', ru: 'Читать', zh: '读', ja: '読む', ko: '읽다', ar: 'قراءة', hi: 'पढ़ना' },
  walk: { en: 'Walk', es: 'Caminar', fr: 'Marcher', de: 'Gehen', it: 'Camminare', pt: 'Andar', ru: 'Ходить', zh: '走', ja: '歩く', ko: '걷다', ar: 'مشي', hi: 'चलना' },
  sleep: { en: 'Sleep', es: 'Dormir', fr: 'Dormir', de: 'Schlafen', it: 'Dormire', pt: 'Dormir', ru: 'Спать', zh: '睡觉', ja: '寝る', ko: '자다', ar: 'نوم', hi: 'सोना' },
  eat: { en: 'Eat', es: 'Comer', fr: 'Manger', de: 'Essen', it: 'Mangiare', pt: 'Comer', ru: 'Есть', zh: '吃', ja: '食べる', ko: '먹다', ar: 'أكل', hi: 'खाना' },
  drink: { en: 'Drink', es: 'Beber', fr: 'Boire', de: 'Trinken', it: 'Bere', pt: 'Beber', ru: 'Пить', zh: '喝', ja: '飲む', ko: '마시다', ar: 'شرب', hi: 'पीना' },
  work: { en: 'Work', es: 'Trabajar', fr: 'Travailler', de: 'Arbeiten', it: 'Lavorare', pt: 'Trabalhar', ru: 'Работать', zh: '工作', ja: '働く', ko: '일하다', ar: 'عمل', hi: 'काम करना' },
  study: { en: 'Study', es: 'Estudiar', fr: 'Étudier', de: 'Studieren', it: 'Studiare', pt: 'Estudar', ru: 'Учиться', zh: '学习', ja: '勉強する', ko: '공부하다', ar: 'دراسة', hi: 'पढ़ाई करना' },
  exercise: { en: 'Exercise', es: 'Ejercitar', fr: 'Faire de l\'exercice', de: 'Sport treiben', it: 'Fare esercizio', pt: 'Exercitar', ru: 'Заниматься спортом', zh: '运动', ja: '運動する', ko: '운동하다', ar: 'تمرين', hi: 'व्यायाम करना' },
  dance: { en: 'Dance', es: 'Bailar', fr: 'Danser', de: 'Tanzen', it: 'Ballare', pt: 'Dançar', ru: 'Танцевать', zh: '跳舞', ja: '踊る', ko: '춤추다', ar: 'رقص', hi: 'नृत्य करना' },
  sing: { en: 'Sing', es: 'Cantar', fr: 'Chanter', de: 'Singen', it: 'Cantare', pt: 'Cantar', ru: 'Петь', zh: '唱歌', ja: '歌う', ko: '노래하다', ar: 'غناء', hi: 'गाना गाना' },
  draw: { en: 'Draw', es: 'Dibujar', fr: 'Dessiner', de: 'Zeichnen', it: 'Disegnare', pt: 'Desenhar', ru: 'Рисовать', zh: '画画', ja: '描く', ko: '그리다', ar: 'رسم', hi: 'चित्र बनाना' },
  
  // People
  mom: { en: 'Mom', es: 'Mamá', fr: 'Maman', de: 'Mama', it: 'Mamma', pt: 'Mãe', ru: 'Мама', zh: '妈妈', ja: 'お母さん', ko: '엄마', ar: 'أم', hi: 'माँ' },
  dad: { en: 'Dad', es: 'Papá', fr: 'Papa', de: 'Papa', it: 'Papà', pt: 'Pai', ru: 'Папа', zh: '爸爸', ja: 'お父さん', ko: '아빠', ar: 'أب', hi: 'पापा' },
  friend: { en: 'Friend', es: 'Amigo', fr: 'Ami', de: 'Freund', it: 'Amico', pt: 'Amigo', ru: 'Друг', zh: '朋友', ja: '友達', ko: '친구', ar: 'صديق', hi: 'दोस्त' },
  teacher: { en: 'Teacher', es: 'Maestro', fr: 'Professeur', de: 'Lehrer', it: 'Insegnante', pt: 'Professor', ru: 'Учитель', zh: '老师', ja: '先生', ko: '선생님', ar: 'معلم', hi: 'शिक्षक' },
  doctor: { en: 'Doctor', es: 'Doctor', fr: 'Docteur', de: 'Arzt', it: 'Dottore', pt: 'Doutor', ru: 'Доктор', zh: '医生', ja: '医者', ko: '의사', ar: 'طبيب', hi: 'डॉक्टर' },
  nurse: { en: 'Nurse', es: 'Enfermera', fr: 'Infirmière', de: 'Krankenschwester', it: 'Infermiera', pt: 'Enfermeira', ru: 'Медсестра', zh: '护士', ja: '看護師', ko: '간호사', ar: 'ممرضة', hi: 'नर्स' },
  sister: { en: 'Sister', es: 'Hermana', fr: 'Sœur', de: 'Schwester', it: 'Sorella', pt: 'Irmã', ru: 'Сестра', zh: '姐妹', ja: '姉妹', ko: '자매', ar: 'أخت', hi: 'बहन' },
  brother: { en: 'Brother', es: 'Hermano', fr: 'Frère', de: 'Bruder', it: 'Fratello', pt: 'Irmão', ru: 'Брат', zh: '兄弟', ja: '兄弟', ko: '형제', ar: 'أخ', hi: 'भाई' },
  grandma: { en: 'Grandma', es: 'Abuela', fr: 'Grand-mère', de: 'Oma', it: 'Nonna', pt: 'Avó', ru: 'Бабушка', zh: '奶奶', ja: 'おばあちゃん', ko: '할머니', ar: 'جدة', hi: 'दादी' },
  grandpa: { en: 'Grandpa', es: 'Abuelo', fr: 'Grand-père', de: 'Opa', it: 'Nonno', pt: 'Avô', ru: 'Дедушка', zh: '爷爷', ja: 'おじいちゃん', ko: '할아버지', ar: 'جد', hi: 'दादा' },
  baby: { en: 'Baby', es: 'Bebé', fr: 'Bébé', de: 'Baby', it: 'Bambino', pt: 'Bebê', ru: 'Малыш', zh: '宝宝', ja: '赤ちゃん', ko: '아기', ar: 'طفل', hi: 'बच्चा' },
  family: { en: 'Family', es: 'Familia', fr: 'Famille', de: 'Familie', it: 'Famiglia', pt: 'Família', ru: 'Семья', zh: '家庭', ja: '家族', ko: '가족', ar: 'عائلة', hi: 'परिवार' },
  
  // Places
  home: { en: 'Home', es: 'Casa', fr: 'Maison', de: 'Zuhause', it: 'Casa', pt: 'Casa', ru: 'Дом', zh: '家', ja: '家', ko: '집', ar: 'منزل', hi: 'घर' },
  school: { en: 'School', es: 'Escuela', fr: 'École', de: 'Schule', it: 'Scuola', pt: 'Escola', ru: 'Школа', zh: '学校', ja: '学校', ko: '학교', ar: 'مدرسة', hi: 'स्कूल' },
  hospital: { en: 'Hospital', es: 'Hospital', fr: 'Hôpital', de: 'Krankenhaus', it: 'Ospedale', pt: 'Hospital', ru: 'Больница', zh: '医院', ja: '病院', ko: '병원', ar: 'مستشفى', hi: 'अस्पताल' },
  park: { en: 'Park', es: 'Parque', fr: 'Parc', de: 'Park', it: 'Parco', pt: 'Parque', ru: 'Парк', zh: '公园', ja: '公園', ko: '공원', ar: 'حديقة', hi: 'पार्क' },
  store: { en: 'Store', es: 'Tienda', fr: 'Magasin', de: 'Geschäft', it: 'Negozio', pt: 'Loja', ru: 'Магазин', zh: '商店', ja: '店', ko: '가게', ar: 'متجر', hi: 'दुकान' },
  restaurant: { en: 'Restaurant', es: 'Restaurante', fr: 'Restaurant', de: 'Restaurant', it: 'Ristorante', pt: 'Restaurante', ru: 'Ресторан', zh: '餐厅', ja: 'レストラン', ko: '레스토랑', ar: 'مطعم', hi: 'रेस्तरां' },
  library: { en: 'Library', es: 'Biblioteca', fr: 'Bibliothèque', de: 'Bibliothek', it: 'Biblioteca', pt: 'Biblioteca', ru: 'Библиотека', zh: '图书馆', ja: '図書館', ko: '도서관', ar: 'مكتبة', hi: 'पुस्तकालय' },
  church: { en: 'Church', es: 'Iglesia', fr: 'Église', de: 'Kirche', it: 'Chiesa', pt: 'Igreja', ru: 'Церковь', zh: '教堂', ja: '教会', ko: '교회', ar: 'كنيسة', hi: 'चर्च' },
  beach: { en: 'Beach', es: 'Playa', fr: 'Plage', de: 'Strand', it: 'Spiaggia', pt: 'Praia', ru: 'Пляж', zh: '海滩', ja: 'ビーチ', ko: '해변', ar: 'شاطئ', hi: 'समुद्र तट' },
  airport: { en: 'Airport', es: 'Aeropuerto', fr: 'Aéroport', de: 'Flughafen', it: 'Aeroporto', pt: 'Aeroporto', ru: 'Аэропорт', zh: '机场', ja: '空港', ko: '공항', ar: 'مطار', hi: 'हवाई अड्डा' },
  bank: { en: 'Bank', es: 'Banco', fr: 'Banque', de: 'Bank', it: 'Banca', pt: 'Banco', ru: 'Банк', zh: '银行', ja: '銀行', ko: '은행', ar: 'بنك', hi: 'बैंक' },
  office: { en: 'Office', es: 'Oficina', fr: 'Bureau', de: 'Büro', it: 'Ufficio', pt: 'Escritório', ru: 'Офис', zh: '办公室', ja: 'オフィス', ko: '사무실', ar: 'مكتب', hi: 'कार्यालय' },
  
  // Time
  now: { en: 'Now', es: 'Ahora', fr: 'Maintenant', de: 'Jetzt', it: 'Ora', pt: 'Agora', ru: 'Сейчас', zh: '现在', ja: '今', ko: '지금', ar: 'الآن', hi: 'अभी' },
  later: { en: 'Later', es: 'Después', fr: 'Plus tard', de: 'Später', it: 'Dopo', pt: 'Depois', ru: 'Позже', zh: '稍后', ja: '後で', ko: '나중에', ar: 'لاحقا', hi: 'बाद में' },
  today: { en: 'Today', es: 'Hoy', fr: 'Aujourd\'hui', de: 'Heute', it: 'Oggi', pt: 'Hoje', ru: 'Сегодня', zh: '今天', ja: '今日', ko: '오늘', ar: 'اليوم', hi: 'आज' },
  tomorrow: { en: 'Tomorrow', es: 'Mañana', fr: 'Demain', de: 'Morgen', it: 'Domani', pt: 'Amanhã', ru: 'Завтра', zh: '明天', ja: '明日', ko: '내일', ar: 'غدا', hi: 'कल' },
  morning: { en: 'Morning', es: 'Mañana', fr: 'Matin', de: 'Morgen', it: 'Mattina', pt: 'Manhã', ru: 'Утро', zh: '早上', ja: '朝', ko: '아침', ar: 'صباح', hi: 'सुबह' },
  night: { en: 'Night', es: 'Noche', fr: 'Nuit', de: 'Nacht', it: 'Notte', pt: 'Noite', ru: 'Ночь', zh: '晚上', ja: '夜', ko: '밤', ar: 'ليل', hi: 'रात' },
  afternoon: { en: 'Afternoon', es: 'Tarde', fr: 'Après-midi', de: 'Nachmittag', it: 'Pomeriggio', pt: 'Tarde', ru: 'День', zh: '下午', ja: '午後', ko: '오후', ar: 'بعد الظهر', hi: 'दोपहर' },
  evening: { en: 'Evening', es: 'Noche', fr: 'Soir', de: 'Abend', it: 'Sera', pt: 'Noite', ru: 'Вечер', zh: '傍晚', ja: '夕方', ko: '저녁', ar: 'مساء', hi: 'शाम' },
  yesterday: { en: 'Yesterday', es: 'Ayer', fr: 'Hier', de: 'Gestern', it: 'Ieri', pt: 'Ontem', ru: 'Вчера', zh: '昨天', ja: '昨日', ko: '어제', ar: 'أمس', hi: 'कल' },
  week: { en: 'Week', es: 'Semana', fr: 'Semaine', de: 'Woche', it: 'Settimana', pt: 'Semana', ru: 'Неделя', zh: '星期', ja: '週', ko: '주', ar: 'أسبوع', hi: 'सप्ताह' },
  month: { en: 'Month', es: 'Mes', fr: 'Mois', de: 'Monat', it: 'Mese', pt: 'Mês', ru: 'Месяц', zh: '月', ja: '月', ko: '월', ar: 'شهر', hi: 'महीना' },
  year: { en: 'Year', es: 'Año', fr: 'Année', de: 'Jahr', it: 'Anno', pt: 'Ano', ru: 'Год', zh: '年', ja: '年', ko: '년', ar: 'سنة', hi: 'साल' },
  
  // Food & Drinks
  bread: { en: 'Bread', es: 'Pan', fr: 'Pain', de: 'Brot', it: 'Pane', pt: 'Pão', ru: 'Хлеб', zh: '面包', ja: 'パン', ko: '빵', ar: 'خبز', hi: 'रोटी' },
  water: { en: 'Water', es: 'Agua', fr: 'Eau', de: 'Wasser', it: 'Acqua', pt: 'Água', ru: 'Вода', zh: '水', ja: '水', ko: '물', ar: 'ماء', hi: 'पानी' },
  milk: { en: 'Milk', es: 'Leche', fr: 'Lait', de: 'Milch', it: 'Latte', pt: 'Leite', ru: 'Молоко', zh: '牛奶', ja: '牛乳', ko: '우유', ar: 'حليب', hi: 'दूध' },
  apple: { en: 'Apple', es: 'Manzana', fr: 'Pomme', de: 'Apfel', it: 'Mela', pt: 'Maçã', ru: 'Яблоко', zh: '苹果', ja: 'りんご', ko: '사과', ar: 'تفاح', hi: 'सेब' },
  banana: { en: 'Banana', es: 'Plátano', fr: 'Banane', de: 'Banane', it: 'Banana', pt: 'Banana', ru: 'Банан', zh: '香蕉', ja: 'バナナ', ko: '바나나', ar: 'موز', hi: 'केला' },
  rice: { en: 'Rice', es: 'Arroz', fr: 'Riz', de: 'Reis', it: 'Riso', pt: 'Arroz', ru: 'Рис', zh: '米饭', ja: 'ご飯', ko: '밥', ar: 'أرز', hi: 'चावल' },
  meat: { en: 'Meat', es: 'Carne', fr: 'Viande', de: 'Fleisch', it: 'Carne', pt: 'Carne', ru: 'Мясо', zh: '肉', ja: '肉', ko: '고기', ar: 'لحم', hi: 'मांस' },
  fish: { en: 'Fish', es: 'Pescado', fr: 'Poisson', de: 'Fisch', it: 'Pesce', pt: 'Peixe', ru: 'Рыба', zh: '鱼', ja: '魚', ko: '생선', ar: 'سمك', hi: 'मछली' },
  egg: { en: 'Egg', es: 'Huevo', fr: 'Œuf', de: 'Ei', it: 'Uovo', pt: 'Ovo', ru: 'Яйцо', zh: '鸡蛋', ja: '卵', ko: '계란', ar: 'بيض', hi: 'अंडा' },
  cheese: { en: 'Cheese', es: 'Queso', fr: 'Fromage', de: 'Käse', it: 'Formaggio', pt: 'Queijo', ru: 'Сыр', zh: '奶酪', ja: 'チーズ', ko: '치즈', ar: 'جبن', hi: 'पनीर' },
  coffee: { en: 'Coffee', es: 'Café', fr: 'Café', de: 'Kaffee', it: 'Caffè', pt: 'Café', ru: 'Кофе', zh: '咖啡', ja: 'コーヒー', ko: '커피', ar: 'قهوة', hi: 'कॉफी' },
  tea: { en: 'Tea', es: 'Té', fr: 'Thé', de: 'Tee', it: 'Tè', pt: 'Chá', ru: 'Чай', zh: '茶', ja: 'お茶', ko: '차', ar: 'شاي', hi: 'चाय' },
  juice: { en: 'Juice', es: 'Jugo', fr: 'Jus', de: 'Saft', it: 'Succo', pt: 'Suco', ru: 'Сок', zh: '果汁', ja: 'ジュース', ko: '주스', ar: 'عصير', hi: 'रस' },
  
  // Animals
  dog: { en: 'Dog', es: 'Perro', fr: 'Chien', de: 'Hund', it: 'Cane', pt: 'Cachorro', ru: 'Собака', zh: '狗', ja: '犬', ko: '개', ar: 'كلب', hi: 'कुत्ता' },
  cat: { en: 'Cat', es: 'Gato', fr: 'Chat', de: 'Katze', it: 'Gatto', pt: 'Gato', ru: 'Кошка', zh: '猫', ja: '猫', ko: '고양이', ar: 'قط', hi: 'बिल्ली' },
  bird: { en: 'Bird', es: 'Pájaro', fr: 'Oiseau', de: 'Vogel', it: 'Uccello', pt: 'Pássaro', ru: 'Птица', zh: '鸟', ja: '鳥', ko: '새', ar: 'طائر', hi: 'पक्षी' },
  fish: { en: 'Fish', es: 'Pez', fr: 'Poisson', de: 'Fisch', it: 'Pesce', pt: 'Peixe', ru: 'Рыба', zh: '鱼', ja: '魚', ko: '물고기', ar: 'سمك', hi: 'मछली' },
  horse: { en: 'Horse', es: 'Caballo', fr: 'Cheval', de: 'Pferd', it: 'Cavallo', pt: 'Cavalo', ru: 'Лошадь', zh: '马', ja: '馬', ko: '말', ar: 'حصان', hi: 'घोड़ा' },
  cow: { en: 'Cow', es: 'Vaca', fr: 'Vache', de: 'Kuh', it: 'Mucca', pt: 'Vaca', ru: 'Корова', zh: '牛', ja: '牛', ko: '소', ar: 'بقرة', hi: 'गाय' },
  pig: { en: 'Pig', es: 'Cerdo', fr: 'Cochon', de: 'Schwein', it: 'Maiale', pt: 'Porco', ru: 'Свинья', zh: '猪', ja: '豚', ko: '돼지', ar: 'خنزير', hi: 'सूअर' },
  chicken: { en: 'Chicken', es: 'Pollo', fr: 'Poulet', de: 'Huhn', it: 'Pollo', pt: 'Frango', ru: 'Курица', zh: '鸡', ja: '鶏', ko: '닭', ar: 'دجاج', hi: 'मुर्गी' },
  rabbit: { en: 'Rabbit', es: 'Conejo', fr: 'Lapin', de: 'Hase', it: 'Coniglio', pt: 'Coelho', ru: 'Кролик', zh: '兔子', ja: 'うさぎ', ko: '토끼', ar: 'أرنب', hi: 'खरगोश' },
  elephant: { en: 'Elephant', es: 'Elefante', fr: 'Éléphant', de: 'Elefant', it: 'Elefante', pt: 'Elefante', ru: 'Слон', zh: '大象', ja: '象', ko: '코끼리', ar: 'فيل', hi: 'हाथी' },
  
  // Colors
  red: { en: 'Red', es: 'Rojo', fr: 'Rouge', de: 'Rot', it: 'Rosso', pt: 'Vermelho', ru: 'Красный', zh: '红色', ja: '赤', ko: '빨간', ar: 'أحمر', hi: 'लाल' },
  blue: { en: 'Blue', es: 'Azul', fr: 'Bleu', de: 'Blau', it: 'Blu', pt: 'Azul', ru: 'Синий', zh: '蓝色', ja: '青', ko: '파란', ar: 'أزرق', hi: 'नीला' },
  green: { en: 'Green', es: 'Verde', fr: 'Vert', de: 'Grün', it: 'Verde', pt: 'Verde', ru: 'Зеленый', zh: '绿色', ja: '緑', ko: '초록', ar: 'أخضر', hi: 'हरा' },
  yellow: { en: 'Yellow', es: 'Amarillo', fr: 'Jaune', de: 'Gelb', it: 'Giallo', pt: 'Amarelo', ru: 'Желтый', zh: '黄色', ja: '黄色', ko: '노란', ar: 'أصفر', hi: 'पीला' },
  black: { en: 'Black', es: 'Negro', fr: 'Noir', de: 'Schwarz', it: 'Nero', pt: 'Preto', ru: 'Черный', zh: '黑色', ja: '黒', ko: '검은', ar: 'أسود', hi: 'काला' },
  white: { en: 'White', es: 'Blanco', fr: 'Blanc', de: 'Weiß', it: 'Bianco', pt: 'Branco', ru: 'Белый', zh: '白色', ja: '白', ko: '흰', ar: 'أبيض', hi: 'सफेद' },
  purple: { en: 'Purple', es: 'Morado', fr: 'Violet', de: 'Lila', it: 'Viola', pt: 'Roxo', ru: 'Фиолетовый', zh: '紫色', ja: '紫', ko: '보라', ar: 'بنفسجي', hi: 'बैंगनी' },
  orange: { en: 'Orange', es: 'Naranja', fr: 'Orange', de: 'Orange', it: 'Arancione', pt: 'Laranja', ru: 'Оранжевый', zh: '橙色', ja: 'オレンジ', ko: '주황', ar: 'برتقالي', hi: 'नारंगी' },
  pink: { en: 'Pink', es: 'Rosa', fr: 'Rose', de: 'Rosa', it: 'Rosa', pt: 'Rosa', ru: 'Розовый', zh: '粉色', ja: 'ピンク', ko: '분홍', ar: 'وردي', hi: 'गुलाबी' },
  brown: { en: 'Brown', es: 'Marrón', fr: 'Marron', de: 'Braun', it: 'Marrone', pt: 'Marrom', ru: 'Коричневый', zh: '棕色', ja: '茶色', ko: '갈색', ar: 'بني', hi: 'भूरा' },
  
  // Weather
  sunny: { en: 'Sunny', es: 'Soleado', fr: 'Ensoleillé', de: 'Sonnig', it: 'Soleggiato', pt: 'Ensolarado', ru: 'Солнечно', zh: '晴天', ja: '晴れ', ko: '맑은', ar: 'مشمس', hi: 'धूप' },
  rainy: { en: 'Rainy', es: 'Lluvioso', fr: 'Pluvieux', de: 'Regnerisch', it: 'Piovoso', pt: 'Chuvoso', ru: 'Дождливо', zh: '下雨', ja: '雨', ko: '비오는', ar: 'ممطر', hi: 'बारिश' },
  cloudy: { en: 'Cloudy', es: 'Nublado', fr: 'Nuageux', de: 'Bewölkt', it: 'Nuvoloso', pt: 'Nublado', ru: 'Облачно', zh: '多云', ja: '曇り', ko: '흐린', ar: 'غائم', hi: 'बादल' },
  windy: { en: 'Windy', es: 'Ventoso', fr: 'Venteux', de: 'Windig', it: 'Ventoso', pt: 'Ventoso', ru: 'Ветрено', zh: '有风', ja: '風', ko: '바람', ar: 'عاصف', hi: 'हवा' },
  snow: { en: 'Snow', es: 'Nieve', fr: 'Neige', de: 'Schnee', it: 'Neve', pt: 'Neve', ru: 'Снег', zh: '雪', ja: '雪', ko: '눈', ar: 'ثلج', hi: 'बर्फ' },
  
  // Transportation
  car: { en: 'Car', es: 'Coche', fr: 'Voiture', de: 'Auto', it: 'Macchina', pt: 'Carro', ru: 'Машина', zh: '汽车', ja: '車', ko: '자동차', ar: 'سيارة', hi: 'कार' },
  bus: { en: 'Bus', es: 'Autobús', fr: 'Bus', de: 'Bus', it: 'Autobus', pt: 'Ônibus', ru: 'Автобус', zh: '公交车', ja: 'バス', ko: '버스', ar: 'حافلة', hi: 'बस' },
  train: { en: 'Train', es: 'Tren', fr: 'Train', de: 'Zug', it: 'Treno', pt: 'Trem', ru: 'Поезд', zh: '火车', ja: '電車', ko: '기차', ar: 'قطار', hi: 'ट्रेन' },
  bike: { en: 'Bike', es: 'Bicicleta', fr: 'Vélo', de: 'Fahrrad', it: 'Bicicletta', pt: 'Bicicleta', ru: 'Велосипед', zh: '自行车', ja: '自転車', ko: '자전거', ar: 'دراجة', hi: 'साइकिल' },
  plane: { en: 'Plane', es: 'Avión', fr: 'Avion', de: 'Flugzeug', it: 'Aereo', pt: 'Avião', ru: 'Самолет', zh: '飞机', ja: '飛行機', ko: '비행기', ar: 'طائرة', hi: 'हवाई जहाज' },
  boat: { en: 'Boat', es: 'Barco', fr: 'Bateau', de: 'Boot', it: 'Barca', pt: 'Barco', ru: 'Лодка', zh: '船', ja: 'ボート', ko: '배', ar: 'قارب', hi: 'नाव' },
  
  // Body Parts
  head: { en: 'Head', es: 'Cabeza', fr: 'Tête', de: 'Kopf', it: 'Testa', pt: 'Cabeça', ru: 'Голова', zh: '头', ja: '頭', ko: '머리', ar: 'رأس', hi: 'सिर' },
  hand: { en: 'Hand', es: 'Mano', fr: 'Main', de: 'Hand', it: 'Mano', pt: 'Mão', ru: 'Рука', zh: '手', ja: '手', ko: '손', ar: 'يد', hi: 'हाथ' },
  foot: { en: 'Foot', es: 'Pie', fr: 'Pied', de: 'Fuß', it: 'Piede', pt: 'Pé', ru: 'Нога', zh: '脚', ja: '足', ko: '발', ar: 'قدم', hi: 'पैर' },
  eye: { en: 'Eye', es: 'Ojo', fr: 'Œil', de: 'Auge', it: 'Occhio', pt: 'Olho', ru: 'Глаз', zh: '眼睛', ja: '目', ko: '눈', ar: 'عين', hi: 'आंख' },
  ear: { en: 'Ear', es: 'Oreja', fr: 'Oreille', de: 'Ohr', it: 'Orecchio', pt: 'Orelha', ru: 'Ухо', zh: '耳朵', ja: '耳', ko: '귀', ar: 'أذن', hi: 'कान' },
  nose: { en: 'Nose', es: 'Nariz', fr: 'Nez', de: 'Nase', it: 'Naso', pt: 'Nariz', ru: 'Нос', zh: '鼻子', ja: '鼻', ko: '코', ar: 'أنف', hi: 'नाक' },
  mouth: { en: 'Mouth', es: 'Boca', fr: 'Bouche', de: 'Mund', it: 'Bocca', pt: 'Boca', ru: 'Рот', zh: '嘴', ja: '口', ko: '입', ar: 'فم', hi: 'मुंह' },
  arm: { en: 'Arm', es: 'Brazo', fr: 'Bras', de: 'Arm', it: 'Braccio', pt: 'Braço', ru: 'Рука', zh: '胳膊', ja: '腕', ko: '팔', ar: 'ذراع', hi: 'बांह' },
  leg: { en: 'Leg', es: 'Pierna', fr: 'Jambe', de: 'Bein', it: 'Gamba', pt: 'Perna', ru: 'Нога', zh: '腿', ja: '脚', ko: '다리', ar: 'ساق', hi: 'पैर' },
  heart: { en: 'Heart', es: 'Corazón', fr: 'Cœur', de: 'Herz', it: 'Cuore', pt: 'Coração', ru: 'Сердце', zh: '心脏', ja: '心臓', ko: '심장', ar: 'قلب', hi: 'दिल' },
  
  // Navigation
  words: { en: 'words', es: 'palabras', fr: 'mots', de: 'Wörter', it: 'parole', pt: 'palavras', ru: 'слов', zh: '词', ja: '単語', ko: '단어', ar: 'كلمات', hi: 'शब्द' },
  back: { en: 'Back', es: 'Atrás', fr: 'Retour', de: 'Zurück', it: 'Indietro', pt: 'Voltar', ru: 'Назад', zh: '返回', ja: '戻る', ko: '뒤로', ar: 'رجوع', hi: 'वापस' },
  
  // Custom Features
  addCustomCategory: { en: 'Add Custom Category', es: 'Agregar Categoría Personalizada', fr: 'Ajouter une Catégorie Personnalisée', de: 'Benutzerdefinierte Kategorie Hinzufügen', it: 'Aggiungi Categoria Personalizzata', pt: 'Adicionar Categoria Personalizada', ru: 'Добавить Пользовательскую Категорию', zh: '添加自定义类别', ja: 'カスタムカテゴリを追加', ko: '사용자 정의 카테고리 추가', ar: 'إضافة فئة مخصصة', hi: 'कस्टम श्रेणी जोड़ें' },
  createCustom: { en: 'Create Custom', es: 'Crear Personalizado', fr: 'Créer Personnalisé', de: 'Benutzerdefiniert Erstellen', it: 'Crea Personalizzato', pt: 'Criar Personalizado', ru: 'Создать Пользовательское', zh: '创建自定义', ja: 'カスタム作成', ko: '사용자 정의 만들기', ar: 'إنشاء مخصص', hi: 'कस्टम बनाएं' },
  newCategory: { en: 'New Category', es: 'Nueva Categoría', fr: 'Nouvelle Catégorie', de: 'Neue Kategorie', it: 'Nuova Categoria', pt: 'Nova Categoria', ru: 'Новая Категория', zh: '新类别', ja: '新しいカテゴリ', ko: '새 카테고리', ar: 'فئة جديدة', hi: 'नई श्रेणी' },
  newWord: { en: 'New Word', es: 'Nueva Palabra', fr: 'Nouveau Mot', de: 'Neues Wort', it: 'Nuova Parola', pt: 'Nova Palavra', ru: 'Новое Слово', zh: '新词', ja: '新しい単語', ko: '새 단어', ar: 'كلمة جديدة', hi: 'नया शब्द' },
  categoryEmoji: { en: 'Category Emoji', es: 'Emoji de Categoría', fr: 'Emoji de Catégorie', de: 'Kategorie-Emoji', it: 'Emoji Categoria', pt: 'Emoji da Categoria', ru: 'Эмодзи Категории', zh: '类别表情', ja: 'カテゴリ絵文字', ko: '카테고리 이모지', ar: 'رمز تعبيري للفئة', hi: 'श्रेणी इमोजी' },
  categoryName: { en: 'Category Name', es: 'Nombre de Categoría', fr: 'Nom de Catégorie', de: 'Kategoriename', it: 'Nome Categoria', pt: 'Nome da Categoria', ru: 'Название Категории', zh: '类别名称', ja: 'カテゴリ名', ko: '카테고리 이름', ar: 'اسم الفئة', hi: 'श्रेणी का नाम' },
  enterCategoryName: { en: 'Enter category name', es: 'Ingrese nombre de categoría', fr: 'Entrez le nom de la catégorie', de: 'Kategoriename eingeben', it: 'Inserisci nome categoria', pt: 'Digite o nome da categoria', ru: 'Введите название категории', zh: '输入类别名称', ja: 'カテゴリ名を入力', ko: '카테고리 이름 입력', ar: 'أدخل اسم الفئة', hi: 'श्रेणी का नाम दर्ज करें' },
  wordEmoji: { en: 'Word Emoji', es: 'Emoji de Palabra', fr: 'Emoji de Mot', de: 'Wort-Emoji', it: 'Emoji Parola', pt: 'Emoji da Palavra', ru: 'Эмодзи Слова', zh: '词表情', ja: '単語絵文字', ko: '단어 이모지', ar: 'رمز تعبيري للكلمة', hi: 'शब्द इमोजी' },
  wordText: { en: 'Word Text', es: 'Texto de Palabra', fr: 'Texte du Mot', de: 'Worttext', it: 'Testo Parola', pt: 'Texto da Palavra', ru: 'Текст Слова', zh: '词文本', ja: '単語テキスト', ko: '단어 텍스트', ar: 'نص الكلمة', hi: 'शब्द पाठ' },
  enterWord: { en: 'Enter word', es: 'Ingrese palabra', fr: 'Entrez le mot', de: 'Wort eingeben', it: 'Inserisci parola', pt: 'Digite a palavra', ru: 'Введите слово', zh: '输入词', ja: '単語を入力', ko: '단어 입력', ar: 'أدخل الكلمة', hi: 'शब्द दर्ज करें' },
  selectCategory: { en: 'Select Category', es: 'Seleccionar Categoría', fr: 'Sélectionner Catégorie', de: 'Kategorie Auswählen', it: 'Seleziona Categoria', pt: 'Selecionar Categoria', ru: 'Выбрать Категорию', zh: '选择类别', ja: 'カテゴリを選択', ko: '카테고리 선택', ar: 'اختر الفئة', hi: 'श्रेणी चुनें' },
  chooseCategory: { en: 'Choose a category', es: 'Elija una categoría', fr: 'Choisissez une catégorie', de: 'Kategorie wählen', it: 'Scegli una categoria', pt: 'Escolha uma categoria', ru: 'Выберите категорию', zh: '选择一个类别', ja: 'カテゴリを選択してください', ko: '카테고리를 선택하세요', ar: 'اختر فئة', hi: 'एक श्रेणी चुनें' },
  save: { en: 'Save', es: 'Guardar', fr: 'Enregistrer', de: 'Speichern', it: 'Salva', pt: 'Salvar', ru: 'Сохранить', zh: '保存', ja: '保存', ko: '저장', ar: 'حفظ', hi: 'सहेजें' },
  cancel: { en: 'Cancel', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', it: 'Annulla', pt: 'Cancelar', ru: 'Отмена', zh: '取消', ja: 'キャンセル', ko: '취소', ar: 'إلغاء', hi: 'रद्द करें' },
  addWord: { en: 'Add Word', es: 'Agregar Palabra', fr: 'Ajouter un Mot', de: 'Wort Hinzufügen', it: 'Aggiungi Parola', pt: 'Adicionar Palavra', ru: 'Добавить Слово', zh: '添加词', ja: '単語を追加', ko: '단어 추가', ar: 'إضافة كلمة', hi: 'शब्द जोड़ें' }
};

// Category name translations
const categoryTranslations = {
  basicNeeds: { en: 'Basic Needs', es: 'Necesidades Básicas', fr: 'Besoins de Base', de: 'Grundbedürfnisse', it: 'Bisogni di Base', pt: 'Necessidades Básicas', ru: 'Основные потребности', zh: '基本需求', ja: '基本的なニーズ', ko: '기본 욕구', ar: 'الاحتياجات الأساسية', hi: 'बुनियादी जरूरतें' },
  emotions: { en: 'Emotions', es: 'Emociones', fr: 'Émotions', de: 'Emotionen', it: 'Emozioni', pt: 'Emoções', ru: 'Эмоции', zh: '情感', ja: '感情', ko: '감정', ar: 'المشاعر', hi: 'भावनाएं' },
  activities: { en: 'Activities', es: 'Actividades', fr: 'Activités', de: 'Aktivitäten', it: 'Attività', pt: 'Atividades', ru: 'Деятельность', zh: '活动', ja: '活動', ko: '활동', ar: 'الأنشطة', hi: 'गतिविधियां' },
  people: { en: 'People', es: 'Personas', fr: 'Personnes', de: 'Personen', it: 'Persone', pt: 'Pessoas', ru: 'Люди', zh: '人物', ja: '人々', ko: '사람들', ar: 'الناس', hi: 'लोग' },
  places: { en: 'Places', es: 'Lugares', fr: 'Lieux', de: 'Orte', it: 'Luoghi', pt: 'Lugares', ru: 'Места', zh: '地方', ja: '場所', ko: '장소', ar: 'الأماكن', hi: 'स्थान' },
  time: { en: 'Time', es: 'Tiempo', fr: 'Temps', de: 'Zeit', it: 'Tempo', pt: 'Tempo', ru: 'Время', zh: '时间', ja: '時間', ko: '시간', ar: 'الوقت', hi: 'समय' },
  foodAndDrinks: { en: 'Food & Drinks', es: 'Comida y Bebidas', fr: 'Nourriture et Boissons', de: 'Essen und Getränke', it: 'Cibo e Bevande', pt: 'Comida e Bebidas', ru: 'Еда и напитки', zh: '食物和饮料', ja: '食べ物と飲み物', ko: '음식과 음료', ar: 'الطعام والشراب', hi: 'भोजन और पेय' },
  animals: { en: 'Animals', es: 'Animales', fr: 'Animaux', de: 'Tiere', it: 'Animali', pt: 'Animais', ru: 'Животные', zh: '动物', ja: '動物', ko: '동물', ar: 'الحيوانات', hi: 'जानवर' },
  colors: { en: 'Colors', es: 'Colores', fr: 'Couleurs', de: 'Farben', it: 'Colori', pt: 'Cores', ru: 'Цвета', zh: '颜色', ja: '色', ko: '색상', ar: 'الألوان', hi: 'रंग' },
  weather: { en: 'Weather', es: 'Clima', fr: 'Météo', de: 'Wetter', it: 'Meteo', pt: 'Clima', ru: 'Погода', zh: '天气', ja: '天気', ko: '날씨', ar: 'الطقس', hi: 'मौसम' },
  transportation: { en: 'Transportation', es: 'Transporte', fr: 'Transport', de: 'Transport', it: 'Trasporto', pt: 'Transporte', ru: 'Транспорт', zh: '交通', ja: '交通', ko: '교통', ar: 'النقل', hi: 'परिवहन' },
  bodyParts: { en: 'Body Parts', es: 'Partes del Cuerpo', fr: 'Parties du Corps', de: 'Körperteile', it: 'Parti del Corpo', pt: 'Partes do Corpo', ru: 'Части тела', zh: '身体部位', ja: '体の部分', ko: '신체 부위', ar: 'أجزاء الجسم', hi: 'शरीर के अंग' }
};

// UI text translations
export const uiTranslations = {
  selectWords: { en: 'Select Words', es: 'Seleccionar Palabras', fr: 'Sélectionner des Mots', de: 'Wörter Auswählen', it: 'Seleziona Parole', pt: 'Selecionar Palavras', ru: 'Выбрать Слова', zh: '选择词语', ja: '言葉を選択', ko: '단어 선택', ar: 'اختر الكلمات', hi: 'शब्द चुनें' },
  selectedWords: { en: 'Selected:', es: 'Seleccionado:', fr: 'Sélectionné:', de: 'Ausgewählt:', it: 'Selezionato:', pt: 'Selecionado:', ru: 'Выбрано:', zh: '已选择:', ja: '選択済み:', ko: '선택됨:', ar: 'المحدد:', hi: 'चयनित:' },
  clearAll: { en: 'Clear All', es: 'Limpiar Todo', fr: 'Tout Effacer', de: 'Alles Löschen', it: 'Cancella Tutto', pt: 'Limpar Tudo', ru: 'Очистить Все', zh: '清除全部', ja: 'すべてクリア', ko: '모두 지우기', ar: 'مسح الكل', hi: 'सभी साफ़ करें' },
  interpretedMessage: { en: 'Interpreted Message:', es: 'Mensaje Interpretado:', fr: 'Message Interprété:', de: 'Interpretierte Nachricht:', it: 'Messaggio Interpretato:', pt: 'Mensagem Interpretada:', ru: 'Интерпретированное Сообщение:', zh: '解释的消息:', ja: '解釈されたメッセージ:', ko: '해석된 메시지:', ar: 'الرسالة المفسرة:', hi: 'व्याख्या किया गया संदेश:' },
  interpretSelection: { en: 'Interpret Selection', es: 'Interpretar Selección', fr: 'Interpréter la Sélection', de: 'Auswahl Interpretieren', it: 'Interpreta Selezione', pt: 'Interpretar Seleção', ru: 'Интерпретировать Выбор', zh: '解释选择', ja: '選択を解釈', ko: '선택 해석', ar: 'تفسير الاختيار', hi: 'चयन की व्याख्या करें' },
  processing: { en: 'Processing...', es: 'Procesando...', fr: 'Traitement...', de: 'Verarbeitung...', it: 'Elaborazione...', pt: 'Processando...', ru: 'Обработка...', zh: '处理中...', ja: '処理中...', ko: '처리 중...', ar: 'معالجة...', hi: 'प्रसंस्करण...' },
  generateImage: { en: 'Generate Image', es: 'Generar Imagen', fr: 'Générer une Image', de: 'Bild Generieren', it: 'Genera Immagine', pt: 'Gerar Imagem', ru: 'Создать Изображение', zh: '生成图片', ja: '画像を生成', ko: '이미지 생성', ar: 'إنشاء صورة', hi: 'छवि उत्पन्न करें' },
  showVisualAid: { en: 'Show Visual Aid Description', es: 'Mostrar Descripción de Ayuda Visual', fr: 'Afficher la Description d\'Aide Visuelle', de: 'Visuelle Hilfe Beschreibung Anzeigen', it: 'Mostra Descrizione Aiuto Visivo', pt: 'Mostrar Descrição de Ajuda Visual', ru: 'Показать Описание Визуальной Помощи', zh: '显示视觉辅助描述', ja: '視覚的支援の説明を表示', ko: '시각적 도움 설명 표시', ar: 'إظهار وصف المساعدة البصرية', hi: 'दृश्य सहायता विवरण दिखाएं' },
  generatedVisualAid: { en: 'Generated visual aid', es: 'Ayuda visual generada', fr: 'Aide visuelle générée', de: 'Generierte visuelle Hilfe', it: 'Aiuto visivo generato', pt: 'Ajuda visual gerada', ru: 'Созданная визуальная помощь', zh: '生成的视觉辅助', ja: '生成された視覚的支援', ko: '생성된 시각적 도움', ar: 'المساعدة البصرية المولدة', hi: 'उत्पन्न दृश्य सहायता' },
  visualAid: { en: 'Visual Aid:', es: 'Ayuda Visual:', fr: 'Aide Visuelle:', de: 'Visuelle Hilfe:', it: 'Aiuto Visivo:', pt: 'Ajuda Visual:', ru: 'Визуальная Помощь:', zh: '视觉辅助:', ja: '視覚的支援:', ko: '시각적 도움:', ar: 'المساعدة البصرية:', hi: 'दृश्य सहायता:' },
  generatingImage: { en: 'Generating image...', es: 'Generando imagen...', fr: 'Génération d\'image...', de: 'Bild wird generiert...', it: 'Generazione immagine...', pt: 'Gerando imagem...', ru: 'Создание изображения...', zh: '生成图片中...', ja: '画像を生成中...', ko: '이미지 생성 중...', ar: 'إنشاء صورة...', hi: 'छवि उत्पन्न कर रहा है...' }
};

export const wordCategories = {
  basicNeeds: {
    name: 'Basic Needs',
    words: [
      { id: 'hungry', text: 'Hungry', symbol: '🍽️' },
      { id: 'thirsty', text: 'Thirsty', symbol: '🥤' },
      { id: 'tired', text: 'Tired', symbol: '😴' },
      { id: 'bathroom', text: 'Bathroom', symbol: '🚽' },
      { id: 'pain', text: 'Pain', symbol: '🤕' },
      { id: 'hot', text: 'Hot', symbol: '🔥' },
      { id: 'cold', text: 'Cold', symbol: '❄️' },
      { id: 'sick', text: 'Sick', symbol: '🤒' },
      { id: 'medicine', text: 'Medicine', symbol: '💊' },
      { id: 'help', text: 'Help', symbol: '🆘' },
    ]
  },
  emotions: {
    name: 'Emotions',
    words: [
      { id: 'happy', text: 'Happy', symbol: '😊' },
      { id: 'sad', text: 'Sad', symbol: '😢' },
      { id: 'angry', text: 'Angry', symbol: '😠' },
      { id: 'scared', text: 'Scared', symbol: '😨' },
      { id: 'excited', text: 'Excited', symbol: '🤩' },
      { id: 'confused', text: 'Confused', symbol: '😕' },
      { id: 'surprised', text: 'Surprised', symbol: '😲' },
      { id: 'worried', text: 'Worried', symbol: '😟' },
      { id: 'calm', text: 'Calm', symbol: '😌' },
      { id: 'proud', text: 'Proud', symbol: '😎' },
    ]
  },
  activities: {
    name: 'Activities',
    words: [
      { id: 'play', text: 'Play', symbol: '🎮' },
      { id: 'read', text: 'Read', symbol: '📚' },
      { id: 'walk', text: 'Walk', symbol: '🚶' },
      { id: 'sleep', text: 'Sleep', symbol: '💤' },
      { id: 'eat', text: 'Eat', symbol: '🍴' },
      { id: 'drink', text: 'Drink', symbol: '🥤' },
      { id: 'work', text: 'Work', symbol: '💼' },
      { id: 'study', text: 'Study', symbol: '📖' },
      { id: 'exercise', text: 'Exercise', symbol: '🏃' },
      { id: 'dance', text: 'Dance', symbol: '💃' },
      { id: 'sing', text: 'Sing', symbol: '🎤' },
      { id: 'draw', text: 'Draw', symbol: '🎨' },
    ]
  },
  people: {
    name: 'People',
    words: [
      { id: 'mom', text: 'Mom', symbol: '👩' },
      { id: 'dad', text: 'Dad', symbol: '👨' },
      { id: 'friend', text: 'Friend', symbol: '👥' },
      { id: 'teacher', text: 'Teacher', symbol: '👨‍🏫' },
      { id: 'doctor', text: 'Doctor', symbol: '👨‍⚕️' },
      { id: 'nurse', text: 'Nurse', symbol: '👩‍⚕️' },
      { id: 'sister', text: 'Sister', symbol: '👧' },
      { id: 'brother', text: 'Brother', symbol: '👦' },
      { id: 'grandma', text: 'Grandma', symbol: '👵' },
      { id: 'grandpa', text: 'Grandpa', symbol: '👴' },
      { id: 'baby', text: 'Baby', symbol: '👶' },
      { id: 'family', text: 'Family', symbol: '👨‍👩‍👧‍👦' },
    ]
  },
  places: {
    name: 'Places',
    words: [
      { id: 'home', text: 'Home', symbol: '🏠' },
      { id: 'school', text: 'School', symbol: '🏫' },
      { id: 'hospital', text: 'Hospital', symbol: '🏥' },
      { id: 'park', text: 'Park', symbol: '🌳' },
      { id: 'store', text: 'Store', symbol: '🏪' },
      { id: 'restaurant', text: 'Restaurant', symbol: '🍽️' },
      { id: 'library', text: 'Library', symbol: '📚' },
      { id: 'church', text: 'Church', symbol: '⛪' },
      { id: 'beach', text: 'Beach', symbol: '🏖️' },
      { id: 'airport', text: 'Airport', symbol: '✈️' },
      { id: 'bank', text: 'Bank', symbol: '🏦' },
      { id: 'office', text: 'Office', symbol: '🏢' },
    ]
  },
  time: {
    name: 'Time',
    words: [
      { id: 'now', text: 'Now', symbol: '⏰' },
      { id: 'later', text: 'Later', symbol: '⏳' },
      { id: 'today', text: 'Today', symbol: '📅' },
      { id: 'tomorrow', text: 'Tomorrow', symbol: '📆' },
      { id: 'morning', text: 'Morning', symbol: '🌅' },
      { id: 'night', text: 'Night', symbol: '🌙' },
      { id: 'afternoon', text: 'Afternoon', symbol: '☀️' },
      { id: 'evening', text: 'Evening', symbol: '🌆' },
      { id: 'yesterday', text: 'Yesterday', symbol: '📅' },
      { id: 'week', text: 'Week', symbol: '📅' },
      { id: 'month', text: 'Month', symbol: '📅' },
      { id: 'year', text: 'Year', symbol: '📅' },
    ]
  },
  foodAndDrinks: {
    name: 'Food & Drinks',
    words: [
      { id: 'bread', text: 'Bread', symbol: '🍞' },
      { id: 'water', text: 'Water', symbol: '💧' },
      { id: 'milk', text: 'Milk', symbol: '🥛' },
      { id: 'apple', text: 'Apple', symbol: '🍎' },
      { id: 'banana', text: 'Banana', symbol: '🍌' },
      { id: 'rice', text: 'Rice', symbol: '🍚' },
      { id: 'meat', text: 'Meat', symbol: '🥩' },
      { id: 'fish', text: 'Fish', symbol: '🐟' },
      { id: 'egg', text: 'Egg', symbol: '🥚' },
      { id: 'cheese', text: 'Cheese', symbol: '🧀' },
      { id: 'coffee', text: 'Coffee', symbol: '☕' },
      { id: 'tea', text: 'Tea', symbol: '🫖' },
      { id: 'juice', text: 'Juice', symbol: '🧃' },
    ]
  },
  animals: {
    name: 'Animals',
    words: [
      { id: 'dog', text: 'Dog', symbol: '🐕' },
      { id: 'cat', text: 'Cat', symbol: '🐱' },
      { id: 'bird', text: 'Bird', symbol: '🐦' },
      { id: 'fish', text: 'Fish', symbol: '🐠' },
      { id: 'horse', text: 'Horse', symbol: '🐎' },
      { id: 'cow', text: 'Cow', symbol: '🐄' },
      { id: 'pig', text: 'Pig', symbol: '🐷' },
      { id: 'chicken', text: 'Chicken', symbol: '🐔' },
      { id: 'rabbit', text: 'Rabbit', symbol: '🐰' },
      { id: 'elephant', text: 'Elephant', symbol: '🐘' },
    ]
  },
  colors: {
    name: 'Colors',
    words: [
      { id: 'red', text: 'Red', symbol: '🔴' },
      { id: 'blue', text: 'Blue', symbol: '🔵' },
      { id: 'green', text: 'Green', symbol: '🟢' },
      { id: 'yellow', text: 'Yellow', symbol: '🟡' },
      { id: 'black', text: 'Black', symbol: '⚫' },
      { id: 'white', text: 'White', symbol: '⚪' },
      { id: 'purple', text: 'Purple', symbol: '🟣' },
      { id: 'orange', text: 'Orange', symbol: '🟠' },
      { id: 'pink', text: 'Pink', symbol: '🩷' },
      { id: 'brown', text: 'Brown', symbol: '🟤' },
    ]
  },
  weather: {
    name: 'Weather',
    words: [
      { id: 'sunny', text: 'Sunny', symbol: '☀️' },
      { id: 'rainy', text: 'Rainy', symbol: '🌧️' },
      { id: 'cloudy', text: 'Cloudy', symbol: '☁️' },
      { id: 'windy', text: 'Windy', symbol: '💨' },
      { id: 'snow', text: 'Snow', symbol: '❄️' },
    ]
  },
  transportation: {
    name: 'Transportation',
    words: [
      { id: 'car', text: 'Car', symbol: '🚗' },
      { id: 'bus', text: 'Bus', symbol: '🚌' },
      { id: 'train', text: 'Train', symbol: '🚂' },
      { id: 'bike', text: 'Bike', symbol: '🚲' },
      { id: 'plane', text: 'Plane', symbol: '✈️' },
      { id: 'boat', text: 'Boat', symbol: '🚢' },
    ]
  },
  bodyParts: {
    name: 'Body Parts',
    words: [
      { id: 'head', text: 'Head', symbol: '👤' },
      { id: 'hand', text: 'Hand', symbol: '✋' },
      { id: 'foot', text: 'Foot', symbol: '🦶' },
      { id: 'eye', text: 'Eye', symbol: '👁️' },
      { id: 'ear', text: 'Ear', symbol: '👂' },
      { id: 'nose', text: 'Nose', symbol: '👃' },
      { id: 'mouth', text: 'Mouth', symbol: '👄' },
      { id: 'arm', text: 'Arm', symbol: '💪' },
      { id: 'leg', text: 'Leg', symbol: '🦵' },
      { id: 'heart', text: 'Heart', symbol: '❤️' },
    ]
  }
};

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' }
];

// Text-to-speech functionality
const speakText = (text, language = 'en') => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language for proper pronunciation
    utterance.lang = language;
    
    // Set voice based on language
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith(language) && voice.localService
    ) || voices.find(voice => 
      voice.lang.startsWith(language)
    ) || voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    
    // Adjust speech settings for clarity
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 10;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }
};

export default function WordLibrary({ onWordSelect, selectedWords, language = 'en', customWords, setCustomWords, customCategories, setCustomCategories }) {
  const [currentView, setCurrentView] = useState('categories'); // 'categories', 'words', 'customCreator'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCustomCreator, setShowCustomCreator] = useState(false);
  const [newCustomWord, setNewCustomWord] = useState({ emoji: '', word: '', category: '' });
  const [newCategory, setNewCategory] = useState({ name: '', emoji: '' });
  const [customWordError, setCustomWordError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTab, setAddTab] = useState('folder'); // 'folder' or 'word'
  const [showEmojiPicker, setShowEmojiPicker] = useState({ word: false, category: false });

  // ... after all useState hooks in WordLibrary ...
  if (typeof window !== 'undefined') {
    window._customWords = customWords;
    window._setCustomWords = setCustomWords;
    window._selectedCategory = selectedCategory;
    window._setSelectedCategory = setSelectedCategory;
    window._currentView = currentView;
    window._setCurrentView = setCurrentView;
  }

  // Helper to get emoji by word ID, always using latest state
  const getWordEmojiById = (wordId) => {
    // Build wordMap on every call
    const map = {};
    for (const categoryId in wordCategories) {
      for (const word of wordCategories[categoryId].words) {
        map[word.id] = word;
      }
    }
    for (const categoryId in customWords) {
      for (const word of customWords[categoryId] || []) {
        map[word.id] = word;
      }
    }
    const word = map[wordId];
    if (word && word.emoji) return word.emoji;
    if (word && word.symbol) return word.symbol;
    return '📝';
  };

  // SelectionBar always builds wordMap from latest state
  const SelectionBar = () => {
    if (!selectedWords || selectedWords.length === 0) return null;
    const cleanSelectedWords = selectedWords.filter(id => id !== undefined && id !== null);
    if (cleanSelectedWords.length === 0) return null;
    // Build wordMap on every render
    const map = {};
    for (const categoryId in wordCategories) {
      for (const word of wordCategories[categoryId].words) {
        map[word.id] = word;
      }
    }
    for (const categoryId in customWords) {
      for (const word of customWords[categoryId] || []) {
        map[word.id] = word;
      }
    }
    const handleRemoveWord = (wordIdToRemove) => {
      const updatedSelection = cleanSelectedWords.filter(id => id !== wordIdToRemove);
      onWordSelect(updatedSelection);
    };
    const handleClearAll = () => {
      onWordSelect([]);
    };
    return (
      <div className="selection-bar">
        <div className="selection-bar-content">
          <div className="selection-label">
            {uiTranslations.selectedWords?.[language] || 'Selected:'}
          </div>
          <div className="selected-words-list">
            {cleanSelectedWords.map((wordId, index) => {
              const word = map[wordId];
              const emoji = getWordEmojiById(wordId);
              let text = '';
              if (word && word.word && typeof word.word === 'object') text = word.word[language] || word.word['en'];
              else if (word && typeof word.word === 'string') text = word.word;
              else if (word && word.text) text = word.text;
              else text = getTranslatedText(wordId);
              return (
                <div key={index} className="selected-word-chip">
                  <span className="selected-word-emoji" style={{ marginRight: '6px' }}>{emoji}</span>
                  <span className="selected-word-text">{text}</span>
                  <button
                    className="remove-word-btn"
                    onClick={() => handleRemoveWord(wordId)}
                    aria-label="Remove word"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          <button
            className="clear-all-btn"
            onClick={handleClearAll}
          >
            {uiTranslations.clearAll?.[language] || 'Clear All'}
          </button>
        </div>
      </div>
    );
  };

  // Helper function to get emoji for a word
  const getWordEmoji = (wordText) => {
    if (!wordText || typeof wordText !== 'string') return '📝';
    // First check if it's a custom word
    for (const categoryId in customWords) {
      for (const word of customWords[categoryId] || []) {
        if (word.word && typeof word.word === 'object') {
          if (word.word[language] === wordText || word.word['en'] === wordText) return word.emoji;
        } else if (typeof word.word === 'string') {
          if (word.word === wordText) return word.emoji;
        }
      }
    }
    // Then check built-in words by searching through wordCategories (English text)
    for (const categoryId in wordCategories) {
      const word = wordCategories[categoryId].words.find(w => w.text === wordText);
      if (word) return word.symbol;
    }
    // Try to find by translated text (all languages)
    for (const [wordId, translations] of Object.entries(wordTranslations)) {
      for (const lang in translations) {
        if (translations[lang] === wordText) {
          // Found the word, now get its emoji from wordCategories
          for (const categoryId in wordCategories) {
            const word = wordCategories[categoryId].words.find(w => w.id === wordId);
            if (word) return word.symbol;
          }
        }
      }
    }
    return '📝';
  };

  // Helper function to get translated text
  const getTranslatedText = (wordId) => {
    if (!wordId || typeof wordId !== 'string') return '';
    return wordTranslations[wordId]?.[language] || wordTranslations[wordId]?.['en'] || wordId;
  };

  // Load custom data from cookies on component mount
  useEffect(() => {
    loadCustomDataFromCookies();
  }, []);

  // Save custom data to cookies whenever it changes
  useEffect(() => {
    saveCustomDataToCookies();
  }, [customCategories, customWords]);

  // Helper function to get translated category name
  const getTranslatedCategoryName = (categoryId) => {
    if (categoryId.startsWith('custom_')) {
      const cat = customCategories.find(cat => cat.id === categoryId);
      if (!cat) return categoryId;
      return cat.name[language] || cat.name['en'] || categoryId;
    }
    return categoryTranslations[categoryId]?.[language] || categoryTranslations[categoryId]?.['en'] || categoryId;
  };

  // Helper function to get category emoji
  const getCategoryEmoji = (categoryId) => {
    if (categoryId.startsWith('custom_')) {
      return customCategories.find(cat => cat.id === categoryId)?.emoji || '📁';
    }
    const categoryEmojis = {
      basicNeeds: '🆘',
      emotions: '😊',
      activities: '🎮',
      people: '👥',
      places: '🏠',
      time: '⏰',
      foodAndDrinks: '🍽️',
      animals: '🐕',
      colors: '🎨',
      weather: '☀️',
      transportation: '🚗',
      bodyParts: '👤'
    };
    return categoryEmojis[categoryId] || '📁';
  };

  // Cookie management functions
  const saveCustomDataToCookies = () => {
    const data = {
      categories: customCategories,
      words: customWords
    };
    document.cookie = `customData=${JSON.stringify(data)}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
  };

  const loadCustomDataFromCookies = () => {
    const cookies = document.cookie.split(';');
    const customDataCookie = cookies.find(cookie => cookie.trim().startsWith('customData='));
    
    if (customDataCookie) {
      try {
        const data = JSON.parse(customDataCookie.split('=')[1]);
        setCustomCategories(data.categories || []);
        setCustomWords(data.words || {});
      } catch (error) {
        console.error('Error loading custom data from cookies:', error);
      }
    }
  };

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentView('words');
  };

  // Handle back button
  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  // Add new custom category
  const addCustomCategory = () => {
    if (newCategory.name.trim() && newCategory.emoji.trim()) {
      const categoryId = `custom_${Date.now()}`;
      const newCat = {
        id: categoryId,
        name: { en: newCategory.name.trim() },
        emoji: newCategory.emoji.trim()
      };
      setCustomCategories([...customCategories, newCat]);
      setCustomWords({
        ...customWords,
        [categoryId]: []
      });
      setNewCategory({ name: '', emoji: '' });
      setShowAddModal(false);
    }
  };

  // When opening the custom word modal from a category, auto-select that category
  const openCustomWordModal = () => {
    setNewCustomWord({ emoji: '', word: '', category: '' });
    setShowAddModal(true);
    setCustomWordError('');
  };

  // Add new custom word
  const addCustomWord = () => {
    if (!newCustomWord.word.trim() || !newCustomWord.emoji.trim() || !newCustomWord.category) {
      setCustomWordError('Please fill in all fields and select a category.');
      return;
    }
    const wordId = `custom_word_${Date.now()}`;
    const newWord = {
      id: wordId,
      emoji: newCustomWord.emoji.trim(),
      word: { en: newCustomWord.word.trim() },
      category: newCustomWord.category
    };
    setCustomWords(prevCustomWords => {
      const updated = {
        ...prevCustomWords,
        [newCustomWord.category]: [...(prevCustomWords[newCustomWord.category] || []), newWord]
      };
      saveCustomDataToCookies({
        categories: customCategories,
        words: updated
      });
      return updated;
    });
    setNewCustomWord({ emoji: '', word: '', category: '' });
    setShowAddModal(false);
    setCustomWordError('');
    setSelectedCategory(newCustomWord.category);
    setCurrentView('words');
  };

  // Delete custom word
  const deleteCustomWord = (wordId, categoryId) => {
    setCustomWords({
      ...customWords,
      [categoryId]: customWords[categoryId].filter(word => word.id !== wordId)
    });
  };

  // Delete custom category
  const deleteCustomCategory = (categoryId) => {
    setCustomCategories(customCategories.filter(cat => cat.id !== categoryId));
    const newCustomWords = { ...customWords };
    delete newCustomWords[categoryId];
    setCustomWords(newCustomWords);
  };

  // Get all categories (built-in + custom)
  const getAllCategories = () => {
    const builtInCategories = Object.entries(wordCategories).map(([id, data]) => ({
      id,
      name: getTranslatedCategoryName(id),
      emoji: getCategoryEmoji(id),
      // Count both built-in and custom words
      wordCount: (data.words.length || 0) + (customWords[id]?.length || 0),
      isCustom: false
    }));

    const customCategoriesData = customCategories.map(cat => ({
      id: cat.id,
      name: typeof cat.name === 'object' ? (cat.name[language] || cat.name['en']) : cat.name,
      emoji: cat.emoji,
      wordCount: customWords[cat.id]?.length || 0,
      isCustom: true
    }));

    return [...builtInCategories, ...customCategoriesData];
  };

  // Get words for a category (built-in + custom)
  const getWordsForCategory = (categoryId) => {
    const builtInWords = wordCategories[categoryId]?.words || [];
    const custom = customWords[categoryId] || [];
    // For custom categories, only show custom words
    if (categoryId.startsWith('custom_')) return custom;
    // For built-in, show both
    return [...builtInWords, ...custom];
  };

  // Render category folders view
  const renderCategoriesView = () => (
    <div className="word-library">
      <h2 className="library-title">{uiTranslations.selectWords[language] || uiTranslations.selectWords['en']}</h2>
      <div className="custom-actions">
        <button 
          className="add-btn"
          onClick={() => openAddModal('folder')}
        >
          <span className="add-icon">➕</span>
          {getTranslatedText('createCustom')}
        </button>
      </div>
      <div className="categories-grid">
        {getAllCategories().map((category) => (
          <button
            key={category.id}
            className="category-folder"
            onClick={() => handleCategoryClick(category.id)}
            aria-label={`Open ${typeof category.name === 'object' ? (category.name[language] || category.name['en']) : category.name} folder`}
          >
            <div className="folder-icon">{category.emoji}</div>
            <div className="category-name">{typeof category.name === 'object' ? (category.name[language] || category.name['en']) : category.name}</div>
            <div className="word-count">{category.wordCount} {getTranslatedText('words')}</div>
            {category.isCustom && (
              <button
                className="delete-category-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCustomCategory(category.id);
                }}
                aria-label="Delete custom category"
              >
                🗑️
              </button>
            )}
          </button>
        ))}
      </div>
      {/* Combined Add Modal with Tabs */}
      {showAddModal && (
        <div className="custom-creator-modal">
          <div className="modal-content">
            <div className="creator-tabs">
              <button
                className={`tab ${addTab === 'folder' ? 'active' : ''}`}
                onClick={() => setAddTab('folder')}
              >
                {getTranslatedText('newCategory')}
              </button>
              <button
                className={`tab ${addTab === 'word' ? 'active' : ''}`}
                onClick={() => setAddTab('word')}
              >
                {getTranslatedText('newWord')}
              </button>
            </div>
            {addTab === 'folder' ? (
              <div className="creator-form">
                <div className="input-group">
                  <label>{getTranslatedText('categoryEmoji')}:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={newCategory.emoji}
                      readOnly
                      onClick={() => setShowEmojiPicker({ ...showEmojiPicker, category: true })}
                      placeholder="📁"
                      maxLength="2"
                      style={{ cursor: 'pointer', background: '#f9f9f9' }}
                    />
                    {showEmojiPicker.category && (
                      <div style={{ position: 'absolute', zIndex: 1000, top: '110%', left: 0 }}>
                        <EmojiPicker
                          onEmojiClick={emoji => {
                            setNewCategory({ ...newCategory, emoji: emoji.emoji });
                            setShowEmojiPicker({ ...showEmojiPicker, category: false });
                          }}
                          searchDisabled={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="input-group">
                  <label>{getTranslatedText('categoryName')}:</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder={getTranslatedText('enterCategoryName')}
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={addCustomCategory} className="save-btn">
                    {getTranslatedText('save')}
                  </button>
                  <button onClick={() => setShowAddModal(false)} className="cancel-btn">
                    {getTranslatedText('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="creator-form">
                <div className="input-group">
                  <label>{getTranslatedText('wordEmoji')}:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={newCustomWord.emoji}
                      readOnly
                      onClick={() => setShowEmojiPicker({ ...showEmojiPicker, word: true })}
                      placeholder="😊"
                      maxLength="2"
                      style={{ cursor: 'pointer', background: '#f9f9f9' }}
                    />
                    {showEmojiPicker.word && (
                      <div style={{ position: 'absolute', zIndex: 1000, top: '110%', left: 0 }}>
                        <EmojiPicker
                          onEmojiClick={emoji => {
                            setNewCustomWord({ ...newCustomWord, emoji: emoji.emoji });
                            setShowEmojiPicker({ ...showEmojiPicker, word: false });
                          }}
                          searchDisabled={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="input-group">
                  <label>{getTranslatedText('wordText')}:</label>
                  <input
                    type="text"
                    value={typeof newCustomWord.word === 'object' ? (newCustomWord.word[language] || newCustomWord.word['en']) : newCustomWord.word}
                    onChange={(e) => setNewCustomWord({...newCustomWord, word: e.target.value})}
                    placeholder={getTranslatedText('enterWord')}
                  />
                </div>
                <div className="input-group">
                  <label>{getTranslatedText('selectCategory')}:</label>
                  <select
                    value={newCustomWord.category || ''}
                    onChange={e => setNewCustomWord({ ...newCustomWord, category: e.target.value })}
                  >
                    <option value="">{getTranslatedText('chooseCategory')}</option>
                    {getAllCategories().map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                {customWordError && (
                  <div style={{ color: 'red', marginBottom: '0.5em' }}>{customWordError}</div>
                )}
                <div className="modal-actions">
                  <button
                    onClick={addCustomWord}
                    className="save-btn"
                    disabled={
                      !newCustomWord.word.trim() ||
                      !newCustomWord.emoji.trim() ||
                      !newCustomWord.category
                    }
                  >
                    {getTranslatedText('save')}
                  </button>
                  <button onClick={() => setShowAddModal(false)} className="cancel-btn">
                    {getTranslatedText('cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render words view for selected category
  const renderWordsView = () => {
    if (!selectedCategory) return null;
    
    const categoryName = getTranslatedCategoryName(selectedCategory);
    const words = getWordsForCategory(selectedCategory);
    // Handler to toggle word selection
    const handleWordButtonClick = (wordId) => {
      // Find the word object
      const wordObj = words.find(w => w.id === wordId);
      // If it's a custom word, use its .word property for TTS
      let translatedText = '';
      if (wordObj && wordObj.word && typeof wordObj.word === 'object') {
        translatedText = wordObj.word[language] || wordObj.word['en'];
      } else if (wordObj && wordObj.text) {
        translatedText = wordObj.text;
      } else {
        translatedText = getTranslatedText(wordId);
      }
      speakText(translatedText, language);
      
      console.log('handleWordButtonClick called with wordId:', wordId);
      console.log('Current selectedWords:', selectedWords);
      
      // Safety check: don't process undefined word IDs
      if (!wordId) {
        console.log('Warning: wordId is undefined, ignoring click');
        return;
      }
      
      // Filter out any existing undefined values from selectedWords
      const cleanSelectedWords = selectedWords.filter(id => id !== undefined && id !== null);
      
      let updatedSelection;
      if (cleanSelectedWords.includes(wordId)) {
        updatedSelection = cleanSelectedWords.filter(id => id !== wordId);
        console.log('Removing wordId:', wordId, 'Updated selection:', updatedSelection);
      } else {
        updatedSelection = [...cleanSelectedWords, wordId];
        console.log('Adding wordId:', wordId, 'Updated selection:', updatedSelection);
      }
      
      console.log('Calling onWordSelect with:', updatedSelection);
      onWordSelect(updatedSelection);
    };
    
    return (
      <div className="word-library">
        <div className="category-header">
          <button 
            className="back-button"
            onClick={handleBackToCategories}
            aria-label="Go back to categories"
          >
            ← {getTranslatedText('back')}
          </button>
          <h2 className="category-title">{categoryName}</h2>
        </div>
        <div className="word-grid">
          {words.map(word => {
            let translatedText = '';
            if (word.word && typeof word.word === 'object') {
              translatedText = word.word[language] || word.word['en'];
            } else if (typeof word.word === 'string') {
              translatedText = word.word;
            } else if (word.text) {
              translatedText = word.text;
            } else {
              translatedText = getTranslatedText(word.id);
            }
            return (
              <button
                key={word.id}
                className={`word-button ${selectedWords.includes(word.id) ? 'selected' : ''}`}
                onClick={() => handleWordButtonClick(word.id)}
                aria-label={`Select ${translatedText}`}
                title={`Click to select \"${translatedText}\" (will be spoken aloud)`}
              >
                <span className="symbol">{word.word && typeof word.word === 'object' ? word.emoji : word.symbol}</span>
                <span className="text">{translatedText}</span>
                <span className="audio-indicator" style={{ fontSize: '0.8em', marginLeft: '4px', opacity: 0.7 }}>🔊</span>
                {word.word && typeof word.word === 'object' && (
                  <button
                    className="delete-word-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomWord(word.id, selectedCategory);
                    }}
                    aria-label="Delete custom word"
                  >
                    🗑️
                  </button>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Add this function above renderCategoriesView
  const openAddModal = (tab = 'folder') => {
    setAddTab(tab);
    setShowAddModal(true);
    setCustomWordError('');
    setNewCategory({ name: '', emoji: '' });
    setNewCustomWord({ emoji: '', word: '', category: '' });
  };

  return (
    <div className="word-library-container">
      {currentView === 'categories' ? renderCategoriesView() : renderWordsView()}
    </div>
  );
} 

export { wordTranslations };