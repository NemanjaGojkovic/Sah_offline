/*
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
*/

var izabranaFigura = false //da li je izabrana figura
var potezIgraca = 0 //koji igrac je na potezu (paran=beli, neparan=crni)
var trenutnaFigura //koja figura je izabrana
var trenutnoPolje //koje polje je izabrano
var signalKraljBeli = true //da li se pomerio beli kralj (true, znaci da nije)
var signalKraljCrni = true //da li se pomerio crni kralj
var signalTopBeliMalaRokada = true // dal i se pomerio beli top za malu rokadu
var signalTopCrniMalaRokada = true // da li se pomerio crni top za malu rokadu
var signalTopBeliVelikaRokada = true // da li se pomerio beli top za veliku rokadu
var signalTopCrniVelikaRokada = true // da li se pomerio crni top za veliku rokadu
var malaRokadaCrni = false //da li je crni odigrao malu rokadu
var malaRokadaBeli = false //da li je beli odigrao malu rokadu
var velikaRokadaCrni = false //da li je crni odigrao veliku rokadu
var velikaRokadaBeli = false //da li je beli odigrao veliku rokadu
var signalCrniPijuni=[false,false,false,false,false,false,false,false] //signali koji se odnosi na en passant, tj da li je beli ili crni
var signalBeliPijuni=[false,false,false,false,false,false,false,false] //pijun bio pomeren dva polja u prethodnom potezu
var enPassantBeli = false //signal da se en passant desio za bele
var enPassantCrni = false //signal da se en passant desio za crne
let kruziciSignal = false //signal koji nam omogucava da se kruzici ne pojavljuju kod trenutno nemogucih poteza
let signalOdigraniPotez=false //signal koji daje do znanja da li je potez odigran ili se bira potez
let brojacBeli=0 //koliko legalnih poteza ima beli
let brojacCrni=0 //koliko legalnih poteza ima crni
let brojacPoteza=0 //koliko poteza je odigrano
let brojacPotezaBezPojedeneFigure=0 //koliko poteza je proslo a da figura nije pojedena
let duzinaBelih=16 //koliko ima belih figura
let duzinaCrnih=16 //koliko ima crnih figura
let brojacPraznihPolja=0 //koliko ima praznih polja
let signalRepeticija=false //da li je doslo do repeticije poteza
let signalKlasikal=false //da li se izabrao klasikal mod
let dugmeZaVreme=document.querySelector('.vreme')
let dugmePredaja=document.querySelector('.predaja')
let dugmeNovaIgra=document.querySelector('.novaIgraVrh')
let dugmeNovaIgraMalo=document.querySelector('.novaIgra')
//audio zvuci
var move=document.getElementById("move")
var castles=document.getElementById("castles")
var capture=document.getElementById("capture")
var check=document.getElementById("check")
let intervalBeli=null //vremenski interval za sat za belog
let intervalCrni //vremenski interval za sat za crnog


//uzimamo sva polja sa table, i klikom na njih manipulisemo igrom
var polja = document.getElementsByTagName("td")
for(let i=0;i<polja.length;i++){
    polja[i].onclick=()=>{
        kliknutoPolje(polja[i])
    }
}

//izbor vremena (ovo predstavlja animaciju koja pojavljuje se vise puta u toku koda u razlicitim slucajevima)
setTimeout(()=>{document.querySelector('.overlay').style.display="flex"
    document.querySelector('.vremeIgranja').style.display="flex"}, 50)
setTimeout(()=>{document.querySelector('.overlay').style.opacity="0.7"
    document.querySelector('.vremeIgranja').style.top="260px"}, 100)


//vremena belog koja se koriste za sat
let startVremeBeli = document.getElementById('minutiBeli').innerHTML.substring(0,1)
let ukupnoVremeBeli = startVremeBeli * 6000
let zapravoVremeBeli = document.getElementById('minutiBeli')

//vremena crnog koja se koriste za sat
let startVremeCrni = document.getElementById('minutiCrni').innerHTML.substring(0,1)
let ukupnoVremeCrni = startVremeCrni * 6000
let zapravoVremeCrni = document.getElementById('minutiCrni')

