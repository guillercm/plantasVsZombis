class Planta {

    nombre = null;
    costeSoles = 0;
    rutaLogo = null;
    rutaEstadoBase = null;
    divPanelPlantas = null;
    divLogoPlanta = null;
    static DIRECTORIO = "multimedia/plantas/";
    divPlantaArrastrar = null;
    segundosRecarga = 0;
    vida = 0;
    
    frecuenciaEjecutarFuncionHacerAlgo = 0;

    constructor(nombre, costeSoles, rutaLogo, rutaEstadoBase, segundosRecarga, vida, frecuenciaEjecutarFuncionHacerAlgo) {
        this.nombre = nombre;
        this.costeSoles = costeSoles;
        this.rutaLogo = rutaLogo;
        this.rutaEstadoBase = rutaEstadoBase;
        this.divPanelPlantas = document.getElementById("panelPlantas");
        this.segundosRecarga = segundosRecarga;
        this.vida = vida;
        this.frecuenciaEjecutarFuncionHacerAlgo = frecuenciaEjecutarFuncionHacerAlgo;
        this.generarDiv();
    }

    getDivLogoPlanta() {
        return this.divLogoPlanta;
    }

    getRutaLogo() {
        return Planta.DIRECTORIO + this.rutaLogo;
    }

    getRutaEstadoBase() {
        return Planta.DIRECTORIO + this.rutaEstadoBase;
    }

    getDivPlantaArrastrar() {
        return this.divPlantaArrastrar;
    }

    getDescripcion() {
        return "Esto es una planta";
    }


    generarDiv() {
        const divLogoPlanta = document.createElement("div");
        divLogoPlanta.classList.add("panelPlanta");
        divLogoPlanta.setAttribute("style", `background-image: url(${this.getRutaLogo()});`);
        divLogoPlanta.innerHTML = `
            <div class="fondoCargandoPlanta oculto" ></div>
            <div class="cargandoPlanta oculto" ></div>
            <span class="costePlanta">${this.costeSoles}</span>
        `;
        this.divPanelPlantas.appendChild(divLogoPlanta);
        this.divLogoPlanta = divLogoPlanta;
        divLogoPlanta.title = this.nombre;

        this.divPlantaArrastrar = document.createElement("div");
        this.divPlantaArrastrar.classList.add("plantaArrastrar");
        this.divPlantaArrastrar.setAttribute("style", `background-image: url(${this.getRutaEstadoBase()});`);
        ocultar(this.divPlantaArrastrar);
        document.body.appendChild(this.divPlantaArrastrar);
    }

    iniciar(tableroDivs, tableroPlantas, tableroPlantasInfo, fila, columna) {

    }

    plantaCargando = false;

    cargarPlanta() {
        this.plantaCargando = true;
        const fondoCargandoPlanta = this.divLogoPlanta.getElementsByClassName("fondoCargandoPlanta")[0];
        const cargandoPlanta = this.divLogoPlanta.getElementsByClassName("cargandoPlanta")[0];
        mostrar(fondoCargandoPlanta);
        mostrar(cargandoPlanta);
        const transitionClass = "transition_" + this.segundosRecarga;
        //console.log(transitionClass);
        cargandoPlanta.classList.add(transitionClass);
        setTimeout(function() {
            cargandoPlanta.setAttribute("style","height: 0");
        }, 10);
        const este = this;
        setTimeout(function() {
            ocultar(fondoCargandoPlanta);
            ocultar(cargandoPlanta);
            este.plantaCargando = false;
            cargandoPlanta.classList.remove(transitionClass);
            cargandoPlanta.setAttribute("style","height: 100%");
        }, this.segundosRecarga * 1000);
    }

    getNombre() {
        return this.nombre;
    }

    hacerAlgo(iTablero, jTablero) {
        
    }

    nivel = null;

    setNivel(nivel) {
        this.nivel = nivel;
    }

    puedoColocarlaEnCuadricula(divCuadricula) {
        return divCuadricula.style.backgroundImage.includes("nenufar") || !divCuadricula.classList.value.includes("agua");
    }

}

class Girasol extends Planta {

    constructor() {
        const COSTE_SOLES = 50;
        const SEGUNDOS_RECARGA = 5;
        const VIDA = 300;
        const FRECUENCIA_FUNCION_HACER_ALGO = 20;
        super("Girasol", COSTE_SOLES, "girasol_logo.png", "girasol.gif", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO);
    }

    hacerAlgo(iTablero, jTablero) {
        const divSol = this.crearSol();
        divSol.classList.add("solDeGirasol");
        const tamSol = getCssVariable("tamSol").replace("px","")*1;
        const tamCuadricula = this.nivel.tablero.getTamCuadricula();
        const marginLeft = getRandomInt(jTablero * tamCuadricula - tamSol/3, jTablero * tamCuadricula + tamSol/3 + tamCuadricula/2);
        const marginTop = iTablero * tamCuadricula + tamSol;
        divSol.setAttribute("style", 
            "margin-left: " +  marginLeft + "px; " + 
            "margin-top: " + marginTop  + "px");
        //console.log(divSol);
    }

