import puppeteer from 'puppeteer';
import imap from 'imap-simple';
import { VisaApplication } from '../../../server';

const verificationEndpoint = 'http://localhost:3000/api/get-verification-code';
const mongoUri = 'mongodb://localhost:27017'; 
const dbName = 'etaVisaDB';
const collectionName = 'visaApplications';

export async function POST(req) {
  try {
    const formData = await req.json();

    // Enviar la solicitud al servidor Express
    const response = await fetch('http://localhost:5000/api/submit-visa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error en la respuesta del servidor Express:', data.message);
      return new Response(
        JSON.stringify({ message: 'Error al enviar la solicitud al servidor Express' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Solicitud enviada al servidor Express:', data.message);

    // Iniciar la automatización con Puppeteer
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://israel-entry.piba.gov.il/apply-for-an-eta-il-2/', {
      waitUntil: 'domcontentloaded',
    });

    // Clic en el botón "Continue to application"
    await page.waitForSelector('a.elementor-button[href="/etail"]', { timeout: 10000 });
    await page.evaluate(() => {
      document.querySelector('a.elementor-button[href="/etail"]').click();
    });
    console.log('Clic en el botón "Continue to application" realizado con éxito');

    // Esperar a que cargue la siguiente página y hacer clic en el checkbox
    await page.waitForSelector('input[name="confirmConditions"]', { timeout: 10000 });
    await page.evaluate(() => {
      const checkbox = document.querySelector('input[name="confirmConditions"]');
      if (checkbox) checkbox.click();
    });
    console.log('Clic en el checkbox de confirmación realizado con éxito');

    // Hacer clic en el botón "Continue"
    await page.waitForSelector('button.MuiButton-root[type="button"]', { timeout: 10000 });
    await page.evaluate(() => {
      const continueButton = Array.from(
        document.querySelectorAll('button.MuiButton-root[type="button"]')
      ).find((btn) => btn.textContent.trim().toLowerCase() === 'continue');
      if (continueButton) {
        continueButton.scrollIntoView();
        continueButton.click();
      }
    });
    console.log('Clic en el botón "Continue" realizado con éxito');

    // Esperar al radio button "Myself" y hacer clic
    await page.waitForSelector('input[name="groupTypeId"][value="1:Myself"]', { timeout: 10000 });
    await page.evaluate(() => {
      const radioButton = document.querySelector('input[name="groupTypeId"][value="1:Myself"]');
      if (radioButton) {
        radioButton.scrollIntoView();
        radioButton.click();
      }
    });
    console.log('Clic en el radio button "Myself" realizado con éxito');

    // Esperar al botón "Verify your email" y hacer clic con retraso
    await page.waitForSelector(
      "#ContainerGlob > form > div.sort.contentForms.MuiBox-root.css-0 > div.MuiBox-root.css-0 > div > button.btnForms.next.css-1onhyvl",
      { timeout: 42000, visible: true }
    );
    await page.evaluate(async () => {
      const verifyEmailButton = document.querySelector(
        "#ContainerGlob > form > div.sort.contentForms.MuiBox-root.css-0 > div.MuiBox-root.css-0 > div > button.btnForms.next.css-1onhyvl"
      );
      if (verifyEmailButton) {
        verifyEmailButton.scrollIntoView();
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Espera de 3 segundos
        verifyEmailButton.click();
      }
    });
    console.log('Clic en el botón "Verify your email" realizado con éxito');

    // Esperar los campos de email y completarlos
    await page.waitForSelector('#EmailAddress', { timeout: 60000, visible: true });
    await page.type('#EmailAddress', 'maxidimnik@gmail.com');
    await page.waitForSelector('#ConfirmEmail', { timeout: 60000, visible: true });
    await page.type('#ConfirmEmail', 'maxidimnik@gmail.com');
    console.log('Campos de email completados con éxito');

    // Hacer clic en el botón "Verify your email" después de completar los campos
    await page.waitForSelector('button.btnForms.next.css-1onhyvl', { timeout: 10000, visible: true });
    await page.evaluate(() => {
      const verifyButton = document.querySelector('button.btnForms.next.css-1onhyvl');
      if (verifyButton) {
        verifyButton.scrollIntoView();
        verifyButton.click();
      }
    });
    await new Promise((resolve) => setTimeout(resolve, 20000));

    // Llamar al endpoint de verificación de código
    console.log('Obteniendo el código de verificación desde Gmail...');
    const verificationResponse = await fetch(verificationEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const verificationData = await verificationResponse.json();

    if (verificationResponse.ok) {
      console.log('Código de verificación obtenido:', verificationData.code);
      const code = verificationData.code.split('');
      // Ingresar cada dígito en los campos correspondientes
      for (let i = 0; i < code.length; i++) {
        await page.type(`#digit${i + 1}`, code[i]);
      }
      console.log('Código de verificación ingresado correctamente en el formulario.');

      // Esperar al botón "Verify your email" y hacer clic
      await page.waitForSelector('button.btnForms.next.css-1onhyvl', { timeout: 10000, visible: true });
      await page.evaluate(() => {
        const verifyEmailButton = document.querySelector('button.btnForms.next.css-1onhyvl');
        if (verifyEmailButton) {
          verifyEmailButton.scrollIntoView();
          verifyEmailButton.click();
        }
      });
      console.log('Clic en el botón "Verify your email" realizado con éxito');


    // Ingresar el propósito del viaje (Travel Purpose)
    await page.waitForSelector('#entryReasonId', { timeout: 15000 });
    await page.click('#entryReasonId');

    // Verificar si el dropdown está abierto y visible
    await page.waitForSelector('ul[role="listbox"]', { timeout: 20000, visible: true });

    // Seleccionar la opción correcta del menú desplegable
    await page.evaluate((travelPurpose) => {
        const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
        const optionToSelect = options.find(option => option.textContent.trim().toLowerCase() === travelPurpose.toLowerCase());
        if (optionToSelect) {
            optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
            optionToSelect.click();
        } else {
            console.error('No se encontró la opción en el dropdown:', travelPurpose);
        }
    }, formData.travelPurpose);

    console.log('Propósito del viaje seleccionado correctamente:', formData.travelPurpose);

    // Captura de pantalla para depuración (opcional)
    await page.screenshot({ path: 'dropdown_debug.png' });




    // Ingresar la fecha de llegada (Arrival Date)
    const arrivalDate = formData.arrivalDate; // Ejemplo: '2025-05-05'

    // Dividir la fecha en día, mes y año
    const [year, month, day] = arrivalDate.split('-');

    // Ingresar el día
    await page.waitForSelector('#dayEstimatedAarrivalDate', { timeout: 10000, visible: true });
    await page.type('#dayEstimatedAarrivalDate', day);

    console.log('Día de llegada ingresado:', day);

    // Ingresar el mes
    await page.waitForSelector('input[name="monthEstimatedAarrivalDate"]', { timeout: 10000, visible: true });
    await page.type('input[name="monthEstimatedAarrivalDate"]', month);

    console.log('Mes de llegada ingresado:', month);

    // Ingresar el año
    await page.waitForSelector('input[name="yearEstimatedAarrivalDate"]', { timeout: 10000, visible: true });
    await page.type('input[name="yearEstimatedAarrivalDate"]', year);

    console.log('Año de llegada ingresado:', year);

    // Hacer clic en el menú desplegable de duración de la estadía
    await page.waitForSelector('#lengthOfStayId', { timeout: 15000 });
    await page.click('#lengthOfStayId');

    await page.evaluate(() => {
        const dropdown = document.querySelector('#lengthOfStayId');
        if (dropdown) {
            dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dropdown.click();
        }
    });

    console.log('Menú desplegable de duración de la estadía abierto con éxito');

    // Esperar a que se muestren las opciones del menú
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    // Mapeo de las duraciones numéricas a las opciones del dropdown
    const durationMap = {
        '7': 'Up to 7 days',
        '14': 'Up to 14 days',
        '30': 'Up to 30 days',
        '60': 'Up to 60 days',
        '90': 'Above 90 days'
    };

    // Convertir la duración de la estadía a la opción correcta del dropdown
    const stayDurationText = durationMap[formData.stayDuration];

    if (!stayDurationText) {
        console.error('Duración de estadía no válida:', formData.stayDuration);
    } else {
        // Seleccionar la opción correcta del menú desplegable
        await page.evaluate((stayDurationText) => {
            const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
            const optionToSelect = options.find(option => option.textContent.trim() === stayDurationText);
            if (optionToSelect) {
                optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                optionToSelect.click();
            } else {
                console.error('No se encontró la opción en el dropdown:', stayDurationText);
            }
        }, stayDurationText);

        console.log('Duración de la estadía seleccionada:', stayDurationText);
    }

    // Esperar al botón "Enter passport details" y hacer clic
    await page.waitForSelector('button.btnForms.next.css-1onhyvl', { timeout: 10000, visible: true });
    await page.evaluate(() => {
        const button = document.querySelector('button.btnForms.next.css-1onhyvl');
        if (button && button.textContent.trim().includes('Enter passport details')) {
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            button.click();
        }
    });

    console.log('Clic en el botón "Enter passport details" realizado con éxito');


    await page.waitForSelector('#passportTypeId', { timeout: 15000 });
    await page.click('#passportTypeId');

    console.log('Menú desplegable de tipo de pasaporte abierto con éxito');

    // Esperar un momento para asegurarse de que el menú esté desplegado
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mapeo de las opciones de tipo de pasaporte
    const passportTypeMap = {
        'Regular': 'Regular passport (national)',
        'Diplomatic': 'Diplomatic passport',
        'Service': 'Service passport',
        'Official': 'Official passport',
        'Travel Document': 'Travel document (Laissez passer)'
    };

    // Convertir el tipo de pasaporte a la opción correcta del menú desplegable
    const passportTypeText = passportTypeMap[formData.passportType];

    if (!passportTypeText) {
        console.error('Tipo de pasaporte no válido:', formData.passportType);
    } else {
        // Esperar a que se muestren las opciones del menú
        await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

        // Seleccionar la opción correcta del menú desplegable
        await page.evaluate((passportTypeText) => {
            const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
            const optionToSelect = options.find(option => option.textContent.trim() === passportTypeText);
            if (optionToSelect) {
                optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                optionToSelect.click();
            } else {
                console.error('No se encontró la opción en el dropdown:', passportTypeText);
            }
        }, passportTypeText);

        console.log('Tipo de pasaporte seleccionado:', passportTypeText);
    }

    // Esperar al campo de número de pasaporte y completarlo con el valor del formulario
    await page.waitForSelector('#passportNum', { timeout: 15000 });
    await page.type('#passportNum', formData.passportNumber, { delay: 100 });

    console.log('Número de pasaporte ingresado correctamente:', formData.passportNumber);


    // Esperar el menú desplegable de país de pasaporte y hacer clic para abrirlo
    await page.waitForSelector('#passportCountryId', { timeout: 15000 });
    await page.click('#passportCountryId');

    await page.evaluate(() => {
        const dropdown = document.querySelector('#passportCountryId');
        if (dropdown) {
            dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dropdown.click();
        }
    });

    console.log('Menú desplegable de país de pasaporte abierto con éxito');

    // Esperar un momento para asegurarse de que el menú esté desplegado
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Esperar las opciones del menú desplegable
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    // Seleccionar la opción del país de pasaporte basado en los datos del formulario
    await page.evaluate((passportCountry) => {
        const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
        const optionToSelect = options.find(option => option.textContent.trim().startsWith(passportCountry));
        if (optionToSelect) {
            optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
            optionToSelect.click();
        } else {
            console.error('No se encontró la opción de país en el dropdown:', passportCountry);
        }
    }, formData.passportCountry);

    console.log('País de pasaporte seleccionado correctamente:', formData.passportCountry);

    // Esperar un momento para asegurarse de que el menú esté desplegado
      await new Promise((resolve) => setTimeout(resolve, 20000));
    // Esperar el menú desplegable de nacionalidad y hacer clic para abrirlo
      await page.waitForSelector('#nationalityId', { timeout: 15000 });
      await page.click('#nationalityId');

      await page.evaluate(() => {
          const dropdown = document.querySelector('#nationalityId');
          if (dropdown) {
              dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
              dropdown.click();
          }
      });

      console.log('Menú desplegable de nacionalidad abierto con éxito');

      // Esperar un momento para asegurarse de que el menú esté desplegado
      await new Promise((resolve) => setTimeout(resolve, 15000));


      // Seleccionar la opción de nacionalidad basado en los datos del formulario
      await page.evaluate((nationality) => {
          const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
          const optionToSelect = options.find(option => option.textContent.trim().toLowerCase() === nationality.toLowerCase());
          if (optionToSelect) {
              optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
              optionToSelect.click();
          } else {
              console.error('No se encontró la opción de nacionalidad en el dropdown:', nationality);
          }
      }, formData.nationality);

      console.log('Nacionalidad seleccionada correctamente:', formData.nationality);

      // Esperar el contenedor del grupo de botones para el campo "isBiometricPassport"
      await page.waitForSelector('#isBiometricPassport', { timeout: 15000 });

      // Seleccionar la opción adecuada en función de los datos del formulario
      await page.evaluate((isBiometric) => {
          const option = isBiometric.toLowerCase() === 'yes' ? '1' : '0';
          const button = document.querySelector(`#isBiometricPassport button[data="${option}"]`);
          if (button) {
              button.scrollIntoView({ behavior: 'smooth', block: 'center' });
              button.click();
          } else {
              console.error('No se encontró la opción de pasaporte biométrico:', isBiometric);
          }
      }, formData.isBiometric);

      console.log('Opción de pasaporte biométrico seleccionada correctamente:', formData.isBiometric);

      // Esperar el campo de texto para el apellido (Last Name)
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('#lastName', { timeout: 15000 });

      // Esperar el campo de texto para el apellido (Last Name)
      await page.waitForSelector('#lastName', { timeout: 15000 });
      const lastNameInput = await page.$('#lastName');
      await lastNameInput.click({ clickCount: 3 }); // Seleccionar y borrar el contenido existente
      await page.keyboard.press('Backspace'); // Asegurar que se borre el contenido
      await page.type('#lastName', formData.lastName, { delay: 100 });
      console.log('Apellido ingresado correctamente:', formData.lastName);

      // Esperar el campo de texto para el nombre (First Name)
      await page.waitForSelector('#firstName', { timeout: 15000 });
      const firstNameInput = await page.$('#firstName');
      await firstNameInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await page.type('#firstName', formData.firstName, { delay: 100 });
      console.log('Nombre ingresado correctamente:', formData.firstName);

      console.log('Nombre ingresado correctamente:', formData.firstName);

      // Extraer día, mes y año de la fecha de emisión del pasaporte
      const [issueYear, issueMonth, issueDay] = formData.issueDate.split('-');

      // Ingresar el día de la fecha de emisión
      await page.waitForSelector('#dayPassportIssue', { timeout: 15000 });
      const dayInput = await page.$('#dayPassportIssue');
      await dayInput.click({ clickCount: 3 }); // Selecciona y limpia el contenido
      await page.type('#dayPassportIssue', issueDay);
      console.log('Día de la fecha de emisión ingresado correctamente:', issueDay);


      // Ingresar el mes de la fecha de emisión
      await page.waitForSelector('[id=":ru:"]', { timeout: 15000 });
      const monthInput = await page.$('[id=":ru:"]');
      await monthInput.click({ clickCount: 3 });
      await page.type('[id=":ru:"]', issueMonth);
      console.log('Mes de la fecha de emisión ingresado correctamente:', issueMonth);


      // Ingresar el año de la fecha de emisión
      await page.waitForSelector('[id=":rv:"]', { timeout: 15000 });
      const yearInput = await page.$('[id=":rv:"]');
      await yearInput.click({ clickCount: 3 });
      await page.type('[id=":rv:"]', issueYear);
      console.log('Año de la fecha de emisión ingresado correctamente:', issueYear);

       // Extraer día, mes y año de la fecha de vencimiento del pasaporte
      const [expiryYear, expiryMonth, expiryDay] = formData.expiryDate.split('-');

      // Ingresar el día de la fecha de vencimiento
      await page.waitForSelector('#dayPassportExpire', { timeout: 15000 });
      const dayInputExpire = await page.$('#dayPassportExpire');
      await dayInputExpire.click({ clickCount: 3 });
      await page.type('#dayPassportExpire', expiryDay);
      console.log('Día de la fecha de vencimiento ingresado correctamente:', expiryDay);
    

      // Ingresar el mes de la fecha de vencimiento
      await page.waitForSelector('[id=":r12:"]', { timeout: 18000 });
      const monthInputExpire = await page.$('[id=":r12:"]');
      await monthInputExpire.click({ clickCount: 3 });
      await page.type('[id=":r12:"]', expiryMonth);
      console.log('Mes de la fecha de vencimiento ingresado correctamente:', expiryMonth);

      // Ingresar el año de la fecha de vencimiento
      await page.waitForSelector('[id=":r13:"]', { timeout: 18000 });
      const yearInputExpire = await page.$('[id=":r13:"]');
      await yearInputExpire.click({ clickCount: 3 });
      await page.type('[id=":r13:"]', expiryYear);
      console.log('Año de la fecha de vencimiento ingresado correctamente:', expiryYear);

      // Extraer día, mes y año de la fecha de nacimiento 
      const [bYear, bMonth, bDay] = formData.birthDate.split('-');

      // Ingresar el día de la fecha de nacimiento
      await page.waitForSelector('#dayBirth', { timeout: 18000 });
      const dayBirthInput = await page.$('#dayBirth');
      await dayBirthInput.click({ clickCount: 3 });
      await page.type('#dayBirth', bDay);
      console.log('Día de la fecha de nacimiento ingresado correctamente:', bDay);


      // Ingresar el mes de la fecha de nacimiento
      await page.waitForSelector('[id=":r15:"]', { timeout: 25000 });
      const monthBirthInput = await page.$('[id=":r15:"]');
      await monthBirthInput.click({ clickCount: 3 });
      await page.type('[id=":r15:"]', bMonth);
      console.log('Mes de la fecha de nacimiento ingresado correctamente:', bMonth);

      // Ingresar el año de la fecha de nacimiento
      await page.waitForSelector('[id=":r16:"]', { timeout: 18000 });
      const yearBirthInput = await page.$('[id=":r16:"]');
      await yearBirthInput.click({ clickCount: 3 });
      await page.type('[id=":r16:"]', bYear);
      console.log('Año de la fecha de nacimiento ingresado correctamente:', bYear);



    // Esperar el menú desplegable de genero y hacer clic para abrirlo
    await page.waitForSelector('#gender', { timeout: 15000 });
    await page.click('#gender');

    await page.evaluate(() => {
        const dropdown = document.querySelector('#gender');
        if (dropdown) {
            dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dropdown.click();
        }
    });

    console.log('Menú desplegable de genero abierto con éxito');

    // Esperar un momento para asegurarse de que el menú esté desplegado
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Esperar las opciones del menú desplegable
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    // Seleccionar la opción del país de pasaporte basado en los datos del formulario
    await page.evaluate((gender) => {
        const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
        const optionToSelect = options.find(option => option.textContent.trim().startsWith(gender));
        if (optionToSelect) {
            optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
            optionToSelect.click();
        } else {
            console.error('No se encontró la opción de país en el dropdown:', gender);
        }
    }, formData.gender);

    console.log('Genero seleccionado correctamente:', formData.gender);

    await new Promise((resolve) => setTimeout(resolve, 15000));
    // Esperar el menú de lugar de nacimiento y hacer click para abrirlo
    await page.waitForSelector('#birthCountryId', { visible: true, timeout: 15000 });
    await page.click('#birthCountryId');
    console.log('Menú desplegable de nacimiento abierto con éxito');

    // Esperar a que se despliegue el menú (las opciones)
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    // Seleccionar la opción del lugar de nacimiento basado en formData.birthPlace
    await page.evaluate((birthPlace) => {
      const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
      const optionToSelect = options.find(option => option.textContent.trim().startsWith(birthPlace));
      if (optionToSelect) {
        optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        optionToSelect.click();
      } else {
        console.error('No se encontró la opción de país en el dropdown:', birthPlace);
      }
    }, formData.birthPlace);

    console.log('Lugar de nacimiento seleccionado correctamente:', formData.birthPlace);


    await new Promise((resolve) => setTimeout(resolve, 10000));
    await page.waitForSelector('button.btnForms.next', { timeout: 15000 });
    await page.click('button.btnForms.next');
    console.log('Boton presionado',);

    await new Promise((resolve) => setTimeout(resolve, 15000));

    if (formData.additionalNationality && formData.additionalNationality !== "NO") {
    // Esperar y hacer click en el combobox de nacionalidad adicional
    await page.waitForSelector('#anotherNationalityId', { visible: true, timeout: 20000 });
    await page.click('#anotherNationalityId');
    console.log('Dropdown de nacionalidad adicional abierto con éxito');

    // Esperar a que se despliegue la lista de opciones
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });
    
    // Seleccionar la opción que contenga el valor de additionalNationality
    await page.evaluate((additionalNationality) => {
      const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
      const optionToSelect = options.find(option =>
        option.textContent.trim().toLowerCase().includes(additionalNationality.toLowerCase())
      );
      if (optionToSelect) {
        optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Simular eventos de mouse para asegurar la selección en componentes como Material‑UI
        optionToSelect.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        optionToSelect.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        optionToSelect.click();
      } else {
        console.error('No se encontró la opción:', additionalNationality);
      }
    }, formData.additionalNationality);

    console.log('Nacionalidad adicional seleccionada:', formData.additionalNationality);
  } else {
    console.log('additionalNationality es "NO", no se realiza ninguna acción');
  }

    // Esperar el menú desplegable de Marital Status y hacer clic para abrirlo
    await page.waitForSelector('#maritalStatusId', { timeout: 15000 });
    await page.click('#maritalStatusId');

    await page.evaluate(() => {
        const dropdown = document.querySelector('#maritalStatusId');
        if (dropdown) {
            dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
            dropdown.click();
        }
    });

    console.log('Menú desplegable de marital status abierto con éxito');

    // Esperar un momento para asegurarse de que el menú esté desplegado
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Esperar las opciones del menú desplegable
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    // Seleccionar la opción del marital status basado en los datos del formulario
    await page.evaluate((maritalStatus) => {
        const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
        const optionToSelect = options.find(option => option.textContent.trim().startsWith(maritalStatus));
        if (optionToSelect) {
            optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
            optionToSelect.click();
        } else {
            console.error('No se encontró la opción de país en el dropdown:', maritalStatus);
        }
    }, formData.maritalStatus);

    console.log('Marital status seleccionado correctamente:', formData.maritalStatus);


      // Esperar el campo de texto para el nombre Padre (First Name)
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('#fatherFirstName', { timeout: 15000 });

      // Esperar el campo de texto para el apellido Padre (First Name)
      await page.waitForSelector('#fatherFirstName', { timeout: 15000 });
      const firstNameInputF = await page.$('#fatherFirstName');
      await firstNameInputF.click({ clickCount: 3 }); // Seleccionar y borrar el contenido existente
      await page.keyboard.press('Backspace'); // Asegurar que se borre el contenido
      await page.type('#fatherFirstName', formData.fatherFirstName, { delay: 100 });
      console.log('Nombre Padre ingresado correctamente:', formData.fatherFirstName);

      // Esperar el campo de texto para el apellido Padre (Last Name)
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('#fatherLastName', { timeout: 15000 });

      // Esperar el campo de texto para el apellido Padre (Last Name)
      await page.waitForSelector('#fatherLastName', { timeout: 15000 });
      const lastNameInputF = await page.$('#fatherLastName');
      await lastNameInputF.click({ clickCount: 3 }); // Seleccionar y borrar el contenido existente
      await page.keyboard.press('Backspace'); // Asegurar que se borre el contenido
      await page.type('#fatherLastName', formData.fatherLastName, { delay: 100 });
      console.log('Apellido Padre ingresado correctamente:', formData.fatherLastName);


      // Esperar el campo de texto para el nombre Madre (First Name)
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('#motherFirstName', { timeout: 15000 });

      // Esperar el campo de texto para el apellido Madre (Last Name)
      await page.waitForSelector('#motherFirstName', { timeout: 15000 });
      const firstNameInputM = await page.$('#motherFirstName');
      await firstNameInputM.click({ clickCount: 3 }); // Seleccionar y borrar el contenido existente
      await page.keyboard.press('Backspace'); // Asegurar que se borre el contenido
      await page.type('#motherFirstName', formData.motherFirstName, { delay: 150 });
      console.log('Nombre Madre ingresado correctamente:', formData.motherFirstName);

      // Esperar el campo de texto para el apellido Madre (Last Name)
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('#fatherLastName', { timeout: 15000 });

      // Esperar el campo de texto para el apellido Madre (Last Name)
      await page.waitForSelector('#motherLastName', { timeout: 15000 });
      const lastNameInputM = await page.$('#motherLastName');
      await lastNameInputM.click({ clickCount: 3 }); // Seleccionar y borrar el contenido existente
      await page.keyboard.press('Backspace'); // Asegurar que se borre el contenido
      await page.type('#motherLastName', formData.motherLastName, { delay: 150 });
      console.log('Apellido Madre ingresado correctamente:', formData.motherLastName);


      // Esperar el campo de texto para el telefono
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('#mobilePhoneNum', { timeout: 15000 });

      // Esperar el campo de texto para el telefono
      await page.waitForSelector('#mobilePhoneNum', { timeout: 15000 });
      const phoneMobileN = await page.$('#mobilePhoneNum');
      await phoneMobileN.click({ clickCount: 3 }); // Seleccionar y borrar el contenido existente
      await page.keyboard.press('Backspace'); // Asegurar que se borre el contenido
      await page.type('#mobilePhoneNum', formData.mobilePhone, { delay: 100 });
      console.log('Telefono ingresado:', formData.mobilePhone);


      // Esperar el campo de texto para el telefono
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('#addressTownName', { timeout: 15000 });

      // Esperar el campo de texto para el telefono
      await page.waitForSelector('#addressTownName', { timeout: 15000 });
      const addressTownN = await page.$('#addressTownName');
      await addressTownN.click({ clickCount: 3 }); // Seleccionar y borrar el contenido existente
      await page.keyboard.press('Backspace'); // Asegurar que se borre el contenido
      await page.type('#addressTownName', formData.homeCity, { delay: 100 });
      console.log('Ciudad ingresado:', formData.homeCity);


    // Esperar el menú de pais y hacer click para abrirlo
    await page.waitForSelector('#addressCountryId', { visible: true, timeout: 15000 });
    await page.click('#addressCountryId');
    console.log('Menú homeCountry con éxito');

    // Esperar a que se despliegue el menú (las opciones)
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    // Seleccionar la opción de pais
    await page.evaluate((homeCountry) => {
      const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
      const optionToSelect = options.find(option => option.textContent.trim().startsWith(homeCountry));
      if (optionToSelect) {
        optionToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
        optionToSelect.click();
      } else {
        console.error('homeCountry seleccionado correctamente:', homeCountry);
      }
    }, formData.homeCountry);

    console.log('homeCountry seleccionado correctamente:', formData.homeCountry);

    await new Promise((resolve) => setTimeout(resolve, 10000));
 
    // Esperar el menú de dropdown y hacer click para abrirlo
    await page.waitForSelector('#companyOccupationTypeId', { visible: true, timeout: 15000 });
    await page.click('#companyOccupationTypeId');
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Esperar a que se despliegue el menú (las opciones)
    await page.waitForSelector('ul[role="listbox"] li', { timeout: 10000 });

    // Seleccionar la opción que coincida exactamente con occupationStatus
    await page.evaluate((occupationStatus) => {
      const options = Array.from(document.querySelectorAll('ul[role="listbox"] li'));
      const optionToSelect = options.find(option =>
        option.textContent.trim().toLowerCase() === occupationStatus.toLowerCase()
      );
      if (optionToSelect) {
        // Simular eventos para imitar una interacción real
        optionToSelect.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        optionToSelect.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        optionToSelect.click();
      } else {
        console.error("No se encontró la opción para occupationStatus:", formData.occupationStatus);
      }
    }, formData.occupationStatus);

    console.log("Estado de ocupación seleccionado:", formData.occupationStatus);

    // Si el estado de ocupación es "Employed" o "Self employed", se muestran y deben completarse campos adicionales
    if (
      formData.occupationStatus.toLowerCase() === "employed" ||
      formData.occupationStatus.toLowerCase() === "self employed"
    ) {
      // Completar el campo "role"
      await page.waitForSelector('input[name="role"]', { visible: true, timeout: 10000 });
      await page.click('input[name="role"]', { clickCount: 3 });
      await page.type('input[name="role"]', role);
      console.log("Campo 'role' completado:", role);

      // Completar el campo "organizationName"
      await page.waitForSelector('input[name="organizationName"]', { visible: true, timeout: 10000 });
      await page.click('input[name="organizationName"]', { clickCount: 3 });
      await page.type('input[name="organizationName"]', organizationName);
      console.log("Campo 'organizationName' completado:", organizationName);

      // Completar el campo "workPhone"
      await page.waitForSelector('input[name="workPhone"]', { visible: true, timeout: 10000 });
      await page.click('input[name="workPhone"]', { clickCount: 3 });
      await page.type('input[name="workPhone"]', workPhone);
      console.log("Campo 'workPhone' completado:", workPhone);

      // Completar el campo "workEmail"
      await page.waitForSelector('input[name="workEmail"]', { visible: true, timeout: 10000 });
      await page.click('input[name="workEmail"]', { clickCount: 3 });
      await page.type('input[name="workEmail"]', workEmail);
      console.log("Campo 'workEmail' completado:", workEmail);
    }

      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('button.btnForms.next', { timeout: 15000 });
      await page.click('button.btnForms.next');
      console.log('Boton presionado',);

      await new Promise((resolve) => setTimeout(resolve, 10000));

      if (formData.visitedIsrael && formData.visitedIsrael.toLowerCase() === "yes") {
        // Seleccionar el botón "Yes"
        await page.waitForSelector('button[name="previousStayInIsraelYN"][data="1"]', { visible: true, timeout: 15000 });
        await page.click('button[name="previousStayInIsraelYN"][data="1"]');
        console.log("Seleccionado Yes para previousStayInIsraelYN");

        // Esperar a que aparezca el campo adicional para el año de visita
        await page.waitForSelector('#previousYearInIsrael', { visible: true, timeout: 15000 });
        await page.click('#previousYearInIsrael', { clickCount: 3 });
        await page.type('#previousYearInIsrael', formData.yearOfVisit);
        console.log("Año de visita ingresado:", formData.yearOfVisit);
      } else {
        // Seleccionar el botón "No"
        await page.waitForSelector('button[name="previousStayInIsraelYN"][data="0"]', { visible: true, timeout: 15000 });
        await page.click('button[name="previousStayInIsraelYN"][data="0"]');
        console.log("Seleccionado No para previousStayInIsraelYN");
      }

      if (
      formData.appliedForVisa &&
      (formData.appliedForVisa.toLowerCase() === "yes" ||
        formData.appliedForVisa.toLowerCase() === "si")
    ) {
      // Seleccionar el botón "Yes" para anotherVisaRequestYN
      await page.waitForSelector('button[name="anotherVisaRequestYN"][data="1"]', { visible: true, timeout: 15000 });
      await page.click('button[name="anotherVisaRequestYN"][data="1"]');
      console.log("Seleccionado Yes para anotherVisaRequestYN");

      // Esperar a que aparezca el campo textarea y completarlo
      await page.waitForSelector('textarea[name="anotherVisaRequestDesc"]', { visible: true, timeout: 15000 });
      await page.click('textarea[name="anotherVisaRequestDesc"]', { clickCount: 3 });
      await page.type('textarea[name="anotherVisaRequestDesc"]', formData.visaApplicationDetails);
      console.log("Texto de solicitud de visa ingresado:", formData.visaApplicationDetails);
    } else {
      // Seleccionar el botón "No" para anotherVisaRequestYN
      await page.waitForSelector('button[name="anotherVisaRequestYN"][data="0"]', { visible: true, timeout: 15000 });
      await page.click('button[name="anotherVisaRequestYN"][data="0"]');
      console.log("Seleccionado No para anotherVisaRequestYN");

      await new Promise((resolve) => setTimeout(resolve, 10000));
      await page.waitForSelector('button.btnForms.next', { timeout: 15000 });
      await page.click('button.btnForms.next');
      console.log('Botón "Next" presionado');

          }
      await new Promise(resolve => setTimeout(resolve, 10000));
      // (Opcional) Esperar un momento para que la acción se procese
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 2. Hacer click en el primer botón "Confirm this section"
      await page.waitForSelector('button.btnForms.next', { timeout: 15000 });
      await page.click('button.btnForms.next');
      console.log('Primer botón "Confirm this section" presionado');

      // (Opcional) Esperar para que se procese la transición
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. Hacer click en el segundo botón "Confirm this section"
      await page.waitForSelector('button.btnForms.next', { timeout: 15000 });
      await page.click('button.btnForms.next');
      console.log('Segundo botón "Confirm this section" presionado');

      // (Opcional) Esperar un momento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Hacer click en el tercer botón "Confirm this section"
      await page.waitForSelector('button.btnForms.next', { timeout: 15000 });
      await page.click('button.btnForms.next');
      console.log('Tercer botón "Confirm this section" presionado');

      // (Opcional) Esperar un momento antes de proceder al checkbox
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 5. Marcar el checkbox "confirmConditions"
      await page.waitForSelector('input[name="confirmConditions"]', { visible: true, timeout: 15000 });
      const isChecked = await page.$eval('input[name="confirmConditions"]', el => el.checked);
      if (!isChecked) {
        await page.click('input[name="confirmConditions"]');
        console.log('Checkbox "confirmConditions" marcado');
      } else {
        console.log('Checkbox "confirmConditions" ya estaba marcado');
      }


      return new Response(
        JSON.stringify({
          message: 'Automatización y verificación completadas',
          code: verificationData.code,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('Error al obtener el código de verificación:', verificationData.message);
      await browser.close();
      return new Response(
        JSON.stringify({ message: 'Error al obtener el código de verificación' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('❌ Error en la automatización con Puppeteer:', error);
    return new Response(
      JSON.stringify({ message: 'Error en la automatización con Puppeteer' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}