//funkcija koja pokrece sat za belog(koriste se stotinke)
const otkucajiBeli = () =>{

    
    let minutiBeli = Math.floor(ukupnoVremeBeli/6000)
    let sekundeBeli = Math.floor((ukupnoVremeBeli%6000)/100)
    let stotinkeBeli = ukupnoVremeBeli%100
    sekundeBeli = sekundeBeli < 10 ? '0' + sekundeBeli : sekundeBeli //dodaje se nula da bi vreme bilo u formatu 00:00
    stotinkeBeli = stotinkeBeli < 10 ? '0' + stotinkeBeli : stotinkeBeli 
    if(ukupnoVremeBeli>=6000){
        zapravoVremeBeli.innerHTML=`${minutiBeli}:${sekundeBeli}` //ukoliko je vreme iznad minut prikazivace se minuti i sekunde
    }else{
        zapravoVremeBeli.innerHTML=`${sekundeBeli}:${stotinkeBeli}` //ukoliko je vreme ispod minut prikazivace se sekunde i stotinke
    }

    let minutiCrni = Math.floor(ukupnoVremeCrni/6000)
    let sekundeCrni = Math.floor((ukupnoVremeCrni%6000)/100)
    let stotinkeCrni = ukupnoVremeCrni%100
    sekundeCrni = sekundeCrni < 10 ? '0' + sekundeCrni : sekundeCrni 
    stotinkeCrni = stotinkeCrni < 10 ? '0' + stotinkeCrni : stotinkeCrni 
    if(ukupnoVremeCrni>=6000){
        zapravoVremeCrni.innerHTML=`${minutiCrni}:${sekundeCrni}` 
    }else{
        zapravoVremeCrni.innerHTML=`${sekundeCrni}:${stotinkeCrni}`
    }
    

    ukupnoVremeBeli-- //otkucaju vremena u stotinkama

    //kada je vreme na 20 sekundi od isteka boji se u crveno kako bi upozorilo igraca na preostalo vreme
    if(ukupnoVremeBeli<=2000){
        document.querySelector('.saticBeli').style.borderColor="red"
        document.querySelector('#vremeBeli').style.color="red"
    }

    //kraj vremena, poraz belog ili neresen ishod ukoliko crni ima nedostatak materijala
    if(ukupnoVremeBeli==0){
        zapravoVremeBeli.innerHTML=`00:00`
        if(crneFigure.length==1){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.nedostatakMaterijala')

            setTimeout(()=>{overlay.style.display="flex"
                blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                clearInterval(intervalBeli)
                clearInterval(intervalCrni)
                return 
        }
        if(crneFigure.length==2){
            if(crneFigure[0].childNodes[0].classList[2]=="kralj"){
                if(crneFigure[1].childNodes[0].classList[2]=="lovac" || crneFigure[1].childNodes[0].classList[2]=="konj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)
                        return
                }
            }
            if(crneFigure[0].childNodes[0].classList[2]=="lovac" || crneFigure[0].childNodes[0].classList[2]=="konj"){
                if(crneFigure[1].childNodes[0].classList[2]=="kralj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)

                        return
                }
            }
        }
        let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.beliIzgubioNaVreme')
    
            setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)
            
        //nakon sto se igra zavrsi, sat prestaje da otkucava (pojavljuje se nakon svakog prekida igre)
        clearInterval(intervalBeli)
        clearInterval(intervalCrni)
    }
}

//funckija koja pokrece sat za crnog (isti princip kao i za belog)
const otkucajiCrni = () =>{


    let minutiCrni = Math.floor(ukupnoVremeCrni/6000)
    let sekundeCrni = Math.floor((ukupnoVremeCrni%6000)/100)
    let stotinkeCrni = ukupnoVremeCrni%100
    sekundeCrni = sekundeCrni < 10 ? '0' + sekundeCrni : sekundeCrni 
    stotinkeCrni = stotinkeCrni < 10 ? '0' + stotinkeCrni : stotinkeCrni 
    if(ukupnoVremeCrni>=6000){
        zapravoVremeCrni.innerHTML=`${minutiCrni}:${sekundeCrni}`
    }else{
        zapravoVremeCrni.innerHTML=`${sekundeCrni}:${stotinkeCrni}`
    }

    let minutiBeli = Math.floor(ukupnoVremeBeli/6000)
    let sekundeBeli = Math.floor((ukupnoVremeBeli%6000)/100)
    let stotinkeBeli = ukupnoVremeBeli%100
    sekundeBeli = sekundeBeli < 10 ? '0' + sekundeBeli : sekundeBeli
    stotinkeBeli = stotinkeBeli < 10 ? '0' + stotinkeBeli : stotinkeBeli 
    if(ukupnoVremeBeli>=6000){
        zapravoVremeBeli.innerHTML=`${minutiBeli}:${sekundeBeli}`
    }else{
        zapravoVremeBeli.innerHTML=`${sekundeBeli}:${stotinkeBeli}`
    }

    ukupnoVremeCrni--

    if(ukupnoVremeCrni<=2000){
        document.querySelector('.saticCrni').style.borderColor="red"
        document.querySelector('#vremeCrni').style.color="red"
    }

    if(ukupnoVremeCrni==0){
        zapravoVremeCrni.innerHTML=`00:00`
        if(beleFigure.length==1){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.nedostatakMaterijala')
    
            setTimeout(()=>{overlay.style.display="flex"
                blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                clearInterval(intervalBeli)
                clearInterval(intervalCrni)

            return
        }
        if(beleFigure.length==2){
            if(beleFigure[0].childNodes[0].classList[2]=="kralj"){
                if(beleFigure[1].childNodes[0].classList[2]=="lovac" || beleFigure[1].childNodes[0].classList[2]=="konj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)

                        return
                }
            }
            if(beleFigure[0].childNodes[0].classList[2]=="lovac" || beleFigure[0].childNodes[0].classList[2]=="konj"){
                if(beleFigure[1].childNodes[0].classList[2]=="kralj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)

                        return
                }
            }
        }
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.crniIzgubioNaVreme')
    
            setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

        clearInterval(intervalBeli)
        clearInterval(intervalCrni)
    }

}



//ova funckija se poziva svaki put kad se klikne na polje i ona je glavna funnkcija same igre, jer omogucava kretanje figura
const kliknutoPolje = (polje) => {
    if(izabranaFigura==false){ //poredimo da li je kliknuto polje kako bi se izabrala figura kojom se igra potez ili destinacija same figure
        if(polje.childNodes[0]==null){ //ukoliko je prvo izabrano prazno polje, a ne figura, funckija ne radi nista
            return
        }
        
        if((potezIgraca%2==0 && polje.childNodes[0].classList[1]=="crnaFigura") ||  //ne sme se igrati igrac ciji nije potez na redu
           (potezIgraca%2==1 && polje.childNodes[0].classList[1]=="belaFigura")){  
            return
        }  

        signalOdigraniPotez=false
        izabranaFigura=true
        trenutnaFigura=polje.innerHTML
        trenutnoPolje=polje
        polje.style.backgroundColor="rgba(127, 255, 212, 0.6)"

        //pojavljivanje kruzica nakon klika na figuru koji pokazuju sva moguca polja na koja izabrana figura moze da ide
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if((primarnaOgranicenjePokreta(sahovskaTabla[i][j], trenutnoPolje) && 
                ogranicenjaPrelazaPrekoFigura(sahovskaTabla[i][j], trenutnoPolje)) &&
                !(sahovskaTabla[i][j].childNodes.length!=0 && sahovskaTabla[i][j].childNodes[0].classList[1]=="crnaFigura" && potezIgraca%2==1) &&
                !(sahovskaTabla[i][j].childNodes.length!=0 && sahovskaTabla[i][j].childNodes[0].classList[1]=="belaFigura" && potezIgraca%2==0)
                ){
                    //ukoliko je moguca rokada, pojavice se i kruzic za to polje
                    if(trenutnoPolje.childNodes[0].classList[2]=="kralj" && trenutnoPolje.childNodes[0].classList[1]=="belaFigura"){
                        if(signalKraljBeli && signalTopBeliMalaRokada && sahovskaTabla[7][5].childNodes.length==0 &&
                            sahovskaTabla[7][6].childNodes.length==0 && sahovskaTabla[7][4]==trenutnoPolje && !napadnutaPoljaCrni[7][4]
                            && !napadnutaPoljaCrni[7][5] && !napadnutaPoljaCrni[7][6]){
                                    sahovskaTabla[7][6].style.backgroundImage="url('slike/tackaCrnoPolje.png')"
                                    sahovskaTabla[7][6].style.backgroundPosition="center"
                                    sahovskaTabla[7][6].style.backgroundSize="60px"
                            }
                    }
                    if(trenutnoPolje.childNodes[0].classList[2]=="kralj" && trenutnoPolje.childNodes[0].classList[1]=="belaFigura"){
                        if(signalKraljBeli && signalTopBeliVelikaRokada && sahovskaTabla[7][1].childNodes.length==0 &&
                            sahovskaTabla[7][2].childNodes.length==0 && sahovskaTabla[7][3].childNodes.length==0 &&
                            sahovskaTabla[7][4]==trenutnoPolje && !napadnutaPoljaCrni[7][4]
                            && !napadnutaPoljaCrni[7][3] && !napadnutaPoljaCrni[7][2]){
                                    sahovskaTabla[7][2].style.backgroundImage="url('slike/tackaCrnoPolje.png')"
                                    sahovskaTabla[7][2].style.backgroundPosition="center"
                                    sahovskaTabla[7][2].style.backgroundSize="60px"
                            }
                    }
                    if(trenutnoPolje.childNodes[0].classList[2]=="kralj" && trenutnoPolje.childNodes[0].classList[1]=="crnaFigura"){
                        if(signalKraljCrni && signalTopCrniMalaRokada && sahovskaTabla[0][5].childNodes.length==0 &&
                            sahovskaTabla[0][6].childNodes.length==0 && sahovskaTabla[0][4]==trenutnoPolje && !napadnutaPoljaBeli[0][4]
                            && !napadnutaPoljaBeli[0][5] && !napadnutaPoljaBeli[0][6]){
                                sahovskaTabla[0][6].style.backgroundImage="url('slike/tackaBeloPolje.png')"
                                sahovskaTabla[0][6].style.backgroundPosition="center"
                                sahovskaTabla[0][6].style.backgroundSize="60px"
                            }
                    }
                    if(trenutnoPolje.childNodes[0].classList[2]=="kralj" && trenutnoPolje.childNodes[0].classList[1]=="crnaFigura"){
                        if(signalKraljCrni && signalTopCrniVelikaRokada && sahovskaTabla[0][1].childNodes.length==0 &&
                            sahovskaTabla[0][2].childNodes.length==0 && sahovskaTabla[0][3].childNodes.length==0 &&
                            sahovskaTabla[0][4]==trenutnoPolje && !napadnutaPoljaBeli[0][4]
                            && !napadnutaPoljaBeli[0][3] && !napadnutaPoljaBeli[0][2]){
                                sahovskaTabla[0][2].style.backgroundImage="url('slike/tackaBeloPolje.png')"
                                sahovskaTabla[0][2].style.backgroundPosition="center"
                                sahovskaTabla[0][2].style.backgroundSize="60px"
                            }
                    }

                    pomocniInnerHTML=sahovskaTabla[i][j].innerHTML
                    sahovskaTabla[i][j].innerHTML=trenutnaFigura
                    trenutnoPolje.innerHTML=null
                    for(let i=0;i<8;i++){
                        for(let j=0;j<8;j++){
                            napadnutaPoljaBeli[i][j]=false
                            napadnutaPoljaCrni[i][j]=false
                        }
                    }
                    poljaKojeFigureNapadaju()
                    if((sahOgranicenjeBeli() && potezIgraca%2==0) || (sahOgranicenjeCrni() && potezIgraca%2==1)){
                        kruziciSignal=true
                    }
                    sahovskaTabla[i][j].innerHTML=pomocniInnerHTML
                    trenutnoPolje.innerHTML=trenutnaFigura
                    
                    if(!kruziciSignal){
                        if(sahovskaTabla[i][j].classList[0]=="bela"){
                            sahovskaTabla[i][j].style.backgroundImage="url('slike/tackaBeloPolje.png')"
                            sahovskaTabla[i][j].style.backgroundPosition="center"
                            sahovskaTabla[i][j].style.backgroundSize="60px"
                        }
                        if(sahovskaTabla[i][j].classList[0]=="crna"){
                            sahovskaTabla[i][j].style.backgroundImage="url('slike/tackaCrnoPolje.png')"
                            sahovskaTabla[i][j].style.backgroundPosition="center"
                            sahovskaTabla[i][j].style.backgroundSize="60px"
                        }
                    }
                    
                    kruziciSignal=false
                    
                }
            }
        }

        //ukoliko se predje preko fipolja na koja figura moze da stane,obojice se celo polje u boju kruzica na njoj
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                sahovskaTabla[i][j].addEventListener('mouseover',()=>{
                    if(sahovskaTabla[i][j].style.backgroundImage!=0){
                        if(sahovskaTabla[i][j].classList[0]=="crna"){
                            sahovskaTabla[i][j].style.backgroundColor="rgb(71, 33, 84)"
                        }
                        if(sahovskaTabla[i][j].classList[0]=="bela"){
                            sahovskaTabla[i][j].style.backgroundColor="rgb(172, 150, 212)"
                        }
                    }
                })
               
                //vracanje boje polja na deafult vrednost nakon pomeranja misa sa nje
                sahovskaTabla[i][j].addEventListener('mouseout',()=>{
                    if(sahovskaTabla[i][j]!=trenutnoPolje){
                        if(sahovskaTabla[i][j].classList[0]=="crna"){
                            sahovskaTabla[i][j].style.backgroundColor="rgb(102, 49, 2)"
                        }
                        if(sahovskaTabla[i][j].classList[0]=="bela"){
                            sahovskaTabla[i][j].style.backgroundColor="rgb(252, 220, 192)"
                        }
                    }
                })
            }
        }
                    
        
        
    }else{

        //ovaj deo koda je deo u kome je funkcija kliknutoPolje() drugi put pozvana tj. da je kliknuto na polje na koje bi figura trebalo da dodje

        signalOdigraniPotez=true //potez je odigran

        //otklanjanje kruzica sa table
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                sahovskaTabla[i][j].style.backgroundImage=null
            }
        }

        //ukoliko se izabere isto polje kao i prvi put, ne desava se nista jer je figura vec na tom polju pa ne moze da se pomeri na njega
        if(polje==trenutnoPolje){
            if(trenutnoPolje.classList[0]=="bela"){ 
                trenutnoPolje.style.backgroundColor="rgb(252, 220, 192)"
            }
            if(trenutnoPolje.classList[0]=="crna"){
                trenutnoPolje.style.backgroundColor="rgb(102, 49, 2)"
            }
                izabranaFigura=false
               return
        }
        

        //ne smeju da se jedu figure iste bolje, u tom slucaju ce se polje figure na sekundu ofarbati u crveno kako bi ukazalo na gresku
        //(isto to ce se ponoviti i kod ostalih nelegalnih poteza, osim u slucaju kada se klikne na isto polje gde se figura nalazi)
        if(polje.childNodes[0]!=null){
            if((potezIgraca%2==0 && polje.childNodes[0].classList[1]=="belaFigura") || 
               (potezIgraca%2==1 && polje.childNodes[0].classList[1]=="crnaFigura")){
                if(trenutnoPolje.classList[0]=="bela"){ 
                    trenutnoPolje.style.backgroundColor="red"
                    setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(252, 220, 192)", 100)
                }
                if(trenutnoPolje.classList[0]=="crna"){
                    trenutnoPolje.style.backgroundColor="red"
                    setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(102, 49, 2)", 100)
                }
                    izabranaFigura=false
                   return
               }
        }
        if(trenutnoPolje.classList[0]=="bela"){
            trenutnoPolje.style.backgroundColor="rgb(252, 220, 192)"
        }else{
            trenutnoPolje.style.backgroundColor="rgb(102, 49, 2)"
        }

        

        //provera da li figure postuju definisana ogranicenja kretanja
            if(!primarnaOgranicenjePokreta(polje, trenutnoPolje) || !ogranicenjaPrelazaPrekoFigura(polje, trenutnoPolje)){
                if(trenutnoPolje.classList[0]=="bela"){ 
                    trenutnoPolje.style.backgroundColor="red"
                    setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(252, 220, 192)", 100)
                }
                if(trenutnoPolje.classList[0]=="crna"){
                    trenutnoPolje.style.backgroundColor="red"
                    setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(102, 49, 2)", 100)
                }
                    izabranaFigura=false
                   return
               } 


               
        //izvrsavanje male rokade crnog
        if(malaRokadaCrni){
            sahovskaTabla[0][7].innerHTML=null
            sahovskaTabla[0][5].innerHTML=`<img class="figura crnaFigura top malaRokada" src="slike/Chess_rdt60.png" alt="">`
            malaRokadaCrni=false

        }

        //izvrsavanje male rokade belog
        if(malaRokadaBeli){
            sahovskaTabla[7][7].innerHTML=null
            sahovskaTabla[7][5].innerHTML=`<img class="figura belaFigura top malaRokada" src="slike/Chess_rlt60.png" alt="">`
            malaRokadaBeli=false

        }

        //izvrsavanje velike rokade crnog
        if(velikaRokadaCrni){
            sahovskaTabla[0][0].innerHTML=null
            sahovskaTabla[0][3].innerHTML=`<img class="figura crnaFigura top malaRokada" src="slike/Chess_rdt60.png" alt="">`
            velikaRokadaCrni=false

        }

        //izvrsavanje velike rokade belog
        if(velikaRokadaBeli){
            sahovskaTabla[7][0].innerHTML=null
            sahovskaTabla[7][3].innerHTML=`<img class="figura belaFigura top malaRokada" src="slike/Chess_rlt60.png" alt="">`
            velikaRokadaBeli=false

        }

        //izvrsavanje en passant-a belog
        if(enPassantBeli){
            for(let i=0;i<8;i++){
                for(let j=0;j<8;j++){
                    if(polje==sahovskaTabla[i][j]){
                        sahovskaTabla[i+1][j].innerHTML=null
                        enPassantBeli=false
                    }
                }
            }
        }

        //izvrsavanje en passanta-a crnog
        if(enPassantCrni){
            for(let i=0;i<8;i++){
                for(let j=0;j<8;j++){
                    if(polje==sahovskaTabla[i][j]){
                        sahovskaTabla[i-1][j].innerHTML=null
                        enPassantCrni=false
                    }
                }
            }
        }

        //izvrsavanje promocije pijuna u drugu figuru
        promocijaFigura(polje, trenutnoPolje)

        let pomocnoPolje=polje.innerHTML
        polje.innerHTML=trenutnaFigura
        trenutnoPolje.innerHTML=null
        izabranaFigura=false
        potezIgraca++
        
        

        
        //resetovanje napadnutih polja za sve figure
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                napadnutaPoljaBeli[i][j]=false
                napadnutaPoljaCrni[i][j]=false
            }
        }

        //ponovno popunjavanje napadnutih polja za sve figure
        poljaKojeFigureNapadaju()
        
        //ogranicenje da se ne sme napraviti potez gde kralj ide na napadnuto polje ili da se ne spreci sah
        if(sahOgranicenjeCrni() && potezIgraca%2==0){
            polje.innerHTML=pomocnoPolje
            trenutnoPolje.innerHTML=trenutnaFigura
            potezIgraca--

            if(trenutnoPolje.classList[0]=="bela"){ 
                trenutnoPolje.style.backgroundColor="red"
                setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(252, 220, 192)", 100)
            }
            if(trenutnoPolje.classList[0]=="crna"){
                trenutnoPolje.style.backgroundColor="red"
                setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(102, 49, 2)", 100)
            }
                izabranaFigura=false
                odigranPotez=false
               return
        }

        if(sahOgranicenjeBeli() && potezIgraca%2==1){
            polje.innerHTML=pomocnoPolje
            trenutnoPolje.innerHTML=trenutnaFigura
            potezIgraca--

            if(trenutnoPolje.classList[0]=="bela"){ 
                trenutnoPolje.style.backgroundColor="red"
                setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(252, 220, 192)", 100)
            }
            if(trenutnoPolje.classList[0]=="crna"){
                trenutnoPolje.style.backgroundColor="red"
                setTimeout(()=>trenutnoPolje.style.backgroundColor="rgb(102, 49, 2)", 100)
            }
                izabranaFigura=false
                odigranPotez=false
               return
        }

        
        //ukoliko en passant nije izvrsen u prvom potezu, ne moze se vise izvrsiti
        if(potezIgraca%2==0){
            for(let i=0;i<signalBeliPijuni.length;i++){
                signalBeliPijuni[i]=false
            }
        }

        if(potezIgraca%2==1){
            for(let i=0;i<signalCrniPijuni.length;i++){
                signalCrniPijuni[i]=false
            }
        }

        brojacPoteza++

        //provera da li je sah mat
        sahMat()

        //provera da li je proslo 50 poteza bez pojedene figure
        if(duzinaBelih==beleFigure.length && duzinaCrnih==crneFigure.length){
            brojacPotezaBezPojedeneFigure++
            if(brojacPotezaBezPojedeneFigure==100){
                let overlay=document.querySelector('.overlay')
                let blok = document.querySelector('.poteza50')

                setTimeout(()=>{overlay.style.display="flex"
                    blok.style.display="flex"}, 50)
                setTimeout(()=>{overlay.style.opacity="0.7"
                    blok.style.top="260px"}, 100)

                clearInterval(intervalBeli)
                clearInterval(intervalCrni)

                return
            }
        }else{
            brojacPotezaBezPojedeneFigure=0
        }

        
        duzinaBelih=beleFigure.length
        duzinaCrnih=crneFigure.length

        //crni matiran
        if(potezIgraca%2==1 && brojacCrni==0 && sahOgranicenjeCrni()){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.crniMatiran')

            clearInterval(intervalBeli)
            clearInterval(intervalCrni)

            setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                return
            
        }
        //pat pozicija
        if(potezIgraca%2==1 && brojacCrni==0 && !sahOgranicenjeCrni()){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.pat')
    
            setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                clearInterval(intervalBeli)
                clearInterval(intervalCrni)

                return
        }     
        //beli matiran
        if(potezIgraca%2==0 && brojacBeli==0 && sahOgranicenjeBeli()){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.beliMatiran')
    
            setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                clearInterval(intervalBeli)
                clearInterval(intervalCrni)

                return
        }

        if(potezIgraca%2==0 && brojacBeli==0 && !sahOgranicenjeBeli()){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.pat')
    
            setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                clearInterval(intervalBeli)
                clearInterval(intervalCrni)

                return
        }
        
        //nedostatak materijala
        if(beleFigure.length==2 && crneFigure.length==1){
            if(beleFigure[0].childNodes[0].classList[2]=="kralj"){
                if(beleFigure[1].childNodes[0].classList[2]=="lovac" || beleFigure[1].childNodes[0].classList[2]=="konj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)

                        return
                }
            }
            if(beleFigure[0].childNodes[0].classList[2]=="lovac" || beleFigure[0].childNodes[0].classList[2]=="konj"){
                if(beleFigure[1].childNodes[0].classList[2]=="kralj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)

                        return
                }
            }
        }

        if(beleFigure.length==1 && crneFigure.length==2){
            if(crneFigure[0].childNodes[0].classList[2]=="kralj"){
                if(crneFigure[1].childNodes[0].classList[2]=="lovac" || crneFigure[1].childNodes[0].classList[2]=="konj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)
                        return
                }
            }
            if(crneFigure[0].childNodes[0].classList[2]=="lovac" || crneFigure[0].childNodes[0].classList[2]=="konj"){
                if(crneFigure[1].childNodes[0].classList[2]=="kralj"){
                    let overlay=document.querySelector('.overlay')
                    let blok = document.querySelector('.nedostatakMaterijala')
    
                    setTimeout(()=>{overlay.style.display="flex"
                        blok.style.display="flex"}, 50)
                    setTimeout(()=>{overlay.style.opacity="0.7"
                        blok.style.top="260px"}, 100)

                        clearInterval(intervalBeli)
                        clearInterval(intervalCrni)

                        return
                }
            }
        }

        if(beleFigure.length==1 && crneFigure.length==1){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.nedostatakMaterijala')
    
            setTimeout(()=>{overlay.style.display="flex"
                 blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                clearInterval(intervalBeli)
                clearInterval(intervalCrni)
                return
        }

        //ukoliko je u pitanju igra koja ima vremenski inkrement, nakon odigranog poteza se povecava za odredjen broj sekundi
        //ukoliko je klasikal vremenski mod, nakon 40 poteza svakog igraca, dobija se dodatnih 30 minuta vremena
        if(potezIgraca%2==1){
            if(brojacPoteza==79 && signalKlasikal){
                ukupnoVremeBeli+=180000
            }
            if(inkrement1){
                ukupnoVremeBeli+=100
            }
            if(inkrement2){
                ukupnoVremeBeli+=200
            }
            if(inkrement3){
                ukupnoVremeBeli+=300
            }
            if(inkrement5){
                ukupnoVremeBeli+=500
            }
            if(inkrement10){
                ukupnoVremeBeli+=1000
            }
            if(inkrement15){
                ukupnoVremeBeli+=1500
            }
            if(inkrement30){
                ukupnoVremeBeli+=3000
            }
        }

        if(potezIgraca%2==0){
            if(brojacPoteza==80 && signalKlasikal){
                ukupnoVremeCrni+=180000
            }
            if(inkrement1){
                ukupnoVremeCrni+=100
            }
            if(inkrement2){
                ukupnoVremeCrni+=200
            }
            if(inkrement3){
                ukupnoVremeCrni+=300
            }
            if(inkrement5){
                ukupnoVremeCrni+=500
            }
            if(inkrement10){
                ukupnoVremeCrni+=1000
            }
            if(inkrement15){
                ukupnoVremeCrni+=1500
            }
            if(inkrement30){
                ukupnoVremeCrni+=3000
            }
        }
        
        //ukoliko se igra neogranicen vremenski mod, sat se ukida
        if(document.getElementById('minutiCrni').innerHTML=='∞' && document.getElementById('minutiBeli').innerHTML=='∞'){
            intervalCrni=null
        }

        //ukoliko se ne igra neogranicen vremenski mod, sat se aktivira
        if(potezIgraca%2==0 && document.getElementById('minutiCrni').innerHTML!='∞' && document.getElementById('minutiBeli').innerHTML!='∞'){
            intervalBeli=setInterval(otkucajiBeli,10)
            clearInterval(intervalCrni)
        }

        if(potezIgraca%2==1 && document.getElementById('minutiBeli').innerHTML!='∞' && document.getElementById('minutiCrni').innerHTML!='∞'){
            intervalCrni=setInterval(otkucajiCrni,10)
            clearInterval(intervalBeli)
        }

        //nakon sto je partija krenula, ne moze da se promeni vremenski mod igre
        dugmeZaVreme.removeEventListener('click', vremeIgranja)

        //kreiranje kopije table kako bi se proveravalo da li je doslo do repeticije poteza
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                if(sahovskaTabla[i][j].childNodes.length==0){
                    repeticijaTabla[i][j]="x"
                    brojacPraznihPolja++
                }else{
                    if(sahovskaTabla[i][j].childNodes[0].classList[1]=="crnaFigura"){
                        switch(sahovskaTabla[i][j].childNodes[0].classList[2]){
                            case "kralj":
                                repeticijaTabla[i][j]="crniKralj"
                                break
                            case "kraljica":
                                repeticijaTabla[i][j]="crnaKraljica"
                                break
                            case "lovac":
                                if(sahovskaTabla[i][j].classList[0]=="bela"){
                                    repeticijaTabla[i][j]="crniSvetliLovac"
                                }else{
                                    repeticijaTabla[i][j]="crniTamniLovac"
                                }
                                break
                            case "konj":
                                repeticijaTabla[i][j]="crniKonj"
                                break
                            case "top":
                                repeticijaTabla[i][j]="crniTop"
                                break
                            case "pijun":
                                repeticijaTabla[i][j]="crniPijun"
                                break
                            default:
                                break
                        }
                    }else{
                        switch(sahovskaTabla[i][j].childNodes[0].classList[2]){
                            case "kralj":
                                repeticijaTabla[i][j]="beliKralj"
                                break
                            case "kraljica":
                                repeticijaTabla[i][j]="belaKraljica"
                                break
                            case "lovac":
                                if(sahovskaTabla[i][j].classList[0]=="bela"){
                                    repeticijaTabla[i][j]="beliSvetliLovac"
                                }else{
                                    repeticijaTabla[i][j]="beliTamniLovac"
                                }
                                break
                            case "konj":
                                repeticijaTabla[i][j]="beliKonj"
                                break
                            case "top":
                                repeticijaTabla[i][j]="beliTop"
                                break
                            case "pijun":
                                repeticijaTabla[i][j]="beliPijun"
                                break
                            default:
                                break
                        }
                    }
                }
            }
    
        }

        

        skupRepeticijaTabla.push(JSON.parse(JSON.stringify(repeticijaTabla)))
        proveraRepeticije()

        //repeticija
        if(signalRepeticija){
            let overlay=document.querySelector('.overlay')
            let blok = document.querySelector('.repeticija')

            clearInterval(intervalBeli)
            clearInterval(intervalCrni)

            setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
            setTimeout(()=>{overlay.style.opacity="0.7"
                blok.style.top="260px"}, 100)

                return
        }
        brojacPraznihPolja=0





    }


    

    



}

