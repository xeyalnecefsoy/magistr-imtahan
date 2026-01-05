
import json

questions = [
    {
        "id": 1,
        "question": "Erqonomikanın əsas anlayışı və məqsədi nədən ibarətdir?",
        "answer": "Erqonomika (erqon-iş, nomos-qanun) insanların əmək proseslərində funksional imkanlarını öyrənən elmi fəndir. Məqsədi insan-maşın-mühit sistemində fəaliyyətin effektliyi və keyfiyyətinin yüksəldilməsi, eyni zamanda insanın sağlamlığının qorunması və şəxsiyyətin inkişafı üçün optimal şəraitin yaradılmasıdır.",
        "category": "Erqonomika əsasları"
    },
    {
        "id": 2,
        "question": "\"İnsan-maşın-mühit\" sistemində erqonomik tələblər hansı xassələrlə nəticələnir və bu xassələr nələrdir?",
        "answer": "Erqonomik tələblər sistemin layihələndirilməsində aşağıdakı xassələrlə nəticələnir: Sosial-psixoloji (qrup fəaliyyəti), Antropometrik (insan bədən ölçülərinə uyğunluq), Psixoloji (yaddaş, qavrama), Psixofizioloji (görmə, eşitmə), Fizioloji (güc sürət, enerji) və Gigiyenik (işıqlanma, səs-küy, temperatur).",
        "category": "Sistem analizi"
    },
    {
        "id": 3,
        "question": "Antropometrik faktorların (fiziki ölçülərin) erqonomik layihələndirmədə rolu nədir?",
        "answer": "Antropometrik faktorlar avadanlığın və elementlərin quruluşu, forması və ölçülərinin insan bədəninin ölçülərinə və kütləsinə uyğunluğunu müəyyən edir. Bu, insan-maşın sistemində rahatlığı və səmərəliliyi təmin etmək üçün vacibdir.",
        "category": "Antropometriya"
    },
    {
        "id": 4,
        "question": "Yaşayış mühitinin layihələndirilməsində erqodizaynın vəzifələri nələrdir?",
        "answer": "Erqodizayn insan amilinin elmi erqonomik tədqiqatlarını dizayn layihələndirilməsi ilə birləşdirir. Vəzifələri yaşayış mühitini, interyerləri və onların təchizat elementlərini insanın fiziki və psixoloji xüsusiyyətlərinə uyğunlaşdıraraq harmonik, rahat və təhlükəsiz mühit yaratmaqdır.",
        "category": "Mühit dizaynı"
    },
    {
        "id": 5,
        "question": "Geyimin forması hansı faktorlardan asılıdır və onun əsas tələbləri nələrdir?",
        "answer": "Geyimin forması insan bədəninin ölçüləri, hərəkət dinamikası (ergonomik), gigiyenik (istilik, nəmlik mübadiləsi) və estetik faktorlardan asılıdır. Əsas tələblər insan bədəninə uyğunluq (antropometrik), hərəkət sərbəstliyi və komfortun təmin edilməsidir.",
        "category": "Geyim erqonomikası"
    },
    {
        "id": 6,
        "question": "Erqonomikanın predmeti və məqsədi haqqında ətraflı məlumat verin.",
        "answer": "Erqonomikanın predmeti elm kimi sistemin insanla texniki vasitələrin əlaqəsi və fəaliyyət prosesində obyektin və mühitin qanunauyğunluqlarının öyrənilməsidir. Məqsədi insan-maşın sisteminin fəaliyyətinin səmərəliliyini artırmaq və insan sağlamlığını qorumaqdır.",
        "category": "Erqonomika əsasları"
    },
    {
        "id": 7,
        "question": "Erqonomik tələblər-insan operator fəaliyyətinin optimallaşdırılması məqsədilə hansı imkanları nəzərə alır?",
        "answer": "Erqonomik tələblər insan operatorun sosial-psixoloji, psixofizioloji, antropoloji, psixoloji və gigiyenik xassə və imkanlarını nəzərə alaraq fəaliyyətin optimallaşdırılmasını təmin edir.",
        "category": "İnsan faktorları"
    },
    {
        "id": 8,
        "question": "Psixofizioloji faktorlar iş zamanı insanın hansı imkanlarını və mühitin xüsusiyyətlərini əhatə edir?",
        "answer": "Psixofizioloji faktorlar iş zamanı insanın eşitmə, görmə imkanlarını, predmet mühiti və effektiv komfort uyğunluğunun təmin edilməsini əhatə edir.",
        "category": "Psixologiya"
    },
    {
        "id": 9,
        "question": "Memarlıq mühitində işıq və rəngin qavranılması haqqında əsas nəzəriyyələr nədən bəhs edir?",
        "answer": "Nəzəriyyələr işıq və rəngin insanın psixofizioloji vəziyyətinə, əhval-ruhiyyəsinə və iş qabiliyyətinə təsirindən bəhs edir. İşıqlandırma və rəng həlləri məkanın qavranılmasını, vizual komfortu və emosional təsiri formalaşdırır (məsələn, ağır/yüngül tonlar, isti/soyuq rənglər).",
        "category": "Mühit dizaynı"
    },
    {
        "id": 10,
        "question": "\"Toxuculuq materialları\"nın toxucu xassələri, o cümlədən toxuculuq nəmlik udma qabiliyyəti (hidsroskopiklik) haqqında məlumat verin.",
        "answer": "Toxuculuq materiallarının xassələri onların istismar və gigiyenik keyfiyyətlərini müəyyən edir. Higroskopiklik materialın ətraf mühitdən nəmliyi udma və saxlama qabiliyyətidir. Təbii liflər yüksək higroskopikliyə, sintetik liflər isə aşağı higroskopikliyə malikdir ki, bu da geyimin altındakı mikrobiqlimə təsir edir.",
        "category": "Materialşünaslıq"
    },
    {
        "id": 11,
        "question": "Erqonomikanın qarşısında qoyulan məqsəd – təcrübə fəaliyyəti kimi layihələndirmə nəyi əhatə edir?",
        "answer": "Layihələndirmə və təkmilləşdirmə proseslərini (üsul, alqoritm, üslublar), fəaliyyətin yerinə yetirilməsi və bunun üçün xüsusi hazırlıq üsullarını (öyrədilməsi, məşqi), həm də insanın effektiv fəaliyyətinə və psixoloji vəziyyətinə təsir göstərən vasitə və şəraitin xassələrinin müəyyən edilməsini əhatə edir.",
        "category": "Layihələndirmə"
    },
    {
        "id": 12,
        "question": "Erqonomik tədqiqatların nəticələri nədir və sistemin layihələndirilməsi prosesində onların rolu nədir?",
        "answer": "Erqonomik tədqiqatların nəticələri sistemin layihə tərtibatı üçün vacib olan elmi və təcrübi göstəricilərdir. Sistemin layihələndirilməsi prosesi başlanğıcdan onun erqonomik xassələrinin formalaşmasına əsaslanmalıdır, bu da layihənin erqonomik təminatının əsas məqsədidir.",
        "category": "Tədqiqat metodları"
    },
    {
        "id": 13,
        "question": "Diqqətin əsas psixi fəaliyyət xüsusiyyətləri hansılardır (cəmlənmə, yönəlmə, həcm, bölünmə, davamlılıq)?",
        "answer": "Diqqətin xüsusiyyətlərinə onun cəmlənməsi (məqsədyönlü toplanması), yönəlməsi (obyektlər üzərində fokuslanma səviyyəsi), həcmi (eyni anda qavranılan obyektlərin sayı), bölünməsi (eyni anda bir neçə işi görmək) və davamlılığı (uzun müddət mərkəzləşməsi) aiddir.",
        "category": "Psixologiya"
    },
    {
        "id": 14,
        "question": "Mebelə qoyulan erqonomik tələblər və mebel növlərinin təsnifatı haqqında məlumat verin.",
        "answer": "Mebelə qoyulan erqonomik tələblər insan bədəninin ölçülərinə (antropometriya) və funksional rahatlığa əsaslanır. Mebellər funksiyasına görə qruplaşdırılır: oturmaq üçün (stul, kreslo), iş səthləri (masa), saxlama (şkaf) və istirahət üçün. Məqsəd dayaq sahəsini və bədən duruşunu optimallaşdırmaqdır.",
        "category": "Mebel dizaynı"
    },
    {
        "id": 15,
        "question": "Optik illüziyalar nədir və memarlıq abidələrinin layihələndirilməsində onların nəzərə alınmasının əhəmiyyəti nədən ibarətdir?",
        "answer": "Optik illüziyalar gözün həndəsi quruluşları bəzi dəyişikliklərlə (qeyri-dəqiq) qavramasıdır. Memarlar vizual təəssüratları dəyişmək, ifadəli obraz yaratmaq, lazımi aksentləri vurğulamaq və gözlənilən emosional təsiri əldə etmək üçün memarlıq-planlaşdırma korrektivləri (optik düzəlişlər) tətbiq edirlər.",
        "category": "Vizual qavrayış"
    },
    {
        "id": 16,
        "question": "Erqonomika fəaliyyətin obyektləri olaraq nələri əhatə edir?",
        "answer": "Erqonomika fəaliyyət obyekti olaraq 'insan-əşya-mühit' sistemini əhatə edir. Burada insan (operator, istehlakçı), texniki vasitələr (maşın, əşya) və onların qarşılıqlı əlaqədə olduğu mühit əsas komponentlərdir.",
        "category": "Erqonomika əsasları"
    },
    {
        "id": 17,
        "question": "Layihənin bütün erqonomik təminat prosesini təşkil edən mərhələlər hansılardır?",
        "answer": "1. İnsan fəaliyyəti və amillərinin analizi. 2. Erqonomik tələblərin və göstəricilərin tərtibatı. 3. Layihələndirilən texnika və mühitin erqonomik xassələrinin formalaşdırılması. 4. Yekun mərhələ - erqonomik tələblərin reallaşdırılmasının qiymətləndirilməsi.",
        "category": "Layihələndirmə"
    },
    {
        "id": 18,
        "question": "Erqonomik məsələlərin həlli üçün insanın həyat fəaliyyətinin kompleks faktorları hansılardır?",
        "answer": "İnsanın həyat fəaliyyətinin kompleks faktorları: Sosial-psixoloji, Antropometrik, Psixoloji, Psixofizioloji, Fizioloji və Gigiyenik faktorlardır. Bu faktorlar insan-maşın sisteminin uyğunluğunu təmin etmək üçün istifadə olunur.",
        "category": "İnsan faktorları"
    },
    {
        "id": 19,
        "question": "Rəngin psixofizioloji təsiri və rəngin emosional-estetik amili kimi həll olunan məsələlər nədən ibarətdir?",
        "answer": "Rəngin psixofizioloji təsiri görmə işini optimallaşdırmaq, yorğunluğu azaltmaq və komfort yaratmaqla bağlıdır. Emosional-estetik amil kimi isə rəng mühitin atmosferini formalaşdırır, insana estetik zövq verir və psixoloji vəziyyətinə müsbət təsir göstərir.",
        "category": "Rəngşünaslıq"
    },
    {
        "id": 20,
        "question": "Geyimin geyilən materiallarla bağlı gigiyenik xassələrindən bədən tərəfindən buraxılan \"buxar\" və \"nəmlik keçiriciliyi\"nin fərqini izah edin.",
        "answer": "Gigiyenik xassələr bədənin normal istilik mübadiləsini təmin etməlidir. Buxar keçiriciliyi tərin buxar halında xaric olunmasını təmin edir (nəfəs alma). Nəmlik keçiriciliyi (higroskopiklik) isə materialın mayeni udub saxlama qabiliyyətidir. Yüksək buxar keçiriciliyi və optimal higroskopiklik gigiyenik komfortu təmin edir.",
        "category": "Geyim erqonomikası"
    },
    {
        "id": 21,
        "question": "Sistem – vahid məqsədlə birləşdirilmiş qarşılıqlı faktorların və komponentlərin uyğunlaşdırılması nə deməkdir?",
        "answer": "Sistem, vahid məqsədə çatmaq üçün bir-biri ilə əlaqəli və qarşılıqlı təsirdə olan elementlərin (insan, maşın, mühit) məcmusudur. Uyğunlaşdırma bu elementlərin funksiyalarının ahəngdar və səmərəli şəkildə inteqrasiyasını nəzərdə tutur.",
        "category": "Sistem analizi"
    },
    {
        "id": 22,
        "question": "\"Erqodizayn\" anlayışı nədir və o, nəyi vəhdətə birləşdirir?",
        "answer": "Erqodizayn erqonomika və dizaynın qovşağında yaranan fəaliyyət sahəsidir. O, \"insan amili\"nin elmi erqonomik tədqiqatlarını dizayn layihələndirilməsi ilə elə vəhdətdə birləşdirir ki, onlar arasında sərhədi ayırd etmək mümkün olmur.",
        "category": "Dizayn nəzəriyyəsi"
    },
    {
        "id": 23,
        "question": "Diqqətin davamlılığı nədir və istehsalat şəraitində bu müddət nə qədərdir?",
        "answer": "Diqqətin davamlılığı onun uzun müddət müəyyən obyekt üzərində mərkəzləşməsidir. İstehsalat şəraitində yüksək mərkəzləşmə tələb olunan işlərdə insan diqqətini bir obyekt üzərində təxminən 15-20 dəqiqə saxlaya bilir.",
        "category": "Psixologiya"
    },
    {
        "id": 24,
        "question": "Yaşayış mühitini təkmilləşdirmə prosesində funksional zonalar hansı qruplara bölünür?",
        "answer": "Funksional zonalar interyerlərdə fəaliyyətin növünə görə qruplaşdırılır: İstirahət zonası, İş zonası (tədris, peşə), Məişət prosesləri zonası (yemək hazırlanması, qida qəbulu) və Sanitar-gigiyenik zona.",
        "category": "İnteryer dizaynı"
    },
    {
        "id": 25,
        "question": "İnsan fiqurunun qəbul edilmiş anatomik quruluş qanunları və bu qanunların sənətdə tətbiqi haqqında məlumat verin.",
        "answer": "İnsan fiqurunun anatomik quruluşu proporsiya qanunlarına (məsələn, başın bədənə nisbəti) əsaslanır. Sənətdə və erqonomikada bu qanunlar (məsələn, Vitruvi adamı, qızıl bölgü) harmoniya yaratmaq və əşyaları insan ölçülərinə uyğunlaşdırmaq üçün istifadə olunur.",
        "category": "Anatomiya və sənət"
    },
    {
        "id": 26,
        "question": "Erqonomikanın əsas struktur elementləri (tədqiqat elmi haqqında nəzəriyyə, metodologiya və elmi biliklər) hansılardır?",
        "answer": "Erqonomikanın əsas struktur elementləri: 1. Nəzəriyyə (tədqiqat predmeti haqqında). 2. Metodologiya (tədqiqat üsulları). 3. Elmi biliklər (toplanmış faktlar). Bunlarla yanaşı operativ vasitələr bloku və erqonomik qiymətləndirmə də strukturun vacib hissəsidir.",
        "category": "Erqonomika nəzəriyyəsi"
    },
    {
        "id": 27,
        "question": "Erqonomikanın inkişafının XX əsrin əvvəlində və sonrakı dövrlərdə (1920-ci illər, II Dünya müharibəsindən sonra) əsas istiqamətləri hansılar olmuşdur?",
        "answer": "XX əsrin əvvəlində (Teylorizm) əsas diqqət fiziki əməyin səmərəliliyinə yönəlmişdi. II Dünya müharibəsindən sonra hərbi texnikanın inkişafı ilə insan faktorlarının öyrənilməsi ('Mühəndis psixologiyası') ön plana keçdi. 1960-cı illərdən sonra isə erqonomika sənaye dizaynı və istehlak mallarına tətbiq olunmağa başladı.",
        "category": "Erqonomika tarixi"
    },
    {
        "id": 28,
        "question": "Həyat fəaliyyəti (istehsalatda, avtomobil idarə edəndə, məişət situasiyalarında və s.) ilə bağlı psixoloji hal olaraq diqqətin rolu nədir?",
        "answer": "Diqqət, insanın təfəkkürü ilə sıx bağlı olan mürəkkəb psixoloji hal kimi istehsalatda, nəqliyyatda və məişətdə təhlükəsizlik və səmərəlilik üçün həlledici rol oynayır. Diqqətin düzgün paylanması və davamlılığı qəzaların qarşısını alır və işin keyfiyyətini artırır.",
        "category": "Təhlükəsizlik"
    },
    {
        "id": 29,
        "question": "Müşahidə zamanı obyektlərin qavranılmasında obyektiv ölçülərin qeyri-düzgün qiymətləndirilməsinə səbəb olan hadisələr nələrdir?",
        "answer": "Obyektlərin uzaqlaşması, işıqlanma şəraiti və fonun təsiri ölçülərin qeyri-düzgün qiymətləndirilməsinə (illüziyalara) səbəb olur. Məsələn, 100 metr məsafədə obyekt 82-93 metr, 500 metr məsafədə isə 230-360 metr kimi (daha qısa) qavranıla bilər.",
        "category": "Vizual qavrayış"
    },
    {
        "id": 30,
        "question": "Müxtəlif yaş dövrlərində qadınların bədən hissələrinin (baş, çiyinlər, qollar, sinə, bel, çanaq, saçlar, üzlər) ardıcıllıqla böyüməsinin fərqləri hansı şəkildə ifadə olunur?",
        "answer": "Qadınların bədən proporsiyaları yaşla dəyişir. Yeniyetməlikdə boy artır, gənclikdə (20-29 yaş) bədən formalaşır. 30-45 yaşlarında çəki artımı və bədən dolğunluğu müşahidə oluna bilər. Yaşlılıqda boy qısalması və dəri elastikliyinin itirilməsi baş verir.",
        "category": "Antropometriya"
    },
    {
        "id": 31,
        "question": "Erqonomikanın elmi kimi nəyi əhatə edir (Nəzəriyyə, Metodologiya, Elmi biliklər və s.)?",
        "answer": "Erqonomika elmi kimi nəzəriyyəni (əsas qanunauyğunluqlar), metodologiyanı (tədqiqat üsulları), toplanmış elmi bilikləri, operativ vasitələri və qiymətləndirmə metodlarını əhatə edir. Bu komponentlər erqonomikanın tətbiqi elmi fənn kimi xüsusiliyini müəyyən edir.",
        "category": "Erqonomika nəzəriyyəsi"
    },
    {
        "id": 32,
        "question": "İnsan fəaliyyəti və fəaliyyətin gedişat amillərinin təhlili mərhələsi nəyi əhatə edir?",
        "answer": "Bu mərhələ erqonomik layihələndirmənin ilkin mərhələsidir. Burada operatorun funksiyaları, iş prosesinin strukturu, iş yükü, ətraf mühitin təsiri və mümkün səhvlər analiz edilir. Məqsəd problemləri aşkar etmək və tələbləri formalaşdırmaqdır.",
        "category": "İş analizi"
    },
    {
        "id": 33,
        "question": "Şəxsiyyətin psixoloji xüsusiyyətlərinin əsasları nədən ibarətdir?",
        "answer": "Şəxsiyyətin psixoloji xüsusiyyətləri onun əhəmiyyətli və az-çox daimi xassələrinin vəhdətidir (dünya görüşü, maraqları, xarakteri, istedadı, temperament). Bunlar həyat boyu dəyişə bilər və mühitdən asılıdır.",
        "category": "Psixologiya"
    },
    {
        "id": 34,
        "question": "Rəngin psixofizioloji və psixoloji təsiri nəticəsində yaranan \"rəng dayıları\" (qırmızı, yaşıl, sarı, bənövşəyi) hansılardır və xüsusiyyətləri nələrdir?",
        "answer": "Qırmızı: Aktivləşdirir, həyəcanlandırır, istilik hissi verir. Sarı: Şən, yüngül, diqqəti cəlb edir. Yaşıl: Sakitləşdirir, göz üçün ən rahat rəngdir, təhlükəsizlik hissi verir. Bənövşəyi: Pasiv, sirli, bəzən kədərli və ya təntənəli təsir bağışlayır.",
        "category": "Rəng psixologiyası"
    },
    {
        "id": 35,
        "question": "Yaşlı insanların (60 yaşdan yuxarı) antropometrik parametrlərinin orta ölçülərinin müəyyən edilməsi nə üçün vacibdir?",
        "answer": "Yaşlı insanlarda (60+) onurğanın deformasiyası nəticəsində boyun qısalması (kişilərdə 5%, qadınlarda 6%-ə qədər), əyilmə bucağının dəyişməsi və hərəkət məhdudiyyəti yaranır. Bu parametrlər onlar üçün rahat mühit və avadanlıq (xüsusilə mətbəx, sanitar qovşaq) layihələndirmək üçün vacibdir.",
        "category": "Gerontoloji erqonomika"
    },
    {
        "id": 36,
        "question": "Erqonomikanın predmeti olaraq elmi kimi (sistemlik-sistemin xüsusiyyətləri) nəyi öyrənir?",
        "answer": "Erqonomikanın predmeti sistemli yanaşma əsasında insanla texniki vasitələr və mühit arasındakı qarşılıqlı əlaqələri, fəaliyyət prosesinin qanunauyğunluqlarını öyrənməkdir.",
        "category": "Sistem analizi"
    },
    {
        "id": 37,
        "question": "Erqonomik tədqiqatların əsas istiqamətləri olan Analiz, Sintez (modelləşmə) və Obyektin Qiymətləndirilməsi nəyi əhatə edir?",
        "answer": "Analiz - mövcud sistemin və fəaliyyətin öyrənilməsi; Sintez (Modelləşmə) - yeni sistemin və ya elementin layihələndirilməsi, erqonomik parametrlərin tətbiqi; Qiymətləndirmə - yaradılmış obyektin erqonomik tələblərə uyğunluğunun yoxlanılması.",
        "category": "Tədqiqat metodları"
    },
    {
        "id": 38,
        "question": "Temperament tipləri (zəif, güclü xolerik, güclü sanqvinik, güclü fleqmatik) haqqında məlumat verin.",
        "answer": "1. Zəif (Melanxolik): Həssas, incə, lakin tez yorulan. 2. Güclü, qeyri-mütənasib (Xolerik): Enerjili, lakin tez qıcıqlanan. 3. Güclü, tarazlı, hərəkətli (Sanqvinik): Çevik, işgüzar, tez uyğunlaşan. 4. Güclü, tarazlı, ləng (Fleqmatik): Sakit, dözümlü, stressə dayanıqlı.",
        "category": "Psixologiya"
    },
    {
        "id": 39,
        "question": "Uzaqlaşma dərəcəsinin qavranılmasında (konvergensiya/ divergensiya və büllurun dartılması) rol oynayan fizioloji mexanizmlər hansılardır?",
        "answer": "Uzaqlaşma dərəcəsini qavramaq üçün konvergensiya (gözlərin yaxınlaşması), divergensiya (gözlərin aralanması) və akkomodasiya (göz büllurunun əyriliyinin dəyişməsi/dartılması) mexanizmləri rol oynayır. Binokulyar görmə (iki gözlə görmə) məsafəni və həcmi hiss etməyə imkan verir.",
        "category": "Fiziologiya"
    },
    {
        "id": 40,
        "question": "Materialların buxar keçiriciliyi nədir və onun sinetik lifli parçalarda yüksək olmamasının səbəbi nədir?",
        "answer": "Buxar keçiriciliyi materialın su buxarını keçirmə qabiliyyətidir. Sintetik liflər hamar, sıx struktura malikdir və nəm udmur (aşağı higroskopiklik), buna görə də onların buxar keçiriciliyi aşağıdır, bu da tərləməyə səbəb ola bilər.",
        "category": "Materialşünaslıq"
    },
    {
        "id": 41,
        "question": "Erqonomikanın məqsədlərindən biri olan – insanın maddi və mənəvi tələbatlarına cavab verən harmonik mühitin formalaşması nədən bəhs edir?",
        "answer": "Bu, erqonomikanın dizaynla əlaqəsini göstərir. Məqsəd yalnız funksional deyil, həm də estetik və kompozisiya baxımından bütöv, insana rahatlıq və zövq verən mühit yaratmaqdır. Bu, insanın həm səmərəli işləməsi, həm də ruhi rahatlığı üçün vacibdir.",
        "category": "Mühit dizaynı"
    },
    {
        "id": 42,
        "question": "Erqonomik tədqiqat işləri hansı kollektivlər tərəfindən yerinə yetirilir?",
        "answer": "Erqonomik tədqiqatlar kompleks xarakter daşıdığı üçün müxtəlif mütəxəssislər tərəfindən yerinə yetirilir: psixoloqlar, fizioloqlar, sanitarlar (gigiyenistlər), memarlar, dizaynerlər və mühəndislər.",
        "category": "Təşkilat"
    },
    {
        "id": 43,
        "question": "Diqqətin davamlılığına təsir edən səbəblər nələrdir?",
        "answer": "Diqqətin davamlılığına diqqət sahəsi (çox geniş və ya çox dar olması), obyektin ölçüsü, obyektin dinamikliyi (hərəkətli olması diqqəti daha asan saxlayır), işçinin marağı və yorğunluq dərəcəsi təsir edir.",
        "category": "Psixologiya"
    },
    {
        "id": 44,
        "question": "İnteryerin rəngləndirilməsində rəngin psixikaya olan güclü və zəif təsirindən (ağır/yüngül tonlar) hansı şəkildə istifadə olunur?",
        "answer": "İnteryerdə \"ağır\" (tünd, doymuş) rənglər adətən aşağı hissədə, \"yüngül\" (açıq, soyuq) rənglər isə yuxarı hissədə istifadə olunur ki, balans və genişlik hissi yaransın. Güclü rənglər diqqəti cəlb etmək üçün az miqdarda, zəif rənglər isə fon kimi istifadə edilir.",
        "category": "İnteryer dizaynı"
    },
    {
        "id": 45,
        "question": "Bədənin müxtəlif ölçülərinin (Boy, Çiyin, Bel, Çanaq və s.) dolğunluqdan asılı olaraq yaşlara (29-a kimi, 30-45 yaş, 45-dən yuxarı) görə dəyişməsi haqqında məlumat verin.",
        "answer": "Antropometrik tədqiqatlar göstərir ki, yaş artdıqca bədən ölçüləri dəyişir. 20-29 yaşda bədən stabilləşir. 30-45 yaşda çəki artımı, bel və çanaq ölçülərinin genişlənməsi müşahidə olunur. 45-dən yuxarı yaşda əzələ kütləsinin azalması və piy toxumasının artması, boyun qısalması baş verir.",
        "category": "Antropometriya"
    },
    {
        "id": 46,
        "question": "Erqonomikanın elmi kimi nəzəriyyə, metodologiya və elmi biliklər arasındakı qarşılıqlı əlaqəsinin strukturunu izah edin.",
        "answer": "Bu elementlər vəhdət təşkil edir. Nəzəriyyə əsas prinsipləri müəyyən edir, Metodologiya bu prinsipləri öyrənmək üçün yollar göstərir, toplanan Elmi Biliklər isə həm nəzəriyyəni zənginləşdirir, həm də praktiki (operativ) vasitələrin yaranmasına zəmin yaradır.",
        "category": "Erqonomika nəzəriyyəsi"
    },
    {
        "id": 47,
        "question": "Gigiyenik faktorlar nəyi əhatə edir?",
        "answer": "Gigiyenik faktorlar mikrobiqlim (hava, temperatur), işıqlandırma (təbii və süni), zərərli maddələr (toz, qaz), səs-küy, vibrasiya, şüalanma və bioloji agentləri əhatə edir. Bu faktorların normada olması insan sağlamlığı üçün vacibdir.",
        "category": "Əməyin mühafizəsi"
    },
    {
        "id": 48,
        "question": "Diqqətin bölünməsi prosesi nədir və insanın psixikasının bütün proses və xassələri baxımından rolu nədir?",
        "answer": "Diqqətin bölünməsi eyni zamanda bir neçə fəaliyyəti (məsələn, maşın sürmək və danışmaq) icra etmək bacarığıdır. Bu, psixikanın çevikliyini, məşq və təcrübə sayəsində avtomatlaşma səviyyəsini göstərir. İstehsalatda mürəkkəb əməliyyatların yerinə yetirilməsi üçün vacibdir.",
        "category": "Psixologiya"
    },
    {
        "id": 49,
        "question": "Rənglərin emosional-estetik təsirinin (sarı, bənövşəyi, qırmızı, yaşıl-mavi) hansı hissi reaksiyalara səbəb olduğunu izah edin.",
        "answer": "Sarı: Sevinc, ümid, yüngüllük. Bənövşəyi: Qeyri-müəyyənlik, sirr, bəzən kədər. Qırmızı: Güc, iradə, dinamika, bəzən aqressiya. Yaşıl-Mavi: Sərinlik, təravət, sakitlik, məkan genişliyi hissi.",
        "category": "Rəng psixologiyası"
    },
    {
        "id": 50,
        "question": "Əşyaların real ölçülərini görmək üçün əlavə komponent olaraq nəyin qiymətləndirilməsi vacibdir?",
        "answer": "Əşyanın real ölçülərini düzgün qiymətləndirmək üçün \"uzaqlaşma dərəcəsinin\" (məsafənin) qiymətləndirilməsi vacibdir. Beyin tor qişadakı təsvirin ölçüsünü məsafə ilə korrelyasiya edərək əşyanın həqiqi ölçüsünü qavrayır.",
        "category": "Vizual qavrayış"
    },
    {
        "id": 51,
        "question": "\"İnsan-maşın-mühit\" sistemində erqonomik tələblər hansı xüsusiyyətləri əhatə edir?",
        "answer": "Erqonomik tələblər sistemin idarə olunmasının rahatlığını, təhlükəsizliyini, informasiya mübadiləsinin sürətini və dəqiqliyini, həmçinin mühitin insana fiziki və psixoloji təsirinin optimallaşdırılmasını əhatə edir.",
        "category": "Sistem analizi"
    },
    {
        "id": 52,
        "question": "Müasir layihələndirmədə istifadə edilən \"İnsan faktorları\" və dizayn arasında formanın əmələ gəlməsinə təsir edən faktorlar hansılardır?",
        "answer": "Formanın yaranmasına insan faktorları (antropometriya, fiziologiya, psixologiya) birbaşa təsir edir. Dizayner formanı yaradarkən funksionallığı, erqonomik rahatlığı, estetik gözəlliyi və texnoloji istehsal imkanlarını balanslaşdırır.",
        "category": "Dizayn metodologiyası"
    },
    {
        "id": 53,
        "question": "Şəxsiyyətin sinir sisteminin növləri (zəif, güclü xolerik, güclü sanqvinik, güclü fleqmatik) və xüsusiyyətləri haqqında məlumat verin.",
        "answer": "- Zəif: Yüksək həssaslıq, az dözümlülük. - Güclü Xolerik (Balanssız): Yüksək enerji, lakin cilovlanmayan emosiyalar. - Güclü Sanqvinik (Balanslı, Hərəkətli): Yüksək iş qabiliyyəti, tez reaksiya. - Güclü Fleqmatik (Balanslı, Ləng): Təmkinli, dəqiq, lakin yavaş.",
        "category": "Psixologiya"
    },
    {
        "id": 54,
        "question": "Optik korreksiya üsullarının memarlıqda tətbiqinin məqsədi nədən ibarətdir?",
        "answer": "Memarlıqda optik korreksiya (məqsədli təhriflər) binanın vizual olaraq düzgün, dayanıqlı və harmonik görünməsini təmin etmək üçün tətbiq edilir. Bu, gözün təbii optik illüziyalarını (məsələn, uzun düz xətlərin əyilmiş kimi görünməsi) kompensasiya edir.",
        "category": "Memarlıq"
    },
    {
        "id": 55,
        "question": "Geyimin geyilən materiallarla bağlı gigiyenik xassələrindən istilik keçiriciliyinin əhəmiyyəti nədən ibarətdir?",
        "answer": "İstilik keçiriciliyi geyimin bədən temperaturunu tənzimləmə qabiliyyətidir. Soyuq mühitdə geyim aşağı istilik keçiriciliyinə malik olmalıdır (istiliyi saxlamalıdır), isti mühitdə isə əksinə, yüksək keçiriciliyə malik olmalıdır ki, bədən qızmasın.",
        "category": "Geyim erqonomikası"
    },
    {
        "id": 56,
        "question": "Erqonomikanın əsas məqsədi insan-maşın fəaliyyəti-obyektin-məskunluq mühitinin insan-maşın sistemində fəaliyyətin səmərəliliyinin yüksəldilməsi və keyfiyyətinin artırılması ilə bağlıdır.",
        "answer": "Bəli, erqonomikanın əsas məqsədi insan-maşın-mühit sistemini optimallaşdırmaqdır. Bu, əmək məhsuldarlığının, işin keyfiyyətinin və etibarlılığının artırılmasına, eyni zamanda işçinin sağlamlığının və şəxsiyyətinin inkişafının təmin edilməsinə yönəlmişdir.",
        "category": "Erqonomika əsasları"
    },
    {
        "id": 57,
        "question": "Müxtəlif mühitlərin erqonomikasının əsas vektorları (mühit komponentlərinin erqonomik həllində səhvlər, mühitin emosional vəziyyətinə təsir) nələrdir?",
        "answer": "Erqonomik həllərdəki səhvlər (narahatlıq, təhlükə) diskomfort və yorğunluq yaradır. Mühitin emosional vəziyyətə təsiri isə rəng, işıq və forma vasitəsilə insanın əhvalına müsbət və ya mənfi təsir göstərir. Erqonomika bu təsirləri müsbətə doğru yönəltməyi hədəfləyir.",
        "category": "Mühit dizaynı"
    },
    {
        "id": 58,
        "question": "Şəxsiyyətin psixoloji xüsusiyyətlərindən \"Maraqlar\" və \"Xarakter cəhətləri\"nin əsasları nədən ibarətdir?",
        "answer": "Maraqlar insanın müəyyən fəaliyyətə və ya obyektə xüsusi diqqət yetirməsidir. Xarakter cəhətləri isə insanın davranışında özünü göstərən iradi (məsələn, qətiyyət), emosional və intellektual xüsusiyyətləridir. Bunlar peşə seçiminə və işin keyfiyyətinə təsir edir.",
        "category": "Psixologiya"
    },
    {
        "id": 59,
        "question": "Somatoqrafiya metodunun əsas məqsədi və texniki vasitələri nələrdir?",
        "answer": "Somatoqrafiya insan bədəninin və iş yerinin ölçü nisbətlərini qrafik təsvir etmək metodudur. Məqsədi erqonomik uyğunluğu təmin etməkdir. Texniki vasitələri: sxemlər, çertyojlar, miqyaslı manekenlər (şablonlar) və onların iş yerinin planında təsviridir.",
        "category": "Tədqiqat metodları"
    },
    {
        "id": 60,
        "question": "Uzaq məsafədə obyektlərin qavranılması və məsafənin qeyri-düzgün qiymətləndirilməsi haqqında danışın (100 metr, 500 metr məsafə örnəkləri ilə)",
        "answer": "Müşahidələr göstərir ki, 100 metrlik məsafə qısalaraq 82-93 metr kimi, 500 metrlik məsafə isə 230-360 metr kimi qavranıla bilər. Bu qeyri-dəqiqlik ölçülərin vizual kiçilməsi və perspektiv təhriflərlə bağlıdır, bu da obyektlərin ölçüsünün səhv qiymətləndirilməsinə gətirib çıxarır.",
        "category": "Vizual qavrayış"
    }
]

data = {
    "subject": "Erqonomika və texniki dizayn",
    "totalQuestions": 60,
    "questions": questions,
    "categories": [
        "Erqonomika əsasları",
        "Sistem analizi",
        "Antropometriya",
        "Mühit dizaynı",
        "Geyim erqonomikası",
        "İnsan faktorları",
        "Psixologiya",
        "Materialşünaslıq",
        "Layihələndirmə",
        "Tədqiqat metodları",
        "Mebel dizaynı",
        "Vizual qavrayış",
        "Rəngşünaslıq",
        "Dizayn nəzəriyyəsi",
        "İnteryer dizaynı",
        "Anatomiya və sənət",
        "Erqonomika tarixi",
        "Təhlükəsizlik",
        "Erqonomika nəzəriyyəsi",
        "İş analizi",
        "Rəng psixologiyası",
        "Gerontoloji erqonomika",
        "Fiziologiya",
        "Təşkilat",
        "Əməyin mühafizəsi",
        "Dizayn metodologiyası"
    ]
}

with open('src/data/erqonomika-suallari.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated erqonomika-suallari.json with new answers based on lecture structure.")
