class Tablero {

    COLUMNAS = 0;
    divTablero = null;
    divsCuadriculas = null;
    filasDisponibles = null;

    constructor() {
        const idName = "areaJuego";
        this.COLUMNAS = getCssVariable('columnas')*1;
        this.divTablero = document.getElementById(idName);
        if (this.divTablero === null) {
            this.divTablero = document.createElement("div");
            this.divTablero.id = idName;
            document.body.appendChild(this.divTablero);
        }
        this.vaciar();
    }

    vaciar() {
        this.divTablero.innerHTML = '';
        this.divsCuadriculas = [];
    }

    deHierva(filas, esDeNoche = false) {
        this.crear(filas, function(result) {
            const i = result.i;
            const j = result.j;
            const div = result.div;
            let newClass = 'cespedOscuro';
            if ((esPar(i) && esPar(j)) || (esImpar(i) && esImpar(j))) {
                newClass = 'cespedClaro';
            }
            div.classList.add(newClass);
        });
    }

    dePiscina(filas, esDeNoche = false) {
        this.crear(filas, function(result) {
            const i = result.i;
            const j = result.j;
            const div = result.div;
            let newClass = 'cespedOscuro';
            if ((esPar(i) && esPar(j)) || (esImpar(i) && esImpar(j))) {
                newClass = 'cespedClaro';
            }
            if (i === 2 || i === 3) {
                newClass = 'agua' + (i - 2) + "" + j;
            }
            if (newClass !== null) {
                div.classList.add(newClass);
            }
        });
    }

    deTejado(filas, esDeNoche = false) {
        this.crear(filas, function(result) {
            const i = result.i;
            const j = result.j;
            const div = result.div;
            let newClass = 'cespedOscuro';
            if ((esPar(i) && esPar(j)) || (esImpar(i) && esImpar(j))) {
                newClass = 'cespedClaro';
            }
            div.classList.add(newClass);
        });
    }

    crear(filas = 5, funcion) {
        this.vaciar();
        const este = this;
        for (let i = 0; i < filas; i++) {
            this.divsCuadriculas.push([]);
            for (let j = 0; j < this.COLUMNAS; j++) {
                const doTask = () => new Promise((resolve) => {
                    const divCuadricula = este.getDivCuadricula(this.filasDisponibles.includes(i));
                    este.divsCuadriculas[i].push(divCuadricula);
                    este.divTablero.appendChild(divCuadricula);
                    resolve({
                        div: divCuadricula,
                        i: i,
                        j: j
                    });
                });
                doTask().then(result => funcion(result));
            }
        }
    }

    getTamCuadricula() {
        return getCssVariable("tamCuadricula").replace("px","")*1;
    }

    getIndexCuadricula(div) {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < this.COLUMNAS; j++) {
                if (this.divsCuadriculas[i][j] === div) {
                    return {
                        i: i,
                        j: j,
                    };
                }
            }
        }
        return null;
    }

    getDivCuadricula(habilitada) {
        const newDiv = document.createElement("div");
        newDiv.classList.add(habilitada ? "cuadricula" : "cuadriculaDeshabilitada");
        /*for (let i = 0; i < clases.length; i++) {
           newDiv.classList.add(clases[i]);
        } */
        return newDiv;
    }
}