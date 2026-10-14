

const FEATURES = [
  'Piscina', 'Aire acondicionado', 'Paellero', 'Terraza', 'Garaje',
  'Ascensor', 'Trastero', 'Jardín', 'Amueblado', 'Calefacción',
  'Chimenea', 'Vistas', 'Barbacoa', 'Mascotas permitidas'
];

const fmtNum = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const IMG = {
  a: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=70',
  b: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=70',
  c: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=70',
  d: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=70',
  e: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=70',
  f: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=70',
  g: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=70',
  h: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=70',
  i: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=70',
  j: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=70'
};

const PHOTOS = {
  interior: ['1502672260266-1c1ef2d93688', '1560448204-e02f11c3d0e2', '1484154218962-a197022b5858', '1493809842364-78817add7ffb',
             '1522708323590-d24dbb6b0267', '1505691938895-1758d7feb511', '1556912172-45b7abe8b7e1', '1540518614846-7eded433c457',
             '1552321554-5fefe8c9ef14', '1586023492125-27b2c045efd7', '1493663284031-b7e3aefcae8e', '1505693416388-ac5ce068fe85'],
  exterior: ['1564013799919-ab600027ffc6', '1512917774080-9991f1c4c750', '1600585154340-be6161a56a0c', '1613490493576-7fde63acd811',
             '1600596542815-ffad4c1539a9', '1600607687939-ce8a6c25118c', '1580587771525-78b9dba3b914', '1568605114967-8130f3a36994',
             '1570129477492-45c003edd2be', '1600047509807-ba8f99d2cdde']
};
const photoUrl = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;

function buildGallery(p, idx) {
  const main = p.img.replace('w=800', 'w=1400');
  const pool = (p.tipo === 'Chalet' || p.tipo === 'Finca')
    ? [...PHOTOS.exterior, ...PHOTOS.interior]
    : [...PHOTOS.interior, ...PHOTOS.exterior.slice(0, 2)];
  const out = [main];
  for (let k = 0; k < 8; k++) out.push(photoUrl(pool[(idx * 3 + k) % pool.length]));
  return [...new Set(out)];
}

