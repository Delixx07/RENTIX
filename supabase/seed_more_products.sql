-- ============================================================
-- RENTIX — Tambahan produk (jalankan di SQL Editor)
-- Menambah 12 produk baru (id 9–20). Aman & idempotent —
-- tidak menghapus / menimpa produk yang sudah ada.
-- ============================================================

insert into public.products
  (id, cat, name, img, price, price_week, price_month, rating, reviews, owner_name, owner_verified, badges, description, specs, available, stock, is_premium)
values
  (9,'camera','Canon EOS R6 Mark II','/product_camera.png',330000,1900000,6500000,4.8,87,'FotoPro Studio',true,'{protected,popular}',
   'Kamera mirrorless full-frame 24.2MP dengan autofokus Dual Pixel CMOS AF II dan video 4K 60fps. Ideal untuk wedding, event, dan videografi.',
   '{"Sensor":"24.2MP Full-Frame CMOS","ISO":"100-102400","Video":"4K 60fps","AF":"Dual Pixel CMOS AF II","Bobot":"588g"}', true, 2, true),
  (10,'camera','Fujifilm X-T5 + 18-55mm','/product_camera.png',280000,1600000,5500000,4.7,64,'Lensa Kita',true,'{protected}',
   'Kamera mirrorless APS-C 40MP dengan simulasi film khas Fujifilm. Cocok untuk street photography dan content creator.',
   '{"Sensor":"40.2MP APS-C X-Trans","ISO":"125-12800","Video":"6.2K 30fps","Stabilisasi":"IBIS 7 stop","Bobot":"557g"}', true, 3, false),
  (11,'camera','GoPro HERO12 Black','/product_camera.png',95000,520000,1800000,4.6,112,'ActionCam ID',true,'{protected,popular}',
   'Action camera tahan air 5.3K dengan HyperSmooth 6.0. Cocok untuk vlog perjalanan, olahraga air, dan dokumentasi outdoor.',
   '{"Video":"5.3K 60fps","Stabilisasi":"HyperSmooth 6.0","TahanAir":"10m tanpa case","Baterai":"Enduro","Bobot":"154g"}', true, 5, false),
  (12,'laptop','Dell XPS 15 OLED i7','/product_laptop.png',185000,1050000,3600000,4.7,53,'TechRent Surabaya',true,'{protected}',
   'Laptop premium layar OLED 3.5K untuk desain dan editing. Intel Core i7, RAM 16GB, RTX 4050.',
   '{"CPU":"Intel Core i7-13700H","GPU":"RTX 4050 6GB","RAM":"16GB DDR5","Storage":"512GB SSD","Display":"15.6\" 3.5K OLED"}', true, 2, false),
  (13,'laptop','Lenovo Legion 5 Ryzen 7','/product_laptop.png',160000,920000,3200000,4.5,48,'GameGear Rental',false,'{}',
   'Laptop gaming bertenaga AMD Ryzen 7 + RTX 4060. Layar 165Hz, cocok untuk gaming dan rendering ringan.',
   '{"CPU":"AMD Ryzen 7 7840HS","GPU":"RTX 4060 8GB","RAM":"16GB DDR5","Storage":"1TB SSD","Display":"15.6\" 165Hz"}', true, 3, false),
  (14,'projector','BenQ TH685 Gaming Projector','/product_projector.png',135000,750000,2400000,4.6,41,'Layar Lebar Rental',true,'{protected}',
   'Proyektor Full HD 3500 lumens dengan input lag rendah, cocok untuk nobar, gaming, dan presentasi.',
   '{"Brightness":"3500 Lumens","Resolusi":"1080p Full HD","InputLag":"8.3ms","Konektivitas":"HDMI x2, USB","Bobot":"2.8kg"}', true, 4, false),
  (15,'projector','Epson EB-FH52 Full HD','/product_projector.png',170000,950000,3000000,4.7,33,'Event Pro ID',true,'{protected,popular}',
   'Proyektor bisnis 4000 lumens Full HD untuk seminar besar dan acara kampus. Konektivitas lengkap.',
   '{"Brightness":"4000 Lumens","Resolusi":"1080p Full HD","Lampu":"12000 jam","Konektivitas":"HDMI, VGA, USB, LAN","Bobot":"3.1kg"}', true, 2, false),
  (16,'audio','Rode Wireless GO II (Dual)','/product_microphone.png',85000,480000,1600000,4.8,58,'SoundLab Surabaya',true,'{protected,popular}',
   'Sistem mikrofon wireless dual-channel untuk wawancara, vlog, dan dokumentasi event. Jangkauan hingga 200m.',
   '{"Channel":"Dual TX + 1 RX","Jangkauan":"200m","Baterai":"7 jam","Rekaman":"Internal 40 jam","Berat":"32g/unit"}', true, 4, false),
  (17,'audio','Zoom H6 Audio Recorder','/product_microphone.png',75000,420000,1400000,4.6,27,'AudioWorks',true,'{protected}',
   'Perekam audio portabel 6-track dengan kapsul mikrofon yang bisa diganti. Standar produksi film & podcast.',
   '{"Track":"6 track simultan","Input":"4 XLR/TRS","Sampling":"24-bit/96kHz","Layar":"LCD warna","Berat":"280g"}', true, 3, false),
  (18,'drone','DJI Mini 4 Pro','/product_drone.png',280000,1600000,5800000,4.9,69,'AerialShot Studio',true,'{protected,popular,new}',
   'Drone ringan di bawah 249g dengan kamera 4K HDR dan deteksi rintangan segala arah. Tanpa perlu registrasi rumit.',
   '{"Kamera":"4K/60fps HDR","Berat":"<249g","Terbang":"34 menit","Sensor":"Omnidirectional","Transmisi":"O4 20km"}', true, 2, true),
  (19,'stabilizer','Zhiyun Crane M3','/product_gimbal.png',95000,540000,1850000,4.5,31,'Cinematech Rental',true,'{protected}',
   'Gimbal ringkas untuk kamera mirrorless, action cam, dan smartphone. Lampu fill built-in.',
   '{"Payload":"2kg max","Axis":"3-axis","Baterai":"7.5 jam","FillLight":"Built-in","Bobot":"700g"}', true, 3, false),
  (20,'ht','Baofeng UV-82 HT Set (6 unit)','/product_ht.png',70000,390000,1300000,4.4,52,'Rizky Event Supply',true,'{protected,popular}',
   'Set 6 unit Handy Talky dual-band untuk koordinasi panitia event besar. Ekonomis dan andal.',
   '{"Jangkauan":"4km (open area)","Channel":"128 channel","Baterai":"2800mAh","Frekuensi":"VHF/UHF dual-band","Unit":"6 unit/set"}', true, 6, false)
on conflict (id) do nothing;

-- jaga agar sequence id tetap di atas id tertinggi
select setval(pg_get_serial_sequence('public.products','id'), (select max(id) from public.products));

-- beberapa ulasan untuk produk baru (rating produk ikut terhitung jika trigger aktif)
insert into public.reviews (product_id, direction, rating, text, author_name) values
  (9,'to_owner',5,'Canon R6 II-nya tajam banget buat foto wedding. Owner ramah dan barang prima.','Reza P.'),
  (11,'to_owner',5,'GoPro 12 mantap buat diving. Stabilizernya halus, baterai awet.','Tina M.'),
  (18,'to_owner',5,'Mini 4 Pro ringan, gampang diterbangkan, hasil 4K-nya jernih. Recommended!','Galih W.'),
  (16,'to_owner',4,'Wireless GO II jernih, praktis buat liputan acara kampus.','Nadia S.'),
  (15,'to_owner',5,'Proyektor Epson terang, seminar 200 orang tetap jelas.','Panitia Semnas')
on conflict do nothing;
