# E-Insight

E-Insight, e-ticaret platformlarındaki ürün yorumlarını analiz ederek hem alıcılar hem de satıcılar için içgörüler sağlayan bir web uygulamasıdır. Kullanıcıların daha bilinçli satın alma kararları vermelerine ve satıcıların müşteri geri bildirimlerini anlamalarına yardımcı olur.

## Özellikler

- **Ürün Yorumu Analizi**: Trendyol'dan yorumları çeker ve analiz eder
- **Çift Mod**: 
  - Kullanıcı Modu: Ürün derecelendirmeleri ve özetleriyle alıcı perspektifine odaklanır
  - Satıcı Modu: Rekabet analizi ve iyileştirme önerileri sunar
- **Özel Analiz**: Belirli analiz gereksinimleri için özel istemler ekleme yeteneği
- **Yapay Zeka Destekli**: Akıllı yorum analizi için Google'ın Gemini AI'sını kullanır

## Teknoloji Altyapısı

### Önyüz
- React + Vite
- Navigasyon için React Router
- Durum yönetimi için Zustand
- Stillendirme için SCSS
- API çağrıları için Axios

### Arkayüz
- Express.js
- Veri depolama için MongoDB
- Web kazıma için Puppeteer
- Yorum analizi için Google Gemini AI
- Çapraz kaynak istekleri için CORS

## Başlangıç

### Gereksinimler
- Node.js
- MongoDB Atlas hesabı
- Google Gemini API anahtarı

### Kurulum

1. Depoyu klonlayın
2. Backend bağımlılıklarını yükleyin:
```bash
cd backend
npm install
```

3. Frontend bağımlılıklarını yükleyin:
```bash
cd frontend/insight
npm install
```

4. Backend dizininde `backend/config.env` dosyası oluşturun:
```env
ATLAS_URI=mongodb_baglanti_stringiniz
PORT=5050
GEMINI_API_KEY=gemini_api_anahtariniz
```

### Uygulamayı Çalıştırma

1. Backend sunucusunu başlatın:
```bash
cd backend
node --env-file=config.env server.js // node.js built-in,  dotenv yükleyip kullanabilirsiniz.
```

2. Frontend geliştirme sunucusunu başlatın:
```bash
cd frontend/insight
npm run dev
```

## Katkıda Bulunma

1. Depoyu fork edin
2. Özellik dalınızı oluşturun
3. Değişikliklerinizi commit edin
4. Dalınıza push yapın
5. Pull request açın


## Kullanılan Teknojiler

- Yönlendirme için React Router
- Durum yönetimi için Zustand
- Analiz için Google Gemini AI
- Veritabanı için MongoDB
