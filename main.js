/*
01 - Iniciar chamada
method: POST
headers: token_auth, Content-Type: application/json
URI: http://www.provedortelefonia.com.br/v1/calls
BODY:
*/
{
    "caller": "+554830000000",
    "called": "+551199000000"
}

/*
RESPONSE: SUCCESS
format:JSON
status code: 201
*/
{    
    "state":"received",
    "callId": "159f22g1h5"
}

/*
02 - Consultar andamento
method: GET
headers: token_auth, Content-Type: application/json
URI: http://www.provedortelefonia.com.br/v1/calls/{callId}

RESPONSE: SUCCESS
format:JSON
status code: 200
*/
{
    "state": "calling_origin | calling_destination | established | finished | failed",
    "message": "description of failure",
    "callId": "159f22g1h5",
    "talkingDurationSeconds":15
}

/*
03 - Relatório da Ligação
method: GET
headers: token_auth, Content-Type: application/json
URI: http://www.provedortelefonia.com.br/v1/calls/{id}/sumary

RESPONSE: SUCCESS
format:JSON
status code: 200
*/
{
    "callId": "159f22g1h5",
    "linkAudio": "http://www.provedortelefonia.com.br/central/chamada159f22g1h5.mp3",
    "startDate": "2016-03-31T20:33:13-03:00",
    "endDate": "2016-03-31T20:35:13-03:00",
    "talkingDurationSeconds": 70,
    "totalDurationSeconds": 120,
    "price": "0.06",
    "caller": "+554830000000",
    "called": "+551199000000"
}

/*
03.1 - WebHook Recebimento relatório
method: POST
headers: token_auth, Content-Type: application/json
URI: http://call.spotter.exactsales.com.br/v1/ended
BODY:
*/
{
    "callId": "159f22g1h5",
    "linkAudio": "http://www.provedortelefonia.com.br/central/chamada159f22g1h5.mp3",
    "startDate": "2016-03-31T20:33:13-03:00",
    "endDate": "2016-03-31T20:35:13-03:00",
    "talkingDurationSeconds": 70,
    "totalDurationSeconds": 120,
    "price": "0.06",
    "caller": "+554830000000",
    "called": "+551199000000"
}

/*
04 - Encerrar chamada
method: POST
headers: token_auth, Content-Type: application/json
URI: http://www.provedortelefonia.com.br/v1/calls/endcall
BODY:
*/
{
    "callId": "159f22g1h5"
}

/*
RESPONSE: SUCCESS
format:JSON
status code: 200
*/
{    
    "state":"finished",
    "callId": "159f22g1h5"
}

/*
RESPONSE FAIL: Erros do servidor, exceções etc
format:JSON
status code: 500
*/
{
    "state":"error",
    "message":"error description"
}

/*
RESPONSE FAIL: Erros vindos da requisição, parametros inválidos(numeros, ids etc)
format:JSON
status code: 400
*/
{
    "state":"bad_request",
    "message":"error description"//indicando qual parametro causou a falha
}

/*
RESPONSE FAIL: Unauthorized
format:JSON
status code: 401
*/
{
    "state":"unauthorized",
    "message":"error description"
}