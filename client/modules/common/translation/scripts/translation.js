'use strict';
			
// Define main module translation and injects all other modules as dependencies
var translation = angular.module('translation',
	[
    'translationControllers',
		'translationServices',
		'translationDirectives'
	]
)
.constant('translations_en', {
   // Global
  'EDIT': 'Edit',
  'SEVERITY': 'Severity',
  'BUTTON.OPEN': 'Open',
  'BUTTON.CHANGE': 'Change Password',
  'BUTTON.CLOSE': 'Close',
  'BUTTON.SIGNIN': 'Sign in',
  'BUTTON.CANCEL': 'Cancel',
  'BUTTON.UPDATE': 'Update',
  'BUTTON.CREATE': 'Create',
// !REVISSAR!!! -> Sobranm hay que ver donde estan utilizandose y cambiarlos por BUTTON.
  'CREATE': 'Create',
  'UPDATE': 'Update',
///
  'USER.SETTINGS': 'User Settings',
  'SIGN.OUT': 'Sign out',
  'Close as': 'Close incidence as',

   // Inventory
  'UNAVALIABLE': 'Unavailable',
  'INVENTORY.BUTTON.ENABLE': 'Enable',
  'INVENTORY.BUTTON.DISABLE': 'Disable',
  'INVENTORY.NEW': 'New Inventory Item',
  'INVENTORY.INTERNAL_ID': 'Internal Id',
  'INVENTORY.SERIAL': 'Serial Number',
  'INVENTORY.KIND': 'Kind',
  'INVENTORY.ACQUISITION_DATE': 'Acquisition Date',
  'INVENTORY.GUARANTEE_EXPIRATION_DATE': 'Guarantee Expiration Date',
  'INVENTORY.LAST_INVENTORY_DATE': 'Last Inventory Date',
  'INVENTORY.MODEL': 'Model',
  'INVENTORY.MANUFACTURER': 'Manufacturer',
  'INVENTORY.DESCRIPTION': 'Description',
  'INVENTORY.LOCATION': 'Location',
  'INVENTORY.PRICE': 'Price',
  'INVENTORY.TYPE': 'Type',
  'INVENTORY.PROCESSOR': 'Processor',
  'INVENTORY.RAM': 'Ram',
  'INVENTORY.HD': 'Hd',
  'INVENTORY.CD': 'Cd',
  'INVENTORY.VIDEO': 'Video',
  'INVENTORY.USB': 'Usb',
  'INVENTORY.CONNECTOR': 'Connector',
  'INVENTORY.SIZE': 'Size',
  'INVENTORY.AVAILABILITY.WHEN': 'Date',
  'INVENTORY.AVAILABILITY.WHY': 'Reason',

   // Accounts
  'ACCOUNT.EDIT': 'Edit profile',
  'ACCOUNT.CHANGE.PASSWORD': 'Change password',
  'ACCOUNT.NAME': 'Name',
  'ACCOUNT.SURNAME': 'Surname',
  'SELECT': 'Select',

   // Incidences
  'INCIDENCES.INCIDENCE': 'Incidence',
  'INCIDENCES.NEW_INCIDENCE': 'New Incidence',
  'INCIDENCES.SEVERITY': 'Severity',
  'INCIDENCES.PRIORITY': 'Priority',
  'INCIDENCES.ASSIGN': 'Assign',
  'INCIDENCES.TITLE': 'Títle',
  'INCIDENCES.DESCRIPTION': 'Description',
  'INCIDENCES.CREATOR': 'Creator',
  'INCIDENCES.CREATED': 'Created',
  'INCIDENCES.OWNER': 'Owner',
  'INCIDENCES.OPENED_ON': 'Opened On',
  'INCIDENCES.NO_TECHNICIAN_ASSIGNED': 'No technician assigned',
  'INCIDENCES.POST_COMMENT': 'Post Comment',
  'INCIDENCES.NO_TIME_REPORTED': 'No time reported',
  'INCIDENCES.NO_RATINGS_REPORTED': 'No ratings reported',

})
.constant('translations_es', {
  // Global
  'Password': 'Contraseña',
  'BUTTON.OPEN': 'Abrir',
  'BUTTON.CLOSE': 'Cerrar',
  'BUTTON.CANCEL': 'Cancelar',
  'BUTTON.UPDATE': 'Actualizar',
  'BUTTON.CREATE': 'Crear',

  // Navbar
  'USER.SETTINGS': 'Configuración Usuario',
  'SIGN.OUT': 'Desconectar',

  // Sign
  'BUTTON.SIGNIN': 'Iniciar Sesion',
	
  // Incidences
  'INCIDENCES.INCIDENCE': 'Incidencia',
  'INCIDENCES.NEW_INCIDENCE': 'Nueva Incidencia',
  'INCIDENCES.SEVERITY': 'Severidad',
  'INCIDENCES.PRIORITY': 'Prioridad',
  'INCIDENCES.ASSIGN': 'Assignar',
  'INCIDENCES.TITLE': 'Título',
  'INCIDENCES.DESCRIPTION': 'Descripción',
  'INCIDENCES.CREATOR': 'Creador',
  'INCIDENCES.CREATED': 'Creada',
  'INCIDENCES.OWNER': 'Dueño',
  'INCIDENCES.OPENED_ON': 'Abierta el',
  'INCIDENCES.NO_TECHNICIAN_ASSIGNED': 'No asignada a ningun técnico',
  'INCIDENCES.POST_COMMENT': 'Escribe un comentario',
  'INCIDENCES.NO_TIME_REPORTED': 'Ningun tiempo reportado',
  'INCIDENCES.NO_RATINGS_REPORTED': 'No hay valoraciones',

  'Incidences': 'Incidencias',
  //! MIRAR!
  'Severity': 'Severidad',
  'Priority': 'Prioridad',
  //
  'Updated': 'Actualizada',
  'Status': 'Estado',
  'Created': 'Creada',
  'Creator': 'Creador',
  'Title': 'Título',
  'Assigned': 'Asignada',
  'Medium': 'Media',
  'Serious': 'Seria',
  'High': 'Alta',
  'Low': 'Baja',
  'Open': 'Abierta',
  'On Going': 'En Proceso',
  'Closed': 'Cerrada',
  'Create': 'Crear',
  'List': 'Listar',
  'Statistics': 'Estadísticas',
  'Import CSV': 'Importar CSV',
  'Expenses': 'Gastos',
  'Search id': 'Buscar ID',
  'Today': 'Hoy',
  'Yesterday': 'Ayer',
  '2 days ago': 'Hace 2 dias',
  'Close as': 'Cerrar incidencia como',
  'Sun': 'Dom',
  'Tue': 'Mar',

  // Inventory
  'Inventory': 'Inventario',
  'INTERNAL_ID': 'ID Interno',
  'SERIAL': 'Número de Serie',
  'ACQ_DATE': 'Fecha de Adquisición',
  'KIND': 'Tipo',
  'UNAVAILABLE': 'Deshabilitar',
  'INVENTORY.BUTTON.ENABLE': 'Habilitar',
  'INVENTORY.BUTTON.DISABLE': 'Deshabilitar',
  'INVENTORY.NEW': 'Nuevo elemento de inventario',
  'INVENTORY.INTERNAL_ID': 'Id Interno',
  'INVENTORY.SERIAL': 'Numero de Serie',
  'INVENTORY.KIND': 'Tipo',
  'INVENTORY.ACQUISITION_DATE': 'Fecha de Adquisición',
  'INVENTORY.GUARANTEE_EXPIRATION_DATE': 'Expiración de Garantia',
  'INVENTORY.LAST_INVENTORY_DATE': 'Ultima fecha de Inventario',
  'INVENTORY.MODEL': 'Modelo',
  'INVENTORY.MANUFACTURER': 'Fabricante',
  'INVENTORY.DESCRIPTION': 'Descripciçon',
  'INVENTORY.LOCATION': 'Lugar',
  'INVENTORY.PRICE': 'Precio',
  'INVENTORY.TYPE': 'Tipo',
  'INVENTORY.PROCESSOR': 'Procesador',
  'INVENTORY.RAM': 'Ram',
  'INVENTORY.HD': 'Hd',
  'INVENTORY.CD': 'Cd',
  'INVENTORY.VIDEO': 'Video',
  'INVENTORY.USB': 'Usb',
  'INVENTORY.CONNECTOR': 'Conector',
  'INVENTORY.SIZE': 'Tamaño',
  'INVENTORY.AVAILABILITY.WHEN': 'Fecha',
  'INVENTORY.AVAILABILITY.WHY': 'Razon',

  // Schools
  'Schools': 'Escuelas',

  // Accounts
  'Accounts': 'Cuentas',

})
.config(function($translateProvider, translations_en, translations_es){
  $translateProvider.translations('en', translations_en);
  $translateProvider.translations('es', translations_es);
  $translateProvider.preferredLanguage('en');
});

