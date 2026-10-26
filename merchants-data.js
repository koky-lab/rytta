const DEFAULT_MERCHANTS = [
  {
    "id": "merchant-0",
    "name": "Herrería",
    "location": "",
    "description": "",
    "visible": false,
    "items": [
      {
        "id": "item-1-0",
        "name": "Daga",
        "price": "2 po",
        "use": "Arma común"
      },
      {
        "id": "item-1-1",
        "name": "Espada corta",
        "price": "10 po",
        "use": "Arma común"
      },
      {
        "id": "item-1-2",
        "name": "Espada larga",
        "price": "15 po",
        "use": "Arma común"
      },
      {
        "id": "item-1-3",
        "name": "Estoque",
        "price": "25 po",
        "use": "Arma común"
      },
      {
        "id": "item-1-4",
        "name": "Mandoble",
        "price": "50 po",
        "use": "Arma pesada"
      },
      {
        "id": "item-1-5",
        "name": "Arco corto",
        "price": "25 po",
        "use": "Arma a distancia"
      },
      {
        "id": "item-1-6",
        "name": "Arco largo",
        "price": "50 po",
        "use": "Arma a distancia"
      },
      {
        "id": "item-1-7",
        "name": "20 flechas",
        "price": "1 po",
        "use": "Munición"
      },
      {
        "id": "item-1-8",
        "name": "Escudo",
        "price": "10 po",
        "use": "Defensa"
      },
      {
        "id": "item-1-9",
        "name": "Cota de mallas",
        "price": "75 po",
        "use": "Armadura"
      },
      {
        "id": "item-1-10",
        "name": "Coraza",
        "price": "400 po",
        "use": "Armadura"
      },
      {
        "id": "item-1-11",
        "name": "Media armadura",
        "price": "750 po",
        "use": "Armadura"
      },
      {
        "id": "item-1-12",
        "name": "Arpón de anclaje",
        "price": "35 po",
        "use": "Enganchar criaturas grandes o superficies"
      },
      {
        "id": "item-1-13",
        "name": "Garfio de abordaje reforzado",
        "price": "8 po",
        "use": "Escalada/abordaje"
      },
      {
        "id": "item-1-14",
        "name": "Clavos de emergencia navales",
        "price": "15 po",
        "use": "Reparación provisional del barco"
      },
      {
        "id": "item-1-15",
        "name": "Cuchillo de marinero",
        "price": "3 po",
        "use": "Ventaja narrativa cortando redes/cuerdas"
      },
      {
        "id": "item-1-16",
        "name": "Escudo de cubierta",
        "price": "25 po",
        "use": "Protección contra restos/proyectiles"
      },
      {
        "id": "item-1-17",
        "name": "Puntas rompeescamas, 5 uds.",
        "price": "20 po",
        "use": "Munición especial para monstruos marinos"
      },
      {
        "id": "item-1-18",
        "name": "Martillo",
        "price": "1 po",
        "use": "Herramienta"
      },
      {
        "id": "item-1-19",
        "name": "Palanca",
        "price": "2 po",
        "use": "Abrir/forzar"
      },
      {
        "id": "item-1-20",
        "name": "10 pitones",
        "price": "5 pp",
        "use": "Escalada"
      },
      {
        "id": "item-1-21",
        "name": "Cadena, 3 m",
        "price": "5 po",
        "use": "Inmovilizar/asegurar"
      }
    ]
  },
  {
    "id": "merchant-1",
    "name": "Alquimista",
    "location": "",
    "description": "",
    "visible": false,
    "items": [
      {
        "id": "item-2-0",
        "name": "Poción de curación",
        "price": "50 po",
        "use": "2d4+2 PV"
      },
      {
        "id": "item-2-1",
        "name": "Antitoxina",
        "price": "50 po",
        "use": "Resistencia/ayuda contra veneno"
      },
      {
        "id": "item-2-2",
        "name": "Ácido",
        "price": "25 po",
        "use": "Daño / utilidad"
      },
      {
        "id": "item-2-3",
        "name": "Fuego de alquimista",
        "price": "50 po",
        "use": "Fuego continuo"
      },
      {
        "id": "item-2-4",
        "name": "Aceite",
        "price": "1 pp",
        "use": "Combustible"
      },
      {
        "id": "item-2-5",
        "name": "Kit de sanador",
        "price": "5 po",
        "use": "10 usos"
      },
      {
        "id": "item-2-6",
        "name": "Poción de respiración acuática",
        "price": "150 po",
        "use": "Respirar bajo el agua durante 1 h"
      },
      {
        "id": "item-2-7",
        "name": "Ungüento de branquias",
        "price": "50 po",
        "use": "Respirar bajo el agua 10 min"
      },
      {
        "id": "item-2-8",
        "name": "Luz abisal",
        "price": "20 po",
        "use": "Luz submarina; puede marcar una criatura"
      },
      {
        "id": "item-2-9",
        "name": "Bálsamo contra el mareo",
        "price": "10 po",
        "use": "Evita penalizadores por mareo durante varias horas"
      },
      {
        "id": "item-2-10",
        "name": "Resina instantánea",
        "price": "30 po",
        "use": "Sellar temporalmente una vía de agua"
      },
      {
        "id": "item-2-11",
        "name": "Humo salino",
        "price": "25 po",
        "use": "Nube de humo/dispersión"
      },
      {
        "id": "item-2-12",
        "name": "Tónico del despertar",
        "price": "35 po",
        "use": "Estabilizar/despertar rápidamente a alguien"
      },
      {
        "id": "item-2-13",
        "name": "Repelente de criaturas",
        "price": "20 po",
        "use": "Ayuda contra fauna menor durante varias horas"
      }
    ]
  },
  {
    "id": "merchant-2",
    "name": "Templo",
    "location": "",
    "description": "",
    "visible": false,
    "items": [
      {
        "id": "item-3-0",
        "name": "Agua bendita",
        "price": "25 po",
        "use": "Uso contra determinadas criaturas"
      },
      {
        "id": "item-3-1",
        "name": "Símbolo sagrado",
        "price": "5 po",
        "use": "Objeto religioso"
      },
      {
        "id": "item-3-2",
        "name": "Incienso",
        "price": "5 pp",
        "use": "Ritual"
      },
      {
        "id": "item-3-3",
        "name": "Kit de sanador",
        "price": "5 po",
        "use": "Medicina"
      },
      {
        "id": "item-3-4",
        "name": "Amuleto del Navegante",
        "price": "75 po",
        "use": "Pequeña protección frente a accidentes marítimos"
      },
      {
        "id": "item-3-5",
        "name": "Cuerda de los Náufragos, 15 m",
        "price": "40 po",
        "use": "Flota incluso con carga"
      },
      {
        "id": "item-3-6",
        "name": "Vela del Regreso",
        "price": "125 po",
        "use": "Su llama apunta hacia donde fue encendida inicialmente"
      },
      {
        "id": "item-3-7",
        "name": "Medallón del Último Nombre",
        "price": "100 po",
        "use": "Mantiene mágicamente grabado el nombre del propietario"
      },
      {
        "id": "item-3-8",
        "name": "Sal consagrada",
        "price": "20 po",
        "use": "Protección/identificación sobrenatural limitada"
      },
      {
        "id": "item-3-9",
        "name": "Bendición del viaje",
        "price": "25 po/persona",
        "use": "Bonificación narrativa para la expedición"
      },
      {
        "id": "item-3-10",
        "name": "Lesser Restoration",
        "price": "75 po aprox.",
        "use": "Servicio mágico"
      },
      {
        "id": "item-3-11",
        "name": "Remove Curse",
        "price": "150–250 po",
        "use": "Servicio mágico más raro"
      }
    ]
  },
  {
    "id": "merchant-3",
    "name": "Mercado general",
    "location": "",
    "description": "",
    "visible": false,
    "items": [
      {
        "id": "item-4-0",
        "name": "Mochila",
        "price": "2 po",
        "use": ""
      },
      {
        "id": "item-4-1",
        "name": "Saco",
        "price": "1 pc",
        "use": ""
      },
      {
        "id": "item-4-2",
        "name": "Bedroll",
        "price": "1 po",
        "use": ""
      },
      {
        "id": "item-4-3",
        "name": "Ración de 1 día",
        "price": "5 pp",
        "use": ""
      },
      {
        "id": "item-4-4",
        "name": "Odre",
        "price": "2 pp",
        "use": ""
      },
      {
        "id": "item-4-5",
        "name": "Tienda de campaña",
        "price": "2 po",
        "use": ""
      },
      {
        "id": "item-4-6",
        "name": "Cuerda de cáñamo, 15 m",
        "price": "1 po",
        "use": ""
      },
      {
        "id": "item-4-7",
        "name": "Cuerda de seda, 15 m",
        "price": "10 po",
        "use": ""
      },
      {
        "id": "item-4-8",
        "name": "Garfio",
        "price": "2 po",
        "use": ""
      },
      {
        "id": "item-4-9",
        "name": "Polea",
        "price": "1 po",
        "use": ""
      },
      {
        "id": "item-4-10",
        "name": "Linterna cubierta",
        "price": "5 po",
        "use": ""
      },
      {
        "id": "item-4-11",
        "name": "Linterna ojo de buey",
        "price": "10 po",
        "use": ""
      },
      {
        "id": "item-4-12",
        "name": "Antorcha",
        "price": "1 pc",
        "use": ""
      },
      {
        "id": "item-4-13",
        "name": "Caja de yesca",
        "price": "5 pp",
        "use": ""
      },
      {
        "id": "item-4-14",
        "name": "Manta",
        "price": "5 pp",
        "use": ""
      },
      {
        "id": "item-4-15",
        "name": "Pico",
        "price": "2 po",
        "use": ""
      },
      {
        "id": "item-4-16",
        "name": "Pala",
        "price": "2 po",
        "use": ""
      },
      {
        "id": "item-4-17",
        "name": "Equipo de pesca",
        "price": "1 po",
        "use": ""
      },
      {
        "id": "item-4-18",
        "name": "Catalejo básico",
        "price": "100 po",
        "use": ""
      },
      {
        "id": "item-4-19",
        "name": "Catalejo de alta calidad",
        "price": "1.000 po",
        "use": ""
      },
      {
        "id": "item-4-20",
        "name": "Campanas de niebla",
        "price": "10 po",
        "use": ""
      },
      {
        "id": "item-4-21",
        "name": "Jaula + 2 aves marinas",
        "price": "8 po",
        "use": ""
      },
      {
        "id": "item-4-22",
        "name": "Mapa regional de corrientes",
        "price": "15 po",
        "use": ""
      },
      {
        "id": "item-4-23",
        "name": "Mapa naval detallado",
        "price": "50 po",
        "use": ""
      },
      {
        "id": "item-4-24",
        "name": "Barril impermeabilizado",
        "price": "5 po",
        "use": ""
      },
      {
        "id": "item-4-25",
        "name": "Red reforzada",
        "price": "8 po",
        "use": ""
      },
      {
        "id": "item-4-26",
        "name": "Espejo de señales",
        "price": "5 po",
        "use": ""
      },
      {
        "id": "item-4-27",
        "name": "Brújula normal",
        "price": "10 po",
        "use": ""
      },
      {
        "id": "item-4-28",
        "name": "Reloj de arena",
        "price": "25 po",
        "use": ""
      }
    ]
  },
  {
    "id": "merchant-4",
    "name": "Mano Hundida",
    "location": "",
    "description": "Material y contactos que Konga puede conseguir.",
    "visible": false,
    "items": [
      {
        "id": "item-5-0",
        "name": "Herramientas de ladrón",
        "price": "25 po",
        "use": "Cerraduras/trampas"
      },
      {
        "id": "item-5-1",
        "name": "Kit de disfraz",
        "price": "25 po",
        "use": "Identidades falsas"
      },
      {
        "id": "item-5-2",
        "name": "Kit de falsificación",
        "price": "15 po",
        "use": "Documentos"
      },
      {
        "id": "item-5-3",
        "name": "Veneno básico",
        "price": "100 po",
        "use": "1d4 veneno"
      },
      {
        "id": "item-5-4",
        "name": "Abrojos",
        "price": "1 po",
        "use": "Persecuciones"
      },
      {
        "id": "item-5-5",
        "name": "Canicas metálicas",
        "price": "1 po",
        "use": "Derribar/perseguir"
      },
      {
        "id": "item-5-6",
        "name": "Esposas",
        "price": "2 po",
        "use": "Prisioneros"
      },
      {
        "id": "item-5-7",
        "name": "Somnífero clandestino",
        "price": "40 po",
        "use": "Incapacitar sin matar"
      },
      {
        "id": "item-5-8",
        "name": "Documentación falsa",
        "price": "30–80 po",
        "use": "Depende de calidad"
      },
      {
        "id": "item-5-9",
        "name": "Bengala de contrabandista",
        "price": "10 po",
        "use": "Señales de colores"
      },
      {
        "id": "item-5-10",
        "name": "Moneda de Konga",
        "price": "Favor, no venta",
        "use": "Demuestra pertenencia/contacto con la Mano Hundida"
      },
      {
        "id": "item-5-11",
        "name": "Cofre con doble fondo",
        "price": "20 po",
        "use": "Esconder objetos"
      },
      {
        "id": "item-5-12",
        "name": "Informante básico",
        "price": "10–25 po",
        "use": "Rumor/información menor"
      },
      {
        "id": "item-5-13",
        "name": "Informante especializado",
        "price": "50–150 po",
        "use": "Información sensible"
      },
      {
        "id": "item-5-14",
        "name": "Mercenario por día",
        "price": "2–5 po",
        "use": "Según experiencia"
      },
      {
        "id": "item-5-15",
        "name": "Guardaespaldas veterano/día",
        "price": "10 po",
        "use": "Personal especializado"
      }
    ]
  },
  {
    "id": "merchant-arcano",
    "name": "Suministros arcanos",
    "location": "",
    "description": "",
    "visible": false,
    "items": [
      {
        "id": "item-6-0",
        "name": "Tiza arcana, 5 uds.",
        "price": "15 po",
        "use": "Marcas resistentes a agua/clima"
      },
      {
        "id": "item-6-1",
        "name": "Pergaminos vinculados, pareja",
        "price": "75 po",
        "use": "Mensajes escritos a distancia, usos limitados"
      },
      {
        "id": "item-6-2",
        "name": "Ancla mental",
        "price": "150 po",
        "use": "Conserva una frase/idea frente a alteración de memoria"
      },
      {
        "id": "item-6-3",
        "name": "Brújula imposible",
        "price": "250 po",
        "use": "Señala una anomalía mágica concreta"
      },
      {
        "id": "item-6-4",
        "name": "Frasco de recuerdo",
        "price": "200 po",
        "use": "Guarda una imagen/sensación breve"
      },
      {
        "id": "item-6-5",
        "name": "Pergamino nivel 1",
        "price": "50–75 po",
        "use": "Magia consumible"
      },
      {
        "id": "item-6-6",
        "name": "Pergamino nivel 2",
        "price": "125–175 po",
        "use": "Magia consumible"
      },
      {
        "id": "item-6-7",
        "name": "Pergamino nivel 3",
        "price": "250–350 po",
        "use": "Magia consumible"
      },
      {
        "id": "item-6-8",
        "name": "Perla para Identify",
        "price": "100 po",
        "use": "Componente reusable"
      },
      {
        "id": "item-6-9",
        "name": "Componentes arcanos raros",
        "price": "25–200 po",
        "use": "Según hechizo"
      }
    ]
  },
  {
    "id": "merchant-6",
    "name": "Suministros navales",
    "location": "",
    "description": "",
    "visible": false,
    "items": [
      {
        "id": "item-7-0",
        "name": "Cuerda de cáñamo, 15 m",
        "price": "1 po",
        "use": "Uso general"
      },
      {
        "id": "item-7-1",
        "name": "Garfio",
        "price": "2 po",
        "use": "Abordaje"
      },
      {
        "id": "item-7-2",
        "name": "Polea",
        "price": "1 po",
        "use": "Manipulación de cargas"
      },
      {
        "id": "item-7-3",
        "name": "Red",
        "price": "1 po",
        "use": "Pesca/inmovilizar"
      },
      {
        "id": "item-7-4",
        "name": "Equipo de pesca",
        "price": "1 po",
        "use": "Comida"
      },
      {
        "id": "item-7-5",
        "name": "Arnés de cubierta",
        "price": "8 po",
        "use": "Evita caer por la borda"
      },
      {
        "id": "item-7-6",
        "name": "Chaleco de corcho",
        "price": "5 po",
        "use": "Flotación"
      },
      {
        "id": "item-7-7",
        "name": "Kit de reparación naval",
        "price": "50 po",
        "use": "Reparaciones; puede restaurar recursos del minijuego"
      },
      {
        "id": "item-7-8",
        "name": "Kit de reparación naval grande",
        "price": "150 po",
        "use": "Varias reparaciones importantes"
      },
      {
        "id": "item-7-9",
        "name": "Arpón ballenero",
        "price": "30 po",
        "use": "Combate naval"
      },
      {
        "id": "item-7-10",
        "name": "Arpón ballenero reforzado",
        "price": "75 po",
        "use": "Criaturas grandes"
      },
      {
        "id": "item-7-11",
        "name": "Cuerda de seguridad para 5 personas",
        "price": "20 po",
        "use": "Mantener un grupo unido"
      },
      {
        "id": "item-7-12",
        "name": "Silbato de contramaestre",
        "price": "5 po",
        "use": "Coordinar tripulación"
      },
      {
        "id": "item-7-13",
        "name": "Barril de agua",
        "price": "1 po",
        "use": "Suministros"
      },
      {
        "id": "item-7-14",
        "name": "Barril de comida seca",
        "price": "5 po",
        "use": "Suministros"
      },
      {
        "id": "item-7-15",
        "name": "Repuesto de vela",
        "price": "25 po",
        "use": "Reparación"
      },
      {
        "id": "item-7-16",
        "name": "Madera preparada para casco",
        "price": "50 po",
        "use": "Reparación"
      },
      {
        "id": "item-7-17",
        "name": "Carta náutica de Jeff",
        "price": "No se vende",
        "use": "Información de rutas y zonas peligrosas"
      }
    ]
  }
];
