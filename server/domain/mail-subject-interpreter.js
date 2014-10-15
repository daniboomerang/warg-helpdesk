exports.extractId = function(mailSubject){
  var aux = mailSubject.split(" # ")[0];

  if (aux.indexOf("Re: ") >= 0){
    aux = aux.slice("Re: ".length);
  }
  /*if (aux.indexOf("New Comment on ") >= 0){
    aux = aux.slice("New Comment on ".length);
  }*/

  if (aux.indexOf("Nuevo comentario en ") >= 0){
    aux = aux.slice("Nuevo comentario en ".length);
  }

  return aux;
};

exports.mailIncidenceDefinition = function(incidenceId, incidenceTitle){
  return incidenceId + ' # ' + incidenceTitle;
};