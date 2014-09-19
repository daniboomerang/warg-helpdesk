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
  'SEVERITY': 'Severity',
  'BUTTON.OPEN': 'Open',
  'BUTTON.CLOSE': 'Close',
  'BUTTON.SIGNIN': 'Sign in',
  'USER.SETTINGS': 'User Settings',
  'SIGN.OUT': 'Sign out',
  'Close as': 'Close incidence as',
  'UNAVALIABLE': 'Unavailable',
  'INVENTORY.NEW': 'New Inventory Item',
  'INVENTORY.INTERNAL_ID': 'Internal Id',
  'INVENTORY.SERIAL': 'Serial Number',
  'INVENTORY.KIND': 'Kind',
  'INVENTORY.ACQUISITION_DATE': 'Acquisition Date',
})
.constant('translations_es', {
  // Global
  'Password': 'Contraseña',
  'BUTTON.OPEN': 'Abrir',
  'BUTTON.CLOSE': 'Cerrar',

  // Navbar
  'USER.SETTINGS': 'Configuración Usuario',
  'SIGN.OUT': 'Desconectar',

  // Sign
  'BUTTON.SIGNIN': 'Iniciar Sesion',
	
  // Incidences
  'Incidences': 'Incidencias',
  'Severity': 'Severidad',
  'Priority': 'Prioridad',
  'Updated': 'Actualizada',
  'Status': 'Estado',
  'Created': 'Creada',
  'Owner': 'Propietario',
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