//kreiranje matrice koja ce sluziti kao sahovska tabla
let sahovskaTablaPrototip = document.querySelectorAll('td')
let brojPolja=0
let sahovskaTabla=[[],[],[],[],[],[],[],[]]
if(document.location.pathname=='/sahBeli.html'){
    for(let i = 0;i<8;i++){
        for(let j=0;j<8;j++){
            sahovskaTabla[i][j]=sahovskaTablaPrototip[brojPolja++]
        }
    }
}

//ukoliko se izabere da se igra sa crnim figurama, sahovska tabla ce obrnuti vrednosti
if(document.location.pathname=='/sahCrni.html'){
    for(let i = 7;i>=0;i--){
        for(let j=7;j>=0;j--){
            sahovskaTabla[i][j]=sahovskaTablaPrototip[brojPolja++]
        }
    }
}

//deifinisanje matrice koja ce uzimati trenutne pozicije table (repeticijaTable), i cuvati ih u nizu (skupRepeticijaTable)
let repeticijaTabla=[[],[],[],[],[],[],[],[]]
let skupRepeticijaTabla=[]



//primarna ogranicenja kretanja

const primarnaOgranicenjePokreta = (izabranoPolje, prethodnoPolje) => {

    //definisanje izabranih i trenutnih kolona i redova (pojavljuje se u skoro svakoj funckiji)
    let redIzabrano
    let kolonaIzabrano
    let redPrethodno
    let kolonaPrethodno
    
    for(let i = 0;i<8;i++){
        for(let j=0;j<8;j++){
            if(izabranoPolje==sahovskaTabla[i][j]){
                redIzabrano=i
                kolonaIzabrano=j
            }
            if(prethodnoPolje==sahovskaTabla[i][j]){
                redPrethodno=i
                kolonaPrethodno=j
            }

        }
    }

    //ogranicenje za lovca (dijagonalo)
    if(prethodnoPolje.childNodes[0].classList[2]=="lovac"){

        for(let pom=1;pom<8;pom++){
            if((redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno+pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno+pom)){
               return true
           }
        }

           return false
    }
    //ogranicenje za topa (horizontalno i vretikalno)
    if(prethodnoPolje.childNodes[0].classList[2]=="top"){
        for(let pom=1;pom<8;pom++){
            if((redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno)||
                (redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno)||
                (redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno+pom)){
                    if(redPrethodno==0 && kolonaPrethodno==0 && signalOdigraniPotez){
                        signalTopCrniVelikaRokada=false
                    }
                    if(redPrethodno==0 && kolonaPrethodno==7 && signalOdigraniPotez){
                        signalTopCrniMalaRokada=false
                    }
                    if(redPrethodno==7 && kolonaPrethodno==0 && signalOdigraniPotez){
                        signalTopBeliVelikaRokada=false
                    }
                    if(redPrethodno==7 && kolonaPrethodno==7 && signalOdigraniPotez){
                        signalTopBeliMalaRokada=false
                    }


               return true
           }
        }

           return false
    }
    //ogranicenje za kraljicu (horizontalno, vertikalno i dijagonalno)
    if(prethodnoPolje.childNodes[0].classList[2]=="kraljica"){
        for(let pom=1;pom<8;pom++){
            if((redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno+pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno+pom)||
                (redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno)||
                (redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno)||
                (redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno+pom)){
               return true
           }
        }

           return false
    }
    //ogranicenje za kralja (horizontalno, vertikalno i dijagonalno, ali po jedno polje)
    if(prethodnoPolje.childNodes[0].classList[2]=="kralj"){
        let pom=1
        if((redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno+pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno+pom)||
                (redIzabrano==redPrethodno-pom && kolonaIzabrano==kolonaPrethodno)||
                (redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno-pom)||
                (redIzabrano==redPrethodno+pom && kolonaIzabrano==kolonaPrethodno)||
                (redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno+pom)){

                //onemogucavanje rokade nakon pomeranja
                if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura" && signalOdigraniPotez){
                    signalKraljCrni=false 
                }
                if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura" && signalOdigraniPotez){
                    signalKraljBeli=false
                }
               return true
        }

           // mala rokada
           if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
                if(redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno+2 &&
                rokada(izabranoPolje,trenutnoPolje,signalKraljCrni,signalKraljBeli,signalTopCrniMalaRokada,signalTopBeliMalaRokada)
                && signalOdigraniPotez){
                        malaRokadaCrni=true
                         return true
                  }
           }

           if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
            if(redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno+2 &&
                rokada(izabranoPolje,trenutnoPolje,signalKraljCrni,signalKraljBeli,signalTopCrniMalaRokada,signalTopBeliMalaRokada)
                && signalOdigraniPotez){
                    malaRokadaBeli=true
                    return true
                }
           }

           //velika rokada
           
           if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
            if(redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno-2 &&
                rokada(izabranoPolje,trenutnoPolje,signalKraljCrni,signalKraljBeli,signalTopCrniVelikaRokada,signalTopBeliVelikaRokada)
                && signalOdigraniPotez){
                    velikaRokadaCrni=true
                     return true
              }
            }

            if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
             if(redIzabrano==redPrethodno && kolonaIzabrano==kolonaPrethodno-2 &&
                rokada(izabranoPolje,trenutnoPolje,signalKraljCrni,signalKraljBeli,signalTopCrniVelikaRokada,signalTopBeliVelikaRokada)
                && signalOdigraniPotez){
                    velikaRokadaBeli=true
                    return true
              }
            }

            


           return false
    }
    //ogranicenje za konja (L oblik)
    if(prethodnoPolje.childNodes[0].classList[2]=="konj"){
        if((redIzabrano==redPrethodno-2 && kolonaIzabrano==kolonaPrethodno-1)||
                (redIzabrano==redPrethodno-2 && kolonaIzabrano==kolonaPrethodno+1)||
                (redIzabrano==redPrethodno+1 && kolonaIzabrano==kolonaPrethodno-2)||
                (redIzabrano==redPrethodno+1 && kolonaIzabrano==kolonaPrethodno+2)||
                (redIzabrano==redPrethodno-1 && kolonaIzabrano==kolonaPrethodno+2)||
                (redIzabrano==redPrethodno-1 && kolonaIzabrano==kolonaPrethodno-2)||
                (redIzabrano==redPrethodno+2 && kolonaIzabrano==kolonaPrethodno-1)||
                (redIzabrano==redPrethodno+2 && kolonaIzabrano==kolonaPrethodno+1)){
               return true
           }

           return false
    }
    //ogranicenje za pijuna 
    if(prethodnoPolje.childNodes[0].classList[2]=="pijun"){

        //ukoliko jede, jede dijagonalno
        if(jedenjePijunom(izabranoPolje, prethodnoPolje)){
            return true
        }

        //unapred jedno polje
        if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
            if(redIzabrano==redPrethodno+1 && kolonaIzabrano==kolonaPrethodno){
                return true
            }
        }

        if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
            if(redIzabrano==redPrethodno-1 && kolonaIzabrano==kolonaPrethodno){
                return true
            }
        }

        //ukoliko se nalazi na pocetnoj poziciji, moze da ide 2 polja unapred, ali samo jednom
        if(redPrethodno==1){
            if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
                if(redIzabrano==redPrethodno+2 && kolonaIzabrano==kolonaPrethodno){
                    if(sahovskaTabla[redIzabrano][kolonaIzabrano+1]!=null){
                        if(sahovskaTabla[redIzabrano][kolonaIzabrano+1].childNodes[0]!=null){
                            if(sahovskaTabla[redIzabrano][kolonaIzabrano+1].childNodes[0].classList[2]=="pijun" &&
                            sahovskaTabla[redIzabrano][kolonaIzabrano+1].childNodes[0].classList[1]=="belaFigura" && signalOdigraniPotez){
                                for(let i=0;i<signalCrniPijuni.length;i++){
                                     signalCrniPijuni[kolonaIzabrano]=true
                                 }
                            }
                        }
                    }
                    if(sahovskaTabla[redIzabrano][kolonaIzabrano-1]!=null){
                        if(sahovskaTabla[redIzabrano][kolonaIzabrano-1].childNodes[0]!=null){
                            if(sahovskaTabla[redIzabrano][kolonaIzabrano-1].childNodes[0].classList[2]=="pijun" &&
                            sahovskaTabla[redIzabrano][kolonaIzabrano-1].childNodes[0].classList[1]=="belaFigura" && signalOdigraniPotez){
                                for(let i=0;i<signalCrniPijuni.length;i++){
                                     signalCrniPijuni[kolonaIzabrano]=true
                                 }
                            }
                        }
                    }

                    return true
                }

                

            }
        }
    
            if(redPrethodno==6){
                if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
                    if(redIzabrano==redPrethodno-2 && kolonaIzabrano==kolonaPrethodno){
                        if(sahovskaTabla[redIzabrano][kolonaIzabrano+1]!=null){
                            if(sahovskaTabla[redIzabrano][kolonaIzabrano+1].childNodes[0]!=null){
                                if(sahovskaTabla[redIzabrano][kolonaIzabrano+1].childNodes[0].classList[2]=="pijun" &&
                                sahovskaTabla[redIzabrano][kolonaIzabrano+1].childNodes[0].classList[1]=="crnaFigura"  && signalOdigraniPotez){
                                        for(let i=0;i<signalBeliPijuni.length;i++){
                                         signalBeliPijuni[kolonaIzabrano]=true
                                         }
                                    }
                            }
                        }
                        if(sahovskaTabla[redIzabrano][kolonaIzabrano-1]!=null){
                            if(sahovskaTabla[redIzabrano][kolonaIzabrano-1].childNodes[0]!=null){
                                if(sahovskaTabla[redIzabrano][kolonaIzabrano-1].childNodes[0].classList[2]=="pijun" &&
                                sahovskaTabla[redIzabrano][kolonaIzabrano-1].childNodes[0].classList[1]=="crnaFigura"  && signalOdigraniPotez){
                                        for(let i=0;i<signalBeliPijuni.length;i++){
                                         signalBeliPijuni[kolonaIzabrano]=true
                                         }
                                    }
                            }
                        }
                        return true
                    }
    
                    
                }
            }

            
        

        
        

        return false

    }

    

 

    
}

