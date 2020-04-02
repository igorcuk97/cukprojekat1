window.onload = function(){

    /* niz */

    var nizL = [];
    var nizD = [];
    var noviNizZak = [];

    var tester = false;

    /* chb */

    var chbL = [];
    var chbD = [];
    var chbProvera = [];
    
    pocetniIspis();

    document.getElementById("prenesiBtn").addEventListener("click", DohvatiPacijenteZaZakazivanje);
    document.getElementById("zakaziBtn").addEventListener("click", DohvatiPacijenteDaIhVratim);
    document.getElementById("stampaBtn").addEventListener("click", function(){
        $.ajax({
            url: "obrada.php",
            method : "POST",
            data: {
                nizPacijenata : nizD
            },
            success: function(data){
                alert(data);
            },
            error: function(error){
                console.log(error);
            }
        })
    })

    function DohvatiPacijenteZaZakazivanje(){
        let chb = document.getElementsByClassName("pacijentLista");

        for(let c of chb){
            if(c.checked){
                chbL.push(c.getAttribute("data-id"));
            }
        }

        if(chbL.length == 0){
            alert("Nije odabran ni jedan pacijent");
        }
        else{
            $.ajax({
                url:"data/pacijenti.json",
                method:"GET",
                success: function(data){
                    if(nizD.length > 0){
                        for(let d of data){
                            if(chbL.includes(String(d.id))){
                                noviNizZak.push(d);
                            }
                        }
                        pocetniIspis();
                        cuvanjeZakazivanje();
                        IspisZakazivanje(noviNizZak);
                    }
                    else{
                        for(let d of data){
                            if(chbL.includes(String(d.id))){
                                nizD.push(d);
                            }
                        }
                        pocetniIspis();
                        if(tester){
                            cuvanjeZakazivanje();
                            tester = false;
                        }
                        else{
                            IspisZakazivanje(nizD);
                        }
                    }
                },
                error: function(error){
                    console.error(error);
                }
            })
        }
    }
    function cuvanjeZakazivanje(){           
        for(let d of nizD){
            if(!chbD.includes(String(d.id))){
                noviNizZak.push(d);
            }
        }
        nizD = noviNizZak;
        IspisZakazivanje(nizD);
        noviNizZak = [];
    }
    function DohvatiPacijenteDaIhVratim(){

        let chb = document.getElementsByClassName("zakazivanjeLista");

        for(let c of chb){
            if(c.checked){
                chbD.push(c.getAttribute("data-id"));
            }
        }

        if(chbD.length == 0){
            alert("Niste odabran ni jednog pacijent");
        }
        else{
            $.ajax({
                url:"data/pacijenti.json",
                method:"GET",
                success: function(data){
                    for(let d of data){
                        if(chbD.includes(String(d.id))){
                            nizL.push(d);
                        }
                    }
                    tester = true;
                    pocetniIspis();                    
                },
                error: function(error){
                    console.error(error);
                }
            })
        }
    }
    function pocetniIspis(){
        for(let c of chbL){
            chbProvera.push(c);
        }

        $.ajax({
            url:"data/pacijenti.json",
            method:"GET",
            success: function(data){
                for(let d of data){
                    if(!chbProvera.includes(String(d.id))){
                        nizL.push(d);
                    }
                }
                IspisPacijent(nizL);
                chbL = [];
                nizL = [];
                if(tester){
                    cuvanjeZakazivanje();
                    tester = false;
                }
                else{
                    IspisZakazivanje(nizD);
                }
            },
            error: function(error){
                console.error(error);
            }
        })
    }
    function IspisZakazivanje(data){
        let html = "";
        for(let d of data){
            html += `
            <div class="custom-control custom-checkbox zakazivanjeListaDiv">
                <input type="checkbox" class="custom-control-input zakazivanjeLista" id="chb-${d.id}" name="${d.ImePrezime}" data-id="${d.id}">
                <label class="custom-control-label" for="chb-${d.id}">${d.ImePrezime}</label>
            </div>
            `;
        }
        document.getElementById("ZakazivanjeDiv").innerHTML = html;
    }
    function IspisPacijent(data){
        let html = "";
        for(let d of data){
            html += `
            <div class="custom-control custom-checkbox pacijentListaDiv">
                <input type="checkbox" class="custom-control-input pacijentLista" id="chb-${d.id}" name="${d.ImePrezime}" data-id="${d.id}">
                <label class="custom-control-label" for="chb-${d.id}">${d.ImePrezime}</label>
            </div>
            `;
        }
        document.getElementById("PacijentDiv").innerHTML = html;
    }

    /* promena boje */
    const body = document.body;
    document.getElementById("sunceBtn").addEventListener("click", function(){
        body.classList.replace('tamno', 'svetlo');
        $('.dugme').removeClass('btn-dark').addClass('btn-primary');
    });
    document.getElementById("mesecBtn").addEventListener("click", function(){
        body.classList.replace('svetlo', 'tamno');
        $('.dugme').removeClass('btn-primary').addClass('btn-dark');
    });   
}