    getDescripcion() {
        return "Los girasoles son esenciales para producir sol extra. ¡Intenta plantar tantos como puedas!";
    }

    crearSol() {
        return this.nivel.generarSol();
    }

}

class LanzaguisantesBase extends Planta {

    rutaAtaque = null;
    checkPlantorcha = true;
    duraccionGifAtaque = 0;
    atacando = false;


    constructor(nombre, costeSoles, rutaLogo, rutaEstadoBase, segundosRecarga, vida, frecuenciaEjecutarFuncionHacerAlgo, rutaAtaque, checkPlantorcha, duraccionGifAtaque) {
        super(nombre, costeSoles, rutaLogo, rutaEstadoBase, segundosRecarga, vida, frecuenciaEjecutarFuncionHacerAlgo);
        this.rutaAtaque = rutaAtaque;
        this.checkPlantorcha = checkPlantorcha;
        this.duraccionGifAtaque = duraccionGifAtaque;
    }

    getRutaAtaque() {
        return Planta.DIRECTORIO + this.rutaAtaque;//'lanzaguisantes_ataque.gif';
    }

    hacerAlgo(iTablero, jTablero) {
        const tablero = this.nivel.getTableroDivs();
        let rutaNenufar = this.nivel.tableroPlantasInfo[iTablero][jTablero].urlNenufar;
        if (this.hayZombiesDelante(iTablero, jTablero)) {
            this.atacar(tablero[iTablero][jTablero], iTablero, jTablero, rutaNenufar);
        } else {
            //this.dejarDeAtacar(tablero[iTablero][jTablero]);
        }
    }

    hayZombiesDelante(iTablero, jTablero) {
        for (let i = 0; i < this.nivel.zombies.length; i++) {
            let zombi = this.nivel.zombies[i];
            if (zombi.fila === iTablero && zombi.left > (jTablero + 2) * 100) {
                return true;
            }
        }
        return false;
    }
    /*
    dejarDeAtacar(div) {
        if (this.atacando) {
            this.atacando = false;
            div.style.backgroundImage = 'url('+this.getRutaEstadoBase()+')';
        }
    }*/

    getClassDivAtaque() {
        return "guisante";
    }

    atacar(div, iTablero, jTablero, rutaNenufar) {
        this.atacando = true;
        div.style.backgroundImage = 'url('+this.getRutaAtaque()+')' + rutaNenufar;
        const rutaEstadoBase = 'url('+this.getRutaEstadoBase()+')' + rutaNenufar;
        
        setTimeout(function() {
            if (div.style.backgroundImage.toString().trim() !== '') {
                div.style.backgroundImage = rutaEstadoBase + rutaNenufar;
            }
        }, this.duraccionGifAtaque * 1000);
        const divGuisante = document.createElement("div");
        divGuisante.classList.add(this.getClassDivAtaque());
        const tamCuadricula = getCssVariable("tamCuadricula").replace("px","")*1;
        const tamGuis = divGuisante.offsetWidth;
        let left = (jTablero + 2) * tamCuadricula;
        const top = (iTablero + 1)  * tamCuadricula - 15;
        divGuisante.setAttribute("style", 
            "left: " +  left + "px; " + 
            "top: " + top  + "px");
        const este = this;
        const inicialLeft = left;
        setTimeout(function() {
            document.body.appendChild(divGuisante);
            const moverGuisante = setInterval(function(){
                left+=2;
                if (este.checkPlantorcha && Plantorcha.puedeQuemarseMasElGuisante(divGuisante)) {
                    const tamCuadricula = este.nivel.tablero.getTamCuadricula();
                    for (let i = inicialLeft + 64; i <= (este.nivel.tablero.COLUMNAS + 1) * tamCuadricula; i+= tamCuadricula) {
                        if (left !== i) {
                            continue;
                        }
                        // divPrueba.setAttribute("style", 
                        // "left: " +  left + "px; " + 
                        // "top: " + top + "px");
                        const elementos = document.elementsFromPoint( left, top);
                        const divCuadricula = getDivDeClase(elementos, "cuadricula");
                        if (divCuadricula !== null) {
                            const indexCuadricula = este.nivel.tablero.getIndexCuadricula(divCuadricula);
                            if (indexCuadricula !== null) {
                                const planta = este.nivel.tableroPlantas[indexCuadricula.i][indexCuadricula.j];
                                if (planta !== null && planta.nombre === "Plantorcha") {
                                    Plantorcha.darFuegoGuisante(divGuisante);
                                }
                            }
                        } 
                    }
                }

                divGuisante.setAttribute("style", 
                "left: " +  left + "px; " + 
                "top: " + top  + "px");
                if (left > 900) {
                    clearInterval(moverGuisante);
                    divGuisante.remove();
                }
            }, 10);
        }, 700);
    }
}

