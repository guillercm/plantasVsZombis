function esPar(num) {
    return num % 2 === 0;
}

function esImpar(num) {
    return !esPar(num);
}

function getRandomInt(min, max) {
    max++;
    return Math.floor(Math.random() * (max - min) + min);
}

function getCssVariable(nombre) {
    return getComputedStyle(document.documentElement).getPropertyValue('--' + nombre);
}

function mostrar(elemento) {
    if (elemento === null){
        return;
    }
    elemento.classList.remove("oculto");
}

function ocultar(elemento) {
    if (elemento === null){
        return;
    }
    elemento.classList.add("oculto");
}

function getDivDeClase(elementos, claseABuscar) {
    for (let i = 0; i < elementos.length; i++) {
        if (elementos[i].classList.length > 0 && elementos[i].classList.contains(claseABuscar)) {
            return elementos[i];
        }
    }
    return null;
}

function moverDivPrueba(left, top) {
    document.getElementById("divPrueba").setAttribute("style", 
    "left: " + left + "px; " + 
    "top: " + top  + "px");
}

function eliminarPrimerElementoArray(array) {
    const array2 = [];
    for (let i = 1; i < array.length; i++) {
        array2.push(array[i]);
    }
    return array2;
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function borrarCacheNavegador() {
    localStorage.setItem('nivelPlantasVsZombies', 0);
    localStorage.setItem('numPlPlantasVsZombies', 0);
    location.reload();
}

function borrarRegistroPartida() {
    if (!confirm("Todo tu progreso actual se eliminará, ¿Estás seguro que desea borrar su partida?")) return;
    borrarCacheNavegador();
}

function plantaDesbloqueada(nombre, costeSoles, descripcion, logo) {
    const divDesbloquearPlanta = document.getElementById("divDesbloquearPlanta");
    if (divDesbloquearPlanta === null) return;
    divDesbloquearPlanta.innerHTML = `
        <div>
            <img src="multimedia/nuevaPlanta.png">
            <img class="plantaLogo" src="${logo}">
            <h3 class="nombre">${nombre}</h3>
            <p class="desc">${descripcion}</p>
            <p class="precio">Precio: ${costeSoles}</p>
        </div>
    `;
    mostrar(divDesbloquearPlanta);
}