/* Coordenadas aproximadas por población (para el mapa) */
const COORDS = { 'Requena': [39.4881, -1.1005], 'Utiel': [39.5686, -1.2086], 'Venta del Moro': [39.4747, -1.3597] };
function coordsFor(p) {
  const [lat, lng] = COORDS[p.poblacion] || COORDS.Requena;
  const h = [...(p.zona + p.ref)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return [lat + ((h % 60) - 30) / 10000, lng + (((h >> 2) % 60) - 30) / 10000];
}


const RAW = [
  {
    ref: 'MRG2114', op: 'venta', tipo: 'Ático', poblacion: 'Requena', zona: 'Centro',
    title: 'Ático de autor con vistas panorámicas', beds: 4, baths: 4, m2: 270, price: 490000,
    feats: ['Terraza', 'Aire acondicionado', 'Ascensor', 'Garaje', 'Vistas'], img: IMG.f, tour: true, video: true, featured: true, date: '2026-10-01',
    util: 245, orient: 'Sur', cons: 'Reformado', planta: '8', suelo: 'Mármol', agua: 'Termo eléctrico', elec: '380W', ext: 'Aluminio', dorms: [1, 3],
    extras: ['Armarios empotrados', 'Electrodomésticos', 'Luz', 'Agua', 'Portero automático'], energia: { letra: 'C', cons: 96, emis: 19 },
    desc: [
      'Inmobiliaria Requena se complace en presentar este singular ático de autor en pleno centro, con amplias terrazas y vistas panorámicas despejadas sobre la localidad.',
      'La vivienda, muy luminosa, se distribuye en un gran salón-comedor con salida directa a la terraza, cocina totalmente equipada, cuatro dormitorios y cuatro baños completos. Acabados de calidad en mármol y carpintería de aluminio.',
      'Dispone de aire acondicionado por conductos, ascensor hasta la vivienda y plaza de garaje en el mismo edificio. Una oportunidad única para vivir en el mejor enclave de Requena.'
    ]
  },
  {
    ref: 'MRG2112', op: 'alquiler', tipo: 'Piso', poblacion: 'Requena', zona: 'Ensanche',
    title: 'Estupenda vivienda con vistas a los jardines', beds: 4, baths: 2, m2: 163, price: 1800,
    feats: ['Aire acondicionado', 'Ascensor', 'Calefacción', 'Terraza', 'Garaje'], img: IMG.d, featured: true, date: '2026-09-28',
    util: 150, orient: 'Noroeste', cons: 'Entrar a vivir', planta: '2', suelo: 'Mármol', agua: 'Termo eléctrico', elec: '220W', ext: 'Mixto', dorms: [1, 3],
    extras: ['Armarios empotrados', 'Electrodomésticos', 'Luz', 'Agua'], energia: null,
    desc: [
      'Inmobiliaria Requena se complace en presentar esta excelente vivienda en alquiler, situada en una segunda planta con impresionantes vistas a los jardines.',
      'La propiedad, muy luminosa y bien distribuida, cuenta con un vestíbulo acogedor que da acceso a cuatro amplios dormitorios y dos baños completos. Su cocina ha sido reformada recientemente e incluye los electrodomésticos necesarios, además de un cuarto de lavado adyacente.',
      'El salón es amplio y ofrece salida directa a una terraza perfecta para disfrutar del aire libre. Se alquila sin amueblar pero equipada adecuadamente para su uso inmediato, y dispone de plaza de garaje con acceso directo desde el interior del edificio.'
    ]
  },
  {
    ref: 'MRG2111', op: 'venta', tipo: 'Piso', poblacion: 'Requena', zona: 'Centro',
    title: 'Entreplanta reformada en el centro', beds: 3, baths: 2, m2: 102, price: 195000,
    feats: ['Aire acondicionado', 'Amueblado', 'Calefacción'], img: IMG.c, tour: true, video: true, featured: true, date: '2026-09-25',
    util: 89, orient: 'Este', cons: 'Reformado', planta: '1', suelo: 'Porcelánico', agua: 'Termo eléctrico', elec: '220W', ext: 'Aluminio', dorms: [1, 2],
    extras: ['Armarios empotrados', 'Electrodomésticos', 'Luz', 'Agua', 'Puerta blindada'], energia: { letra: 'D', cons: 138, emis: 27 },
    desc: [
      'Entreplanta totalmente reformada en el centro, a pocos pasos de comercios, colegios y servicios. Una vivienda para entrar a vivir sin hacer ninguna obra.',
      'Se distribuye en un salón-comedor abierto a la cocina con isla, tres dormitorios y dos baños con acabados modernos. Los grandes ventanales de aluminio aportan mucha luz natural.',
      'Incluye aire acondicionado, calefacción y mobiliario de cocina y salón. Ideal tanto para vivienda habitual como para inversión.'
    ]
  },
  {
    ref: 'MRG2110', op: 'venta', tipo: 'Piso', poblacion: 'Requena', zona: 'Mercado',
    title: 'Piso con cocina de diseño junto al mercado', beds: 2, baths: 1, m2: 78, price: 129000,
    feats: ['Aire acondicionado', 'Amueblado', 'Ascensor'], img: IMG.j, tour: true, video: true, date: '2026-09-20',
    util: 68, orient: 'Sur', cons: 'Reformado', planta: '3', suelo: 'Porcelánico', agua: 'Termo eléctrico', elec: '220W', ext: 'Aluminio', dorms: [0, 2],
    extras: ['Electrodomésticos', 'Luz', 'Agua'], energia: { letra: 'E', cons: 176, emis: 33 },
    desc: [
      'Coqueto piso reformado junto al mercado, con todo a mano: comercios, hostelería y transporte.',
      'Destaca su cocina de diseño con encimera de gran formato, electrodomésticos integrados y zona de lavadero. Dos dormitorios dobles y un baño completo con plato de ducha.',
      'El edificio cuenta con ascensor. Se vende amueblado, listo para entrar a vivir o destinar al alquiler.'
    ]
  },
  {
    ref: 'MRG2108', op: 'venta', tipo: 'Chalet', poblacion: 'Requena', zona: 'La Portera',
    title: 'Chalet independiente con piscina y paellero', beds: 5, baths: 3, m2: 320, price: 365000, parcela: 900,
    feats: ['Piscina', 'Paellero', 'Barbacoa', 'Jardín', 'Garaje', 'Aire acondicionado', 'Mascotas permitidas'], img: IMG.b, video: true, date: '2026-09-15',
    util: 290, orient: 'Sureste', cons: 'Entrar a vivir', planta: '2 plantas', suelo: 'Gres', agua: 'Aerotermia', elec: '380W', ext: 'Carpintería PVC', dorms: [1, 4],
    extras: ['Armarios empotrados', 'Luz', 'Agua', 'Zona de juegos', 'Vallado'], energia: { letra: 'D', cons: 150, emis: 30 },
    desc: [
      'Magnífico chalet independiente sobre una parcela de 900 m², con jardín, piscina privada y una gran zona de barbacoa y paellero para disfrutar todo el año.',
      'La planta baja reúne el salón con chimenea, la cocina independiente y un dormitorio con baño. En la planta superior se encuentran cuatro dormitorios más, dos de ellos con vestidor.',
      'Garaje cubierto para dos vehículos, aire acondicionado por conductos y aerotermia para el agua caliente. Entorno tranquilo y muy bien comunicado.'
    ]
  },
  {
    ref: 'MRG2107', op: 'venta', tipo: 'Finca', poblacion: 'Requena', zona: 'Campo',
    title: 'Finca rústica con viñedo y casa restaurada', beds: 3, baths: 2, m2: 540, price: 280000, parcela: 15000,
    feats: ['Chimenea', 'Paellero', 'Jardín', 'Vistas', 'Barbacoa'], img: IMG.a, date: '2026-09-10',
    util: 480, orient: 'Sur', cons: 'Restaurado', planta: '1 planta', suelo: 'Barro cocido', agua: 'Butano', elec: '220W', ext: 'Madera', dorms: [1, 2],
    extras: ['Pozo', 'Luz', 'Agua', 'Viñedo', 'Casa de aperos'], energia: null,
    desc: [
      'Finca rústica de 1,5 hectáreas con viñedo en producción y una casa de campo restaurada respetando los materiales tradicionales.',
      'La vivienda cuenta con un salón con chimenea, cocina rústica totalmente equipada, tres dormitorios y dos baños. Cuenta con porche, paellero y una gran zona de jardín.',
      'Pozo propio y suministro eléctrico. Perfecta para quien busca desconectar o iniciar un proyecto vinculado al vino.'
    ]
  },
  {
    ref: 'MRG2105', op: 'alquiler', tipo: 'Piso', poblacion: 'Utiel', zona: 'Centro',
    title: 'Piso luminoso amueblado en Utiel', beds: 3, baths: 1, m2: 95, price: 620,
    feats: ['Amueblado', 'Calefacción', 'Aire acondicionado', 'Mascotas permitidas'], img: IMG.g, date: '2026-09-05',
    util: 84, orient: 'Este', cons: 'Entrar a vivir', planta: '2', suelo: 'Terrazo', agua: 'Termo eléctrico', elec: '220W', ext: 'Aluminio', dorms: [1, 2],
    extras: ['Armarios empotrados', 'Electrodomésticos', 'Luz', 'Agua'], energia: { letra: 'F', cons: 214, emis: 41 },
    desc: [
      'Piso muy luminoso y completamente amueblado en pleno centro de Utiel, con todos los servicios al alcance.',
      'Tres dormitorios, un baño completo, cocina equipada y salón con salida a balcón. Dispone de calefacción y aire acondicionado en el salón.',
      'Se admiten mascotas. Disponible de forma inmediata para contratos de larga duración.'
    ]
  },
  {
    ref: 'MRG2103', op: 'venta', tipo: 'Chalet', poblacion: 'Utiel', zona: 'Las Cuevas',
    title: 'Chalet adosado con terraza y garaje', beds: 4, baths: 3, m2: 210, price: 215000, parcela: 180,
    feats: ['Terraza', 'Garaje', 'Trastero', 'Aire acondicionado', 'Paellero'], img: IMG.e, date: '2026-08-30',
    util: 185, orient: 'Sur', cons: 'Entrar a vivir', planta: '3 plantas', suelo: 'Gres', agua: 'Termo eléctrico', elec: '380W', ext: 'Carpintería PVC', dorms: [1, 3],
    extras: ['Armarios empotrados', 'Luz', 'Agua', 'Patio'], energia: { letra: 'D', cons: 145, emis: 28 },
    desc: [
      'Chalet adosado en una zona residencial tranquila, con terraza, patio trasero con paellero y garaje para dos coches.',
      'Distribuido en tres plantas: salón-comedor y cocina en la baja, tres dormitorios y dos baños en la primera y un dormitorio principal con baño en suite en la última.',
      'Incluye trastero y aire acondicionado por splits. Una opción cómoda y espaciosa para toda la familia.'
    ]
  },
  {
    ref: 'MRG2101', op: 'venta', tipo: 'Local', poblacion: 'Requena', zona: 'Ensanche',
    title: 'Local comercial a pie de calle, esquina', beds: 0, baths: 1, m2: 120, price: 145000,
    feats: ['Aire acondicionado', 'Calefacción'], img: IMG.h, date: '2026-08-25',
    util: 112, orient: 'Norte', cons: 'Entrar a vivir', planta: 'Baja', suelo: 'Porcelánico', agua: 'Termo eléctrico', elec: '380W', ext: 'Aluminio', dorms: null,
    extras: ['Luz', 'Agua', 'Escaparate', 'Salida de humos'], energia: null,
    desc: [
      'Local comercial a pie de calle en esquina, con gran escaparate y mucho paso peatonal.',
      'Espacio diáfano de 120 m² con un aseo, instalación eléctrica trifásica y climatización. Apto para tienda, oficina o servicios.',
      'Dispone de salida de humos, por lo que también es posible destinarlo a hostelería previa licencia.'
    ]
  },
  {
    ref: 'MRG2099', op: 'alquiler', tipo: 'Local', poblacion: 'Requena', zona: 'Centro',
    title: 'Local diáfano para negocio o despacho', beds: 0, baths: 1, m2: 85, price: 700,
    feats: ['Aire acondicionado'], img: IMG.i, date: '2026-08-20',
    util: 80, orient: 'Este', cons: 'Entrar a vivir', planta: 'Baja', suelo: 'Gres', agua: 'Termo eléctrico', elec: '220W', ext: 'Aluminio', dorms: null,
    extras: ['Luz', 'Agua', 'Escaparate'], energia: { letra: 'E', cons: 190, emis: 36 },
    desc: [
      'Local diáfano en una calle céntrica con mucho tránsito, ideal para despacho, estudio o comercio.',
      'Cuenta con 85 m² en una sola planta, un aseo y aire acondicionado. Listo para empezar la actividad.',
      'Se alquila con contrato de uso distinto de vivienda y posibilidad de negociar el periodo de carencia.'
    ]
  },
  {
    ref: 'MRG2097', op: 'venta', tipo: 'Piso', poblacion: 'Requena', zona: 'La Portera',
    title: 'Piso con trastero y plaza de garaje', beds: 3, baths: 2, m2: 110, price: 158000,
    feats: ['Garaje', 'Trastero', 'Ascensor', 'Calefacción'], img: IMG.c, date: '2026-08-15',
    util: 96, orient: 'Sureste', cons: 'Entrar a vivir', planta: '4', suelo: 'Parquet', agua: 'Calentador de gas', elec: '220W', ext: 'Aluminio', dorms: [1, 2],
    extras: ['Armarios empotrados', 'Luz', 'Agua', 'Piscina comunitaria'], energia: { letra: 'D', cons: 140, emis: 26 },
    desc: [
      'Piso en una urbanización cuidada, con plaza de garaje y trastero incluidos en el precio.',
      'Tres dormitorios con armarios empotrados, dos baños, salón con terraza y cocina independiente. Calefacción de gas natural.',
      'La comunidad ofrece zonas verdes y piscina. Muy cerca de colegios, supermercados y de la autovía.'
    ]
  },
  {
    ref: 'MRG2095', op: 'venta', tipo: 'Chalet', poblacion: 'Venta del Moro', zona: 'Casco urbano',
    title: 'Casa de pueblo reformada con patio', beds: 3, baths: 2, m2: 180, price: 135000, parcela: 220,
    feats: ['Chimenea', 'Jardín', 'Barbacoa', 'Mascotas permitidas'], img: IMG.a, date: '2026-08-10',
    util: 160, orient: 'Oeste', cons: 'Reformado', planta: '2 plantas', suelo: 'Barro cocido', agua: 'Termo eléctrico', elec: '220W', ext: 'Madera', dorms: [1, 2],
    extras: ['Luz', 'Agua', 'Bodega', 'Patio'], energia: null,
    desc: [
      'Encantadora casa de pueblo reformada manteniendo el carácter original: vigas de madera, suelos de barro y paredes de piedra vista.',
      'Se organiza en dos plantas con salón con chimenea, cocina, tres dormitorios y dos baños. Cuenta con un patio con barbacoa y una pequeña bodega.',
      'Perfecta como vivienda habitual o como casa de fin de semana en un entorno tranquilo y rodeado de naturaleza.'
    ]
  },
  {
    ref: 'MRG2093', op: 'alquiler', tipo: 'Chalet', poblacion: 'Requena', zona: 'La Portera',
    title: 'Chalet de alquiler con piscina comunitaria', beds: 3, baths: 2, m2: 150, price: 1100,
    feats: ['Piscina', 'Aire acondicionado', 'Terraza', 'Garaje', 'Amueblado'], img: IMG.b, date: '2026-08-05',
    util: 132, orient: 'Sur', cons: 'Entrar a vivir', planta: '2 plantas', suelo: 'Gres', agua: 'Termo eléctrico', elec: '380W', ext: 'Carpintería PVC', dorms: [1, 2],
    extras: ['Armarios empotrados', 'Electrodomésticos', 'Luz', 'Agua', 'Zona comunitaria'], energia: { letra: 'C', cons: 110, emis: 22 },
    desc: [
      'Chalet amueblado en una urbanización con piscina comunitaria y zonas ajardinadas, ideal para familias.',
      'Salón con salida a la terraza, cocina equipada, tres dormitorios y dos baños. Garaje privado y aire acondicionado en todas las estancias.',
      'Contrato de larga duración. Disponible desde ya; se ruega presentar nóminas y documentación habitual.'
    ]
  },
  {
    ref: 'MRG2090', op: 'venta', tipo: 'Piso', poblacion: 'Utiel', zona: 'Ensanche',
    title: 'Piso de 2 habitaciones listo para entrar', beds: 2, baths: 1, m2: 72, price: 84000,
    feats: ['Aire acondicionado', 'Ascensor'], img: IMG.g, date: '2026-07-30',
    util: 64, orient: 'Norte', cons: 'Entrar a vivir', planta: '1', suelo: 'Terrazo', agua: 'Termo eléctrico', elec: '220W', ext: 'Aluminio', dorms: [0, 2],
    extras: ['Luz', 'Agua'], energia: { letra: 'E', cons: 180, emis: 34 },
    desc: [
      'Piso de dos dormitorios en buen estado, ideal como primera vivienda o inversión.',
      'Salón-comedor luminoso, cocina independiente con office y un baño completo. Cuenta con aire acondicionado y ascensor.',
      'Precio muy ajustado para la zona. Consulta financiación y gastos de la operación con nuestro equipo.'
    ]
  },
  {
    ref: 'MRG2088', op: 'alquiler', tipo: 'Piso', poblacion: 'Requena', zona: 'Centro',
    title: 'Vivienda de alquiler en edificio histórico', beds: 3, baths: 2, m2: 100, price: 1300,
    feats: ['Ascensor', 'Calefacción', 'Aire acondicionado'], img: IMG.d, video: true, date: '2026-07-25',
    util: 90, orient: 'Este', cons: 'Reformado', planta: '2', suelo: 'Parquet', agua: 'Termo eléctrico', elec: '220W', ext: 'Madera', dorms: [1, 2],
    extras: ['Armarios empotrados', 'Luz', 'Agua'], energia: null,
    desc: [
      'Vivienda en alquiler en un edificio histórico del centro, con techos altos, molduras originales y grandes balcones a la calle.',
      'Tres dormitorios, dos baños, cocina equipada y un salón muy luminoso con suelo de parquet. Calefacción y aire acondicionado.',
      'Edificio con ascensor, a un paso de comercios y servicios. Contrato de larga duración.'
    ]
  },
  {
    ref: 'MRG2085', op: 'alquiler', tipo: 'Piso', poblacion: 'Requena', zona: 'Centro',
    title: 'Fantástica vivienda con terraza en edificio histórico', beds: 2, baths: 2, m2: 95, price: 1750,
    feats: ['Terraza', 'Aire acondicionado', 'Ascensor', 'Amueblado'], img: IMG.j, video: true, date: '2026-07-20',
    util: 85, orient: 'Sur', cons: 'Reformado', planta: '3', suelo: 'Madera', agua: 'Termo eléctrico', elec: '220W', ext: 'Madera', dorms: [0, 2],
    extras: ['Armarios empotrados', 'Electrodomésticos', 'Luz', 'Agua'], energia: { letra: 'D', cons: 142, emis: 27 },
    desc: [
      'Fantástica vivienda amueblada y reformada, en un edificio histórico del centro con ascensor.',
      'Dos dormitorios dobles con baño propio, cocina totalmente equipada y salón con salida a una terraza soleada.',
      'Aire acondicionado, mobiliario de diseño y todo listo para entrar a vivir. Ideal para parejas o profesionales.'
    ]
  },
  {
    ref: 'MRG2083', op: 'alquiler', tipo: 'Oficina', poblacion: 'Requena', zona: 'Centro',
    title: 'Oficina en pleno centro', beds: 0, baths: 1, m2: 40, price: 350,
    feats: ['Aire acondicionado', 'Ascensor'], img: IMG.i, date: '2026-07-15',
    util: 36, orient: 'Norte', cons: 'Entrar a vivir', planta: '1', suelo: 'Gres', agua: 'Termo eléctrico', elec: '220W', ext: 'Aluminio', dorms: null,
    extras: ['Luz', 'Agua', 'Internet fibra'], energia: null,
    desc: [
      'Oficina de 40 m² en pleno centro, en un edificio con ascensor y fácil acceso.',
      'Dos estancias diáfanas, un aseo y aire acondicionado. Ideal para autónomos, despachos profesionales o pequeñas empresas.',
      'Se alquila lista para empezar a trabajar, con fibra óptica disponible.'
    ]
  }
];

const PROPERTIES = RAW.map((p, i) => {
  const [lat, lng] = coordsFor(p);
  return {
    provincia: 'VALENCIA',
    ...p,
    gallery: p.gallery || buildGallery(p, i),
    lat, lng,
    aire: p.feats.includes('Aire acondicionado'),
    garaje: p.feats.includes('Garaje')
  };
});