//ogranicenja koja su vezana za to da figure ne mogu da preskacu druge figure

const ogranicenjaPrelazaPrekoFigura = (izabranoPolje, prethodnoPolje) => {


    let redIzabrano
    let kolonaIzabrano
    let redPrethodno
    let kolonaPrethodno
    
    for(let i = 0;i<8;i++){
        for(let j=0;j<8;j++){
            if(izabranoPolje==sahovskaTabla[i][j]){
                redIzabrano=i
                kolonaIzabrano=j
            }
            if(prethodnoPolje==sahovskaTabla[i][j]){
                redPrethodno=i
                kolonaPrethodno=j
            }

        }
    }

    //ogranicenje za lovca
    if(prethodnoPolje.childNodes[0].classList[2]=="lovac"){

        if(redPrethodno<redIzabrano && kolonaPrethodno<kolonaIzabrano){
            for(let i=redPrethodno+1, j=kolonaPrethodno+1;i<redIzabrano;i++, j++){
                

                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno>redIzabrano && kolonaPrethodno<kolonaIzabrano){
            for(let i=redPrethodno-1, j=kolonaPrethodno+1;j<kolonaIzabrano;i--, j++){
                
                    
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                        return false
                }
                
            }
        }

        if(redPrethodno<redIzabrano && kolonaPrethodno>kolonaIzabrano){
            for(let i=redPrethodno+1, j=kolonaPrethodno-1;i<redIzabrano;i++, j--){
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno>redIzabrano && kolonaPrethodno>kolonaIzabrano){
            for(let i=redPrethodno-1, j=kolonaPrethodno-1;i>redIzabrano;i--,j--){
                
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }


           return true
    }

    //ogranicenje za topa

    if(prethodnoPolje.childNodes[0].classList[2]=="top"){

        if(redPrethodno<redIzabrano && kolonaPrethodno==kolonaIzabrano){
            for(let i=redPrethodno+1, j=kolonaPrethodno;i<redIzabrano;i++){
                

                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno>redIzabrano && kolonaPrethodno==kolonaIzabrano){
            for(let i=redPrethodno-1, j=kolonaPrethodno;i>redIzabrano;i--){
                
                    
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                        return false
                }
                
            }
        }

        if(redPrethodno==redIzabrano && kolonaPrethodno>kolonaIzabrano){
            for(let i=redPrethodno, j=kolonaPrethodno-1;j>kolonaIzabrano; j--){
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno==redIzabrano && kolonaPrethodno<kolonaIzabrano){
            for(let i=redPrethodno, j=kolonaPrethodno+1;j<kolonaIzabrano;j++){
                
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }


           return true
    }

    // ogranicenja za kraljicu

    if(prethodnoPolje.childNodes[0].classList[2]=="kraljica"){

        if(redPrethodno<redIzabrano && kolonaPrethodno<kolonaIzabrano){
            for(let i=redPrethodno+1, j=kolonaPrethodno+1;i<redIzabrano;i++, j++){
                

                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno>redIzabrano && kolonaPrethodno<kolonaIzabrano){
            for(let i=redPrethodno-1, j=kolonaPrethodno+1;j<kolonaIzabrano;i--, j++){
                
                    
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                        return false
                }
                
            }
        }

        if(redPrethodno<redIzabrano && kolonaPrethodno>kolonaIzabrano){
            for(let i=redPrethodno+1, j=kolonaPrethodno-1;i<redIzabrano;i++, j--){
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno>redIzabrano && kolonaPrethodno>kolonaIzabrano){
            for(let i=redPrethodno-1, j=kolonaPrethodno-1;i>redIzabrano;i--,j--){
                
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }


        if(redPrethodno<redIzabrano && kolonaPrethodno==kolonaIzabrano){
            for(let i=redPrethodno+1, j=kolonaPrethodno;i<redIzabrano;i++){
                

                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno>redIzabrano && kolonaPrethodno==kolonaIzabrano){
            for(let i=redPrethodno-1, j=kolonaPrethodno;i>redIzabrano;i--){
                
                    
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                        return false
                }
                
            }
        }

        if(redPrethodno==redIzabrano && kolonaPrethodno>kolonaIzabrano){
            for(let i=redPrethodno, j=kolonaPrethodno-1;j>kolonaIzabrano; j--){
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }

        if(redPrethodno==redIzabrano && kolonaPrethodno<kolonaIzabrano){
            for(let i=redPrethodno, j=kolonaPrethodno+1;j<kolonaIzabrano;j++){
                
                if(sahovskaTabla[i][j].childNodes[0]!=null){
                    return false
                }
            }
        }


           return true
    }

    //ogranicenje za kralja da ne moze da ide na napadnuta polja

    if(prethodnoPolje.childNodes[0].classList[2]=="kralj"){
        if(!ogranicenjaKraja(prethodnoPolje, redIzabrano, kolonaIzabrano)){
            return false
        }
    }


    //za konja ne postoje ogranicenja, jer on preskace preko figura


    //ogranicenje za pijuna

    if(prethodnoPolje.childNodes[0].classList[2]=="pijun"){

        if(jedenjePijunom(izabranoPolje, trenutnoPolje)){
            return true
        }
       
        if(sahovskaTabla[redIzabrano][kolonaIzabrano].childNodes[0]!=null){
            return false
        }
        

       

        if(redPrethodno==1){
            if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
                if((sahovskaTabla[redIzabrano+1][kolonaIzabrano].childNodes[0]!=null 
                    && sahovskaTabla[redIzabrano][kolonaIzabrano].childNodes[0]!=null) ||
                    (sahovskaTabla[redIzabrano-1][kolonaIzabrano].childNodes[0]!=null 
                        && sahovskaTabla[redIzabrano][kolonaIzabrano].childNodes[0]==null && redPrethodno==redIzabrano-2) ){
                    return false
                }
            }
    
        }

        if(redPrethodno==6){
            if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
                if((sahovskaTabla[redIzabrano-1][kolonaIzabrano].childNodes[0]!=null 
                    && sahovskaTabla[redIzabrano][kolonaIzabrano].childNodes[0]!=null) ||
                    (sahovskaTabla[redIzabrano+1][kolonaIzabrano].childNodes[0]!=null 
                        && sahovskaTabla[redIzabrano][kolonaIzabrano].childNodes[0]==null && redPrethodno==redIzabrano+2) ){
                    return false
                }
            }
        }

        return true
    }

    return true

}
// omogucavanje pijuna da jede dijagonalno

const jedenjePijunom = (izabranoPolje, prethodnoPolje) => {

    let redIzabrano
    let kolonaIzabrano
    let redPrethodno
    let kolonaPrethodno
    
    for(let i = 0;i<8;i++){
        for(let j=0;j<8;j++){
            if(izabranoPolje==sahovskaTabla[i][j]){
                redIzabrano=i
                kolonaIzabrano=j
            }
            if(prethodnoPolje==sahovskaTabla[i][j]){
                redPrethodno=i
                kolonaPrethodno=j
            }

        }
    }

 

    if(prethodnoPolje.childNodes[0].classList[2]=="pijun"){
        if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
            if(sahovskaTabla[redIzabrano][kolonaIzabrano].childNodes[0]!=null && redIzabrano==redPrethodno+1 &&
                (kolonaIzabrano==kolonaPrethodno+1||kolonaIzabrano==kolonaPrethodno-1)){
                return true
            }
        }

        if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
            if(sahovskaTabla[redIzabrano][kolonaIzabrano].childNodes[0]!=null && redIzabrano==redPrethodno-1 &&
                 (kolonaIzabrano==kolonaPrethodno+1 || kolonaIzabrano==kolonaPrethodno-1)){
                return true
            }
        }

        //en passant
        if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
            if(signalBeliPijuni[kolonaIzabrano] && (kolonaIzabrano==kolonaPrethodno-1 || kolonaIzabrano==kolonaPrethodno+1) &&
             redIzabrano==redPrethodno+1){
                enPassantCrni=true
                return true
            }
        }

        if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
            if(signalCrniPijuni[kolonaIzabrano] && (kolonaIzabrano==kolonaPrethodno-1 || kolonaIzabrano==kolonaPrethodno+1) &&
            redIzabrano==redPrethodno-1){
                enPassantBeli=true
                return true
            }
        }
        





        return false
    }

    

}

//ogranicenja vezana za rokadu
const rokada=(izabranoPolje, prethodnoPolje, signalKraljCrni, signalKraljBeli, signalTopCrni, signalTopBeli)=>{

    

    //mala rokada

    if(prethodnoPolje.childNodes[0].classList[2]=="kralj"){
        if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
            if(signalKraljCrni && signalTopCrni && sahovskaTabla[0][6].childNodes[0]==null && sahovskaTabla[0][5].childNodes[0]==null){
                if(!napadnutaPoljaBeli[0][6] && !napadnutaPoljaBeli[0][5] && !napadnutaPoljaBeli[0][4]){
                    return true
                }
            }
        }
    }

    if(prethodnoPolje.childNodes[0].classList[2]=="kralj"){
        if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
            if(signalKraljBeli && signalTopBeli && sahovskaTabla[7][5].childNodes[0]==null && sahovskaTabla[7][6].childNodes[0]==null){
                if(!napadnutaPoljaCrni[7][6] && !napadnutaPoljaCrni[7][5] && !napadnutaPoljaCrni[7][4]){
                    return true
                }
            }
        }
    }

    //velika rokada

    if(prethodnoPolje.childNodes[0].classList[2]=="kralj"){
        if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
            if(signalKraljCrni && signalTopCrni && sahovskaTabla[0][1].childNodes[0]==null && sahovskaTabla[0][2].childNodes[0]==null &&
                sahovskaTabla[0][3].childNodes[0]==null){
                    if(!napadnutaPoljaBeli[0][2] && !napadnutaPoljaBeli[0][3] && !napadnutaPoljaBeli[0][4]){
                        return true
                    }
            }
        }
    }

    if(prethodnoPolje.childNodes[0].classList[2]=="kralj"){
        if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
            if(signalKraljBeli && signalTopBeli && sahovskaTabla[7][1].childNodes[0]==null && sahovskaTabla[7][2].childNodes[0]==null &&
                sahovskaTabla[7][2].childNodes[0]==null){
                    if(!napadnutaPoljaCrni[7][2] && !napadnutaPoljaCrni[7][3] && !napadnutaPoljaCrni[7][4]){
                        return true
                    }
            }
        }
    }

