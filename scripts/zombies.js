class ZombiBase {

    nombre = "";
    vida = 0;
    rutaAndando = "";
    rutaComiendo = "";
    alturaZombi = 0;

    nivel = null;
    divZombi = null;
    imgZombie = null;

    left = 0;
    top = 0;
    valocidad = 1;
    z_index = 0;

    meta = 0;
    danno = 0;
    rutaGorro = null;
    divGorro = null;

    static DIRECTORIO = "multimedia/zombies/";

    intervalVida = null;
    intervalComerPlanta = null;

    estoyComiendo = false;

    fila = 0;

    congelado = false;
    cambiarRuta = false;

    dePiscina = false;

    constructor(nombre, vida, velocidad, rutaAndando, rutaComiendo, danno, alturaZombi, rutaGorro = null, dePiscina = false) {
        this.nombre = nombre;
        this.vida = vida;
        this.velocidad = velocidad;
        this.rutaAndando = rutaAndando;
        this.danno = danno;
        this.alturaZombi = alturaZombi;
        this.rutaComiendo = rutaComiendo;
        this.rutaGorro = rutaGorro;
        this.dePiscina = dePiscina;
        this.getDivZombi();
    }

    getRutaAndando() {
        return ZombiBase.DIRECTORIO + (this.congelado ? this.rutaAndando.replace(".gif","Congelado.gif") : this.rutaAndando);
    }

    getRutaComiendo() {
        return ZombiBase.DIRECTORIO + (this.congelado ? this.rutaComiendo.replace(".gif","Congelado.gif") : this.rutaComiendo);
    }

    getRutaGorro() {
        return this.rutaGorro === null ? null : ZombiBase.DIRECTORIO + (this.congelado ? this.rutaGorro.replace(".png","Congelado.png") : this.rutaGorro);
    }

    restarVida(puntos) {
        this.vida -= puntos;
        if (this.vida < 1) {
            this.morir();
        }
    }

    sigoVivo() {
        return this.vida > 0;
    }

    morir() {
        if (this.divZombi === null) return;
        this.divZombi.remove();
        if (this.divGorro !== null) {
            this.divGorro.remove();
        }
        if (this.intervalVida !== null) {
            clearInterval(this.intervalVida);
        }
        if (this.intervalComerPlanta !== null) {
            clearInterval(this.intervalComerPlanta);
        }
        this.nivel.nuevaOleadaZombis();
    }

    setNivel(nivel) {
        this.nivel = nivel;
        this.meta = this.getCoordinadasDivTablero(0, 0).left - this.getTamCuadricula()/2;
    }

    getDivZombi() {
        const div = document.createElement("div");
        div.classList.add("divZombi");
        div.innerHTML = `
            <img src=${this.getRutaAndando()} class="imgZombie">
        `;
        this.divZombi = div;
        this.imgZombie = div.getElementsByTagName("img")[0];
    }

    empezar(indexFila) {
        document.body.appendChild(this.divZombi);
        const filaRandom = indexFila;
        this.fila = filaRandom;
        let rect = this.getCoordinadasDivTablero(filaRandom, this.nivel.tablero.COLUMNAS - 1);
        this.left = rect.left + this.getTamCuadricula();
        this.top = rect.top + (this.getTamCuadricula() - this.alturaZombi);
        this.moverZombi();
        const este = this;
        this.intervalVida = setInterval(function(){
            este.vidaZombi();
        },10);
        //console.log(rect.top, rect.right, rect.bottom, rect.left);
    }

    getTamCuadricula() {
        return this.nivel.tablero.getTamCuadricula();
    }

    getCoordinadasDivTablero(fila, columna) {
        if (fila < 0 || fila >= this.nivel.filas) {
            return null;
        }
        const casilla = this.nivel.getTableroDivs()[fila][columna];
        return casilla.getBoundingClientRect();
    }

    vidaZombi() {
        if (!this.estoyComiendo) {
            this.left -= this.congelado ? (this.velocidad - (this.velocidad/1.5)) : this.velocidad;
        }
        if (this.left < this.meta) {
            if (this.intervalVida !== null) {
                clearInterval(this.intervalVida);
                this.intervalVida = null;
            }
            this.nivel.perder();
        } else {
            const elementos = document.elementsFromPoint(this.left + 17, this.top + this.alturaZombi / 2);
            this.analizarDisparos(elementos, "guisante", "guisanteFuego", "guisanteCongelado");
            const cuadricula = getDivDeClase(elementos, "cuadricula");
            const indexsCuadricula = this.nivel.tablero.getIndexCuadricula(cuadricula);
            if (indexsCuadricula !== null) {
                const planta = this.nivel.getPlantaDeCuadricula(indexsCuadricula.i, indexsCuadricula.j);
                if (planta === null) {
                    if (this.estoyComiendo || this.cambiarRuta) {   
                        this.imgZombie.src = this.getRutaAndando();
                    }
                    this.estoyComiendo = false;
                } else {
                    if (!this.estoyComiendo || this.cambiarRuta) {   
                        this.imgZombie.src = this.getRutaComiendo();
                    }
                    //console.log(indexsCuadricula.i, indexsCuadricula.j);
                    this.comerPlanta(indexsCuadricula.i, indexsCuadricula.j);
                    this.estoyComiendo = true;
                }
                this.cambiarRuta = false;
            }
            //moverDivPrueba(this.left + 12, this.top + this.alturaZombi / 2);
        }
        this.moverZombi();
    }

    comerPlanta(iTablero, jTablero) {
        if (this.intervalComerPlanta === null) {
            const esteZombi = this;
            this.intervalComerPlanta = setInterval(function(){
                if (esteZombi.sigoVivo()) {
                    const dannoPlanta = esteZombi.congelado ? esteZombi.danno / 2 : esteZombi.danno;
                    if (esteZombi.nivel.restarVidaPlanta(iTablero, jTablero, esteZombi.danno)) {
                        if (esteZombi.intervalComerPlanta !== null) {
                            clearInterval(esteZombi.intervalComerPlanta);
                            esteZombi.intervalComerPlanta = null;
                        }
                    }
                }
            },1000);
        }
    } 

    analizarDisparos(elementos, ...clases) {
        for (let i = 0; i < clases.length; i++) {
            const divDisparo = getDivDeClase(elementos, clases[i]);
            if (divDisparo !== null) {
                divDisparo.remove();
                this.quitarVidaDisparo(clases[i]);
            }
        }
    }

    moverZombi() {
        this.divZombi.style.left = this.left + "px";
        this.divZombi.style.top = this.top + "px";
        this.divZombi.style.height = this.alturaZombi + "px";
        this.divZombi.style.z_index = this.fila;
        if (this.estoyComiendo) {
            const rutaGorro = this.getRutaGorro();
            if (rutaGorro !== null) {
                if (this.divGorro === null) {
                    this.divGorro = document.createElement("div");
                    this.divGorro.classList.add("gorroZombie");
                    this.divGorro.innerHTML = `
                        <img src=${rutaGorro}>
                    `;
                    document.body.appendChild(this.divGorro);
                }
                this.divGorro.getElementsByTagName("img")[0].src = rutaGorro;
                this.divGorro.style.left = (this.left + 20) + "px";
                this.divGorro.style.top =  (this.top - this.alturaZombi / 5) + "px";
            }
            mostrar(this.divGorro);
        } else {
            ocultar(this.divGorro);
        }
    }

    intervalDescongelar = null;

    quitarVidaDisparo(divClaseDisparo) {
        let vidaAQuitar = 0;
        switch (divClaseDisparo)
        {
        case "guisante":
            vidaAQuitar = 10;
            break;
        case "guisanteFuego":
            vidaAQuitar = 20;
            break;
        case "guisanteCongelado":
            vidaAQuitar = 10;
            if (!this.congelado) {
                this.cambiarRuta = true;
            }
            this.congelado = true;
            if (this.intervalDescongelar !== null) {
                clearInterval(this.intervalDescongelar);
                this.intervalDescongelar = null;
            }
            const esteZombi = this;
            this.intervalDescongelar = setTimeout(function(){
                esteZombi.congelado = false;
                esteZombi.cambiarRuta = true;
            }, 6000);
        }
        this.restarVida(vidaAQuitar);
    }

}

