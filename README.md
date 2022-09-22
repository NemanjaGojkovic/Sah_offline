# Sah_offline
Igrica sah za samostalnu igru, javaScript

Ovo je uvod za samu igru i objasnjenje procesa razmisljanja i osnovnih pravila sahovske igre.
Necu ulaziti u osnovna pravila igre postosu trivijalna vec cu se posvetiti objasnjavanju manje poznatih pravila i samog
    toka kreiranja funnckionalnosti istih.
Prvo igra pocinje izborom vremenskog moda. Samo igranje na vreme je bazirano na tome da imate odgovarajuci broj minuta za odigravanje poteza.
Ukoliko je vas potez, vase vreme se trosi i kada se potez odigra vase vreme se zaledjuje, a protivnicko krece sa otkucavanjem i tako u krug.
Postoje vremenski modovi sa inkrementom. Nakon svakog odigranog poteza, vi cete dobiti bonus sekunde u zavisnosti koji mod je izabran.
Postoji klasikal vremenski mod kod kojeg nakon 40 odgranih poteza dobijate dodatnih 30 minuta vremena.
Tu je i vremenski mod neogranicenog vremena, gde se funkcija sata gasi i igra se na neograniceno vreme.
Na vrhu se nalaze dugmadi: Nova igra, Predaj, Vreme igranja i rotirajuce strelice.
Nova igra kreira novu igru, predaj predaje partiju, vreme igranja daje mogucnost promene vremenskog moda igre i rotirajuce strelice menjaju
    boju figura sa kojima igrate.
Figure se pomeraju sledecim mehanizmom: klikne se na zeljenu figuru, zatim se klikne na polje na koje zelite da odigrate potez.
(radi se mogucnosti da se figure prevuku na zeljeno polje...)
Prvi klik (koji mora biti na figuru) oznacava da se figura izabrala i pojavljuju se kruzici koji predstavljaju indikatore na koja polja
    izbrana figura ima pravo da stane.
Drugi klik je na prazno polje ili na protivnicku figuru, i to polje mora biti pokazano indikatorom inace je nelegalno.
Postoji funkcija sa ogranicenjima za kretanje figura(lovac dijagonalno...), funkcija sa ogranicenjima da figure ne smeju da prelaze jedne
    preko druge, kao i da li je sah ili nije koje kreiraju restrikcije kretanja figura.
Ukoliko je igrac pod sahom, on ne sme da odigra nijedan potez koji ga iz tog saha ne vadi (sme da pomeri kralja, blokira figurom sah,
    pojede figuru koja napada kralja...), a takodje ne sme da kraljem odigra potez koji ulazi u sah.
Rokada ne sme da se odigra ukoliko je kralj ili top koji se rokira pomeren ili je neko preko kog kralj prolazi napadnuto...
En passant je pravilo kod koga pijun sme da jede pijuna koji je odigrao dva polja unapred akko se nalazi odma pored njega
    i to je moguce izvesti samo prvi potez nakon sto se protivnicki pijun pomerio.
Takodje se prate polja koja napadaju figure za obe strane posebno, u odnosu na njih se proverava da li je neki potez legalan (rokada, sah...)
Prati se broj legalnih poteza svake figure za obe strane, ukoliko je beli na potezu i nema nijedan legalan potez onda se proverava da li
    je u sahu ili ne. Ukoliko jeste tada je u pitanju sah mat i beli je izgubio, dok je u suprotnom pat i ishod meca je neresen.
Neresen ishod je takodje u sledecim slucajevima: ako se odigra 50 poteza bez ijedne figure pojedene, ukoliko se na tabli nalaze figure kojima
    ne moze da se da mat (svaki slucaj gde ne nalazi pijun ili gde ima manje od 2 lovca ili 2 konja, ili kombinacija dve figure), ukoliko se
    pobedi na vreme al nema figura koje omogucavaju mat ili u koliko se jedna pozicija ponovila 3 puta(repeticija).
Repeticija se proverava tako sto se cuvaju pozicije, i ukoliko se nadju 3 iste, rezultat je neresen.
Nedovrsena je mogucnost pomeranja figura pomocu prevlacenja i dodavanje audio zvuka zbog odredjenih pucanja u kodu koje se dodatno moraju analizirati...
