import { useSelector } from 'react-redux';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5491100000000';
const SEP = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500';

// Bytes UTF-8 pre-codificados — ningun emoji en el codigo fuente
const E = {
  MANO:    '%F0%9F%91%87', // \uD83D\uDC47
  CLIENTE: '%F0%9F%91%A4', // \uD83D\uDC64
  CIUDAD:  '%F0%9F%93%8D', // \uD83D\uDCCD
  CASA:    '%F0%9F%8F%A0', // \uD83C\uDFE0
  BARRIO:  '%F0%9F%8F%A2', // \uD83C\uDFE2
  CAJA:    '%F0%9F%93%A6', // \uD83D\uDCE6
  DINERO:  '%F0%9F%92%B0', // \uD83D\uDCB0
  SOBRE:   '%E2%9C%89',    // \u2709
  ORO:     '%F0%9F%A5%87', // \uD83E\uDD47
  DURA:    '%F0%9F%93%97', // \uD83D\uDCD7
  BLANDA:  '%F0%9F%93%95', // \uD83D\uDCD5
  BOLSA:   '%F0%9F%9B%8D', // \uD83D\uDECD
};

// Construye la URL: codifica texto y reemplaza [[KEY]] con bytes pre-codificados
function buildWAUrl(text) {
  let enc = encodeURIComponent(text);
  Object.entries(E).forEach(([key, bytes]) => {
    enc = enc.split('%5B%5B' + key + '%5D%5D').join(bytes);
  });
  return 'https://api.whatsapp.com/send?phone=' + WA_NUMBER + '&text=' + enc;
}

const prodEmoji = (nombre) => {
  if (/caja/i.test(nombre))   return '[[CAJA]]';
  if (/sobre/i.test(nombre))  return '[[SOBRE]]';
  if (/oro/i.test(nombre))    return '[[ORO]]';
  if (/dura/i.test(nombre))   return '[[DURA]]';
  if (/blanda/i.test(nombre)) return '[[BLANDA]]';
  return '[[BOLSA]]';
};

const shortName = (nombre) =>
  nombre.replace('\u00C1lbum Panini Mundial 2026 \u2014 ', '');

export function useWhatsApp() {
  const items = useSelector((s) => s.carrito.items);

  const generarMensaje = (nombre, direccion = '', barrio = '') => {
    if (items.length === 0) return null;
    const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

    const lineas = [
      '[[MANO]] \u00A1Hola! Tengo un nuevo pedido',
      '',
      '[[CLIENTE]] *Cliente:* ' + nombre,
      '[[CIUDAD]] *Ciudad:* Pasto',
    ];
    if (direccion) lineas.push('[[CASA]] *Direcci\u00F3n:* ' + direccion);
    if (barrio)    lineas.push('[[BARRIO]] *Barrio:* ' + barrio);
    lineas.push('', '[[CAJA]] *Resumen de Productos:*', SEP);
    items.forEach((i) =>
      lineas.push(
        '\u2022 ' + prodEmoji(i.nombre) + ' _' + shortName(i.nombre) + '_\n  *Cantidad:* x' + i.cantidad + '  |  *Subtotal:* $' + (i.precio * i.cantidad).toLocaleString('es-CO')
      )
    );
    lineas.push(SEP, '', '[[DINERO]] *VALOR TOTAL: $' + total.toLocaleString('es-CO') + '*');

    return buildWAUrl(lineas.join('\n'));
  };

  return { generarMensaje };
}