return false

    
}

//polja koja napadaju figure
let napadnutaPoljaBeli=[
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false]
] 

let napadnutaPoljaCrni=[
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false]
]

//davanje matricama napdanutaPoljaBeli i napadnutaPoljaCrni vrednosti koje oznacavaju da li je to polje napadnuto od strane belih/crnih figura

const poljaKojeFigureNapadaju=()=>{

    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(sahovskaTabla[i][j].childNodes.length!=0){
                if(sahovskaTabla[i][j].childNodes[0].classList[1]=="crnaFigura"){
                    //polja koje lovac napada
                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="lovac"){
                        for(let r=i-1,k=j-1;sahovskaTabla[r]!=null;k--,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j+1;sahovskaTabla[r]!=null;k++,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j-1;sahovskaTabla[r]!=null;k--,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j+1;sahovskaTabla[r]!=null;k++,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }

                    }
                    //polja koja top napada
                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="top"){
                        for(let r=i,k=j-1;sahovskaTabla[r][k]!=null;k--){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaCrni[r][k]=true
                                break
                            }
                            napadnutaPoljaCrni[r][k]=true
                        }
                        for(let r=i,k=j+1;sahovskaTabla[r][k]!=null;k++){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaCrni[r][k]=true
                                break
                            }
                            napadnutaPoljaCrni[r][k]=true
                        }
                        for(let r=i+1,k=j;sahovskaTabla[r]!=null;r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j;sahovskaTabla[r]!=null;r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }

                    }
                    
                    //polja koja napada kraljica
                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="kraljica"){
                        for(let r=i,k=j-1;sahovskaTabla[r][k]!=null;k--){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaCrni[r][k]=true
                                break
                            }
                            napadnutaPoljaCrni[r][k]=true
                        }
                        for(let r=i,k=j+1;sahovskaTabla[r][k]!=null;k++){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaCrni[r][k]=true
                                break
                            }
                            napadnutaPoljaCrni[r][k]=true
                        }
                        for(let r=i+1,k=j;sahovskaTabla[r]!=null;r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j;sahovskaTabla[r]!=null;r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j-1;sahovskaTabla[r]!=null;k--,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j+1;sahovskaTabla[r]!=null;k++,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j-1;sahovskaTabla[r]!=null;k--,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j+1;sahovskaTabla[r]!=null;k++,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaCrni[r][k]=true
                                    break
                                }
                                napadnutaPoljaCrni[r][k]=true
                            }
                        }
                    }

                    //polja koja napada konj

                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="konj"){
                        if(sahovskaTabla[i+1]!=null){
                            if(sahovskaTabla[i+1][j-2]!=null){
                                napadnutaPoljaCrni[i+1][j-2]=true
                            }
                        }
                        if(sahovskaTabla[i+1]!=null){
                            if(sahovskaTabla[i+1][j+2]!=null){
                                napadnutaPoljaCrni[i+1][j+2]=true
                            }
                        }
                        if(sahovskaTabla[i+2]!=null){
                            if(sahovskaTabla[i+2][j-1]!=null){
                                napadnutaPoljaCrni[i+2][j-1]=true
                            }
                        }
                        if(sahovskaTabla[i+2]!=null){
                            if(sahovskaTabla[i+2][j+1]!=null){
                                napadnutaPoljaCrni[i+2][j+1]=true
                            }
                        }
                        if(sahovskaTabla[i-1]!=null){
                            if(sahovskaTabla[i-1][j-2]!=null){
                                napadnutaPoljaCrni[i-1][j-2]=true
                            }
                        }
                        if(sahovskaTabla[i-1]!=null){
                            if(sahovskaTabla[i-1][j+2]!=null){
                                napadnutaPoljaCrni[i-1][j+2]=true
                            }
                        }
                        if(sahovskaTabla[i-2]!=null){
                            if(sahovskaTabla[i-2][j-1]!=null){
                                napadnutaPoljaCrni[i-2][j-1]=true
                            }
                        }
                        if(sahovskaTabla[i-2]!=null){
                            if(sahovskaTabla[i-2][j+1]!=null){
                                napadnutaPoljaCrni[i-2][j+1]=true
                            }
                        }
                        
                    }

                    //polja koja napada kralj

                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="kralj"){
                        if(sahovskaTabla[i+1]!=null){
                            if(sahovskaTabla[i+1][j]!=null){
                                napadnutaPoljaCrni[i+1][j]=true
                            }
                            if(sahovskaTabla[i+1][j-1]!=null){
                                napadnutaPoljaCrni[i+1][j-1]=true
                            }
                            if(sahovskaTabla[i+1][j+1]!=null){
                                napadnutaPoljaCrni[i+1][j+1]=true
                            }
                        }
                        if(sahovskaTabla[i-1]!=null){
                            if(sahovskaTabla[i-1][j+1]!=null){
                                napadnutaPoljaCrni[i-1][j+1]=true
                            }
                            if(sahovskaTabla[i-1][j]!=null){
                                napadnutaPoljaCrni[i-1][j]=true
                            }
                            if(sahovskaTabla[i-1][j-1]!=null){
                                napadnutaPoljaCrni[i-1][j-1]=true
                            }
                        }
                        if(sahovskaTabla[i][j+1]!=null){
                            napadnutaPoljaCrni[i][j+1]=true
                        }
                        if(sahovskaTabla[i][j]!=null){
                            napadnutaPoljaCrni[i][j]=true
                        }
                        if(sahovskaTabla[i][j-1]!=null){
                            napadnutaPoljaCrni[i][j-1]=true
                        }
                        
                    }

                    //polja koja napada pijun

                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="pijun"){
                        if(sahovskaTabla[i+1]!=null){
                            if(sahovskaTabla[i+1][j+1]!=null){
                                napadnutaPoljaCrni[i+1][j+1]=true
                            }
                            if(sahovskaTabla[i+1][j-1]!=null){
                                napadnutaPoljaCrni[i+1][j-1]=true
                            }
                        }
                    }

                }
            
                if(sahovskaTabla[i][j].childNodes[0].classList[1]=="belaFigura"){
                    //polja koje lovac napada
                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="lovac"){
                        for(let r=i-1,k=j-1;sahovskaTabla[r]!=null;k--,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j+1;sahovskaTabla[r]!=null;k++,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j-1;sahovskaTabla[r]!=null;k--,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j+1;sahovskaTabla[r]!=null;k++,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }

                    }
                    //polja koaj top napada
                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="top"){
                        for(let r=i,k=j-1;sahovskaTabla[r][k]!=null;k--){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaBeli[r][k]=true
                                break
                            }
                            napadnutaPoljaBeli[r][k]=true
                        }
                        for(let r=i,k=j+1;sahovskaTabla[r][k]!=null;k++){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaBeli[r][k]=true
                                break
                            }
                            napadnutaPoljaBeli[r][k]=true
                        }
                        for(let r=i+1,k=j;sahovskaTabla[r]!=null;r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j;sahovskaTabla[r]!=null;r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }

                    }
                    
                    //pola koja napada kraljica
                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="kraljica"){
                        for(let r=i,k=j-1;sahovskaTabla[r][k]!=null;k--){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaBeli[r][k]=true
                                break
                            }
                            napadnutaPoljaBeli[r][k]=true
                        }
                        for(let r=i,k=j+1;sahovskaTabla[r][k]!=null;k++){
                            if(sahovskaTabla[r][k].childNodes.length!=0){
                                napadnutaPoljaBeli[r][k]=true
                                break
                            }
                            napadnutaPoljaBeli[r][k]=true
                        }
                        for(let r=i+1,k=j;sahovskaTabla[r]!=null;r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j;sahovskaTabla[r]!=null;r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j-1;sahovskaTabla[r]!=null;k--,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j+1;sahovskaTabla[r]!=null;k++,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i+1,k=j-1;sahovskaTabla[r]!=null;k--,r++){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                        for(let r=i-1,k=j+1;sahovskaTabla[r]!=null;k++,r--){
                            if(sahovskaTabla[r][k]!=null){
                                if(sahovskaTabla[r][k].childNodes.length!=0){
                                    napadnutaPoljaBeli[r][k]=true
                                    break
                                }
                                napadnutaPoljaBeli[r][k]=true
                            }
                        }
                    }

                    //polja koja napada konj

                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="konj"){
                        if(sahovskaTabla[i+1]!=null){
                            if(sahovskaTabla[i+1][j-2]!=null){
                                napadnutaPoljaBeli[i+1][j-2]=true
                            }
                        }
                        if(sahovskaTabla[i+1]!=null){
                            if(sahovskaTabla[i+1][j+2]!=null){
                                napadnutaPoljaBeli[i+1][j+2]=true
                            }
                        }
                        if(sahovskaTabla[i+2]!=null){
                            if(sahovskaTabla[i+2][j-1]!=null){
                                napadnutaPoljaBeli[i+2][j-1]=true
                            }
                        }
                        if(sahovskaTabla[i+2]!=null){
                            if(sahovskaTabla[i+2][j+1]!=null){
                                napadnutaPoljaBeli[i+2][j+1]=true
                            }
                        }
                        if(sahovskaTabla[i-1]!=null){
                            if(sahovskaTabla[i-1][j-2]!=null){
                                napadnutaPoljaBeli[i-1][j-2]=true
                            }
                        }
                        if(sahovskaTabla[i-1]!=null){
                            if(sahovskaTabla[i-1][j+2]!=null){
                                napadnutaPoljaBeli[i-1][j+2]=true
                            }
                        }
                        if(sahovskaTabla[i-2]!=null){
                            if(sahovskaTabla[i-2][j-1]!=null){
                                napadnutaPoljaBeli[i-2][j-1]=true
                            }
                        }
                        if(sahovskaTabla[i-2]!=null){
                            if(sahovskaTabla[i-2][j+1]!=null){
                                napadnutaPoljaBeli[i-2][j+1]=true
                            }
                        }
                        
                    }

                    //polja koja napada kralj

                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="kralj"){
                        if(sahovskaTabla[i+1]!=null){
                            if(sahovskaTabla[i+1][j]!=null){
                                napadnutaPoljaBeli[i+1][j]=true
                            }
                            if(sahovskaTabla[i+1][j-1]!=null){
                                napadnutaPoljaBeli[i+1][j-1]=true
                            }
                            if(sahovskaTabla[i+1][j+1]!=null){
                                napadnutaPoljaBeli[i+1][j+1]=true
                            }
                        }
                        if(sahovskaTabla[i-1]!=null){
                            if(sahovskaTabla[i-1][j+1]!=null){
                                napadnutaPoljaBeli[i-1][j+1]=true
                            }
                            if(sahovskaTabla[i-1][j]!=null){
                                napadnutaPoljaBeli[i-1][j]=true
                            }
                            if(sahovskaTabla[i-1][j-1]!=null){
                                napadnutaPoljaBeli[i-1][j-1]=true
                            }
                        }
                        if(sahovskaTabla[i][j+1]!=null){
                            napadnutaPoljaBeli[i][j+1]=true
                        }
                        if(sahovskaTabla[i][j]!=null){
                            napadnutaPoljaBeli[i][j]=true
                        }
                        if(sahovskaTabla[i][j-1]!=null){
                            napadnutaPoljaBeli[i][j-1]=true
                        }
                        
                    }

                    //polja koja napada pijun

                    if(sahovskaTabla[i][j].childNodes[0].classList[2]=="pijun"){
                        if(sahovskaTabla[i-1]!=null){
                            if(sahovskaTabla[i-1][j+1]!=null){
                                napadnutaPoljaBeli[i-1][j+1]=true
                            }
                            if(sahovskaTabla[i-1][j-1]!=null){
                                napadnutaPoljaBeli[i-1][j-1]=true
                            }
                        }
                    }

                }


            }
        }
    }
    


}