class Lanzaguisantes extends LanzaguisantesBase {


    constructor() {
        const COSTE_SOLES = 100;
        const SEGUNDOS_RECARGA = 5;
        const VIDA = 300;
        const FRECUENCIA_FUNCION_HACER_ALGO = 2;
        const RUTA_ATAQUE = 'lanzaguisantes_ataque.gif';
        const checkPlantorcha = true;
        const duraccionGifAtaque = 0.9;
        super("Lanzaguisantes", COSTE_SOLES, "lanzaguisantes_logo.png", "lanzaguisantes.gif", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO, RUTA_ATAQUE, checkPlantorcha, duraccionGifAtaque);
    }

    getDescripcion() {
        return "Los lanzaguisantes son tu primera línea defensiva. Disparan guisantes a los zombis.";
    }

}

class Hielaguisantes extends LanzaguisantesBase {

    constructor() {
        const COSTE_SOLES = 175;
        const SEGUNDOS_RECARGA = 5;
        const VIDA = 300;
        const FRECUENCIA_FUNCION_HACER_ALGO = 2;
        const RUTA_ATAQUE = 'hielaguisantes_ataque.gif';
        const checkPlantorcha = true;
        const duraccionGifAtaque = 0.9;
        super("Hielaguisantes", COSTE_SOLES, "hielaguisantes_logo.png", "hielaguisantes.gif", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO, RUTA_ATAQUE, checkPlantorcha, duraccionGifAtaque);
    }

    getClassDivAtaque() {
        return "guisanteCongelado";
    }

    getDescripcion() {
        return "Hielaguisantes lanza guisantes helados que dificultan el paso a los zombis.";
    }

}

class Plantorcha extends Planta {

    constructor() {
        const COSTE_SOLES = 175;
        const SEGUNDOS_RECARGA = 5;
        const VIDA = 300;
        const FRECUENCIA_FUNCION_HACER_ALGO = null;
        super("Plantorcha", COSTE_SOLES, "plantorcha_logo.png", "plantorcha.gif", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO);
    }

    static puedeQuemarseMasElGuisante(divGuisante) {
        return !(divGuisante.classList.contains("guisanteFuego"));
    }

    static darFuegoGuisante(divGuisante) {
        if (divGuisante.classList.contains("guisante")) {
            divGuisante.classList.remove("guisante");
            divGuisante.classList.add("guisanteFuego");
        } else if (divGuisante.classList.contains("guisanteCongelado")) {
            divGuisante.classList.remove("guisanteCongelado");
            divGuisante.classList.add("guisante");
        }
    }

    getDescripcion() {
        return "Plantorcha prende en llamas a los guisantes que la sobrevuelen, los cuales infligirán el doble de daño. Aunque, combinarlo con el Hielaguisantes, tal vez no sería la mejor idea...";
    }

}

class Nuez extends Planta {

    constructor() {
        const COSTE_SOLES = 50;
        const SEGUNDOS_RECARGA = 20;
        const VIDA = 3000;
        const FRECUENCIA_FUNCION_HACER_ALGO = null;
        super("Nuez", COSTE_SOLES, "nuez_logo.png", "nuez.jpg", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO);
    }

    getDescripcion() {
        return "La nuez tiene una cáscara muy dura. Protege con ella a tus otras plantas.";
    }

}

class Patatapum extends Planta {

    DANO_EXPLOSION = 1800;

    constructor() {
        const COSTE_SOLES = 25;
        const SEGUNDOS_RECARGA = 20;
        const VIDA = 300;
        const FRECUENCIA_FUNCION_HACER_ALGO = 14; // 14;
        super("Patatapum", COSTE_SOLES, "patatapum_logo.png", "patatapum.gif", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO);
    }

    TOP_ARRIBA = 30;
    TOP_ABAJO = 72;

    iniciar(tableroDivs, tableroPlantas, tableroPlantasInfo, fila, columna) {
        //tableroDivs[fila][columna].style.backgroundImage = '';
        this.setStyles(tableroDivs[fila][columna], this.TOP_ABAJO);
        const este = this;
        tableroPlantasInfo[fila][columna].puedeExplotar = false;
        setTimeout(function() {
            if (tableroPlantasInfo[fila][columna] != null && tableroPlantasInfo[fila][columna].vida > 0) {
                este.setStyles(tableroDivs[fila][columna], este.TOP_ARRIBA);
                tableroPlantasInfo[fila][columna].puedeExplotar = true;
            }
        }, this.frecuenciaEjecutarFuncionHacerAlgo * 1000);
    }

