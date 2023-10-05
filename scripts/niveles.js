let nivelGuardado = localStorage.getItem('nivelPlantasVsZombies');

if (nivelGuardado != null && !isNaN(nivelGuardado)) {
    try {
        nivelGuardado *= 1;
        if (nivelGuardado < 0) {
            nivelGuardado = 0;
            localStorage.setItem('nivelPlantasVsZombies',0);
        }
    } catch (ex) {
        nivelGuardado = 0;
        localStorage.setItem('nivelPlantasVsZombies',0);
    }
} else {
    nivelGuardado = 0;
    localStorage.setItem('nivelPlantasVsZombies',0);
}
let nivel = null;
nivelGuardado++;
btnBorrarRegistroPartida.onclick = borrarRegistroPartida;
switch (nivelGuardado) {
    case 1:
        nivel = new Nivel(
            numero = nivelGuardado,
            filas = 1,
            terreno = Nivel.TERRENOS.HIERVA,
            esDeNoche = false,
            plantas = [
                new Lanzaguisantes()
            ],
            oleadasZombis = [
                getArrayZombis(1),
                getArrayZombis(1),
                getArrayZombis(2)
            ]
        );
      break;
      case 2:
        nivel = new Nivel(
            numero = nivelGuardado,
            filas = 3,
            terreno = Nivel.TERRENOS.HIERVA,
            esDeNoche = false,
            plantas = [
                new Lanzaguisantes(),
                new Girasol()
            ],
            oleadasZombis = [
                getArrayZombis(1),
                getArrayZombis(2),
                getArrayZombis(3)
            ]
        );
      break;
      case 3:
        nivel = new Nivel(
            numero = nivelGuardado,
            filas = 6,
            terreno = Nivel.TERRENOS.HIERVA,
            esDeNoche = false,
            plantas = [
                new Lanzaguisantes(),
                new Girasol(),
                new Patatapum()
            ],
            oleadasZombis = [
                getArrayZombis(1),
                getArrayZombis(3),
                getArrayZombis(7,2)
            ]
        );
      break;
      case 4:
        nivel = new Nivel(
            numero = nivelGuardado,
            filas = 6,
            terreno = Nivel.TERRENOS.HIERVA,
            esDeNoche = false,
            plantas = [
                new Lanzaguisantes(),
                new Girasol(),
                new Patatapum(),
                new Nuez()
            ],
            oleadasZombis = [
                getArrayZombis(1),
                getArrayZombis(2,1),
                getArrayZombis(8,3)
            ]
        );
      break;
      case 5:
        nivel = new Nivel(
            numero = nivelGuardado,
            filas = 6,
            terreno = Nivel.TERRENOS.HIERVA,
            esDeNoche = false,
            plantas = [
                new Lanzaguisantes(),
                new Girasol(),
                new Patatapum(),
                new Nuez(),
                new Plantorcha(),
            ],
            oleadasZombis = [
                getArrayZombis(1),
                getArrayZombis(2,1),
                getArrayZombis(8,3),
                getArrayZombis(10,6),
            ]
        );
      break;
      case 6:
        nivel = new Nivel(
            numero = nivelGuardado,
            filas = 6,
            terreno = Nivel.TERRENOS.HIERVA,
            esDeNoche = false,
            plantas = [
                new Lanzaguisantes(),
                new Girasol(),
                new Patatapum(),
                new Nuez(),
                new Plantorcha(),
                new Hielaguisantes(),
            ],
            oleadasZombis = [
                getArrayZombis(1),
                getArrayZombis(1,2),
                getArrayZombis(8,5),
                getArrayZombis(12,7),
            ]
        );
        break;
        case 7:
            nivel = new Nivel(
                numero = nivelGuardado,
                filas = 6,
                terreno = Nivel.TERRENOS.PISCINA,
                esDeNoche = false,
                plantas = [
                    new Lanzaguisantes(),
                    new Girasol(),
                    new Patatapum(),
                    new Nuez(),
                    new Plantorcha(),
                    new Hielaguisantes(),
                    new Nenufar(),
                ],
                oleadasZombis = [
                    getArrayZombis(1),
                    getArrayZombis(1,1,1),
                    getArrayZombis(6,4,6),
                    getArrayZombis(10,8,8),
                ]
            );
        break;
        case 8:
            nivel = new Nivel(
                numero = nivelGuardado,
                filas = 6,
                terreno = Nivel.TERRENOS.PISCINA,
                esDeNoche = false,
                plantas = [
                    new Lanzaguisantes(),
                    new Girasol(),
                    new Patatapum(),
                    new Nuez(),
                    new Plantorcha(),
                    new Hielaguisantes(),
                    new Nenufar(),
                    new Zampalga()
                ],
                oleadasZombis = [
                    getArrayZombis(1),
                    getArrayZombis(0,2,2),
                    getArrayZombis(5,5,7),
                    getArrayZombis(8,10,9),
                ]
            );
        break;
  }
const niveles = [nivel];