const ogranicenjaKraja = (prethodnoPolje, redIzabrano, kolonaIzabrano) => {



    //ogranicenje gde kralj ne moze da stane na napadnuto polje
    
    
    if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
        if(napadnutaPoljaBeli[redIzabrano][kolonaIzabrano]){
             return false
         }
    }
    if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
        if(napadnutaPoljaCrni[redIzabrano][kolonaIzabrano]){
             return false
        }
    }
    
    

return true


}

//da li je kralj napadnut
const sahOgranicenjeCrni = () =>{

    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(sahovskaTabla[i][j].childNodes.length!=0){
                if(sahovskaTabla[i][j].childNodes[0].classList[1]=="crnaFigura" &&
                 sahovskaTabla[i][j].childNodes[0].classList[2]=="kralj"){
                     if(napadnutaPoljaBeli[i][j]){
                         return true
                     }
                }
            }
        }
    }
}

const sahOgranicenjeBeli=()=>{
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(sahovskaTabla[i][j].childNodes.length!=0){
                if(sahovskaTabla[i][j].childNodes[0].classList[1]=="belaFigura" &&
                 sahovskaTabla[i][j].childNodes[0].classList[2]=="kralj"){
                     if(napadnutaPoljaCrni[i][j]){
                         return true
                     }
                }
            }
        }
    }
}