function getArrayZombis(normales = 0, conos = 0, pato = 0) {
    const arrayZombis = [];
    for (let i = 0; i < normales; i++) {
        arrayZombis.push(new ZombiNormal());
    }
    for (let i = 0; i < conos; i++) {
        arrayZombis.push(new ZombiCono());
    }
    for (let i = 0; i < pato; i++) {
        arrayZombis.push(new ZombiPato());
    }
    return arrayZombis;
}

class ZombiNormal extends ZombiBase {

    constructor() {
        const VIDA = 100;
        const VELOCIDAD = 0.15;
        const DANNO = 75;
        const ALTURA_ZOMBI = 140;
        const DE_PISCINA = false;
        super("Zombi", VIDA, VELOCIDAD, "zombieAndando.gif", "zombieComiendo.gif", DANNO, ALTURA_ZOMBI, null, DE_PISCINA);
    }

}

class ZombiCono extends ZombiBase {

    constructor() {
        const VIDA = 150;
        const VELOCIDAD = 0.15;
        const DANNO = 75;
        const ALTURA_ZOMBI = 140;
        const RUTA_CONO = "cono.png";
        const DE_PISCINA = false;
        super("Zombi caracono", VIDA, VELOCIDAD, "zombieAndandoCono.gif", "zombieComiendo.gif", DANNO, ALTURA_ZOMBI, RUTA_CONO, DE_PISCINA);
    }

}


class ZombiPato extends ZombiBase {

    constructor() {
        const VIDA = 100;
        const VELOCIDAD = 0.15;
        const DANNO = 75;
        const ALTURA_ZOMBI = 140;
        const RUTA_CONO = null;
        const DE_PISCINA = true;
        super("ZombiPato", VIDA, VELOCIDAD, "zombieAndando.gif", "zombieComiendo.gif", DANNO, ALTURA_ZOMBI, RUTA_CONO, DE_PISCINA);
    }

    moverZombi() {
        this.divZombi.style.left = this.left + "px";
        this.divZombi.style.top = this.top + "px";
        this.divZombi.style.height = this.alturaZombi + "px";
        this.divZombi.style.z_index = this.fila;
        if (this.divGorro === null) {
            const rutaFlotador1 = ZombiBase.DIRECTORIO + "pato1.png";
            const rutaFlotador2 = ZombiBase.DIRECTORIO + "pato2.png";
            this.divGorro = document.createElement("div");
            this.divGorro.classList.add("flotador");
            this.divGorro.innerHTML = `
                <img src=${rutaFlotador1} class="flotador1">
                <img src=${rutaFlotador2} class="flotador2">
            `;
            document.body.appendChild(this.divGorro);
            mostrar(this.divGorro);
        }
        if (this.estoyComiendo) {
            this.divGorro.style.left = (this.left + 50) + "px";
        } else {
            this.divGorro.style.left = (this.left + 20) + "px";
        }
        
        this.divGorro.style.top =  (this.top - this.alturaZombi / 5) + "px";
        
    }

}