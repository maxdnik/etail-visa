import imap from 'imap-simple';

const config = {
  imap: {
    user: 'maxidimnik@gmail.com',
    password: 'hshy rdta nstb yush',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 30000,
    tlsOptions: { rejectUnauthorized: false },
  },
};

export async function POST(req) {
  try {
    const connection = await imap.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN', ['FROM', 'no-reply_israel-entry@piba.gov.il']];
    const fetchOptions = { bodies: ['HEADER.FIELDS (SUBJECT)', 'TEXT'], struct: true };

    const messages = await connection.search(searchCriteria, fetchOptions);
    let verificationCode = '';

    if (messages.length === 0) {
      console.log('No se encontraron correos nuevos con el asunto esperado.');
    } else {
      console.log(`Se encontraron ${messages.length} correos. Revisando...`);
    }

    for (const message of messages) {
      const subject = message.parts.filter(part => part.which === 'HEADER.FIELDS (SUBJECT)')[0].body.subject[0];
      console.log('Asunto del correo encontrado:', subject);

      if (subject.includes('Israel ETA verification code')) {
        const body = message.parts.filter(part => part.which === 'TEXT')[0].body;

        // Buscar un código de 6 dígitos en el cuerpo del correo
        const match = body.match(/\b\d{6}\b/);
        if (match) {
          verificationCode = match[0];
          console.log('Código de verificación encontrado:', verificationCode);
          // Marcar el correo como leído
          await connection.addFlags(message.attributes.uid, ['\\Seen']);
          break;
        } else {
          console.log('No se encontró un código de 6 dígitos en el correo.');
        }
      }
    }

    connection.end();

    return new Response(
      JSON.stringify({ message: 'Código de verificación obtenido', code: verificationCode }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al obtener el código de verificación:', error);
    return new Response(
      JSON.stringify({ message: 'Error al obtener el código de verificación' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
