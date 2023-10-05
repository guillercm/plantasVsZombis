
let plantasVsZombies = null;
window.onload = function() {

    plantasVsZombies = new PlantasVsZombies();
    if (nivel === null) {
        borrarCacheNavegador();
    }
    plantasVsZombies.addNivel(nivel);

}

class PlantasVsZombies {

    niveles = [];

    infoPlantas = [];

    indexNivel = -1;

    constructor() {
        const este = this;
        btnJugar.onclick = function() {
            ocultar(divFondo);
            let numPlAntNivel = 0;
            try {
                numPlAntNivel = localStorage.getItem('numPlPlantasVsZombies')*1;
            } catch (ex) {
                numPlAntNivel = 0;
            }
            if (este.niveles[0].plantas.length !== 1 && (numPlAntNivel === null || isNaN(numPlAntNivel) || este.niveles[0].plantas.length === numPlAntNivel)) {
                plantasVsZombies.siguienteNivel();
            } else {
                let planta = este.niveles[0].plantas[este.niveles[0].plantas.length-1];
                const divDesbloquearPlanta = document.getElementById("divDesbloquearPlanta");
                plantaDesbloqueada(planta.nombre, planta.costeSoles, planta.getDescripcion(), planta.getRutaEstadoBase());
                divDesbloquearPlanta.onclick = function() {
                    plantasVsZombies.siguienteNivel();
                    ocultar(divDesbloquearPlanta);
                }
            }
        }
    }

    addNivel(nivel) {
        this.niveles.push(nivel);
    }

    addNiveles(niveles = []) {
        this.niveles = niveles;
    }

    getNivel(index) {
        return this.niveles[index];
    }

    siguienteNivel() {
        if (this.niveles.length !== 1) {
            return;
        }
        const este = this;
        const funcionGanarPerderPartida = function(haGanado) {
            if (haGanado) {
                let isNum = true;
                let nivel = null;
                try {
                    nivel = (localStorage.getItem('nivelPlantasVsZombies')*1)+1;
                    if (isNaN(nivel)) {
                        nivel = 0;
                    }
                } catch (ex) {
                    isNum = false;
                }
                console.log(nivel);
                localStorage.setItem('nivelPlantasVsZombies', isNum ? nivel : 0);
            }
            location.reload();
        }
        this.niveles[0].empezar(funcionGanarPerderPartida);
            //this.indexNivel++;
        
    }

}