//elementi animacija nakon kraja meca
let pozadina = document.querySelector('.overlay')
let izborBeli = document.querySelector('.promocijaBeli')
let izborCrni = document.querySelector('.promocijaCrni')
let dodatneFigureBele = document.getElementsByClassName('promocijaPoljeBeli')
let dodatneFigureCrne = document.getElementsByClassName('promocijaPoljeCrni')


//ukoliko pijun dodje do kraja table bira u koju ce se figuru pretvoriti    
const promocijaFigura = (izabranoPolje, prethodnoPolje) => {

    let redIzabrano
    let kolonaIzabrano
    let redPrethodno
    let kolonaPrethodno
    
    for(let i = 0;i<8;i++){
        for(let j=0;j<8;j++){
            if(izabranoPolje==sahovskaTabla[i][j]){
                redIzabrano=i
                kolonaIzabrano=j
            }
            if(prethodnoPolje==sahovskaTabla[i][j]){
                redPrethodno=i
                kolonaPrethodno=j
            }

        }
    }

    

    if(prethodnoPolje.childNodes.length!=0){
        if(prethodnoPolje.childNodes[0].classList[2]=="pijun"){
            if(prethodnoPolje.childNodes[0].classList[1]=="crnaFigura"){
                if(redIzabrano==7){
                    pozadina.style.display="flex"
                    pozadina.style.opacity="0.7"
                    izborCrni.style.display="flex"
                    for(let i=0;i<dodatneFigureCrne.length;i++){
                        dodatneFigureCrne[i].onclick=()=>{
                            sahovskaTabla[redIzabrano][kolonaIzabrano].innerHTML=dodatneFigureCrne[i].innerHTML
                            pozadina.style.display="none"
                            pozadina.style.opacity="0"
                            izborCrni.style.display="none"
                        }
                    }
                    
                }
            }
    
            
    
            if(prethodnoPolje.childNodes[0].classList[1]=="belaFigura"){
                if(redIzabrano==0){
                    pozadina.style.display="flex"
                    pozadina.style.opacity="0.7"
                    izborBeli.style.display="flex"
                    for(let i=0;i<dodatneFigureBele.length;i++){
                        dodatneFigureBele[i].onclick=()=>{
                            sahovskaTabla[redIzabrano][kolonaIzabrano].innerHTML=dodatneFigureBele[i].innerHTML
                            pozadina.style.display="none"
                            pozadina.style.opacity="0"
                            izborBeli.style.display="none"
                        }
                    }
                    
                }
            }
    }

        

    }

        





}

//koje su bele/crne figure i dalje na tabli
let beleFigure=[]

let crneFigure=[]

//koristi se funkcija kliknutoPolje() kako bi se proverilo da li postoji legalan potez za bilo koju figuru trenutnog igraca
//ukoliko takav potez ne postoji, igrac je matiran
const sahMat= () => {
    
    beleFigure=[]
    crneFigure=[]
    let brojBeleFigure=0
    let brojCrneFigure=0
    
    
    
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(sahovskaTabla[i][j].childNodes.length!=0){
                if(sahovskaTabla[i][j].childNodes[0].classList[1]=="belaFigura"){
                     beleFigure[brojBeleFigure++]=sahovskaTabla[i][j]
                }
                if(sahovskaTabla[i][j].childNodes[0].classList[1]=="crnaFigura"){
                    crneFigure[brojCrneFigure++]=sahovskaTabla[i][j]
               }
            }
        }
    }
    

    if(potezIgraca%2==0){
        brojacBeli=0
        for(let k=0;k<beleFigure.length;k++){
            beleFigure[k].click()
            for(let i=0;i<8;i++){
                for(let j=0;j<8;j++){
                    if(sahovskaTabla[i][j].style.backgroundImage!=0){
                        brojacBeli++
                    }
                }
            }
            beleFigure[k].click()
            if(beleFigure[k].classList[0]=="crna"){
                beleFigure[k].style.backgroundColor="rgb(102, 49, 2)"
            }
            if(beleFigure[k].classList[0]=="bela"){
                beleFigure[k].style.backgroundColor="rgb(252, 220, 192)"
            }
    
        }
    }
    
    if(potezIgraca%2==1){
        brojacCrni=0
        for(let k=0;k<crneFigure.length;k++){
            crneFigure[k].click()
            for(let i=0;i<8;i++){
                for(let j=0;j<8;j++){
                    if(sahovskaTabla[i][j].style.backgroundImage!=0){
                        brojacCrni++
                    }
                }
            }
            crneFigure[k].click()
            if(crneFigure[k].classList[0]=="crna"){
                crneFigure[k].style.backgroundColor="rgb(102, 49, 2)"
            }
            if(crneFigure[k].classList[0]=="bela"){
                crneFigure[k].style.backgroundColor="rgb(252, 220, 192)"
            }
    
        }
    }







}

//kada se klikne na dugme x kod iskakajucih prozora
const iskljucivanje = (dugme) =>{
    let overlay=document.querySelector('.overlay')
    let blok = dugme.parentElement.parentElement
    
    overlay.style.display="none"
    blok.style.display="none"

    //onemogucava se da se klikne ista na tabli osim nove igre
    for(let i=0;i<polja.length;i++){
        polja[i].onclick=null
    }
    dugmePredaja.removeEventListener('click', predaja)
    dugmeZaVreme.removeEventListener('click', vremeIgranja)


}

//kada se klikne na dugme za novu igru kod iskakajucih prozora
const novaIgraMalo = () =>{

    
    //prvo se pojavljuje prozor za izbor boje figura, a nakon sto se izabere pocinje nova igra
    let overlay = document.querySelector('.overlay')
    let blok = document.querySelector('.izbor')
    setTimeout(()=>{overlay.style.display="flex"
        blok.style.display="flex"}, 50)
    setTimeout(()=>{overlay.style.opacity="0.7"
        blok.style.top="260px"}, 100)



}

