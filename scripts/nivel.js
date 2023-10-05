class Nivel {

    static TERRENOS = {
        HIERVA: 1, 
        PISCINA: 2,
        TEJADO: 3
    };
    
    numero = 1;
    filas = 6;
    terreno = null;
    esDeNoche = false;
    plantas = [];
    numeroSolesIniciales = 0;
    static SOLES_GENERADOS_AL_PRINCIPIO = 4;


    tablero = null;
    solesActuales = 0;
    intervalSoles = null;
    tableroPlantas = [];
    tableroPlantasInfo = [];
    
    zombies = [];
    oleadasZombis = null;
    indexOleada = 0;
    estoyUsandoPala = false;

    yaHeGanado = false;
    yaHePerdido = false;

    filasPiscina = [];

    filasDisponibles = [];

    funcionGanarPerderPartida = null;

    constructor(numero, filas, terreno, esDeNoche, plantas, oleadasZombis) {
        this.numero = numero;
        this.setNivelCartel();
        switch (filas) {
            case 1:
                this.filasDisponibles.push(2);
                this.terreno = Nivel.TERRENOS.HIERVA;
                break;
            case 3:
                this.filasDisponibles.push(1, 2, 3);
                this.terreno = Nivel.TERRENOS.HIERVA;
                break;
            default:
                this.filasDisponibles.push(0, 1, 2, 3, 4, 5);
                this.terreno = terreno;
                break;
        }
        this.esDeNoche = esDeNoche;
        this.plantas = plantas;
        this.oleadasZombis = oleadasZombis;
        for (let i = 0; i < this.plantas; i++) {
            this.plantas[i].setNivel(this);
        }
        this.restablecerSoles();
    }

     getRandomArrayIndexFilas(dePiscina = false) {
        const arrayRandom = [];
        for (let i = 0; i < this.filas; i++) {
            if ((this.filasDisponibles.includes(i)) && ((dePiscina && this.filasPiscina.includes(i)) || (!dePiscina && !this.filasPiscina.includes(i)))) {
                arrayRandom.push(i);
            }
        }
        return shuffleArray(arrayRandom);
    }

    todosLosZombisActualesEstanMuertos() {
        for (let i = 0; i < this.zombies.length; i++) {
            if (this.zombies[i].sigoVivo()) {
                return false;
            }
        }
        return true;
    }

    nuevaOleadaZombis() {
        if (!this.todosLosZombisActualesEstanMuertos()) {
            return;
        }
        this.zombies = [];
        const este = this;
        if (this.indexOleada < this.oleadasZombis.length) {
            const indexOleada = este.indexOleada;
            let zombisOleada = oleadasZombis[this.indexOleada].length;
            let arrayRandomFilasPiscina = [];//this.getRandomArrayIndexFilas(true);
            let arrayRandomFilas = [];//this.getRandomArrayIndexFilas(false);
            let numeroZombis = 0;
            let numeroZombisPiscina = 0;
            for (let i = 0; i < zombisOleada; i++) {
                const zombie = oleadasZombis[indexOleada][i];
                if (zombie.dePiscina) {
                    numeroZombisPiscina++;
                } else {
                    numeroZombis++;
                }
            }
            while (arrayRandomFilas.length < numeroZombis) {
                arrayRandomFilas = arrayRandomFilas.concat(this.getRandomArrayIndexFilas(false));
            }
            while (arrayRandomFilasPiscina.length < numeroZombisPiscina) {
                arrayRandomFilasPiscina = arrayRandomFilasPiscina.concat(this.getRandomArrayIndexFilas(true));
            }
            let contador = 0, contadorPiscina = 0;
            for (let i = 0; i < zombisOleada; i++) {
                //setTimeout(function () {
                    const zombie = oleadasZombis[indexOleada][i];
                    let indexZ = 0;
                    if (zombie.dePiscina) {
                        indexZ = arrayRandomFilasPiscina[contadorPiscina];
                        contadorPiscina++;
                    } else {
                        indexZ = arrayRandomFilas[contador];
                        contador++;
                    }
                    este.addZombie(zombie, indexZ);
                //}, getRandomInt(0, 1000 * zombisOleada));
            }
            this.indexOleada++;
        } else {
            this.ganar();
        }
    }

    

    selecionarPala() {
        this.estoyUsandoPala = true;
        document.getElementById("divPala").classList.add("sinPala");
        document.body.style.cursor = 'none';
    }

    deselecionarPala() {
        this.estoyUsandoPala = false;
        document.getElementById("divPala").classList.remove("sinPala");
        document.body.style.cursor = 'auto';
        ocultar(document.getElementById('imgPalaRaton'));
    }

    perder() {
        if (this.yaHePerdido) return;
        this.yaHePerdido = true;

        alert("Has perdido!");

        this.funcionGanarPerderPartida(false);
    }

    setNivelCartel() {
        const pNivel = document.getElementById("pNivel");
        pNivel.innerHTML = this.numero;
    }

    ganar() {
        if (this.yaHeGanado) return;
        this.yaHeGanado = true;
        
        alert("Has ganado!");

        localStorage.setItem('numPlPlantasVsZombies', this.plantas.length);

        this.funcionGanarPerderPartida(true);
    }

    getTableroDivs() {
        if (this.tablero === null) return null;
        return this.tablero.divsCuadriculas;
    }

    addZombie(zombie, fila) {
        zombie.setNivel(this);
        this.zombies.push(zombie);
        zombie.empezar(fila);
    }

    empezar(funcionGanarPerderPartida) {
        this.funcionGanarPerderPartida = funcionGanarPerderPartida;
        this.tablero = new Tablero();
        this.tablero.filasDisponibles = this.filasDisponibles;
        this.solesActuales = 0;
        this.numeroSolesIniciales = 0;
        switch (this.terreno) {
            case Nivel.TERRENOS.PISCINA:
                this.filasPiscina.push(2,3);
                this.tablero.dePiscina(this.filas, this.esDeNoche);
                break;
            case Nivel.TERRENOS.TEJADO:
                this.tablero.deTejado(this.filas, this.esDeNoche);
                break;
            default:
                this.tablero.deHierva(this.filas, this.esDeNoche);
                break;
        }
        this.tableroPlantas = null;
        this.tableroPlantas = [];
        this.tableroPlantasInfo = null;
        this.tableroPlantasInfo = [];
        //const tableroDivs = this.getTableroDivs();
        for (let i = 0; i < this.filas; i++) {
            this.tableroPlantas.push([]);
            this.tableroPlantasInfo.push([]);
            for (let j = 0; j < this.tablero.COLUMNAS; j++) {
                this.tableroPlantas[i].push(null);
                this.tableroPlantasInfo[i].push(null);
            }
        }
        this.generarSolesAleatorios();
        this.eventosRaton();
        const este = this;
        setInterval(function() {
            const zombiesAux = [];
            for (let i = 0; i < este.zombies.length; i++) {
                if (este.zombies !== null && este.zombies[i].sigoVivo()) {
                    zombiesAux.push(este.zombies[i]);
                }
            }
            este.zombies = zombiesAux;
            for (let i = 0; i < este.filas; i++) {
                for (let j = 0; j < este.tablero.COLUMNAS; j++) {
                    if (este.tableroPlantas[i][j] !== null) {
                        if (este.tableroPlantasInfo[i][j].contadorSegundosHacerAlgo === este.tableroPlantas[i][j].frecuenciaEjecutarFuncionHacerAlgo) {
                            este.tableroPlantasInfo[i][j].contadorSegundosHacerAlgo = 0;
                            este.tableroPlantas[i][j].setNivel(este);
                            este.tableroPlantas[i][j].hacerAlgo(i,j);
                        } else {
                            este.tableroPlantasInfo[i][j].contadorSegundosHacerAlgo++;
                        }
                    }
                }
            }
        },1000);
        setTimeout(function() {
            este.nuevaOleadaZombis();
        }, 5000);
        for (let i = 0; i < this.plantas.length; i++) {
            this.plantas[i].cargarPlanta();
        }
        this.sumarSoles(75);
        divPala.onclick = null;
        divPala.onclick = function() {
            este.selecionarPala();
        }
    }

    getPlantaByCasillaDiv(divCasilla) {
        const tableroDivs = this.getTableroDivs();
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.tablero.COLUMNAS; j++) {
                if (tableroDivs[i][j] === divCasilla) {
                    return {
                        div: this.tableroPlantas[i][j],
                        fila: i,
                        columna: j
                    };
                }
            }
        }
        return {
            div: null,
            fila: -1,
            columna: -1
        }
    }

    terminar() {
        if (intervalSoles != null) {
            clearInterval(this.intervalSoles);
            this.intervalSoles = null;
        }
        this.restablecerSoles();
    }

    generarSolesAleatorios() {
        const este = this;
        //this.generarSol();
        /*
        setTimeout(function () {
            este.generarSol();
        }, 3000);
        */
        this.intervalSoles = setInterval(function () {
            este.numeroSolesIniciales++;
            if (este.numeroSolesIniciales === Nivel.SOLES_GENERADOS_AL_PRINCIPIO - 1) {
                clearInterval(este.intervalSoles);
                este.intervalSoles = null;
                this.intervalSoles = setInterval(function () {
                    este.generarSol();
                }, 20000);
            } else {
                este.generarSol();
            }
        }, 6000);
    }

    generarSol() {
        const divSol = document.createElement("div");
        divSol.classList.add("sol");
        this.tablero.divTablero.appendChild(divSol);
        let px = getRandomInt(0, this.tablero.divTablero.offsetWidth - divSol.offsetWidth);
        divSol.setAttribute("style", "margin-left: " + px + "px");
        this.destruirSol(divSol);
        return divSol;
    }

    sumarSoles(cantidad = 50) {
        this.solesActuales += cantidad;
        if (this.solesActuales > 949) {
            this.solesActuales = 950;
        }
        this.actualizarCartelSoles();
    }

    restarSoles(cantidad = 50) {
        this.solesActuales -= cantidad;
        if (this.solesActuales < 0) {
            this.solesActuales = 0;
        }
        this.actualizarCartelSoles();
    }

    restablecerSoles() {
        this.restarSoles(2000);
    }

    actualizarCartelSoles() {
        const div = document.getElementById("divIndicadorSoles");
        if (div === null) return;
        div.innerHTML = this.solesActuales;
    }

    destruirSol(divSol) {
        const este = this;
        function destruir() {
            if (divSol != null) {
                divSol.remove();
            }
        }
        divSol.onclick = function() {
            destruir();
            este.sumarSoles();
        };
        setTimeout(function() {
            destruir();
        }, 12000);
    }

    getPlantaByHtmlDivs(elementos) {
        let divPlanta = null;
        for (let i = 0; i < elementos.length; i++) {
            if (elementos[i].classList.length === 1 && elementos[i].classList[0] === "panelPlanta") {
                divPlanta = elementos[i];
            }
        }
        if (divPlanta === null) {
            return null;
        }
        for (let i = 0; i < this.plantas.length; i++) {
            if (this.plantas[i].getDivLogoPlanta() === divPlanta) {
                return this.plantas[i];
            }
        }
        return null;
    }

    getPlantaDeCuadricula(i, j) {
        return this.tableroPlantas[i][j];
    }

    getInfoPlantaDeCuadricula(i, j) {
        return this.tableroPlantasInfo[i][j];
    }

    restarVidaPlanta(i, j, vidaAQuitar) {
        const planta = this.getPlantaDeCuadricula(i, j);
        if (planta !== null) {
            if (this.tableroPlantas[i][j].nombre === "Patatapum" && this.tableroPlantasInfo[i][j].puedeExplotar === true) {
                this.tableroPlantas[i][j].hacerAlgo(i, j);
            }
            if (this.tableroPlantasInfo[i][j] !== null) {
                this.tableroPlantasInfo[i][j].vida -= vidaAQuitar;
                if (this.tableroPlantasInfo[i][j].vida < 1) {
                    this.quitarPlantaDeCuadricula(i, j);
                    return true;
                }
                return false;
            }
        }
        return true;
    }

    quitarPlantaDeCuadricula(i, j) {
        this.tableroPlantas[i][j] = null;
        this.tableroPlantasInfo[i][j] = null;
        const tableroDivsCasillas = this.getTableroDivs();
        if (tableroDivsCasillas !== null) {
            tableroDivsCasillas[i][j].style.background = '';
        }
    }

    setPlantaEnCuadricula(i, j, planta) {
        
    }

    plantaActual = null;
    divCeldaAnimada = null;

    eventosRaton() {
        const este = this;
        function getDivCuadriculaActual(elementos) {
            let divCuadricula = null;
            for (let i = 0; i < elementos.length; i++) {
                if (elementos[i].classList.length > 0 && elementos[i].classList.contains("cuadricula")) {
                    divCuadricula = elementos[i];
                }
            }
            return divCuadricula;
        }
        const tamCuadricula = this.tablero.getTamCuadricula() / 2;
        document.addEventListener('mousemove', e => {
            const imgPala = document.getElementById("imgPalaRaton");
            if (este.estoyUsandoPala && imgPala !== null) {
                mostrar(imgPala);
                imgPala.style.top = (parseInt(window.event.pageY) - 50) + "px";
                imgPala.style.left = (parseInt(window.event.pageX) - 50) + "px";
                const elementos = document.elementsFromPoint(e.clientX, e.clientY);
                let divCuadricula = getDivCuadriculaActual(elementos);
                if (divCuadricula !== null && este.getPlantaByCasillaDiv(divCuadricula).div !== null) {
                    divCuadricula.classList.add("celdaAnimada");
                }
                if (este.divCeldaAnimada !== null && este.divCeldaAnimada !== divCuadricula) {
                    este.divCeldaAnimada.classList.remove("celdaAnimada");
                }
                este.divCeldaAnimada = divCuadricula;
                return;
            } else {
                ocultar(imgPala);
            }
            if (este.plantaActual === null) {
                return;
            }
            este.plantaActual.getDivPlantaArrastrar().style.top = parseInt(window.event.pageY) - tamCuadricula + "px";
            este.plantaActual.getDivPlantaArrastrar().style.left = parseInt(window.event.pageX) - tamCuadricula + "px";
            const elementos = document.elementsFromPoint(e.clientX, e.clientY);
            let divCuadricula = getDivCuadriculaActual(elementos);
       
            if (divCuadricula !== null && este.getPlantaByCasillaDiv(divCuadricula).div === null && este.plantaActual.puedoColocarlaEnCuadricula(divCuadricula)) {
                divCuadricula.classList.add("celdaAnimada");
            }
            if (este.divCeldaAnimada !== null && este.divCeldaAnimada !== divCuadricula) {
                este.divCeldaAnimada.classList.remove("celdaAnimada");
            }
            este.divCeldaAnimada = divCuadricula;
            

        }, {passive: true})
        document.addEventListener('mousedown', e => {
            if (este.estoyUsandoPala) {
                //este.plantaActual = este.getPlantaByHtmlDivs(document.elementsFromPoint(e.clientX, e.clientY));
                
                const elementos = document.elementsFromPoint(e.clientX, e.clientY);
                let divCuadricula = getDivCuadriculaActual(elementos);
                const plantaCasilla = este.getPlantaByCasillaDiv(divCuadricula);
                if (plantaCasilla.div !== null) {
                    este.quitarPlantaDeCuadricula(plantaCasilla.fila, plantaCasilla.columna);
                }
                if (este.divCeldaAnimada !== null) {
                    este.divCeldaAnimada.classList.remove("celdaAnimada");
                }
                este.deselecionarPala();
                return;
            }
            if (este.plantaActual !== null) {
                return;
            }
            este.plantaActual = este.getPlantaByHtmlDivs(document.elementsFromPoint(e.clientX, e.clientY));
            if (este.plantaActual === null || este.plantaActual.plantaCargando) {
                este.plantaActual = null;
                return;
            }
            if (este.solesActuales >= este.plantaActual.costeSoles) {
                mostrar(este.plantaActual.getDivPlantaArrastrar());
                este.plantaActual.getDivPlantaArrastrar().style.top = parseInt(window.event.pageY) - tamCuadricula + "px";
                este.plantaActual.getDivPlantaArrastrar().style.left = parseInt(window.event.pageX) - tamCuadricula + "px";
            } else {
                este.plantaActual = null;
                if (!divIndicadorSoles.classList.contains("divIndicadorSolesRojo")) {
                    divIndicadorSoles.classList.add("divIndicadorSolesRojo");
                    setTimeout(function(){
                        divIndicadorSoles.classList.remove("divIndicadorSolesRojo");
                    },800);
                }
            }
        }, {passive: true})
        document.addEventListener('mouseup', e => {
            if (este.estoyUsandoPala || este.plantaActual === null) {
                return;
            }
            ocultar(este.plantaActual.getDivPlantaArrastrar());
            const elementos = document.elementsFromPoint(e.clientX, e.clientY);
            let divCuadricula = getDivCuadriculaActual(elementos);
            if (divCuadricula !== null && este.plantaActual.puedoColocarlaEnCuadricula(divCuadricula)) {
                
                const plantaCasilla = este.getPlantaByCasillaDiv(divCuadricula);
                if (este.tableroPlantas[plantaCasilla.fila][plantaCasilla.columna] === null || este.tableroPlantas[plantaCasilla.fila][plantaCasilla.columna].nombre === "Nenúfar") {
                    if (divCuadricula !== null /*&& plantaCasilla.div === null*/) {
                        este.plantaActual.cargarPlanta();
                        let url = null;
                        let hayNenufar = (este.tableroPlantasInfo[plantaCasilla.fila][plantaCasilla.columna] !== null);
                        let vidaExtra = 0;
                        let rutaNenufar =  divCuadricula.style.backgroundImage.toString();
                        if (!hayNenufar) {
                            url = 'url('+este.plantaActual.getRutaEstadoBase()+')';
                        } else {
                            vidaExtra = este.tableroPlantasInfo[plantaCasilla.fila][plantaCasilla.columna].vida;
                            url = 'url('+este.plantaActual.getRutaEstadoBase() + '), ' + rutaNenufar;
                        }
                        divCuadricula.style.backgroundImage = url;
                        //console.log(divCuadricula.style.backgroundImage);
                        este.restarSoles(este.plantaActual.costeSoles);
                        este.tableroPlantas[plantaCasilla.fila][plantaCasilla.columna] = este.plantaActual;
                        este.tableroPlantasInfo[plantaCasilla.fila][plantaCasilla.columna] = {
                            vida: este.plantaActual.vida + vidaExtra,
                            contadorSegundosHacerAlgo: 0,
                            urlNenufar: hayNenufar ? ', ' + rutaNenufar : ''
                        };
                        //console.log(este.tableroPlantasInfo[plantaCasilla.fila][plantaCasilla.columna]);
                        este.plantaActual.iniciar(este.getTableroDivs(), este.tableroPlantas, este.tableroPlantasInfo, plantaCasilla.fila, plantaCasilla.columna);
                    }
                }
            }
            este.plantaActual = null;
            if (este.divCeldaAnimada !== null) {
                este.divCeldaAnimada.classList.remove("celdaAnimada");
                este.divCeldaAnimada = null;
            }
        }, {passive: true})


    }


}