    hacerAlgo(iTablero, jTablero) {
        if (this.nivel === null) return;
        const tablero = this.nivel.getTableroDivs();
        const zombies = this.nivel.zombies;
        const zombiesCercanos = [];
        const tamCuadricula = this.nivel.tablero.getTamCuadricula();
        const leftMinZombie = tamCuadricula * (jTablero + 1) - 130;
        const leftMaxZombie = tamCuadricula * (jTablero + 1) + 130;
        for (let i = 0; i < zombies.length; i++) {
            const zombie = zombies[i];
            //console.log(zombie);
            if (zombie.fila === iTablero && zombie.left > leftMinZombie && zombie.left < leftMaxZombie) {
                
                zombiesCercanos.push(zombie);
            }
        }
        //console.log(zombiesCercanos);
        if (zombiesCercanos.length > 0) {
            for (let i = 0; i < zombiesCercanos.length; i++) {
                const zombie = zombiesCercanos[i];
                zombie.restarVida(this.DANO_EXPLOSION);
            }
            this.explotar(tablero[iTablero][jTablero], iTablero, jTablero);
        }
    }

    explotar(div, iTablero, jTablero) {
        this.nivel.quitarPlantaDeCuadricula(iTablero, jTablero);
        const rutaExplosion = Planta.DIRECTORIO + "explosion.png";
        const divExplosion = document.createElement("div");
        divExplosion.classList.add("explosionPatatapum");
        divExplosion.innerHTML = `
            <img src="${rutaExplosion}">
        `;
        const tamCuadricula = this.nivel.tablero.getTamCuadricula();
        const marginLeft = (jTablero - 2) * tamCuadricula;
        const marginTop = iTablero * tamCuadricula + (tamCuadricula / 10);
        divExplosion.setAttribute("style", 
        "margin-left: " +  marginLeft + "px; " + 
        "margin-top: " + marginTop  + "px");
        document.body.appendChild(divExplosion);
        setTimeout(function() {
            if (divExplosion != null) {
                divExplosion.remove();
            }
        }, 1900);
    }

    setStyles(div, top) {
        div.setAttribute("style", `
            background-image: url(${this.getRutaEstadoBase()});
            background-repeat: no-repeat;
            background-position-y: ${top}px;
            background-size: contain;
        `);
    }

    puedoColocarlaEnCuadricula(divCuadricula) {
        return !divCuadricula.classList.value.includes("agua");
    }

    getDescripcion() {
        return "Patatapum explota al contacto, pero necesita tiempo para cargarse.";
    }
}


class Nenufar extends Planta {

    constructor() {
        const COSTE_SOLES = 25;
        const SEGUNDOS_RECARGA = 5;
        const VIDA = 300;
        const FRECUENCIA_FUNCION_HACER_ALGO = null;
        super("Nenúfar", COSTE_SOLES, "nenufar_logo.png", "nenufar.png", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO);
    }

    puedoColocarlaEnCuadricula(divCuadricula) {
        return !divCuadricula.style.backgroundImage.includes("nenufar") && divCuadricula.classList.value.includes("agua");
    }

    getDescripcion() {
        return "Para poder plantar plantas no acuáticas en la piscina.";
    }

}



class Zampalga extends Planta {

    DANO_EXPLOSION = 1800;

    constructor() {
        const COSTE_SOLES = 25;
        const SEGUNDOS_RECARGA = 20;
        const VIDA = 300;
        const FRECUENCIA_FUNCION_HACER_ALGO = 1;
        super("Zampalga", COSTE_SOLES, "zampalga.png", "zampalga.png", SEGUNDOS_RECARGA, VIDA, FRECUENCIA_FUNCION_HACER_ALGO);
    }

    hacerAlgo(iTablero, jTablero) {
        if (this.nivel === null) return;
        const tablero = this.nivel.getTableroDivs();
        const zombies = this.nivel.zombies;
        let zombieCercano = null;
        const tamCuadricula = this.nivel.tablero.getTamCuadricula();
        const leftMinZombie = tamCuadricula * (jTablero + 1) - 130;
        const leftMaxZombie = tamCuadricula * (jTablero + 1) + 130;
        for (let i = 0; i < zombies.length; i++) {
            const zombie = zombies[i];
            if (zombie.fila === iTablero && zombie.left > leftMinZombie && zombie.left < leftMaxZombie) {
                zombieCercano = zombie;
                break;
            }
        }
        if (zombieCercano != null) {
            zombieCercano.restarVida(this.DANO_EXPLOSION);
            this.nivel.quitarPlantaDeCuadricula(iTablero, jTablero);
        }
    }

    puedoColocarlaEnCuadricula(divCuadricula) {
        return divCuadricula.classList.value.includes("agua");
    }

    getDescripcion() {
        return "Una planta acuática que succiona al primer zombi que se le acerca bajo el agua.";
    }
}