//kada se klikne dugme predaja
const predaja = ()=>{
    //prvo izlazi prozor za potvrdu predaje, ako se odbije igra se nastavlja, u suporntom se pojavljuje prozor koji daje znak da je igrac predao
    let overlay = document.querySelector('.overlay')
    let blok = document.querySelector('.potvrdiPredaju')
    setTimeout(()=>{overlay.style.display="flex"
        blok.style.display="flex"}, 50)
    setTimeout(()=>{overlay.style.opacity="0.7"
        blok.style.top="260px"}, 100)

    let daDugme = document.querySelector('.daPredaj')
    let neDugme = document.querySelector('.nePredaj')

    daDugme.addEventListener('click', ()=>{
        blok.style.display="none"
        if(window.location.pathname=="/sahBeli.html"){
            blok=document.querySelector('.beliPredao')
        }else{
            blok=document.querySelector('.crniPredao')
        }
        setTimeout(()=>{overlay.style.display="flex"
            blok.style.display="flex"}, 50)
        setTimeout(()=>{overlay.style.opacity="0.7"
            blok.style.top="260px"}, 100)

            clearInterval(intervalBeli)
            clearInterval(intervalCrni)
    })

    neDugme.addEventListener('click', ()=>{
        overlay.style.display="none"
        blok.style.display="none"
        blok.style.top="760px"
    })


}


//kada se klikne dugme za novu igru
const novaIgra = () => {
    //prvo se pojavljuje potvrda za novu igru, ukoliko je odbijena igra se nastavlja,
    //a ukoliko je prihvacena, izlazi prozor za izbor figura, a nakon toga pocinje nova igra
    let overlay = document.querySelector('.overlay')
    let blok = document.querySelector('.potvrdiNovuIgru')
    setTimeout(()=>{overlay.style.display="flex"
        blok.style.display="flex"}, 50)
    setTimeout(()=>{overlay.style.opacity="0.7"
        blok.style.top="260px"}, 100)

    let daDugme = document.querySelector('.daIgraj')
    let neDugme = document.querySelector('.neIgraj')

    daDugme.addEventListener('click', ()=>{
        blok.style.display="none"
        blok.style.top="760px"
        novaIgraMalo()
    })

    neDugme.addEventListener('click', ()=>{
        overlay.style.display="none"
        blok.style.display="none"
        blok.style.top="760px"
    })

}

//vremenski inkrementi zavisno od vremenskog moda (broj oznacava dodatne sekunde)
let inkrement1=false
let inkrement2=false
let inkrement3=false
let inkrement5=false
let inkrement10=false
let inkrement15=false
let inkrement30=false

//namestanje vremena sata u odnosu na izabran vremenski mod
//ukoliko je izabran klasikal, signalKlasikal dobija vrednost true tako da se nakon 40 poteza svakog igraca, dobija bonus vreme od 30min
//ukoliko je igra sa inkrementom, odredjeni inkrement dobija vrednost true
const podesiSat = (nekoVreme) =>{

    inkrement1=false
    inkrement2=false
    inkrement3=false
    inkrement5=false
    inkrement10=false
    inkrement15=false
    inkrement30=false
    if(nekoVreme.innerText=="1+0"){
        document.getElementById('minutiCrni').innerHTML="1:00"
        document.getElementById('minutiBeli').innerHTML="1:00"
        signalKlasikal=false
        ukupnoVremeBeli=6000
        ukupnoVremeCrni=6000
    }
    if(nekoVreme.innerText=="2+1"){
        document.getElementById('minutiCrni').innerHTML="2:00"
        document.getElementById('minutiBeli').innerHTML="2:00"
        signalKlasikal=false
        ukupnoVremeBeli=12000
        ukupnoVremeCrni=12000
        inkrement1=true
        inkrement2=false
        inkrement3=false
        inkrement5=false
        inkrement10=false
        inkrement15=false
        inkrement30=false
    }
    if(nekoVreme.innerText=="3+0"){
        document.getElementById('minutiCrni').innerHTML="3:00"
        document.getElementById('minutiBeli').innerHTML="3:00"
        signalKlasikal=false
        ukupnoVremeBeli=18000
        ukupnoVremeCrni=18000
    }
    if(nekoVreme.innerText=="3+2"){
        document.getElementById('minutiCrni').innerHTML="3:00"
        document.getElementById('minutiBeli').innerHTML="3:00"
        signalKlasikal=false
        ukupnoVremeBeli=18000
        ukupnoVremeCrni=18000
        inkrement1=false
        inkrement2=true
        inkrement3=false
        inkrement5=false
        inkrement10=false
        inkrement15=false
        inkrement30=false
    }
    if(nekoVreme.innerText=="5+0"){
        document.getElementById('minutiCrni').innerHTML="5:00"
        document.getElementById('minutiBeli').innerHTML="5:00"
        signalKlasikal=false
        ukupnoVremeBeli=30000
        ukupnoVremeCrni=30000
    }
    if(nekoVreme.innerText=="5+3"){
        document.getElementById('minutiCrni').innerHTML="5:00"
        document.getElementById('minutiBeli').innerHTML="5:00"
        signalKlasikal=false
        ukupnoVremeBeli=30000
        ukupnoVremeCrni=30000
        inkrement1=false
        inkrement2=false
        inkrement3=true
        inkrement5=false
        inkrement10=false
        inkrement15=false
        inkrement30=false
    }
    if(nekoVreme.innerText=="10+0"){
        document.getElementById('minutiCrni').innerHTML="10:00"
        document.getElementById('minutiBeli').innerHTML="10:00"
        signalKlasikal=false
        ukupnoVremeBeli=60000
        ukupnoVremeCrni=60000
    }
    if(nekoVreme.innerText=="10+5"){
        document.getElementById('minutiCrni').innerHTML="10:00"
        document.getElementById('minutiBeli').innerHTML="10:00"
        ukupnoVremeBeli=60000
        ukupnoVremeCrni=60000
        signalKlasikal=false
        inkrement1=false
        inkrement2=false
        inkrement3=false
        inkrement5=true
        inkrement10=false
        inkrement15=false
        inkrement30=false
    }
    if(nekoVreme.innerText=="15+0"){
        document.getElementById('minutiCrni').innerHTML="15:00"
        document.getElementById('minutiBeli').innerText="15:00"
        signalKlasikal=false
        ukupnoVremeBeli=90000
        ukupnoVremeCrni=90000
    }
    if(nekoVreme.innerText=="15+10"){
        document.getElementById('minutiCrni').innerHTML="15:00"
        document.getElementById('minutiBeli').innerHTML="15:00"
        signalKlasikal=false
        ukupnoVremeBeli=90000
        ukupnoVremeCrni=90000
        inkrement1=false
        inkrement2=false
        inkrement3=false
        inkrement5=false
        inkrement10=true
        inkrement15=false
        inkrement30=false
    }
    if(nekoVreme.innerText=="30+15"){
        document.getElementById('minutiCrni').innerHTML="30:00"
        document.getElementById('minutiBeli').innerHTML="30:00"
        signalKlasikal=false
        ukupnoVremeBeli=180000
        ukupnoVremeCrni=180000
        inkrement1=false
        inkrement2=false
        inkrement3=false
        inkrement5=false
        inkrement10=false
        inkrement15=true
        inkrement30=false
    }
    if(nekoVreme.innerText=="Klasikal"){
        document.getElementById('minutiCrni').innerHTML="90:00"
        document.getElementById('minutiBeli').innerText="90:00"
        signalKlasikal=true
        ukupnoVremeBeli=540000
        ukupnoVremeCrni=540000
        inkrement1=false
        inkrement2=false
        inkrement3=false
        inkrement5=false
        inkrement10=false
        inkrement15=false
        inkrement30=true
    }
    if(nekoVreme.innerText=="Bez ogranicenja"){
        document.getElementById('minutiCrni').innerHTML="∞"
        document.getElementById('minutiBeli').innerHTML="∞"
        signalKlasikal=false
        ukupnoVremeBeli=0
        ukupnoVremeCrni=0
    }

    let overlay = document.querySelector('.overlay')
    let blok = document.querySelector('.vremeIgranja')

    overlay.style.display="none"
    overlay.style.opacity="0"
    blok.style.top="760px"
    blok.style.display="none"
}

const vremeIgranja = () =>{
    let overlay = document.querySelector('.overlay')
    let blok = document.querySelector('.vremeIgranja')
    setTimeout(()=>{overlay.style.display="flex"
        blok.style.display="flex"}, 50)
    setTimeout(()=>{overlay.style.opacity="0.7"
        blok.style.top="260px"}, 100)

    

}

//funckija proverava koliko ima praznih polja na tabli
const brojPraznihPolja = (tablaZaProveru) => {

    let brojac=0

    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(tablaZaProveru[i][j]=="x"){
                brojac++
            }
        }
    }

    return brojac

}

//da li su dve matrice iste
const daLiSuMatriceIste = (prva,druga) => {
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(prva[i][j]!=druga[i][j]){
                return false
            }
        }
    }

    return true
}

//provera repeticije
const proveraRepeticije = () =>{

    let brojacIstihPozicija=0
      
    //provera da li se broj figura smanjio, ukoliko jeste prazni se niz jer nikad nece moci da ima iste poteze kao ranije
    //ovaj deo koda se izvrsava kako bi se ustedela memorija i efikasnost izvrsavanja igre
    for(let k=0;k<skupRepeticijaTabla.length;k++){
        if(brojPraznihPolja(skupRepeticijaTabla[k])!=brojacPraznihPolja){
            skupRepeticijaTabla=skupRepeticijaTabla.slice(skupRepeticijaTabla.length-1, skupRepeticijaTabla.length)
        }

        //ukoliko se iste pozicije pojave 3 puta, dolazi do repeticije i igra se zavrsava neresenim rezultatom
        for(let q=0;q<skupRepeticijaTabla.length;q++){
            if(daLiSuMatriceIste(skupRepeticijaTabla[k],skupRepeticijaTabla[q])){
                brojacIstihPozicija++
            }

            if(brojacIstihPozicija==3){
                signalRepeticija=true
            }
        }

        brojacIstihPozicija=0




    }





}



//svako pocetno dugme ima odredjenu funckiju
dugmePredaja.addEventListener('click', predaja)
dugmeNovaIgra.addEventListener('click', novaIgra)
dugmeZaVreme.addEventListener('click', vremeIgranja)





//pomeranje figura drag and drop metodom (i dalje u izradi)
function allowDrop(event) {
    // event.preventDefault()
  }
  
  function drag(figura) {
    // event.dataTransfer.setData("text", event.target.id)
    // figura.style.opacity="0"
    
    
  }
  
  function drop(polje) {
    
    // event.preventDefault();
    // var data = event.dataTransfer.getData("text");
    // event.target.appendChild(document.getElementById(data))
    // document.getElementById(data).style.opacity="1"
    

  }


 

